/**
 * @fileoverview
 * @module src/utilities/authStorage
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.1
 */

import { serviceData } from '../services/postServiceExtended';
import { Url } from '../constants/global';
import type { ContentTypeConfig } from '../types/common';
import { logConsole } from './logConsole';
import { useConexysConfig } from '../config/ConexysConfig';

const config: ContentTypeConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Key under which the resolved `type_session` value is cached in localStorage.
// This cache is read synchronously by every copy of this module (admin AND plugin
// bundles) so that reads before `initialize()` resolves are still correct, without
// resorting to a cross-medium auth fallback that would ignore `type_session`.
const TYPE_SESSION_CACHE_KEY = 'cx_type_session';

let USE_COOKIES_FOR_AUTH = false; // Default value
let SESSION_EXPIRATION = 365; // Default value

// --- Module-singleton state -----------------------------------------------
// The three flags below are the single source of truth for the resolved
// `type_session` medium. They are deliberately decoupled so that a getter can
// never trigger a fetch, and so a failed/aborted fetch can be retried safely.

// True once we have a *definitive* value for the medium (from the DB or the
// persistent cache). While this is false, getters fall back to 'localstorage'.
let isConfigInitialized = false;

// The in-flight initialization promise. It stays non-null until the current
// init attempt *fully settles* (success or failure), then is reset to null so a
// later caller can retry. Two different states used to be conflated here, which
// left a dangling promise and let callers re-issue `getsettings` in waves.
let initPromise: Promise<void> | null = null;

// True while a fetch is actually in-flight. Used by `refreshTypeSession` so it
// never overlaps an ongoing `initialize` fetch and vice-versa.
let isFetching = false;

/**
 * Reads the resolved `type_session` value from the cross-bundle cache.
 * Returns 'cookie' | 'localstorage' | null (null = not yet known).
 */
const getCachedTypeSession = (): string | null => {
  try {
    return localStorage.getItem(TYPE_SESSION_CACHE_KEY);
  } catch {
    return null;
  }
};

/**
 * Resets the in-flight initialization state after logout. Keeps
 * `USE_COOKIES_FOR_AUTH` (still valid — `type_session` did not change) and the
 * `cx_type_session` persistent cache intact, so no bundle re-issues a redundant
 * `getsettings` request purely because a logout happened.
 */
const resetAuthConfig = (): void => {
  initPromise = null;
  isConfigInitialized = false;
  isFetching = false;
  // USE_COOKIES_FOR_AUTH intentionally NOT reset; resolveUseCookies() falls back
  // to the persistent `cx_type_session` cache until initialize() runs again.
};

/**
 * Persists the resolved `type_session` value so other bundles (plugins) can read
 * it synchronously without issuing their own `getsettings` call.
 */
const setCachedTypeSession = (value: string): void => {
  try {
    localStorage.setItem(TYPE_SESSION_CACHE_KEY, value);
  } catch {
    // Ignore storage failures (e.g. private mode) — the in-memory flag still works.
  }
};

/**
 * Returns whether auth should use cookies, resolving the flag synchronously.
 * NEVER triggers a fetch. Precedence:
 *   1. in-memory initialized flag (authoritative)
 *   2. cross-bundle persistent cache (`cx_type_session`)
 *   3. default 'localstorage' (install default)
 */
const resolveUseCookies = (): boolean => {
  if (isConfigInitialized) return USE_COOKIES_FOR_AUTH;
  const cached = getCachedTypeSession();
  if (cached !== null) return cached === 'cookie';
  // No cached value yet → default to localStorage (install default).
  return false;
};

/**
 * Performs the single authenticated `getsettings` fetch for `type_session`.
 * Extracted so both `initialize()` and `refreshTypeSession()` share the exact
 * same fetch + settle logic, and so a fetch can only ever be in-flight once.
 */
