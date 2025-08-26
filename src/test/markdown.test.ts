import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureMarked,
  extractConfig,
  processCitations,
  processCaptions,
  processFootnotes,
  enumerateHeadings,
} from '@/lib/markdown';

describe('Markdown Utilities', () => {
  describe('configureMarked', () => {
    it('configures marked with highlight.js', () => {
      const marked = configureMarked();
      expect(marked).toBeDefined();
    });
  });

  describe('extractConfig', () => {
    it('extracts default configuration when no mdConfig element exists', () => {
      const div = document.createElement('div');
      const config = extractConfig(div);

      expect(config).toEqual({
        columns: 2,
        padding: '20mm',
        hyphens: true,
        cornellSize: '0',
        fontSize: '9pt',
        fontFamily: "'CMU Serif', Georgia, serif",
        textAlign: 'justify',
      });
    });

    it('extracts configuration from mdConfig element', () => {
      const div = document.createElement('div');
      const configElement = document.createElement('mdConfig');
      configElement.setAttribute('columns', '3');
      configElement.setAttribute('padding', '30mm');
      configElement.setAttribute('hyphens', 'false');
      configElement.setAttribute('fontSize', '12pt');
      div.appendChild(configElement);

      const config = extractConfig(div);

      expect(config.columns).toBe(3);
      expect(config.padding).toBe('30mm');
      expect(config.hyphens).toBe(false);
      expect(config.fontSize).toBe('12pt');
    });
  });

  describe('processCitations', () => {
    it('processes citations with auto-generated keys', () => {
      const div = document.createElement('div');
      const citation1 = document.createElement('mdCitation');
      citation1.setAttribute('id', 'cit1');
      citation1.innerHTML = 'Citation content 1';

      const citation2 = document.createElement('mdCitation');
      citation2.setAttribute('id', 'cit2');
      citation2.setAttribute('key', 'custom');
      citation2.innerHTML = 'Citation content 2';

      div.appendChild(citation1);
      div.appendChild(citation2);

      const citations = processCitations(div);

      expect(citations).toHaveLength(2);
      expect(citations[0]).toEqual({
        id: 'cit1',
        key: '[1]',
        content: 'Citation content 1',
      });
      expect(citations[1]).toEqual({
        id: 'cit2',
        key: '[custom]',
        content: 'Citation content 2',
      });
    });
  });

  describe('processCaptions', () => {
    it('processes captions with auto-generated keys', () => {
      const div = document.createElement('div');
      const caption1 = document.createElement('mdCaption');
      caption1.setAttribute('id', 'cap1');
      caption1.setAttribute('type', 'figure');
      caption1.innerHTML = 'Caption content 1';

      const caption2 = document.createElement('mdCaption');
      caption2.setAttribute('id', 'cap2');
      caption2.setAttribute('type', 'table');
      caption2.setAttribute('key', 'Custom Table');
      caption2.innerHTML = 'Caption content 2';

      div.appendChild(caption1);
      div.appendChild(caption2);

      const captions = processCaptions(div);

      expect(captions).toHaveLength(2);
      expect(captions[0]).toEqual({
        id: 'cap1',
        type: 'figure',
        key: 'Figure 1',
        content: 'Caption content 1',
      });
      expect(captions[1]).toEqual({
        id: 'cap2',
        type: 'table',
        key: 'Custom Table',
        content: 'Caption content 2',
      });
    });
  });

  describe('processFootnotes', () => {
    it('processes footnotes', () => {
      const div = document.createElement('div');
      const footnote1 = document.createElement('mdFootnote');
      footnote1.setAttribute('id', 'fn1');
      footnote1.setAttribute('key', '1');
      footnote1.innerHTML = 'Footnote content 1';

      const footnote2 = document.createElement('mdFootnote');
      footnote2.setAttribute('id', 'fn2');
      footnote2.innerHTML = 'Footnote content 2';

      div.appendChild(footnote1);
      div.appendChild(footnote2);

      const footnotes = processFootnotes(div);

      expect(footnotes).toHaveLength(2);
      expect(footnotes[0]).toEqual({
        id: 'fn1',
        key: '1',
        content: 'Footnote content 1',
      });
      expect(footnotes[1]).toEqual({
        id: 'fn2',
        key: '',
        content: 'Footnote content 2',
      });
    });
  });

  describe('enumerateHeadings', () => {
    it('enumerates headings with proper prefixes', () => {
      const div = document.createElement('div');

      const h2 = document.createElement('h2');
      h2.innerHTML = 'First Heading';

      const h3 = document.createElement('h3');
      h3.innerHTML = 'Sub Heading';

      const h2_2 = document.createElement('h2');
      h2_2.innerHTML = 'Second Heading';

      div.appendChild(h2);
      div.appendChild(h3);
      div.appendChild(h2_2);

      const headings = enumerateHeadings(div);

      expect(headings).toHaveLength(3);
      expect(headings[0].prefix).toBe('1');
      expect(headings[1].prefix).toBe('1.1');
      expect(headings[2].prefix).toBe('2');
    });

    it('skips headings marked with [!]', () => {
      const div = document.createElement('div');

      const h2 = document.createElement('h2');
      h2.innerHTML = '[!]Skip This';

      const h2_2 = document.createElement('h2');
      h2_2.innerHTML = 'Normal Heading';

      div.appendChild(h2);
      div.appendChild(h2_2);

      const headings = enumerateHeadings(div);

      expect(headings).toHaveLength(1);
      expect(headings[0].text).toBe('1. Normal Heading');
    });
  });
});
