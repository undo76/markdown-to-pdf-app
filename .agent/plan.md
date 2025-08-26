# Paper Editor Porting Plan

## Overview

Port the markdown-paper.html functionality to Next.js with React components while maintaining the same styling and functionality.

## Key Features to Implement

1. Paper-like layout with A4 dimensions (210mm x 297mm)
2. Multi-column text layout with proper pagination
3. Markdown parsing and rendering
4. Code syntax highlighting
5. Math equation support (MathJax)
6. Diagram rendering (draw.io)
7. Citation and reference management
8. Table of contents generation
9. File upload/drag-and-drop functionality
10. Print-friendly styling

## Dependencies Needed

- marked (markdown parsing)
- highlight.js (code syntax highlighting)
- mathjax (math equations)
- @types/ packages for TypeScript

## Component Structure

1. PaperEditor (main component)
2. PaperPage (individual page component)
3. MarkdownRenderer (markdown to HTML conversion)
4. FileUpload (drag and drop file input)
5. CitationManager (citation handling)
6. TableOfContents (TOC generation)

## Implementation Steps

1. Add required dependencies
2. Create CSS styles matching the original
3. Build React components for paper layout
4. Implement markdown parsing and rendering
5. Add file upload functionality
6. Implement citation and reference features
7. Add print styling
8. Write tests
9. Create documentation

## File Structure

```
src/
  components/
    paper-editor/
      PaperEditor.tsx
      PaperPage.tsx
      MarkdownRenderer.tsx
      FileUpload.tsx
      CitationManager.tsx
      TableOfContents.tsx
      index.ts
    ui/
      (existing shadcn components)
  lib/
    markdown.ts (markdown processing utilities)
    citations.ts (citation management)
  app/
    paper/
      page.tsx (main paper editor page)
```
