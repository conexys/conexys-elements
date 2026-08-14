/**
 * @fileoverview
 * @description Provides configuration context and utilities for the Conexys application.
 * @module config/ConexysConfig
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { createContext, useContext, type ReactNode } from 'react';

export interface ConexysConfig {
  enableLogs: boolean;
  enableLogsError: boolean;
  enableLogsWarning: boolean;
  enableLogsInfo: boolean;
  enableLogsData: boolean;
  enableLogsDebug: boolean;
  developmentMode: boolean;
  apiUrl?: string;
}

const defaultConfig: ConexysConfig = {
  enableLogs: false,
  enableLogsError: false,
  enableLogsWarning: false,
  enableLogsInfo: false,
  enableLogsData: false,
  enableLogsDebug: false,
  developmentMode: false,
};

export const ConexysConfigContext = createContext<ConexysConfig>(defaultConfig);

interface ConexysConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConexysConfig>;
}

export const ConexysConfigProvider: React.FC<ConexysConfigProviderProps> = ({
  children,
  config = {},
}) => {
  const mergedConfig: ConexysConfig = { ...defaultConfig, ...config };

  return (
    <ConexysConfigContext.Provider value={mergedConfig}>
      {children}
    </ConexysConfigContext.Provider>
  );
};

export const useConexysConfig = (): ConexysConfig => {
  return useContext(ConexysConfigContext);
};

// Helper to check development mode
export const isDevelopmentMode = (config: ConexysConfig): boolean => {
  return config.developmentMode;
};
