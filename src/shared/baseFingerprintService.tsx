/**
 * @fileoverview
 * @module shared/baseFingerprintService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

// Optimized code
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { logConsole } from '../utilities/logConsole';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Default config without logging for fallback (plugins, non-component callers).
 */
const defaultConfig: ReturnType<typeof useConexysConfig> = {
  enableLogs: false,
  enableLogsError: false,
  enableLogsWarning: false,
  enableLogsInfo: false,
  enableLogsData: false,
  enableLogsDebug: false,
  developmentMode: false,
};

/**
 * Loads FingerprintJS and gets the visitorId.
 * @param {ReturnType<typeof useConexysConfig>} [configLogs] - Config context for logging.
 * @returns {Promise<string>} visitorId.
 */
const loadFingerprint = async (
  configLogs?: ReturnType<typeof useConexysConfig>,
): Promise<string> => {
  try {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    return visitorId;
  } catch (error) {
    logConsole(
      configLogs || defaultConfig,
      'error',
      'Error loading FingerprintJS:',
      error,
    );
    console.error('Error loading FingerprintJS:', error);
    throw new Error('Failed to load FingerprintJS');
  }
};

/**
 * Get or set the user's fingerprint.
 * @param {string} [fpHash] - The fingerprint hash.
 * @param {ReturnType<typeof useConexysConfig>} [configLogs] - Config context for logging.
 * @returns {Promise<string>} The user's fingerprint.
 */
export const getOrSetFingerprint = async (
  fpHash: string = '',
  configLogs?: ReturnType<typeof useConexysConfig>,
): Promise<string> => {
  if (fpHash) {
    return fpHash;
  }
  return await loadFingerprint(configLogs);
};
