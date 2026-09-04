/**
 * @fileoverview
 * Shared HTML sanitization helper. Wraps DOMPurify so that any HTML string
 * rendered via `dangerouslySetInnerHTML` is sanitized before it reaches the
 * DOM, mitigating stored/reflected XSS (e.g. user biographies, mail templates,
 * messages, settings HTML and form info blocks).
 * @module utilities/sanitizeHtml
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string with DOMPurify.
 *
 * @param {string | null | undefined} html - The raw HTML string to sanitize.
 * @returns {string} A sanitized HTML string (empty string when input is empty).
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}
