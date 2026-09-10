/**
 * @fileoverview
 * @module utilities/checkAuth
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires ./authStorage
 */

import { authStorage } from './authStorage';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Checks if the user is authenticated.
 * If not, clears local storage and returns false.
 *
 * @returns {boolean} true if the user is authenticated, false otherwise
 */
export const checkAuth = (
  configLogs: ReturnType<typeof useConexysConfig>,
): boolean => {
  // VIII-C3-fix: use the real session check. `getAuthToken()` returns the
  // truthy 'cookie' marker in cookie mode even without a session, so it can no
  // longer be used to decide authentication here.
  const hasSession = authStorage.hasActiveSession(configLogs);

  if (!hasSession) {
    localStorage.removeItem('datauser');
    localStorage.removeItem('sidebarleft');
    localStorage.removeItem('cxl0k2mw');
    authStorage.removeAuthData(configLogs);
    return false;
  }

  return true;
};
