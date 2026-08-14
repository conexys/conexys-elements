/**
 * @fileoverview
 * Authentication
 * This code creates an authentication context using React's createContext and useContext functions.
 * This authentication context can be used to provide authentication information (e.g. user information, authentication tokens) throughout the React application without manually passing properties from one component to another. The useAuth function provides a convenient way to access the current value of the context within functional components.
 * @module Auth
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { createContext, useContext } from 'react';
import type { AuthContextType } from './types/auth.types';

/**
 * Authentication context providing authentication values to secondary components.
 */
export const AuthContext = createContext<AuthContextType>({
  authTokens: null,
  setAuthTokens: () => {},
});

/**
 * Custom Hook that returns the authentication context.
 * @returns Authentication context value.
 */
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
