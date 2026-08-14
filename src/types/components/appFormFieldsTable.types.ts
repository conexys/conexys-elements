/**
 * @fileoverview
 */

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

export interface FormBlock {
  component: string;
  type: string;
  label: string;
  name?: string;
  id?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  autocomplete?: string;
  texthtml?: string;
  variant?: string;
  severity?: string;
  color?: string;
  headline?: string;
  size?: string;
  permission?: number;
  required?: boolean;
  validatetype?: string;
  check?: string;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  validate?: ValidationRules;
  items?: FormBlockItem[];
}

export interface AdditionalFields {
  content: {
    body: FormBlock[];
  };
}

export interface PostResponse {
  data: string;
  permission: string;
}

export interface AppFormFieldsTableProps {
  fetchMethod?: 'post' | 'get';
  name?: string;
  fpHash: string;
  postURL?: string;
  postServerURL: string;
  getServerURL: string;
  deleteServerURL: string;
  id: string;
  additionalfields?: AdditionalFields;
  className?: string;
  permission: boolean;
  show: string;
  nouser?: string;
}
