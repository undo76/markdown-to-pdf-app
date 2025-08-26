'use client';

import React from 'react';

interface MarkdownRendererProps {
  htmlContent: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  htmlContent,
  className = '',
}) => {
  return (
    <div
      className={`paper-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
