'use client';

import React, { useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

interface PaperPage {
  id: string;
  header: React.ReactNode;
  footer: React.ReactNode;
  content: React.ReactNode;
  pageNumber: number;
}

interface PaperEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export const PaperEditor: React.FC<PaperEditorProps> = ({
  initialContent = '',
  onContentChange,
}) => {
  const [, setContent] = useState<string>(initialContent);
  const [pages, setPages] = useState<PaperPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure marked with highlight.js using marked-highlight
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const processMarkdown = useCallback(async (markdownContent: string) => {
    setIsLoading(true);
    try {
      // Parse markdown to HTML
      const htmlContent = marked.parse(markdownContent);

      // For now, create a simple single page
      // In a real implementation, this would handle pagination, columns, etc.
      const newPage: PaperPage = {
        id: 'page-1',
        header: <div>Header</div>,
        footer: <div>Footer</div>,
        content: (
          <div
            className="paper-markdown"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ),
        pageNumber: 1,
      };

      setPages([newPage]);
    } catch (error) {
      console.error('Error processing markdown:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onContentChange?.(newContent);
      processMarkdown(newContent);
    },
    [onContentChange, processMarkdown]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          handleContentChange(fileContent);
        };
        reader.readAsText(file);
      }
    },
    [handleContentChange]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          handleContentChange(fileContent);
        };
        reader.readAsText(file);
      }
    },
    [handleContentChange]
  );

  const handleFilePickerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Process initial content on mount
  React.useEffect(() => {
    if (initialContent) {
      processMarkdown(initialContent);
    }
  }, [initialContent, processMarkdown]);

  return (
    <div className="paper-editor">
      <div className="paper-editor-body">
        {pages.length === 0 ? (
          <div
            className="paper-page paper-file-picker"
            onClick={handleFilePickerClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              style={{ margin: 'auto', opacity: '66%', textAlign: 'center' }}
            >
              <h2>Drag and drop your markdown</h2>
              <h2>Or click to pick</h2>
              <input
                ref={fileInputRef}
                style={{ position: 'absolute', top: '-2rem', display: 'none' }}
                type="file"
                accept=".md,text/markdown,text/plain"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        ) : (
          <div className="paper-pages">
            {pages.map((page) => (
              <div key={page.id} className="paper-page">
                <div className="paper-page-header">
                  {page.header}
                  <p className="paper-page-no">{page.pageNumber}</p>
                </div>

                <div className="paper-page-content">
                  <div className="paper-page-top"></div>
                  <div className="paper-page-columns">{page.content}</div>
                  <div className="paper-page-bottom"></div>
                </div>

                <div className="paper-page-footer">
                  <p className="paper-page-no">{page.pageNumber}</p>
                  {page.footer}
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
            }}
          >
            Processing markdown...
          </div>
        )}
      </div>
    </div>
  );
};
