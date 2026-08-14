/**
 * @fileoverview
 */

import type { FormEvent, ChangeEvent } from 'react';
import type { FormInputs, FormResult } from '../common';

export interface PostFormServiceParams {
  sessionID: string;
  cxauthxc: string;
  postServerURL: string;
  authorization: boolean;
  fingerprint: string;
  event: FormEvent<HTMLFormElement>;
  id: string;
  ButtonPressed: string;
}

export interface UseCustomFormReturn {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  formInputs: FormInputs;
  result: FormResult;
  loading: boolean;
  error: boolean;
}
