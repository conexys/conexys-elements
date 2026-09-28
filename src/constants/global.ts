/**
 * @fileoverview
 * List of constants used in the system
 * @module constants/global
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

/**
 * Resolves the API base URL once and makes it immutable.
 * `window.restAPI` is defined as non-writable and non-configurable to
 * to prevent a third-party script (or the console) from rewriting it and redirecting
 * traffic. If it already exists, its value is preserved; otherwise, it falls back to '' (relative).
 */
const REST_API_KEY = 'restAPI';

function resolveRestAPI(): string {
  let value: string;
  if (typeof window !== 'undefined') {
    const existing = (window as any)[REST_API_KEY];
    if (typeof existing === 'string' && existing.length > 0) {
      value = existing;
    } else {
      value = '';
    }
    // Freeze it: non-writable and non-configurable.
    try {
      Object.defineProperty(window, REST_API_KEY, {
        value,
        writable: false,
        configurable: false,
        enumerable: true,
      });
    } catch {
      // If it has already been defined as non-configurable, do nothing.
    }
  } else {
    value = '';
  }
  return value;
}

const Url: string = resolveRestAPI();

export { Url };
