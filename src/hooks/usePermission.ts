/**
 * usePermission Hook
 *
 * Checks whether the current user has specific granular permissions
 * by calling the /permissionsuser backend endpoint.
 *
 * Returns { hasPermission, loading } — designed to be used inside
 * PermissionGate or directly in components that need permission-aware UI.
 *
 * Uses useRef to guarantee a single fetch per mount (avoids React 18
 * double-mount loops without useCallback dependency headaches).
 *
 * @module hooks/usePermission
 * @version 0.3.0
 */

import { useState, useEffect, useRef } from 'react';
import { getservice2 } from '../services/getServiceExtended';
import { authStorage } from '../utilities/authStorage';
import { useConexysConfig } from '../config/ConexysConfig';
import type { UsePermissionOptions } from '../types/permission.types';

/**
 * Result of the usePermission hook.
 */
export interface UsePermissionResult {
  /** Whether the user has the requested permission. null = still loading. */
  hasPermission: boolean | null;
  /** Whether the permission check is in progress. */
  loading: boolean;
}

/**
 * Hook to check granular permissions via /permissionsuser.
 *
 * ```tsx
 * const { hasPermission, loading } = usePermission({
 *   permissionrequired: { admin: { all_read: "1" } },
 *   permissiontype: "admin",
 * });
 * ```
 */
export function usePermission(
  options: UsePermissionOptions,
): UsePermissionResult {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const hasFetched = useRef<boolean>(false);

  const configLogs = options.configLogs ?? useConexysConfig();
  const sessionID =
    options.sessionID ?? authStorage.getSessionId(configLogs) ?? '';
  const cxauthxc =
    options.cxauthxc ?? authStorage.getAuthToken(configLogs) ?? '';
  const fpHash = options.fpHash ?? '';

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // No-op translation stub — the real i18n key isn't available at this level,
    // but getservice2 requires a t function. We provide a passthrough.
    const t = (key: string) => key;

    const permissionrequiredJson = JSON.stringify(options.permissionrequired);

    getservice2(
      fpHash,
      sessionID,
      'permissionsuser',
      cxauthxc,
      t,
      (result: any) => {
        // Backend returns { data: boolean, code: 200 } or { data: false, code: 200 }
        // getservice2 already unwraps .data, so result is the boolean directly
        setHasPermission(result === true);
        setLoading(false);
      },
      () => {}, // setIsError — unused at hook level
      () => {}, // setError
      () => {}, // setMessageerror
      () => setLoading(false), // setLoading fallback
      configLogs,
      {
        permissionrequired: permissionrequiredJson,
        permissiontype: options.permissiontype,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — run once per mount (useRef prevents double fetch)

  return { hasPermission, loading };
}
