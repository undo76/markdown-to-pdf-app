import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaperEditor } from '@/components/paper-editor';
import { describe, it, expect, vi } from 'vitest';

describe('PaperEditor Component', () => {
  it('renders file picker when no content is provided', () => {
    render(<PaperEditor />);

    expect(screen.getByText('Drag and drop your markdown')).toBeInTheDocument();
    expect(screen.getByText('Or click to pick')).toBeInTheDocument();
  });

  it('renders initial content when provided', async () => {
    const initialContent = '# Test Heading\n\nThis is test content.';
    render(<PaperEditor initialContent={initialContent} />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /test heading/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('This is test content.')).toBeInTheDocument();
  });

  it('handles file upload via click', async () => {
    const user = userEvent.setup();
    const fileContent = '# Uploaded File\n\nThis content was uploaded.';
    const file = new File([fileContent], 'test.md', { type: 'text/markdown' });

    render(<PaperEditor />);

    const fileInput = screen.getByLabelText('file upload') as HTMLInputElement;

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /uploaded file/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('This content was uploaded.')).toBeInTheDocument();
  });

  it('calls onContentChange when content changes via file upload', async () => {
    const user = userEvent.setup();
    const onContentChange = vi.fn();
    const fileContent = '# Uploaded Content';
    const file = new File([fileContent], 'test.md', { type: 'text/markdown' });

    render(<PaperEditor onContentChange={onContentChange} />);

    const fileInput = screen.getByLabelText('file upload') as HTMLInputElement;

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(fileContent);
    });
  });

  it('renders with proper paper styling', async () => {
    const initialContent = '# Test Paper';
    render(<PaperEditor initialContent={initialContent} />);

    await waitFor(() => {
      const paperPage = screen.getByTestId('paper-page');
      expect(paperPage).toBeInTheDocument();
      // The CSS variables should be set, but the actual computed styles
      // might not be available in the test environment
      expect(paperPage).toHaveClass('paper-page');
    });
  });
});
