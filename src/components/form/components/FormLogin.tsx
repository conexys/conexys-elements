/**
 * @fileoverview
 * Form component
 * @module components/form/components/FormLogin
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSet, AppDialogModal } from '../../../components/index';
import Button from '@mui/material/Button';
import { AppDataSettingsHTML } from '../../index';
import type {
  FormData,
  FormLoginProps,
} from '../../../types/components/form.types';

/**
 * FormLogin component for rendering different types of form inputs.
 *
 * @component
 * @param {object} props - The properties of the FormLogin component.
 * @param {object} props.block - Information about the form input.
 * @returns {JSX.Element} The rendered FormLogin component.
 */
const FormLogin: React.FC<FormLoginProps> = ({ block }) => {
  const [trigger1, setTrigger1] = useState<number>(0);
  const [trigger2, setTrigger2] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChange = (): void => {
    setIsChecked((current) => !current);
  };

  const [t] = useTranslation('global');

  //Validation
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: 'onBlur', // "onChange"
  });
  const password = useRef<string>('');
  password.current = watch('password', '');
  //Validation

  const forgot_passworddir: string = '/forgot_password';

  if (block.type === 'text') {
    return (
      <div className="form-group mb-3">
        <label htmlFor={block.name as string}>{block.label}</label>
        <div className="input-group">
          <input
            type={block.type}
            value={(block.value as string) || ''}
            name={block.name as string}
            onChange={block.onChange}
            id={block.id as string}
            className={block.className}
            autoComplete={block.autocomplete}
          />
          <span className="input-group-text">
            <i className="bx bx-user text-4"></i>
          </span>
        </div>
      </div>
    );
  }

  if (block.type === 'password') {
    return (
      <div className="form-group mb-3">
        <div className="clearfix">
          <label className="float-left" htmlFor={block.name as string}>
            {block.label}
          </label>
        </div>
        <div className="input-group">
          <input
            type={block.type}
            value={(block.value as string) || ''}
            name={block.name as string}
            onChange={block.onChange}
            id={block.id as string}
            className={block.className}
          />
          <span className="input-group-text">
            <i className="bx bx-lock text-4"></i>
          </span>
        </div>
        <NavLink to={forgot_passworddir} className="float-end">
          {t('login.recover_password')}
        </NavLink>
      </div>
    );
  }

  if (block.type === 'checkbox') {
    return (
      <div className="row">
        <div className="col-sm-7">
          <div className="checkbox-custom checkbox-default">
            <input
              id={block.id as string}
              value={(block.value as string) || ''}
              name={block.name as string}
              onChange={block.onChange}
              type={block.type}
              className={block.className}
            />
            <label htmlFor={block.id as string}>
              {t('login.keep_me_logged_in')}
            </label>
          </div>
        </div>
        <div className="col-sm-5 text-end">
          <button className="btn btn-primary mt-2">{t('login.loginr')}</button>
        </div>
      </div>
    );
  }

  if (block.type === 'checkboxregister') {
    return (
      <>
        <div className="row">
          <div className="col-sm-7">
            <div className="checkbox-custom checkbox-default">
              <input
                //name="agree"
                id="agree"
                type="checkbox"
                onClick={handleChange}
                {...register('agree', { required: true })}
              />
              <label htmlFor="agree">
                {t('login.accept_our')} -
                <span
                  className="modal-sizes modalGeneral01"
                  data-src=""
                  data-url="terms"
                  data-class="modal-header-color modal-block-primary"
                  data-title={t('login.terms_conditions')}
                  onClick={() => setTrigger1(trigger1 + 1)}
                  style={{ cursor: 'pointer', color: '#0077b3' }}
                >
                  {t('login.terms_conditions')}
                </span>
              </label>
              {errors.agree && (
                <em style={{ color: 'red' }}>
                  {t('login.accept_terms_conditions')}
                </em>
              )}
            </div>
          </div>
          <div className="col-sm-5 text-right">
            <button
              disabled={!isChecked}
              type="submit"
              name="submit"
              id="buttonsend"
              className="btn btn-primary mt-2"
            >
              {t('login.create_account')}
            </button>
          </div>
        </div>
        <span className="mt-3 mb-3 line-thru text-center text-uppercase">
          <span> {t('login.languages')} </span>
        </span>
        <div className="mb-1 text-center">
          <LanguageSet />
        </div>
        <AppDialogModal
          title={t('login.terms_conditions')}
          type="Normal"
          trigger1={trigger1}
          trigger2={trigger2}
        >
          <AppDataSettingsHTML keys="terms" />
          <hr />
          <Button
            sx={{ float: 'right' }}
            variant="contained"
            autoFocus
            onClick={() => setTrigger2(trigger2 + 1)}
          >
            {t('general.close')}
          </Button>
        </AppDialogModal>
      </>
    );
  }

  if (block.type === 'passwordregister') {
    const names = block.name as string[];
    const ids = block.id as string[];
    const labels = block.label as string[];

    // Handle localStorage side effects
    if (
      errors.password?.type === 'required' ||
      errors.password?.type === 'minLength'
    ) {
      localStorage.setItem(
        'errors' + (block.name as string),
        'errorfoundfield',
      );
    }
    if (
      errors.password_confirmation?.type === 'required' ||
      errors.password_confirmation?.type === 'minLength' ||
      errors.password_confirmation?.type === 'validate'
    ) {
      localStorage.setItem(
        'errors' + (block.name as string),
        'errorfoundfield',
      );
    }

    return (
      <div className="form-group mb-0">
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label>{labels[1]}</label>
            <span className="required">*</span>
            <input
              //name={names[1]}
              id={ids[1]}
              type="password"
              className={
                errors.password
                  ? 'form-control form-control-lg is-invalid'
                  : 'form-control form-control-lg'
              }
              {...register('password', { required: true, minLength: 5 })}
            />
            {errors.password?.type === 'required' && (
              <em className="error invalid-feedback">
                {t('error.please_enter_password')}
              </em>
            )}
            {errors.password?.type === 'minLength' && (
              <em className="error invalid-feedback">
                {t('error.password_minimum_5_characters')}
              </em>
            )}
          </div>
          <div className="col-sm-6 mb-3">
            <label>{labels[2]}</label>
            <span className="required">*</span>
            <input
              //name={names[2]}
              id={ids[2]}
              type="password"
              className={
                errors.password_confirmation
                  ? 'form-control form-control-lg is-invalid'
                  : 'form-control form-control-lg'
              }
              {...register('password_confirmation', {
                required: true,
                minLength: 5,
                validate: (value) =>
                  value === password.current ||
                  t('error.passwords_do_not_match'),
              })}
            />
            {errors.password_confirmation?.type === 'required' && (
              <em className="error invalid-feedback">
                {t('error.repeat_password')}
              </em>
            )}
            {errors.password_confirmation?.type === 'minLength' && (
              <em className="error invalid-feedback">
                {t('error.password_minimum_5_characters')}
              </em>
            )}
            {errors.password_confirmation?.type === 'validate' && (
              <em className="error invalid-feedback">
                {t('error.password_not_match')}
              </em>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FormLogin;
