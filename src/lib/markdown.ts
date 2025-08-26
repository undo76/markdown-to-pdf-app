import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with highlight.js
export const configureMarked = () => {
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  return marked;
};

export interface Citation {
  id: string;
  key: string;
  content: string;
}

export interface Caption {
  id: string;
  type: string;
  key: string;
  content: string;
}

export interface Footnote {
  id: string;
  key: string;
  content: string;
}

export interface Heading {
  id: string;
  level: number;
  text: string;
  prefix: string;
}

export interface PaperConfig {
  columns: number;
  padding: string;
  hyphens: boolean;
  cornellSize: string;
  fontSize: string;
  fontFamily: string;
  textAlign: string;
}

export const extractConfig = (contentDiv: HTMLElement): PaperConfig => {
  const config: PaperConfig = {
    columns: 2,
    padding: '20mm',
    hyphens: true,
    cornellSize: '0',
    fontSize: '9pt',
    fontFamily: `'CMU Serif', Georgia, serif`,
    textAlign: 'justify',
  };

  const contentConfig = contentDiv.querySelector('mdConfig');
  if (contentConfig) {
    config.columns = parseInt(
      contentConfig.getAttribute('columns') || config.columns.toString()
    );
    config.padding = contentConfig.getAttribute('padding') || config.padding;
    const hyphensAttr = contentConfig.getAttribute('hyphens');
    config.hyphens =
      hyphensAttr === 'true' || (hyphensAttr !== 'false' && config.hyphens);
    config.cornellSize =
      contentConfig.getAttribute('cornellSize') || config.cornellSize;
    config.fontSize = contentConfig.getAttribute('fontSize') || config.fontSize;
    config.fontFamily =
      contentConfig.getAttribute('fontFamily') || config.fontFamily;
    config.textAlign =
      contentConfig.getAttribute('textAlign') || config.textAlign;
    contentConfig.remove();
  }

  return config;
};

export const processCitations = (contentDiv: HTMLElement): Citation[] => {
  let citationEnum = 0;
  const citations: Citation[] = [];

  const citationElements = contentDiv.querySelectorAll('mdCitation');
  for (const citation of citationElements) {
    const id = citation.getAttribute('id') || '';
    let key = citation.getAttribute('key');

    if (!key) {
      citationEnum++;
      key = citationEnum.toString();
    }

    citations.push({
      id,
      key: `[${key}]`,
      content: citation.innerHTML,
    });
    citation.remove();
  }

  return citations;
};

export const processCaptions = (contentDiv: HTMLElement): Caption[] => {
  const captions: Caption[] = [];
  const captionEnums: Record<string, number> = {};

  const captionElements = contentDiv.querySelectorAll('mdCaption');
  for (const caption of captionElements) {
    const id = caption.getAttribute('id') || '';
    const type = caption.getAttribute('type') || 'figure';
    let key = caption.getAttribute('key');

    if (!captionEnums[type]) {
      captionEnums[type] = 0;
    }

    if (!key) {
      captionEnums[type]++;
      key =
        type.charAt(0).toUpperCase() +
        type.slice(1) +
        ' ' +
        captionEnums[type].toString();
    }

    captions.push({
      id,
      type,
      key,
      content: caption.innerHTML,
    });
  }

  return captions;
};

export const processFootnotes = (contentDiv: HTMLElement): Footnote[] => {
  const footnotes: Footnote[] = [];

  const footnoteElements = contentDiv.querySelectorAll('mdFootnote');
  for (const footnote of footnoteElements) {
    const id = footnote.getAttribute('id') || '';
    const key = footnote.getAttribute('key') || '';

    footnotes.push({
      id,
      key,
      content: footnote.innerHTML,
    });
    footnote.remove();
  }

  return footnotes;
};

export const enumerateHeadings = (contentDiv: HTMLElement): Heading[] => {
  const headings: Heading[] = [];
  const headingLevels = [0, 0, 0, 0, 0, 0];

  const headingElements = contentDiv.querySelectorAll('h2, h3, h4, h5, h6');
  for (const heading of headingElements) {
    if (heading.innerHTML.startsWith('[!]')) {
      heading.innerHTML = heading.innerHTML.replace('[!]', '');
      heading.id = heading.innerHTML.replace(/\s/g, '');
      continue;
    }

    const level = parseInt(heading.tagName[1]) - 1;
    headingLevels[level - 1]++;
    for (let i = level; i < headingLevels.length; i++) {
      headingLevels[i] = 0;
    }
    const prefix = headingLevels
      .map((e) => Math.max(1, e))
      .slice(0, level)
      .join('.');
    heading.id = `h${prefix.replaceAll('.', '-')}`;
    heading.innerHTML = `${prefix}. ${heading.innerHTML}`;

    headings.push({
      id: heading.id,
      level,
      text: heading.innerHTML,
      prefix,
    });
  }

  return headings;
};
