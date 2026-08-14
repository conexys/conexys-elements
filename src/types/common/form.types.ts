/**
 * @fileoverview
 */

export interface FormInputs {
  [key: string]: string | number | boolean;
}

export interface DeleteEvent {
  id: string;
}

export interface FormResult {
  [key: string]: any;
}
