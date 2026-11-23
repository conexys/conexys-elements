/**
 * @fileoverview
 * Custom hook for language synchronization
 * @module hooks/useFingerprintJS
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.4.0
 */

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseUserData } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';
import { authStorage } from '../utilities/authStorage';

export const useLanguageSync = (): void => {
  const configLogs = useConexysConfig();
  const { i18n } = useTranslation('global');
  const hasSynced = useRef(false);

  useEffect(() => {
    // Run once per app mount. `useTranslation` can hand back a different
    // `i18n` reference when the language changes; without this guard the
    // effect re-ran on every language switch and re-applied the stale
    // `datauser.language`, undoing the user's selection on the login,
    // register and forgot-password pages.
    if (hasSynced.current) return;
    hasSynced.current = true;

    const syncLanguage = (): void => {
      const dataUserStr = localStorage.getItem('datauser');
      const hasActiveSession = authStorage.hasActiveSession(configLogs);

      if (!hasActiveSession) {
        // `datauser` is a leftover from a previous session. With no live
        // session it must not pin the UI language (public pages), so drop it.
        if (dataUserStr) {
          localStorage.removeItem('datauser');
        }
      } else if (dataUserStr) {
        try {
          const dataUser: BaseUserData = JSON.parse(dataUserStr);
          const currentStoredLanguage = localStorage.getItem('userLanguage');

          if (dataUser.language && dataUser.language !== currentStoredLanguage) {
            localStorage.setItem('userLanguage', dataUser.language);
          }
        } catch (error) {
          logConsole(configLogs, 'error', 'Error parsing user data:', error);
          console.error('Error parsing user data:', error);
        }
      }

      const lastSelectedLanguage = localStorage.getItem('userLanguage');
      if (lastSelectedLanguage && i18n.language !== lastSelectedLanguage) {
        i18n.changeLanguage(lastSelectedLanguage).catch(console.error);
      }
    };

    syncLanguage();
  }, [i18n, configLogs]);
};
