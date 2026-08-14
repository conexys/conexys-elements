/**
 * @fileoverview
 * Type definitions for BackendStatus components.
 * @module types/components/backendStatus
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 1.0.0
 */

import type { ReactNode } from 'react';

export interface BackendStatusContextType {
  /** Whether the backend is currently reachable */
  isConnected: boolean;
  /** Whether a connection check is in progress */
  isChecking: boolean;
  /** Timestamp of the last connection check */
  lastCheck: Date | null;
  /** Manually trigger a connection check */
  checkConnection: () => Promise<void>;
}

export interface BackendStatusProviderProps {
  /** Children to render when backend is connected */
  children: ReactNode;
  /** Interval in ms between automatic connection checks (default: 30000) */
  checkInterval?: number;
  /** Custom fallback component to show when backend is offline */
  fallbackComponent?: ReactNode;
  /** Custom health endpoint path (default: 'health') */
  healthEndpoint?: string;
}
