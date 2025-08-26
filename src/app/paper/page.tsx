'use client';

import { PaperEditor } from '@/components/paper-editor';

export default function PaperPage() {
  return (
    <div className="min-h-screen">
      <PaperEditor
        initialContent={`# Welcome to Paper Editor

This is a sample markdown document that demonstrates the paper editor functionality.

## Features

- **Multi-column layout** with proper pagination
- **Code syntax highlighting** for various programming languages
- **Mathematical equations** support using MathJax
- **Citations and references** management
- **Table of contents** generation
- **Print-friendly** styling

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Mathematical Equation

Here's a simple equation: $E = mc^2$

### Citation Example

This is a sample citation [1].

## References

1. Author, A. (2024). *Sample Reference*. Journal of Examples.
`}
      />
    </div>
  );
}
