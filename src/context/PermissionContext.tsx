/**
 * PermissionContext
 *
 * Global cache for permission checks to avoid duplicate API calls
 * when multiple components request the same permission combination.
 *
 * Usage:
 * ```tsx
 * // Wrap your app (or a section of it):
 * <PermissionProvider fpHash={fpHash}>
 *   <App />
 * </PermissionProvider>
 *
 * // Inside components:
 * const { checkPermission, clearCache } = usePermissionContext();
 * const result = await checkPermission({ admin: { all_read: "1" } }, "admin");
 * ```
 *
 * @module context/PermissionContext
 * @version 0.3.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { getservice2 } from '../services/getServiceExtended';
import { authStorage } from '../utilities/authStorage';
import { useConexysConfig } from '../config/ConexysConfig';
import type { ModulePermissions } from '../types/permission.types';

// ── Types ──────────────────────────────────────────────────────────

export interface PermissionContextValue {
  /**
   * Cache of permission results, keyed by a serialised version of the request.
   * Key format: `${permissiontype}::${JSON.stringify(permissionrequired)}`
   */
  cache: Map<string, boolean>;

  /**
   * Check a specific permission combination. Uses cache if available.
   * Returns true if the user has at least one of the requested permissions.
   */
  checkPermission: (
    permissionrequired: Record<string, Record<string, string>>,
    permissiontype: string,
  ) => Promise<boolean>;

  /**
   * Check whether a specific module+action is allowed.
   * Convenience wrapper around checkPermission.
   */
  can: (
    module: string,
    action: keyof ModulePermissions[keyof ModulePermissions],
  ) => Promise<boolean>;

  /** Clear the entire permission cache (e.g., on logout or role change). */
  clearCache: () => void;

  /** Whether any permission check is currently loading. */
  loading: boolean;

  /** Raw module permissions from the last cache population (if any). */
  modulePermissions: ModulePermissions | null;
}

// ── Context ────────────────────────────────────────────────────────

const PermissionContext = createContext<PermissionContextValue | undefined>(
  undefined,
);

// ── Provider Props ─────────────────────────────────────────────────

export interface PermissionProviderProps {
  children: ReactNode;
  /** Optional fingerprint hash override. */
  fpHash?: string;
  /** Optional session ID override. */
  sessionID?: string;
  /** Optional auth token override. */
  cxauthxc?: string;
}

// ── Cache key generator ───────────────────────────────────────────

function cacheKey(
  permissionrequired: Record<string, Record<string, string>>,
  permissiontype: string,
): string {
  return `${permissiontype}::${JSON.stringify(permissionrequired)}`;
}

// ── Provider ───────────────────────────────────────────────────────

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
  fpHash: fpHashProp,
  sessionID: sessionIDProp,
  cxauthxc: cxauthxcProp,
}) => {
  const configLogs = useConexysConfig();
  const cacheRef = useRef<Map<string, boolean>>(new Map());
  const modulePermissionsRef = useRef<ModulePermissions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sessionID = sessionIDProp ?? authStorage.getSessionId(configLogs) ?? '';
  const cxauthxc = cxauthxcProp ?? authStorage.getAuthToken(configLogs) ?? '';
  const fpHash = fpHashProp ?? '';

  /** Generate current cache as a Map for consumers. */
  const getCache = useCallback((): Map<string, boolean> => {
    return new Map(cacheRef.current);
  }, []);

  const checkPermission = useCallback(
    async (
      permissionrequired: Record<string, Record<string, string>>,
      permissiontype: string,
    ): Promise<boolean> => {
      const key = cacheKey(permissionrequired, permissiontype);

      // Return cached result if available
      if (cacheRef.current.has(key)) {
        return cacheRef.current.get(key)!;
      }

      setLoading(true);
      const t = (k: string) => k;

      try {
        const result = await new Promise<boolean>((resolve) => {
          getservice2(
            fpHash,
            sessionID,
            'permissionsuser',
            cxauthxc,
            t,
            (data: any) => {
              const granted = data === true;
              cacheRef.current.set(key, granted);
              resolve(granted);
            },
            () => {}, // setIsError
            () => {}, // setError
            () => {}, // setMessageerror
            () => setLoading(false),
            configLogs,
            {
              permissionrequired: JSON.stringify(permissionrequired),
              permissiontype,
            },
          );
        });
        return result;
      } catch {
        cacheRef.current.set(key, false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fpHash, sessionID, cxauthxc, configLogs],
  );

  const can = useCallback(
    async (
      module: string,
      action: keyof ModulePermissions[keyof ModulePermissions],
    ): Promise<boolean> => {
      // Build a single-permission request for this module+action
      const perm: Record<string, Record<string, string>> = {
        [module]: {
          own_create: '0',
          own_read: '0',
          own_update: '0',
          own_delete: '0',
          all_read: '0',
          all_update: '0',
          all_delete: '0',
          [action]: '1',
        },
      };
      return checkPermission(perm, module);
    },
    [checkPermission],
  );

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    modulePermissionsRef.current = null;
  }, []);

  const value: PermissionContextValue = {
    cache: getCache(),
    checkPermission,
    can,
    clearCache,
    loading,
    modulePermissions: modulePermissionsRef.current,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────

/**
 * Access the permission context.
 * Must be used inside a PermissionProvider.
 */
export function usePermissionContext(): PermissionContextValue {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error(
      'usePermissionContext must be used within a <PermissionProvider>. ' +
        'Wrap your app or section with <PermissionProvider fpHash={fpHash}>.',
    );
  }
  return ctx;
}

export default PermissionContext;
