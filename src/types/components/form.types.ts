/**
 * @fileoverview
 */

export interface FormBlock {
  component: string;
  name: string;
  permission: number;
  permissionstatus: number;
  type?: string;
  label?: string;
  id?: string;
  placeholder?: string | number;
  className?: string;
  value?: any;
  onChange?: (event: any) => void;
  onCreateNew?: () => void;
  allowCreate?: boolean;
  style?: React.CSSProperties | string;
  autocomplete?: string;
  texthtml?: string;
  variant?: string;
  severity?: string;
  color?: string;
  headline?: string;
  size?: string | number;
  validate?: {
    required?: boolean;
    type?: string;
    check?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  items?: any[];
  /** `cx_users_id` del registro en edición (A-ENUM-2b, formulario admin). */
  itemID?: string;
  /** Activa validación admin-scoped de disponibilidad (A-ENUM-2b). */
  adminCheck?: boolean;
  /**
   * Muestra un icono de ojo para alternar mostrar/ocultar la contraseña en
   * campos de tipo password. Opcional (default: false).
   */
  showPasswordToggle?: boolean;
}

interface ButtonBlock {
  text: string;
  className?: string;
  ref?: string;
  classNameButton?: string;
  onclick?: () => void;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonProps {
  block: ButtonBlock;
}

interface CheckboxBlock {
  name: string;
  id: string;
  className?: string;
  label: string;
  ref?: string;
  value?: string;
}

export interface CheckboxProps {
  block: CheckboxBlock;
}

export interface FormData {
  password: string;
  password_confirmation: string;
  agree: boolean;
}

interface FormLoginBlock {
  type:
    'text' | 'password' | 'checkbox' | 'checkboxregister' | 'passwordregister';
  name: string | string[];
  id: string | string[];
  className?: string;
  label: string | string[];
  value?: string | boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autocomplete?: string;
  /**
   * Muestra un icono de ojo a la derecha del campo para alternar entre
   * ocultar/mostrar la contraseña. Útil en los tipos 'password' y
   * 'passwordregister'. Opcional (default: false).
   */
  showPasswordToggle?: boolean;
}

export interface FormLoginProps {
  block: FormLoginBlock;
}

interface HeadingBlock {
  headline: string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  ref?: string;
}

export interface HeadingProps {
  block: HeadingBlock;
}

interface ImageBlock {
  className?: string;
  ref?: string;
  urlimage: string;
  name: string;
}

export interface ImageProps {
  block: ImageBlock;
}

interface InfoBlock {
  variant: 'filled' | 'outlined' | 'standard';
  ref?: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  warning?: 'error' | 'warning' | 'info' | 'success';
  texthtml: string;
}

export interface InfoProps {
  block: InfoBlock;
}

interface InputFileBlock {
  id: string;
  name: string;
  ref?: string;
  accept?: string;
}

export interface InputFileProps {
  block: InputFileBlock;
}

interface PasswordValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface InputPasswordBlock {
  id: string;
  name: string;
  type: string;
  label: string;
  className?: string;
  value?: string | number;
  validate: PasswordValidation;
  ref?: string;
  /**
   * Muestra un icono de ojo a la derecha del campo para alternar entre
   * ocultar/mostrar la contraseña. Opcional (default: false).
   */
  showPasswordToggle?: boolean;
}

export interface InputPasswordProps {
  block: InputPasswordBlock;
  inParagraph?: boolean;
}

export interface InputPasswordProps {
  block: InputPasswordBlock;
  inParagraph?: boolean;
}

export interface FormDataPassword {
  password: string;
  password_confirmation: string;
}

interface TextValidation {
  check?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  error?: string;
  type?: string;
  required?: boolean;
}

interface InputTextBlock {
  id: string;
  name: string;
  type: string;
  label: string;
  className?: string;
  placeholder?: string;
  value?: string;
  autocomplete?: string;
  validate: TextValidation;
  ref?: string;
  style?: string;
  /**
   * Muestra un icono de ojo a la derecha del campo para alternar entre
   * ocultar/mostrar la contraseña. Útil cuando `type` es 'password'.
   * Opcional (default: false).
   */
  showPasswordToggle?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * `cx_users_id` del registro en edición (A-ENUM-2b). Presente cuando el
   * formulario es admin-scoped; permite el caso "es el propio registro".
   */
  itemID?: string;
  /**
   * Indica que este input debe validar disponibilidad contra los endpoints
   * admin-scoped (`admincheckusername`/`admincheckmail`) en lugar del público.
   */
  adminCheck?: boolean;
}

export interface InputTextProps {
  block: InputTextBlock;
}

export interface ApiError {
  response?: {
    status: number;
  };
}

interface InputWYSIWYGBlock {
  id: string;
  name: string;
  label: string;
  value?: string;
  ref?: string;
}

export interface InputWYSIWYGProps {
  block: InputWYSIWYGBlock;
}

export interface RadioItem {
  item: string;
  textitem: string;
}

interface RadiobuttonBlock {
  id: string;
  name: string;
  label: string;
  ref?: string;
  value?: string;
  referred?: boolean;
  items: RadioItem[];
}

export interface RadiobuttonProps {
  block: RadiobuttonBlock;
}

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectItem {
  item: string;
  textitem: string;
  isCreateOption?: boolean;
}

interface SelectValidation {
  required?: boolean;
}

interface SelectBlock {
  id: string;
  name: string;
  label: string;
  type: string;
  ref?: string;
  value?: string | SelectOption[];
  referred?: boolean;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
  ) => void;
  onCreateNew?: (
    option: SelectOption | null,
    name: string,
  ) => Promise<SelectOption> | void;
  allowCreate?: boolean;
  placeholder?: string;
  items: SelectItem[];
  validate: SelectValidation;
}

export interface SelectProps {
  block: SelectBlock;
}

interface SwitchBlock {
  id: string;
  name: string;
  label: string;
  ref?: string;
  value?: string;
  referred?: boolean;
}

export interface SwitchProps {
  block: SwitchBlock;
}

interface TextBlock {
  text: string;
  className?: string;
  ref?: string;
}

export interface TextProps {
  block: TextBlock;
}

export interface ApiResponseString {
  user: string;
  result: string;
}

export interface CheckMailRequest {
  email: string;
  sessionID?: string;
}

export interface CheckUsernameRequest {
  username: string;
  sessionID?: string;
}

/**
 * Payload para el endpoint admin-scoped `admincheckusername` (A-ENUM-2b).
 * `itemID` es el `cx_users_id` del registro en edición (para el caso
 * "es el propio registro").
 */
export interface AdminCheckUsernameRequest {
  username: string;
  itemID?: string;
}

/**
 * Payload para el endpoint admin-scoped `admincheckmail` (A-ENUM-2b).
 */
export interface AdminCheckMailRequest {
  email: string;
  itemID?: string;
}

/**
 * Respuesta de los endpoints admin de disponibilidad: devuelve el estado real
 * (a diferencia del endpoint público, que siempre responde 'Valid' neutro).
 * NUNCA revela quién ocupa el valor, solo el estado.
 */
export interface AdminAvailabilityResponse {
  available: boolean;
  isCurrent: boolean;
}
