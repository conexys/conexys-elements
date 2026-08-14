/**
 * @fileoverview
 * Utility function for conditional console logging based on environment variables
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import { useConexysConfig } from '../config/ConexysConfig';

/**
 * @fileoverview
 * Utility function for conditional console logging based on environment variables
 * @param configLogs - Configuration object for logging settings
 * @param type - Type of log message ('info' | 'error' | 'warning' | 'data' | 'debug')
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export const logConsole = (
  configLogs: ReturnType<typeof useConexysConfig> | null | undefined,
  type: 'info' | 'error' | 'warning' | 'data' | 'debug',
  message: string,
  ...args: unknown[]
): void => {
  if (!configLogs) return;
  const {
    enableLogs,
    enableLogsError,
    enableLogsWarning,
    enableLogsInfo,
    enableLogsData,
    enableLogsDebug,
  } = configLogs;

  const colorMap = {
    error: '#fc0000',
    warning: '#ffaa00',
    info: '#55ff00',
    data: '#00aaff',
    debug: '#9b59b6',
  };
  const labelMap = {
    error: '[Error]',
    warning: '[Warning]',
    info: '[Info]',
    data: '[Data]',
    debug: '[Debug]',
  };
  const color = colorMap[type];
  const label = labelMap[type];

  if (enableLogs === true) {
    if (type === 'error' && enableLogsError === true) {
      console.log(
        `%c [Conexys] ${label} `,
        `color: ${color}`,
        message,
        ...args,
      );
    } else if (type === 'warning' && enableLogsWarning === true) {
      console.log(
        `%c [Conexys] ${label} `,
        `color: ${color}`,
        message,
        ...args,
      );
    } else if (type === 'info' && enableLogsInfo === true) {
      console.log(
        `%c [Conexys] ${label} `,
        `color: ${color}`,
        message,
        ...args,
      );
    } else if (type === 'data' && enableLogsData === true) {
      console.log(
        `%c [Conexys] ${label} `,
        `color: ${color}`,
        message,
        ...args,
      );
    } else if (type === 'debug' && enableLogsDebug === true) {
      console.log(
        `%c [Conexys] ${label} `,
        `color: ${color}`,
        message,
        ...args,
      );
    }
  }
};
