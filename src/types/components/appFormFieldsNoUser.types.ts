/**
 * @fileoverview
 */

import type { ReactNode } from 'react';

export interface ValidationRules {
  required?: boolean;
  type?: string;
  check?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

interface FormBlockItem {
  label: string;
  value: string | number;
}

export interface FormBlockComponents {
  component: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  style?: React.CSSProperties;
  autocomplete?: string;
  permission?: number;
  required?: boolean;
  validatetype?: string;
  check?: string;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  items?: FormBlockItem[];
}

export interface AdditionalFields {
  content: {
    body: FormBlockComponents[];
  };
}

export interface AppFormFieldsNoUserProps {
  children?: ReactNode;
  name: string;
  postURL: string;
  postServerURL: string;
  additionalfields?: AdditionalFields;
  className?: string;
}
