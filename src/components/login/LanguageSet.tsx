/**
 * @fileoverview
 * Component for language selection on the login and user registration page.
 * Component that displays a drop-down menu with language options. The list of languages is obtained from an HTTP request using Axios, and internationalisation is handled by the 'react-i18next' library.
 * This module exports the LanguageSet component, which provides a language selection dropdown.
 * It retrieves the available languages from the server and allows users to choose their preferred language.
 * @module components/login/LanguageSet
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import { useTranslation } from 'react-i18next';
import { Url } from '../../constants/global';
import { logConsole } from '../../utilities/logConsole';
import type {
  Language,
  LanguagesResponse,
} from '../../types/components/login.types';
import { useConexysConfig } from '../../config/ConexysConfig';

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Spinner CSS puro - sin dependencias externas
const FadingBalls: React.FC<{ color?: string }> = ({ color = '#777' }) => {
  const ballStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    margin: '0 4px',
    display: 'inline-block',
    animation: 'fadingBalls 1.4s ease-in-out infinite both',
  };

  return (
    <>
      <style>
        {`
                    @keyframes fadingBalls {
                        0%, 80%, 100% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        40% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}
      </style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ ...ballStyle, animationDelay: '-0.32s' }} />
        <div style={{ ...ballStyle, animationDelay: '-0.16s' }} />
        <div style={{ ...ballStyle, animationDelay: '0s' }} />
      </div>
    </>
  );
};

/**
 * Functional component for language selection.
 * @component
 * @returns {JSX.Element} LanguageSet component.
 */
const LanguageSet: React.FC = () => {
  const configLogs = useConexysConfig();
  const [t, i18n] = useTranslation('global');
  const postURL: string = Url + 'getlanguages';

  // Extract only the base language code (e.g: 'es' from 'es-ES')
  const normalizeLanguageCode = (langCode: string): string => {
    return langCode.split('-')[0];
  };

  // State to manage the fetched languages
  const [languages, setLanguages] = useState<LanguagesResponse | null>(null);
  const [userLanguage, setUserLanguage] = useState<string>(
    localStorage.getItem('userLanguage') ||
      normalizeLanguageCode(navigator.language),
  );
  const [loading, setLoading] = useState<boolean>(true);
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  // Fetch languages from the server
  useEffect(() => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;

    const fetchLanguages = async (): Promise<void> => {
      try {
        const response: AxiosResponse<LanguagesResponse | Language[]> =
          await axios.get(postURL, config);
        logConsole(configLogs, 'info', '[Request] ', postURL);
        // Normalize: NestJS returns plain array, some endpoints wrap in { data: [...] }
        const langData = Array.isArray(response.data)
          ? { data: response.data }
          : response.data;
        setLanguages(langData);
        setLoading(false);
      } catch (error: any) {
        logConsole(configLogs, 'error', 'Error fetching languages:', error);
        console.error('Error fetching languages:', error);
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Change Language
  const handleLanguage = (selectedLanguage: string): void => {
    localStorage.setItem('userLanguage', selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    setUserLanguage(selectedLanguage);
  };

  // Set initial language based on user's preference
  useEffect(() => {
    const lastSelectedLanguage: string | null =
      localStorage.getItem('userLanguage');
    if (lastSelectedLanguage) {
      i18n.changeLanguage(lastSelectedLanguage);
      setUserLanguage(lastSelectedLanguage);
    }
  }, [i18n]);

  if (loading) {
    return (
      <div>
        <FadingBalls color="#777" />
      </div>
    );
  }

  if (!languages) return null;

  return (
    <select
      value={userLanguage}
      name="languageset"
      id="languageset"
      className="form-control"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        handleLanguage(e.target.value)
      }
    >
      {languages.data.map((option: Language) => (
        <option key={option.languages_id} value={option.dir}>
          {t('languages.' + option.dir)}
        </option>
      ))}
    </select>
  );
};

export default LanguageSet;
