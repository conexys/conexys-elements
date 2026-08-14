/**
 * @fileoverview
 * BackendStatusProvider — Context provider for checking backend connectivity.
 *
 * Usage:
 *   <BackendStatusProvider>
 *     <App />
 *   </BackendStatusProvider>
 *
 * Optimistic approach: renders children immediately (assumes connected).
 * If the backend is unreachable, children are replaced with a fallback UI.
 * When the user clicks "Reintentar" and the backend responds, the page
 * reloads to ensure a fresh app boot with all proper initializations.
 *
 * @module components/BackendStatus/BackendStatusProvider
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 1.2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import { Url } from '../../constants/global';
import type {
  BackendStatusContextType,
  BackendStatusProviderProps,
} from '../../types/components/backendStatus.types';
import BackendOfflinePage from './BackendOfflinePage';

/**
 * Context for backend connectivity status.
 */
const BackendStatusContext = createContext<
  BackendStatusContextType | undefined
>(undefined);

/**
 * Hook to access backend connectivity status.
 * Must be used within a BackendStatusProvider.
 *
 * @returns {BackendStatusContextType} Connection status and control methods
 * @throws If used outside of BackendStatusProvider
 */
export const useBackendStatus = (): BackendStatusContextType => {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error(
      'useBackendStatus must be used within a BackendStatusProvider',
    );
  }
  return context;
};

/**
 * BackendStatusProvider component.
 *
 * Optimistic startup: renders children immediately without waiting for the
 * first health check. If the backend is later confirmed unreachable, it
 * switches to a fallback offline page.
 *
 * When connection is restored (user clicks retry or periodic check succeeds),
 * the page reloads to guarantee a clean app bootstrap.
 *
 * @param {BackendStatusProviderProps} props - Component props
 * @returns {JSX.Element} The provider with connectivity check
 */
export const BackendStatusProvider: React.FC<BackendStatusProviderProps> = ({
  children,
  checkInterval = 30000,
  fallbackComponent,
  healthEndpoint = 'health',
}) => {
  // Start optimistic — assume connected, render immediately
  const [isConnected, setIsConnected] = useState(true);
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(true);
  // Track previous state to detect transition: disconnected → connected
  const wasDisconnectedRef = useRef(false);

  const checkConnection = useCallback(async () => {
    if (!mountedRef.current) return;

    setIsRetrying(true);

    try {
      const healthUrl = Url + healthEndpoint;
      await axios.get(healthUrl, { timeout: 5000 });

      if (!mountedRef.current) return;

      // If we were previously disconnected and now we're connected,
      // reload the page to boot the app fresh
      if (wasDisconnectedRef.current) {
        window.location.reload();
        return; // stop here, page is reloading
      }

      setIsConnected(true);
      setLastConnected(new Date());
      setLastCheck(new Date());
    } catch {
      if (!mountedRef.current) return;

      wasDisconnectedRef.current = true;
      setIsConnected(false);
      setLastCheck(new Date());
    } finally {
      if (mountedRef.current) {
        setIsRetrying(false);
        setIsInitialized(true);
      }
    }
  }, [healthEndpoint]);

  // Run initial check after render, no blocking
  useEffect(() => {
    // React 18 StrictMode double-mount guard: reset the ref on mount
    mountedRef.current = true;

    // Small delay to let the UI render first
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        checkConnection();
      }
    }, 250);

    // Periodic checks (always, to detect downtime)
    const interval = setInterval(() => {
      if (mountedRef.current) {
        checkConnection();
      }
    }, checkInterval);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkConnection, checkInterval]);

  // If disconnected, show fallback (only after initial check, never on first render)
  if (isInitialized && !isConnected) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return (
      <BackendOfflinePage
        onRetry={checkConnection}
        isRetrying={isRetrying}
        lastConnected={lastConnected}
      />
    );
  }

  // Connected — render children and provide context
  const contextValue: BackendStatusContextType = {
    isConnected,
    isChecking: isRetrying,
    lastCheck,
    checkConnection,
  };

  return (
    <BackendStatusContext.Provider value={contextValue}>
      {children}
    </BackendStatusContext.Provider>
  );
};
