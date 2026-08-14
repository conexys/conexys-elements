/**
 * @fileoverview
 * This code defines a functional component called AppDataSettings that makes an HTTP request using the axios library to obtain configuration data from a server.
 * This component is used to make an HTTP request for configuration data and renders the content of that data once the request is successfully completed. The local post state is used to handle the request response and control conditional rendering.
 * @module components/AppDataSettingsHTML
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Url } from '../constants/global';
import { serviceData } from '../services/postServiceExtended';
import type { AppDataSettingsHTMLProps } from '../types/components/components.types';
import type { ContentTypeConfig } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

const config: ContentTypeConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Component for fetching and displaying application data settings.
 * @param {AppDataSettingsHTMLProps} props - Component properties.
 * @param {string} props.keys - Keys for fetching settings.
 * @returns {JSX.Element|null} Rendered component or null if data is not available.
 */
export default function AppDataSettingsHTML({
  keys,
}: AppDataSettingsHTMLProps): React.JSX.Element | null {
  const configLogs = useConexysConfig();
  const postURL: string = Url + 'getsettings';

  const [htmlString, setHtmlString] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  const fetchData = useCallback(async (): Promise<void> => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;

    try {
      await serviceData(
        postURL,
        { keys: keys },
        config,
        setHtmlString,
        configLogs,
      );
    } catch (err: unknown) {
      setError(true);
      logConsole(configLogs, 'error', 'Error fetching data:', err);
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // If data is not available, return null
  if (!htmlString) return null;

  return (
    <>
      {error ? (
        <div>Error loading data</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      )}
    </>
  );
}
