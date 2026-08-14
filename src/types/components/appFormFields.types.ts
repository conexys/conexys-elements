/**
 * @fileoverview
 */

export interface FormBlockComponents {
  component: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  style?: string;
  autocomplete?: string;
  permission?: string;
  required?: boolean;
  validatetype?: string;
  check?: string;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  items?: any[];
}

export interface AdditionalFields {
  content: {
    body: FormBlockComponents[];
  };
}

export interface PostResponse {
  data: string;
  permission: string;
}

export interface AppFormFieldsProps {
  children?: React.ReactNode;
  fpHash: string;
  name: string;
  postURL: string;
  postServerURL: string;
  getServerURL: string;
  deleteServerURL?: string;
  id: string;
  additionalfields?: AdditionalFields;
  className?: string;
  permission?: boolean;
  show?: string;
  feedback: string;
  method?: 'post' | 'patch';
}
