/**
 * @fileoverview
 * The AppSetHeaderTitle component is responsible for managing the page title, based on the configuration obtained from the backend.
 * This component is useful to dynamically set the page title based on the configuration obtained from the backend. Make sure that the paths and data used in this component are configured correctly in your application and in the backend.
 * @module components/AppSetHeaderTitle
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.1
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import type { AppSetHeaderTitleProps } from '../types/components/components.types';
import type { ContentTypeConfig } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

const config: ContentTypeConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Functional component to dynamically set the page title based on settings.
 * @param {AppSetHeaderTitleProps} props - Component properties.
 * @returns {JSX.Element | null} Rendered component.
 */
export default function AppSetHeaderTitle({
  keys,
  title,
  baseUrl,
  serviceData,
}: AppSetHeaderTitleProps): React.JSX.Element {
  const configLogs = useConexysConfig();
  const baseURL: string = baseUrl + 'getsettings';

  const [siteName, setSiteName] = useState<string | null>(null);
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  /**
   * Fetches settings and updates the component state.
   */
  const fetchData = useCallback(async (): Promise<void> => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;

    try {
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: keys }),
      });
      const text = await response.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        // El backend puede devolver texto plano (ej: "Conexys")
        data = text;
      }
      // NestJS puede devolver { data: "valor" } o directamente "valor"
      const name =
        data && typeof data === 'object' && 'data' in data ? data.data : data;
      setSiteName(typeof name === 'string' ? name : String(name || ''));
    } catch (err) {
      logConsole(configLogs, 'error', 'Error fetching site name:', err);
      console.error('Error fetching site name:', err);
      setSiteName('');
    }
  }, [baseURL, keys, configLogs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mostrar título inmediatamente aunque el fetch no haya terminado
  const fullTitle =
    siteName !== null && siteName !== '' ? `${title} - ${siteName}` : title;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
}
