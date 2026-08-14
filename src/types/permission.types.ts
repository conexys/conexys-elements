/**
 * Permission types for Conexys permission system.
 *
 * @fileoverview Type definitions for granular permission checking.
 * @module types/permission
 * @version 0.3.0
 */

/**
 * Numeric permission level (e.g., 1 = superadmin, 2 = admin, 3 = user).
 */
export type PermissionLevel = number;

/**
 * A single permission value — "0" = denied, "1" = granted.
 */
export type PermissionValue = '0' | '1';

/**
 * Full set of permissions a role has for a given module.
 *
 * ```json
 * {
 *   "admin": {
 *     "own_create": "1",
 *     "own_read": "1",
 *     "own_update": "0",
 *     "own_delete": "0",
 *     "all_read": "1",
 *     "all_update": "0",
 *     "all_delete": "0"
 *   }
 * }
 * ```
 */
export interface ModulePermission {
  own_create: PermissionValue;
  own_read: PermissionValue;
  own_update: PermissionValue;
  own_delete: PermissionValue;
  all_read: PermissionValue;
  all_update: PermissionValue;
  all_delete: PermissionValue;
}

/**
 * All module permissions for a user/role, keyed by module name.
 */
export interface ModulePermissions {
  [module: string]: ModulePermission;
}

/**
 * The object sent to the backend to request permission verification.
 */
export interface PermissionRequired {
  permissionrequired: string; // JSON-stringified ModulePermissions
  permissiontype: string; // e.g., "admin", "dashboard"
}

/**
 * Structured result from a permission check.
 */
export interface PermissionResult {
  /** Whether the user has at least the required permissions. */
  hasAccess: boolean;
  /** User has own_create = "1" for the requested module. */
  canCreate: boolean;
  /** User has own_read = "1" or all_read = "1" for the requested module. */
  canRead: boolean;
  /** User has own_update = "1" for the requested module. */
  canUpdate: boolean;
  /** User has own_delete = "1" for the requested module. */
  canDelete: boolean;
  /** User is superadmin (user_type = "1"). */
  isSuperAdmin: boolean;
}

/**
 * Options for the usePermission hook.
 */
export interface UsePermissionOptions {
  /** Permission requirements as a structured object (will be JSON-stringified). */
  permissionrequired: Record<string, Record<string, string>>;
  /** Module type to check against (e.g., "admin", "dashboard"). */
  permissiontype: string;
  /** Optional fingerprint hash override. */
  fpHash?: string;
  /** Optional session ID override. */
  sessionID?: string;
  /** Optional auth token override. */
  cxauthxc?: string;
  /** Config logs context from ConexysConfig. */
  configLogs?: any;
}
