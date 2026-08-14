/**
 * @fileoverview
 */

interface ErrorObject {
  message?: string;
  [key: string]: any;
}

export interface AppErrorProps {
  error: ErrorObject;
}

export interface AppHeaderPageProps {
  fpHash: string;
  title: string;
}

export interface IconStyles {
  fontSize: string;
  marginTop: string;
  marginLeft?: string;
  cursor?: string;
  color: string;
  width?: string;
}

export interface AppHeaderPage404Props {
  title: string;
  fpHash: string;
}
