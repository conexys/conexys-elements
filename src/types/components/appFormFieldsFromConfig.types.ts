/**
 * @fileoverview
 */

import { useTranslation } from 'react-i18next';
import type { FormInputs } from '../common';

export interface FormBlockComponents {
  component: string;
  type?: string;
  label?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  style?: string;
  autocomplete?: string;
  texthtml?: string;
  variant?: string;
  severity?: string;
  color?: string;
  headline?: string;
  size?: string | number;
  permission?: number;
  required?: boolean;
  validatetype?: string;
  check?: string;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  items?: any[];
  onCreateNew?: () => void;
  allowCreate?: boolean;
  validate?: {
    required?: boolean;
    type?: string;
    check?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormConfig {
  content: {
    body: FormBlockComponents[];
  };
}

export interface AppFormFieldsFromConfigProps {
  formInputs?: FormInputs;
  handleInputChange?: (event: any) => void;
  fpHash?: string;
  postServerURL?: string;
  getServerURL?: string;
  deleteServerURL?: string;
  id?: string;
  userlist?: any[] | object;
  settings?: any[];
  languages?: any[];
  data?: any[];
  handleCreateNew?: () => void;
  getFormFn?: (
    t: ReturnType<typeof useTranslation>[0],
    formInputs: FormInputs,
    handleInputChange: (event: any) => void,
    userlist: any[] | object,
    settings: any[],
    languages: any[],
    data: any[],
    handleCreateNew?: () => void,
  ) => FormConfig | null;
  className?: string;
  permissionstatus?: number;
  nouser?: string;
  t?: ReturnType<typeof useTranslation>[0];
  fetchMethod?: 'post' | 'get';
  method?: 'post' | 'patch';
  restoreMethod?: 'post' | 'patch';
}
