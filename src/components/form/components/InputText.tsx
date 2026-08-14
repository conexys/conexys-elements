/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputText
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useCallback } from 'react';
import { checkExistsUsername, checkExistsMail } from './validation/Validation';
import { useTranslation } from 'react-i18next';
import { Uservalidationerror } from '../../../components/index';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import type {
  InputTextProps,
  ApiError,
} from '../../../types/components/form.types';
import { useConexysConfig } from '../../../config/ConexysConfig';

/**
 * InputText component for rendering text input fields with validation.
 *
 * @component
 * @param {object} props - The properties of the InputText component.
 * @param {object} props.block - Information about the text input.
 * @returns {JSX.Element} The rendered InputText component.
 */
const InputText: React.FC<InputTextProps> = React.memo(
  ({ block }) => {
    const configLogs = useConexysConfig();
    const [t] = useTranslation('global');
    const [errors, setError] = useState<boolean>(false);
    const [texterror, setTextError] = useState<string>('');

    const handleInputBlur = useCallback(
      async (event: React.FocusEvent<HTMLInputElement>): Promise<void> => {
        const session = localStorage.getItem('cx_session') || '';
        const value = event.target.value;

        const setErrorState = (error: boolean, message: string): void => {
          setError(error);
          setTextError(message);
          localStorage.setItem(
            'errors' + block.name,
            error ? 'errorfoundfield' : '',
          );
        };

        try {
          if (block.validate.check === 'email' && value) {
            const mailexist = await checkExistsMail(
              { email: value, sessionID: session },
              configLogs,
            );
            if (!mailexist) {
              setErrorState(true, t('error.email_already_exists'));
              return;
            }
          } else if (block.validate.check === 'username' && value) {
            const usernameExist = await checkExistsUsername(
              { username: value, sessionID: session },
              configLogs,
            );
            if (!usernameExist) {
              setErrorState(true, t('error.username_is_not_valid'));
              return;
            }
          }

          if (
            block.validate.minLength &&
            value.length < block.validate.minLength
          ) {
            setErrorState(
              true,
              `${t('error.must_least')}${block.validate.minLength} ${t('error.characters')}`,
            );
          } else if (
            block.validate.maxLength &&
            value.length > block.validate.maxLength
          ) {
            setErrorState(
              true,
              `${t('error.must_maxim')}${block.validate.maxLength} ${t('error.characters')}`,
            );
          } else if (
            block.validate.pattern &&
            value.match(block.validate.pattern) != null
          ) {
            setErrorState(true, block.validate.error || '');
          } else if (block.validate.type) {
            switch (block.validate.type) {
              case 'number':
                setErrorState(isNaN(Number(value)), t('error.numerical_value'));
                break;
              case 'string':
                setErrorState(!isNaN(Number(value)), t('error.be_a_text'));
                break;
              case 'email':
                setErrorState(
                  !value.match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  ),
                  t('error.enter_email_address'),
                );
                break;
              case 'url':
                setErrorState(
                  !value.match(
                    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                  ),
                  t('error.enter_URL'),
                );
                break;
              default:
                setErrorState(false, '');
                break;
            }
          } else if (block.validate.required && value === '') {
            setErrorState(true, t('error.field_required'));
          } else {
            setErrorState(false, '');
          }
        } catch (err: unknown) {
          const error = err as ApiError;
          const errorMessage =
            error?.response?.status === 400
              ? t('login.command_not_found')
              : error?.response?.status === 401
                ? t('login.invalid_data_username_mail')
                : error?.response?.status === 403
                  ? t('error.no_permission')
                  : t('login.unknown_error');
          setErrorState(true, errorMessage);
          if (error?.response?.status === 401) Uservalidationerror(configLogs);
        }
      },
      [block, t],
    );

    const renderTextField = (): React.JSX.Element => (
      <TextField
        hiddenLabel
        size="small"
        name={block.name}
        id={block.id}
        type={block.type}
        placeholder={block.placeholder}
        value={block.value || ''}
        onChange={block.onChange}
        onBlur={handleInputBlur}
        autoComplete={block.autocomplete}
        className={errors ? `${block.className} is-invalid` : block.className}
        required={block.validate.required}
      />
    );

    if (block.style === 'login') {
      return (
        <div className={`form-group ${block.ref}`}>
          <InputLabel htmlFor={block.id}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
          <div>
            {renderTextField()}
            {errors && <em className="error invalid-feedback">{texterror}</em>}
          </div>
        </div>
      );
    } else if (block.type === 'hidden') {
      return (
        <TextField
          style={{ display: 'none' }}
          type={block.type}
          id={block.id}
          name={block.name}
          value={block.value || ''}
          onChange={block.onChange}
          onBlur={handleInputBlur}
          autoComplete={block.autocomplete}
        />
      );
    } else {
      return (
        <div className={`form-group ${block.ref}`}>
          <InputLabel htmlFor={block.id}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
          <div>
            {renderTextField()}
            {errors && <label className="error">{texterror}</label>}
          </div>
        </div>
      );
    }
  },
  (prevProps, nextProps) => {
    return (
      prevProps.block.value === nextProps.block.value &&
      prevProps.block.name === nextProps.block.name &&
      prevProps.block.label === nextProps.block.label &&
      prevProps.block.onChange === nextProps.block.onChange
    );
  },
);

export default InputText;
