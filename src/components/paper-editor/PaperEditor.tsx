'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  configureMarked,
  extractConfig,
  processCitations,
  processCaptions,
  processFootnotes,
  enumerateHeadings,
} from '@/lib/markdown';
import { MarkdownRenderer } from './MarkdownRenderer';

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

  const marked = configureMarked();

  const processMarkdown = useCallback(
    async (markdownContent: string) => {
      setIsLoading(true);
      try {
        // Parse markdown to HTML
        const htmlContent = marked.parse(markdownContent);

        // Create a temporary div to process the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Extract configuration (will be used in future implementations)
        extractConfig(tempDiv);

        // Process citations, captions, footnotes, and headings
        // These will be used in future implementations for advanced features
        processCitations(tempDiv);
        processCaptions(tempDiv);
        processFootnotes(tempDiv);
        enumerateHeadings(tempDiv);

        // For now, create a simple single page
        // In a real implementation, this would handle pagination, columns, etc.
        const newPage: PaperPage = {
          id: 'page-1',
          header: <div>Header</div>,
          footer: <div>Footer</div>,
          content: <MarkdownRenderer htmlContent={tempDiv.innerHTML} />,
          pageNumber: 1,
        };

        setPages([newPage]);
      } catch (error) {
        console.error('Error processing markdown:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [marked]
  );

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
  useEffect(() => {
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
                aria-label="file upload"
              />
            </div>
          </div>
        ) : (
          <div className="paper-pages">
            {pages.map((page) => (
              <div
                key={page.id}
                className="paper-page"
                data-testid="paper-page"
              >
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
