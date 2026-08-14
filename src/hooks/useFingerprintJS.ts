/**
 * @fileoverview
 * Custom hook for FingerprintJS integration
 * @module hooks/useFingerprintJS
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

export const useFingerprintJS = () => {
  const configLogs = useConexysConfig();
  const [fpHash, setFpHash] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initFingerprint = async (): Promise<void> => {
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        setFpHash(visitorId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to initialize fingerprint'),
        );
        logConsole(configLogs, 'error', 'FingerprintJS error:', err);
        console.error('FingerprintJS error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initFingerprint();
  }, []);

  return { fpHash, error, isLoading };
};
