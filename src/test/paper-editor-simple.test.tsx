import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PaperEditor } from '@/components/paper-editor';

describe('PaperEditor', () => {
  it('renders file picker when no content is provided', () => {
    render(<PaperEditor />);

    expect(screen.getByText('Drag and drop your markdown')).toBeInTheDocument();
    expect(screen.getByText('Or click to pick')).toBeInTheDocument();
  });

  it('renders with initial content', () => {
    const initialContent = '# Test Title';
    render(<PaperEditor initialContent={initialContent} />);

    // The component should render the content instead of file picker
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(
      screen.queryByText('Drag and drop your markdown')
    ).not.toBeInTheDocument();
  });
});
