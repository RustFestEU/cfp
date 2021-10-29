import Marked from 'marked';
import { fluent } from './l10n.js';

// All links in rendered markdown open in a new window
Marked.use(markedExtLinks());
export const marked = Marked;


/**
 * Fluent translation, but parsed through markdown, HTML output
 */
export function $mt(...args) {
  return marked(fluent.format(...args), { smartypants: true });
}

/**
 * Fluent translation, but generating inline HTML from markdown
 */
export function $mti(...args) {
  return marked.parseInline(fluent.format(...args), { smartypants: true });
}


// All links open in a new window
function markedExtLinks() {
  const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  const escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  const escape = (href) => href.replace(escapeReplaceNoEncode, getEscapeReplacement);

  return { renderer: {
    link(href, title, text) {
      if (href === null) {
        return text;
      }
      let out = '<a target="_blank" href="' + escape(href) + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += '>' + text + '</a>';
      return out;
    }
  }}
}