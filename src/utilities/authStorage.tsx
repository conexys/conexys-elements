/**
 * @fileoverview
 * @module src/utilities/authStorage
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
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

let USE_COOKIES_FOR_AUTH = false; // Default value
let SESSION_EXPIRATION = 365; // Default value
let isConfigInitialized = false;
let initPromise: Promise<void> | null = null;

// Initialize configuration from the API
const initializeAuthConfig = (
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<void> => {
  // Reuse the same in-flight promise to avoid concurrent duplicate fetches.
  if (initPromise) return initPromise;

  initPromise = (async (): Promise<void> => {
    if (isConfigInitialized) return;

    const baseURL: string = Url + 'getsettings';

    try {
      await serviceData(
        baseURL,
        { keys: 'type_session' },
        config,
        (value: string) => {
          USE_COOKIES_FOR_AUTH = value === 'cookie';
          isConfigInitialized = true;
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
    } finally {
      // Always resolve initialization so callers can proceed deterministically,
      // even on failure (falls back to the default localStorage behavior).
      isConfigInitialized = true;
    }
  })();

  return initPromise;
};

export const authStorage = {
  /**
   * Exposes the initialization so callers (e.g. Login) can await the
   * `type_session` config before deciding where to read/write auth data.
   * This removes the race condition where a synchronous getter returns
   * null because the async config hasn't loaded yet.
   */
  initialize(configLogs: ReturnType<typeof useConexysConfig>): Promise<void> {
    return initializeAuthConfig(configLogs);
  },

  setAuthToken(
    token: string,
    configLogs: ReturnType<typeof useConexysConfig>,
  ): void {
    initializeAuthConfig(configLogs);
    if (USE_COOKIES_FOR_AUTH) {
      this.setCookie('cxauthxc', token, SESSION_EXPIRATION);
    } else {
      localStorage.setItem('cxauthxc', token);
    }
  },

  getAuthToken(configLogs: ReturnType<typeof useConexysConfig>): string | null {
    initializeAuthConfig(configLogs);
    if (USE_COOKIES_FOR_AUTH) {
      return this.getCookie('cxauthxc');
    }
    return localStorage.getItem('cxauthxc');
  },

  setSessionId(
    sessionId: string,
    configLogs: ReturnType<typeof useConexysConfig>,
  ): void {
    initializeAuthConfig(configLogs);
    if (USE_COOKIES_FOR_AUTH) {
      this.setCookie('cx_session', sessionId, SESSION_EXPIRATION);
    } else {
      localStorage.setItem('cx_session', sessionId);
    }
  },

  getSessionId(configLogs: ReturnType<typeof useConexysConfig>): string | null {
    initializeAuthConfig(configLogs);
    if (USE_COOKIES_FOR_AUTH) {
      return this.getCookie('cx_session');
    }
    return localStorage.getItem('cx_session');
  },

  removeAuthData(configLogs: ReturnType<typeof useConexysConfig>): void {
    initializeAuthConfig(configLogs);
    if (USE_COOKIES_FOR_AUTH) {
      this.deleteCookie('cxauthxc');
      this.deleteCookie('cx_session');
    } else {
      localStorage.removeItem('cxauthxc');
      localStorage.removeItem('cx_session');
    }
  },

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    // Only set the Secure flag on HTTPS. On plain HTTP (e.g. localhost in dev)
    // a Secure cookie is silently rejected by the browser, which breaks auth.
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
