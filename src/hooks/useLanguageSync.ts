/**
 * @fileoverview
 * Custom hook for language synchronization
 * @module hooks/useFingerprintJS
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseUserData } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

export const useLanguageSync = (): void => {
  const configLogs = useConexysConfig();
  const { i18n } = useTranslation('global');

  useEffect(() => {
    const syncLanguage = (): void => {
      const dataUserStr = localStorage.getItem('datauser');

      if (dataUserStr) {
        try {
          const dataUser: BaseUserData = JSON.parse(dataUserStr);
          const currentStoredLanguage = localStorage.getItem('userLanguage');

          if (dataUser.language !== currentStoredLanguage) {
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
  }, [i18n]);
};
