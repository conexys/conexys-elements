/**
 * PermissionGate Component
 *
 * Wraps children and only renders them if the user has the required
 * granular permissions. Uses usePermission internally.
 *
 * Supports:
 * - loadingComponent: shown while the permission check is in progress
 * - fallback: shown if the user doesn't have permission (default: renders nothing)
 * - Auto-reads auth tokens from authStorage / ConexysConfig
 *
 * ```tsx
 * <PermissionGate
 *   permissionrequired={{ admin: { all_read: "1" } }}
 *   permissiontype="admin"
 *   fallback={<AppHeaderPage404 />}
 * >
 *   <ProtectedContent />
 * </PermissionGate>
 * ```
 *
 * @module components/PermissionGate
 * @version 0.3.0
 */

import React, { type ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';
import type { UsePermissionOptions } from '../types/permission.types';

export interface PermissionGateProps extends UsePermissionOptions {
  /** Content to render if the user has permission. */
  children: ReactNode;
  /** Content to render if the user does NOT have permission. Default: nothing. */
  fallback?: ReactNode;
  /** Content to render while the permission check is loading. Default: nothing. */
  loadingComponent?: ReactNode;
}

/**
 * Conditional rendering gate based on user permissions.
 *
 * Automatically extracts sessionID, cxauthxc, and configLogs from
 * authStorage and ConexysConfig context when not explicitly provided.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  fallback = null,
  loadingComponent = null,
  permissionrequired,
  permissiontype,
  fpHash,
  sessionID,
  cxauthxc,
  configLogs,
}) => {
  const { hasPermission, loading } = usePermission({
    permissionrequired,
    permissiontype,
    fpHash,
    sessionID,
    cxauthxc,
    configLogs,
  });

  // Still checking — show loader or nothing
  if (loading) {
    return <>{loadingComponent}</>;
  }

  // Permission denied — show fallback or nothing
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  // Permission granted — render children
  return <>{children}</>;
};

export default PermissionGate;
