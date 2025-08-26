import { render, screen, fireEvent } from '@testing-library/react';
import { PaperEditor } from '@/components/paper-editor';
import { describe, it, expect, vi } from 'vitest';

// Mock the marked library
vi.mock('marked', () => ({
  setOptions: vi.fn(),
  parse: vi.fn().mockReturnValue('<p>Test content</p>'),
}));

// Mock marked-highlight
vi.mock('marked-highlight', () => ({
  markedHighlight: vi.fn().mockReturnValue({}),
}));

// Mock highlight.js
vi.mock('highlight.js', () => ({
  getLanguage: vi.fn().mockReturnValue(true),
  highlight: vi.fn().mockReturnValue({ value: '<code>highlighted</code>' }),
}));

// Mock CSS imports
vi.mock('highlight.js/styles/default.css', () => ({}));

describe('PaperEditor', () => {
  it('renders file picker when no content is provided', () => {
    render(<PaperEditor />);

    expect(screen.getByText('Drag and drop your markdown')).toBeInTheDocument();
    expect(screen.getByText('Or click to pick')).toBeInTheDocument();
  });

  it('renders initial content when provided', () => {
    const initialContent = '# Test Title\n\nTest content';
    render(<PaperEditor initialContent={initialContent} />);

    // The content should be processed and rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles file upload via click', () => {
    render(<PaperEditor />);

    const filePicker = screen.getByText('Or click to pick');
    fireEvent.click(filePicker);

    // The file input should be triggered
    // This test mainly ensures the click handler doesn't throw errors
    expect(filePicker).toBeInTheDocument();
  });

  it('handles drag and drop events', () => {
    render(<PaperEditor />);

    const dropZone = screen
      .getByText('Drag and drop your markdown')
      .closest('.paper-file-picker');

    // Test drag over
    fireEvent.dragOver(dropZone!);

    // Test drop with mock file
    const mockFile = new File(['# Test content'], 'test.md', {
      type: 'text/markdown',
    });
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [mockFile],
      },
    });

    // The component should handle the drop event without errors
    expect(dropZone).toBeInTheDocument();
  });
});
