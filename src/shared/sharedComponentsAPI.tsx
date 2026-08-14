/**
 * @fileoverview Shared components API for plugins
 *
 * @module shared/sharedComponentsAPI
 * @description Provides shared components and utilities for plugins.
 * @version 0.3.0
 */

import { createElement, ReactElement } from 'react';
import { Loading } from '../components/theme/index';
import { logConsole } from '../utilities/logConsole';
import type { LoadingProps } from '../types/components/theme.types';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Interface for the Loading component
 */
interface UIComponents {
  Loading: typeof Loading;
}

/**
 * Interface for Conexys shared components
 */
interface ConexysComponents {
  /** UI components */
  UI: UIComponents;
  /** Factory function to create the Loading component */
  createLoading: (props?: LoadingProps) => ReactElement;
  /** Library version */
  version: string;
  /** Release date */
  releaseDate: string;
}

/**
 * Extension of the Window object to include conexysComponents
 */
declare global {
  interface Window {
    conexysComponents?: ConexysComponents;
  }
}

/**
 * Initializes and exposes shared components on the window object
 * @returns {void}
 */
export const initializeSharedComponents = (): void => {
  const configLogs = useConexysConfig();
  // Avoid reinitialization if it already exists
  if (window.conexysComponents) return;

  // Shared components object
  window.conexysComponents = {
    // UI components
    UI: {
      Loading,
    },
    // Factory functions to render components with specific props
    createLoading: (props?: LoadingProps): ReactElement => {
      return createElement(Loading, props);
    },

    // Version and metadata
    version: '1.0.0',
    releaseDate: '2025-05-21',
  };
  logConsole(
    configLogs,
    'info',
    '[Shared Components] ',
    'Components initialized and shared with plugins',
  );
};
