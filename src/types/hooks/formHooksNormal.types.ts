/**
 * @fileoverview
 */

import type { FormEvent, ChangeEvent } from 'react';
import type {
  FormInputs,
  DeleteEvent,
  FormResult,
  BaseUserData,
} from '../common';

export interface ProfileResponse {
  data: BaseUserData[];
}

export interface UseCustomFormReturn {
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleFormDelete: (event: DeleteEvent) => Promise<void>;
  handleFormRestore: (event: DeleteEvent) => Promise<void>;
  formInputs: FormInputs;
  formStatus: boolean;
  setFormStatus: (status: boolean) => void;
  loading: boolean;
  error: boolean;
  result: FormResult;
}