const fetchTypeSession = async (
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<void> => {
  const baseURL: string = Url + 'getsettings';

  try {
    await serviceData(
      baseURL,
      { keys: 'type_session' },
      config,
      (value: string) => {
        const resolved =
          value && typeof value === 'string' ? value : 'localstorage';
        USE_COOKIES_FOR_AUTH = resolved === 'cookie';
        setCachedTypeSession(resolved);
      },
      configLogs,
    );
  } catch (error) {
    logConsole(
      configLogs,
      'error',
      'Error loading authentication configuration:',
      error,
    );
  }
};

/**
 * Initialize configuration from the API, deduplicated across all callers.
 *
 * Key invariants (this is what prevents the `getsettings` cascade):
 *   - If already initialized → resolves immediately (no fetch).
 *   - If another init is in-flight → resolves with that same promise (no fetch).
 *   - If the persistent cache already holds a value → resolves immediately from
 *     it (no fetch).
 *   - `initPromise` is ALWAYS reset to null once the attempt settles, so a
 *     subsequent genuine need (e.g. after logout clears the cache) can retry.
 */
const initializeAuthConfig = (
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<void> => {
  if (isConfigInitialized) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = (async (): Promise<void> => {
    if (isConfigInitialized) return;

    // Fast path: reuse a previously resolved value from the cross-bundle cache.
    const cached = getCachedTypeSession();
    if (cached !== null) {
      USE_COOKIES_FOR_AUTH = cached === 'cookie';
      isConfigInitialized = true;
      return;
    }

    if (isFetching) return;

    isFetching = true;
    try {
      await fetchTypeSession(configLogs);
      isConfigInitialized = true;
    } finally {
      isFetching = false;
      initPromise = null;
    }
  })();

  return initPromise;
};

/**
 * Forces a fresh read of `type_session` from the DB and updates both the
 * in-memory flag and the cross-bundle cache. Used ONLY at explicit boundaries
 * (login) — never during render/read paths. Never overlaps an in-flight init.
 */
const refreshTypeSessionFromDB = async (
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<void> => {
  // If an init is currently in flight, await it instead of issuing a second fetch.
  if (initPromise && !isFetching) {
    await initPromise;
  } else if (isFetching) {
    // An init fetch is in-flight: wait for it to finish before refreshing.
    if (initPromise) await initPromise;
  }

  if (isFetching) {
    // Already fetching (shouldn't happen after the waits above, but guard).
    if (initPromise) await initPromise;
    return;
  }

  isFetching = true;
  initPromise = (async (): Promise<void> => {
    try {
      await fetchTypeSession(configLogs);
      isConfigInitialized = true;
    } finally {
      isFetching = false;
      initPromise = null;
    }
  })();

  await initPromise;
};

export const authStorage = {
  /**
   * Exposes the initialization so callers (e.g. Login) can await the
   * `type_session` config before deciding where to read/write auth data.
   */
  initialize(configLogs: ReturnType<typeof useConexysConfig>): Promise<void> {
    return initializeAuthConfig(configLogs);
  },

  /**
   * Returns the configured session-storage medium as a string that can be sent
   * in the `x-session-type` header: 'cookie' | 'localstorage'.
   * Resolves synchronously and NEVER triggers a fetch (this was the root cause
   * of the `getsettings` cascade — every request header read issued an init).
   */
  getSessionTypeValue(
    _configLogs: ReturnType<typeof useConexysConfig>,
  ): 'cookie' | 'localstorage' {
    return resolveUseCookies() ? 'cookie' : 'localstorage';
  },

  async setAuthToken(
    token: string,
    configLogs: ReturnType<typeof useConexysConfig>,
  ): Promise<void> {
    await initializeAuthConfig(configLogs);
    if (resolveUseCookies()) {
      this.setCookie('cxauthxc', token, SESSION_EXPIRATION);
      localStorage.removeItem('cxauthxc');
    } else {
      localStorage.setItem('cxauthxc', token);
      this.deleteCookie('cxauthxc');
    }
  },

  getAuthToken(_configLogs: ReturnType<typeof useConexysConfig>): string | null {
    // Synchronous read only — no init, no fetch.
    if (resolveUseCookies()) {
      return this.getCookie('cxauthxc');
    }
    return localStorage.getItem('cxauthxc');
  },

  async setSessionId(
    sessionId: string,
    configLogs: ReturnType<typeof useConexysConfig>,
  ): Promise<void> {
    await initializeAuthConfig(configLogs);
    if (resolveUseCookies()) {
      this.setCookie('cx_session', sessionId, SESSION_EXPIRATION);
      localStorage.removeItem('cx_session');
    } else {
      localStorage.setItem('cx_session', sessionId);
      this.deleteCookie('cx_session');
    }
  },

  getSessionId(_configLogs: ReturnType<typeof useConexysConfig>): string | null {
    // Synchronous read only — no init, no fetch.
    if (resolveUseCookies()) {
      return this.getCookie('cx_session');
    }
    return localStorage.getItem('cx_session');
  },

  /**
   * Explicitly re-reads `type_session` from the DB (single, controlled fetch).
   * Call at auth boundaries (login) — NOT from render/read paths.
   */
  refreshTypeSession(
    configLogs: ReturnType<typeof useConexysConfig>,
  ): Promise<void> {
    return refreshTypeSessionFromDB(configLogs);
  },

  async removeAuthData(
    configLogs: ReturnType<typeof useConexysConfig>,
  ): Promise<void> {
    this.deleteCookie('cxauthxc');
    this.deleteCookie('cx_session');
    localStorage.removeItem('cxauthxc');
    localStorage.removeItem('cx_session');
    // Clear the `cx_type_session` cache on logout (may be stale). The next
    // initialize() re-validates via a single deduplicated `getsettings` fetch.
    try {
      localStorage.removeItem(TYPE_SESSION_CACHE_KEY);
    } catch {
      // Ignore storage failures.
    }
    resetAuthConfig();
  },

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${secure}`;
  },

  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};
