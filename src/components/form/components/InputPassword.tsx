/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputPassword
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type {
  InputPasswordProps,
  FormDataPassword,
} from '../../../types/components/form.types';

/**
 * InputPassword component for rendering password input fields.
 *
 * @component
 * @param {object} props - The properties of the InputPassword component.
 * @param {object} props.block - Information about the password input.
 * @param {string} props.block.id - The ID of the password input.
 * @param {string} props.block.name - The name of the password input.
 * @param {string} props.block.type - The type of the password input.
 * @param {string} props.block.label - The label of the password input.
 * @param {string} props.block.className - The CSS class of the password input.
 * @param {number} props.block.value - The value of the password input.
 * @param {object} props.block.validate - Validation rules for the password input.
 * @param {boolean} props.inParagraph - Whether the component is rendered within a paragraph.
 * @returns {JSX.Element} The rendered InputPassword component.
 */
const InputPassword: React.FC<InputPasswordProps> = ({
  block,
  inParagraph = false,
}) => {
  const [t] = useTranslation('global');

  // Toggle muestra/oculta contraseña (opcional vía block.showPasswordToggle)
  const showToggle = block.showPasswordToggle === true;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleTogglePassword = (): void => setShowPassword((v) => !v);
  const handleToggleConfirmation = (): void =>
    setShowConfirmation((v) => !v);

  // Validation
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormDataPassword>({
    mode: 'onBlur',
  });
  const password = useRef<string>('');
  password.current = watch('password', '');

  useEffect(() => {
    if (errors.password?.type) {
      localStorage.setItem('errors' + block.name, 'errorfoundfield');
    } else {
      localStorage.removeItem('errors' + block.name);
    }

    if (errors.password_confirmation?.type) {
      localStorage.setItem('errors' + block.name + 100, 'errorfoundfield');
    } else {
      localStorage.removeItem('errors' + block.name + 100);
    }
  }, [errors, block.name]);

  if (block.type === 'passwordnorm') {
    const resetvalue = block.value === 200 ? '' : undefined;

    // Determine container to avoid nesting errors
    const Container = inParagraph ? 'span' : 'div';

    return (
      <>
        <Container className={`form-group ${block.ref}`}>
          {inParagraph ? (
            // Simplified version for use within paragraphs
            <>
              <span className="password-label">
                {block.label}
                {block.validate.required && <span className="required">*</span>}
              </span>
              <input
                type={showToggle && showPassword ? 'text' : 'password'}
                //name={block.name}
                id={block.id}
                className={
                  errors.password
                    ? `${block.className} is-invalid`
                    : block.className
                }
                {...register(block.name as keyof FormDataPassword, {
                  required: block.validate.required,
                  minLength: block.validate.minLength,
                  maxLength: block.validate.maxLength,
                })}
                required
              />
              {showToggle && (
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleTogglePassword}
                  aria-label={t('System.show_password')}
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              )}
              {errors.password && (
                <span className="error invalid-feedback">
                  {errors.password.type === 'required' &&
                    t('error.please_enter_password')}
                  {errors.password.type === 'minLength' &&
                    `${t('error.password_minimum')} ${block.validate.minLength} ${t('characters')}`}
                  {errors.password.type === 'maxLength' &&
                    `${t('error.password_maximum')} ${block.validate.maxLength} ${t('characters')}`}
                </span>
              )}
            </>
          ) : (
            // Original version with Material-UI components
            <>
              <InputLabel htmlFor={block.id}>
                {block.label}
                {block.validate.required && <span className="required">*</span>}
              </InputLabel>
              <TextField
                hiddenLabel
                size="small"
                //name={block.name}
                id={block.id}
                type={showToggle && showPassword ? 'text' : 'password'}
                value={resetvalue}
                className={
                  errors.password
                    ? `${block.className} is-invalid`
                    : block.className
                }
                {...register(block.name as keyof FormDataPassword, {
                  required: block.validate.required,
                  minLength: block.validate.minLength,
                  maxLength: block.validate.maxLength,
                })}
                required
                slotProps={
                  showToggle
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={t('System.show_password')}
                                onClick={handleTogglePassword}
                                edge="end"
                                tabIndex={-1}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined
                }
              />
              {errors.password?.type === 'required' && (
                <em className="error invalid-feedback">
                  {t('error.please_enter_password')}
                </em>
              )}
              {errors.password?.type === 'minLength' && (
                <em className="error invalid-feedback">
                  {t('error.password_minimum')} {block.validate.minLength}{' '}
                  {t('characters')}
                </em>
              )}
              {errors.password?.type === 'maxLength' && (
                <em className="error invalid-feedback">
                  {t('error.password_maximum')} {block.validate.maxLength}{' '}
                  {t('characters')}
                </em>
              )}
            </>
          )}
        </Container>

        <Container className={`form-group ${block.ref}`}>
          {inParagraph ? (
            // Simplified version for use within paragraphs
            <>
              <span className="password-label">
                {t('System.repeat')} {block.label}
                {block.validate.required && <span className="required">*</span>}
              </span>
              <input
                type={showToggle && showConfirmation ? 'text' : 'password'}
                id={block.id + 100}
                className={
                  errors.password_confirmation
                    ? `${block.className} is-invalid`
                    : block.className
                }
                {...register(
                  `${block.name}_confirmation` as keyof FormDataPassword,
                  {
                    required: block.validate.required,
                    minLength: block.validate.minLength,
                    maxLength: block.validate.maxLength,
                    validate: (value) =>
                      value === password.current ||
                      t('error.passwords_do_not_match'),
                  },
                )}
                required
              />
              {showToggle && (
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleToggleConfirmation}
                  aria-label={t('System.show_password')}
                  tabIndex={-1}
                >
                  {showConfirmation ? <VisibilityOff /> : <Visibility />}
                </button>
              )}
              {errors.password_confirmation && (
                <span className="error invalid-feedback">
                  {errors.password_confirmation.type === 'required' &&
                    t('error.repeat_password')}
                  {errors.password_confirmation.type === 'minLength' &&
                    `${t('error.password_minimum')} ${block.validate.minLength} ${t('characters')}`}
                  {errors.password_confirmation.type === 'maxLength' &&
                    `${t('error.password_maximum')} ${block.validate.maxLength} ${t('characters')}`}
                  {errors.password_confirmation.type === 'validate' &&
                    t('error.password_not_match')}
                </span>
              )}
            </>
          ) : (
            // Original version with Material-UI components
            <>
              <InputLabel htmlFor={block.id + 100}>
                {t('System.repeat')} {block.label}
                {block.validate.required && <span className="required">*</span>}
              </InputLabel>
              <TextField
                hiddenLabel
                size="small"
                //name={block.name}
                id={block.id + 100}
                type={showToggle && showConfirmation ? 'text' : 'password'}
                value={resetvalue}
                className={
                  errors.password_confirmation
                    ? `${block.className} is-invalid`
                    : block.className
                }
                {...register(
                  `${block.name}_confirmation` as keyof FormDataPassword,
                  {
                    required: block.validate.required,
                    minLength: block.validate.minLength,
                    maxLength: block.validate.maxLength,
                    validate: (value) =>
                      value === password.current ||
                      t('error.passwords_do_not_match'),
                  },
                )}
                required
                slotProps={
                  showToggle
                    ? {
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={t('System.show_password')}
                                onClick={handleToggleConfirmation}
                                edge="end"
                                tabIndex={-1}
                              >
                                {showConfirmation ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }
                    : undefined
                }
              />
              {errors.password_confirmation?.type === 'required' && (
                <em className="error invalid-feedback">
                  {t('error.repeat_password')}
                </em>
              )}
              {errors.password_confirmation?.type === 'minLength' && (
                <em className="error invalid-feedback">
                  {t('error.password_minimum')} {block.validate.minLength}{' '}
                  {t('characters')}
                </em>
              )}
              {errors.password_confirmation?.type === 'maxLength' && (
                <em className="error invalid-feedback">
                  {t('error.password_maximum')} {block.validate.maxLength}{' '}
                  {t('characters')}
                </em>
              )}
              {errors.password_confirmation?.type === 'validate' && (
                <em className="error invalid-feedback">
                  {t('error.password_not_match')}
                </em>
              )}
            </>
          )}
        </Container>
      </>
    );
  }

  return null;
};

export default InputPassword;
