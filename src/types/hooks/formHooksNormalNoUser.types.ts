/**
 * @fileoverview
 */

import type { FormEvent, ChangeEvent } from 'react';
import type { FormInputs } from '../common';

export interface AuthData {
  v2fa: string;
  auth: string;
  name: string;
  lastname: string;
  email: string;
  username: string;
  language: string;
  sessionid: string;
  [key: string]: any;
}

export interface AuthTokenData {
  auth: string;
  name: string;
  lastname: string;
  email: string;
  username: string;
  language: string;
  sessionid: string;
  v2fa?: string;
  [key: string]: any;
}

export interface UseCustomFormReturn {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  formInputs: FormInputs;
  loading: boolean;
  error: boolean;
}
