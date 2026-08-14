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

// Initialize configuration from the API
const initializeAuthConfig = async (
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<void> => {
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
    isConfigInitialized = true; // Mark as initialized even if it fails
  }
};

export const authStorage = {
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
    } else {
      return localStorage.getItem('cxauthxc');
    }
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
    } else {
      return localStorage.getItem('cx_session');
    }
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
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`;
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
