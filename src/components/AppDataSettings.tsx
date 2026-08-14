/**
 * @fileoverview
 * This code defines a functional component called AppDataSettings that makes an HTTP request using the axios library to obtain configuration data from a server.
 * This component is used to make an HTTP request for configuration data and renders the content of that data once the request is successfully completed. The local post state is used to handle the request response and control conditional rendering.
 * @module components/AppDataSettings
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Url } from '../constants/global';
import { serviceData } from '../services/postServiceExtended';
import type { AppDataSettingsProps } from '../types/components/components.types';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Component for fetching and displaying application data settings.
 */
export default function AppDataSettings({
  keys,
}: AppDataSettingsProps): React.JSX.Element | null {
  const configLogs = useConexysConfig();
  const postURL = Url + 'getsettings';

  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  const fetchData = useCallback(async (): Promise<void> => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;

    try {
      await serviceData(postURL, { keys: keys }, config, setPost, configLogs);
    } catch (err) {
      setError(true);
      logConsole(configLogs, 'error', 'Error fetching data:', err);
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // If data is not available, return null
  if (!post) return null;

  return <>{error ? <div>Error loading data</div> : post}</>;
}
