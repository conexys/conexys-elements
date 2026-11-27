import { sanitizeHtml } from './sanitizeHtml';

/**
 * Analisis004 06/A4-02 — translation packages are untrusted HTML.
 * Recursively sanitize every string before handing resources to i18next.
 * Legitimate <b>/<a> formatting is preserved; script/img/event payloads are not.
 */
export function sanitizeI18nResources<T = any>(resources: T): T {
  const walk = (value: any): any => {
    if (typeof value === 'string') return sanitizeHtml(value);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === 'object') {
      const out: Record<string, any> = {};
      for (const [key, child] of Object.entries(value)) out[key] = walk(child);
      return out;
    }
    return value;
  };
  return walk(resources);
}
