/**
 * @fileoverview
 */

import type { FormEvent, ChangeEvent } from 'react';
import type { FormInputs, DeleteEvent } from '../common';

export interface PostFormServiceGetPostParams {
  iditem: string;
  sessionID: string;
  cxauthxc: string;
  postServerURL: string;
  authorization: boolean;
  fingerprint: string;
  event: FormEvent<HTMLFormElement>;
}

export interface UseCustomFormReturn {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleFormDelete: (event: DeleteEvent) => Promise<void>;
  formInputs: FormInputs;
  formStatus: boolean;
  setFormStatus: (status: boolean) => void;
  loading: boolean;
  error: boolean;
}
