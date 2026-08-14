/**
 * @fileoverview
 */

export interface AuthData {
  auth: string;
  name: string;
  lastname: string;
  email: string;
  username: string;
  language: string;
  sessionid: string;
  [key: string]: any;
}

export interface AuthContextType {
  authTokens: string | null;
  setAuthTokens: (data: AuthData) => void;
}
