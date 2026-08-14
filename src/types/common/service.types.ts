/**
 * @fileoverview
 */

import type { FormEvent } from 'react';

export interface BaseServiceParams {
  sessionID: string;
  cxauthxc: string;
  fingerprint: string;
  id: string;
}

/**
 * Parámetros para servicio de eliminación
 */
export interface DeleteServiceParams extends BaseServiceParams {
  deleteServerURL: string;
}

export interface RestoreServiceParams extends BaseServiceParams {
  restoreServerURL: string;
}

export interface PostServiceBaseParams {
  postServerURL: string;
  authorization: boolean | string;
  fingerprint: string;
  cxauthxc?: string;
  sessionID?: string;
  name?: string;
  password?: string;
  id?: string;
  event?: FormEvent<HTMLFormElement>;
  formData?: any;
  state?: string;
  email?: string;
  plugin?: string;
  userUSERNAME?: string;
  img?: any;
  type?: string;
  languages?: string;
}

export interface PostFormServiceBaseParams extends PostServiceBaseParams {
  event: FormEvent<HTMLFormElement>;
  authorization: boolean;
  iditem?: string;
  sessionID?: string;
  ButtonPressed?: string;
  id?: string;
  formData?: any;
}

export interface ServiceResponse {
  [key: string]: any;
}

export interface ServiceDataResponse {
  data: any;
  [key: string]: any;
}
