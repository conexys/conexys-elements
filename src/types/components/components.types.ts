/**
 * @fileoverview
 */

import type { ErrorInfo, ReactNode } from 'react';
import { useConexysConfig } from '../../config/ConexysConfig';

export interface AppDataSettingsHTMLProps {
  keys: string;
}

export interface AppDataSettingsProps {
  keys: string;
}

interface ConfigType {
  headers: {
    'Content-Type': string;
  };
}

interface KeyType {
  keys: string;
}

export interface AppSetHeaderTitleProps {
  keys: string;
  title: string;
  baseUrl: string;
  serviceData: (
    baseURL: string,
    key: KeyType,
    config: ConfigType,
    setPost: React.Dispatch<React.SetStateAction<string | null>>,
    configLogs: ReturnType<typeof useConexysConfig>,
  ) => Promise<void>;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
