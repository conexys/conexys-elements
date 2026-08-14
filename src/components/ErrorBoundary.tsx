/**
 * @fileoverview
 * ErrorBoundary is a component class that acts as a container to catch and handle errors that may occur in the rendering of its child components.
 * This component can be used to wrap other components and catch any errors that propagate from child components during their lifecycle. It is useful for gracefully handling errors that might occur during the rendering of a specific part of the user interface.
 * @module components/ErrorBoundary
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import type { ErrorInfo } from 'react';
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '../types/components/components.types';
import AppDialogModal from './dialog/AppDialogModal';
import { ConexysConfigContext } from '../config/ConexysConfig';
import type { ConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

/**
 * Known error patterns that do not affect functionality
 * Synchronized with suppressKnownErrors.ts
 */
const suppressedPatterns = [
  'removeChild',
  'The node to be removed is not a child of this node',
  'insertBefore',
  'removeChild on Node',
  'NotFoundError',
];

const isKnownError = (
  error: Error | null,
  errorInfo: ErrorInfo | null,
): boolean => {
  if (!error) return false;

  const errorMessage = [
    error.message || '',
    error.toString() || '',
    errorInfo?.componentStack || '',
  ]
    .join(' ')
    .toLowerCase();

  return suppressedPatterns.some((pattern) =>
    errorMessage.includes(pattern.toLowerCase()),
  );
};

/**
 * ErrorBoundary is a React component that catches JavaScript errors
 * anywhere in its child component tree and logs those errors.
 *
 * @class
 * @extends React.Component
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState & { trigger1: number; trigger2: number }
> {
  static contextType = ConexysConfigContext;
  /**
   * Constructor for ErrorBoundary component.
   *
   * @constructor
   * @param {ErrorBoundaryProps} props - React props for the component.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    /**
     * State representing whether an error has occurred.
     */
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      trigger1: 0,
      trigger2: 0,
    };
  }

  /**
   * A lifecycle method that is invoked after an error has been thrown
   * by a descendant component.
   *
   * @static
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} - The updated state indicating an error has occurred.
   */
  static getDerivedStateFromError(
    error: Error,
    errorInfo: ErrorInfo,
  ): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * A lifecycle method that logs the error and additional error information.
   *
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - Additional information about the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const configLogs: ConexysConfig = this.context as ConexysConfig;
    const knownError = isKnownError(error, errorInfo);

    // If it is a known error, do nothing
    if (knownError) {
      return;
    }

    this.setState({ errorInfo });
    logConsole(configLogs, 'error', 'ErrorBoundary caught an error"', error);
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleCloseModal = (): void => {
    this.setState((prevState) => ({ trigger2: prevState.trigger2 + 1 }));
  };

  handleOpenModal = (): void => {
    this.setState((prevState) => ({ trigger1: prevState.trigger1 + 1 }));
  };

  /**
   * Renders the children if no error has occurred.
   * Otherwise, renders a message indicating that something went wrong.
   *
   * @returns {JSX.Element} - Rendered component or error message.
   */
  render(): React.JSX.Element {
    if (this.state.hasError) {
      var isKnown = isKnownError(this.state.error, this.state.errorInfo);
      return (
        <>
          <button
            onClick={this.handleOpenModal}
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              zIndex: 9999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              display: isKnown ? 'none' : 'block',
            }}
          >
            ⚠️ Errors have been found.
          </button>
          <AppDialogModal
            title="⚠️ Application Error"
            type="Delete"
            trigger1={this.state.trigger1}
            trigger2={this.state.trigger2}
            close={false}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{ color: '#666', maxWidth: '500px', lineHeight: '1.6' }}
              >
                An unexpected error has occurred. Please try reloading the page.
              </p>
              {this.state.error && (
                <details
                  style={{
                    marginTop: '16px',
                    color: '#999',
                    fontSize: '12px',
                    maxWidth: '100%',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                    View error details
                  </summary>
                  <pre
                    style={{
                      backgroundColor: '#eee',
                      padding: '10px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={this.handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#757575',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={this.handleReload}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </AppDialogModal>
        </>
      );
    }

    return this.props.children as React.JSX.Element;
  }
}

export default ErrorBoundary;
