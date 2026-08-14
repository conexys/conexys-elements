/**
 * @fileoverview
 */

import type { FormEvent } from 'react';

export interface PostFormServiceGetPostParams {
  postServerURL: string;
  authorization: boolean;
  event: FormEvent<HTMLFormElement>;
  iditem: string;
  sessionID: string;
  fingerprint: string;
  cxauthxc?: string;
}
