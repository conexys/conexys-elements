/**
 * @fileoverview
 */

export interface ContentTypeConfig {
  headers: {
    'Content-Type': string;
  };
}

export interface RequestConfig {
  headers: {
    Authorization: string;
    'X-Session-ID'?: string;
    'X-Fingerprint'?: string;
    'X-Session-Type'?: string;
    'Content-Type': string;
  };
}
