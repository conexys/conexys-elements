/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalNoUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormService from '../services/postFormService';
import { useAuth } from '../Auth.jsx';
import { Url } from '../constants/global';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { logConsole } from '../utilities/logConsole';
import type {
  AuthData,
  AuthTokenData,
  UseCustomFormReturn,
} from '../types/hooks/formHooksNormalNoUser.types';
import type { FormInputs, PostFormServiceBaseParams } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import type { AuthContextType } from '../types/auth.types'; // Define el tipo de useAuth si es necesario

interface UseCustomFormDependencies {
  useAuth?: () => AuthContextType; // Define que useAuth devuelve AuthContextType
}
/**
 * Custom React hook for handling form submissions.
 *
 * @param {string} postServerURL - The URL for posting form data.
 * @param {boolean} setAuth - Indicates whether to update authentication tokens.
 * @param {string} message - Success message to be displayed in the alert.
 * @returns {UseCustomFormReturn} An object containing functions and states for form handling.
 */
const useCustomForm = (
  postServerURL: string,
  setAuth: boolean,
  message?: string,
  dependencies: UseCustomFormDependencies = {},
): UseCustomFormReturn => {
  const configLogs = useConexysConfig();
  const { useAuth: externalUseAuth } = dependencies;
  const { setAuthTokens } =
    typeof externalUseAuth === 'function'
      ? externalUseAuth()
      : externalUseAuth || useAuth(); // Usa el useAuth externo si está disponible
  const [t] = useTranslation('global');
  const MySwal = withReactContent(SweetAlert2);
  const [formInputs, setFormInputs] = useState<FormInputs>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  /**
   * Handles the submission of the form data.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} A promise that resolves after handling the form submission.
   */
  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const visitorId: string = await getOrSetFingerprint('', configLogs);

    // VERIFICATION OF ERRORS IN THE FIELDS
    let error: boolean = false;
    const values: (string | null)[] = [];
    const keys: string[] = Object.keys(localStorage);
    let i: number = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
      if (localStorage.getItem(keys[i]) === 'errorfoundfield') {
        error = true;
        MySwal.fire({
          title: '<p>' + t('error.checkthefields') + '</p>',
          icon: 'error',
          confirmButtonText: t('accept.Aceptar'),
        });
      }
    }

    // Extraer el prefijo de administración de la URL actual
    // Si estamos en /admin/signup, el prefijo es /admin
    // Si estamos en /signup (sin prefijo), no hay prefijo
    const currentPath: string = window.location.pathname;
    const pathParts: string[] = currentPath.split('/').filter(Boolean);
    let adminPrefix: string = '';
    if (pathParts.length > 1 && pathParts[1] === 'signup') {
      // La URL es tipo /admin/signup → prefijo = /admin
      adminPrefix = '/' + pathParts[0];
    }
    const logindir: string = adminPrefix + '/login';
    const authorization: boolean = false;

    if (error === false) {
      try {
        const postParams: PostFormServiceBaseParams = {
          postServerURL,
          authorization,
          fingerprint: visitorId,
          event,
        };
        const dataform: AuthData = await postFormService.postFormService(
          postParams,
          configLogs,
        );

        if (setAuth === true) {
          if (dataform.v2fa === 'true') {
            let authorized: boolean = false;
            MySwal.fire({
              title: t('login.twostepverificationcode'),
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off',
              },
              showCancelButton: true,
              confirmButtonText: t('general.validate'),
              showLoaderOnConfirm: true,
              preConfirm: async (login: string) => {
                try {
                  const postServerURL2: string = Url + 'authTwostep';
                  const config = {
                    headers: {
                      Authorization: `Bearer ${dataform.auth}`,
                      'X-Session-ID': dataform.sessionid,
                      'X-Fingerprint': dataform.fingerprint || visitorId,
                      'Content-Type': 'application/json',
                    },
                  };
                  const dataload = [dataform, visitorId, login];
                  await axios.post(postServerURL2, dataload, config);
                  authorized = true;
                } catch (error) {
                  MySwal.showValidationMessage(
                    t('error.incorrectvalidationcode'),
                  );
                }
              },
              allowOutsideClick: () => !MySwal.isLoading(),
            }).then((result) => {
              if (authorized === true) {
                logConsole(configLogs, 'data', '', 'Authorised');
                setAuthTokens(dataform as AuthTokenData);
              } else {
                logConsole(configLogs, 'error', '[Error] ', 'Unauthorised');
              }
            });
          } else {
            logConsole(configLogs, 'data', '', 'Authorised');
            setAuthTokens(dataform as AuthTokenData);
          }
        }

        if (message) {
          // Limpiar el formulario antes de mostrar el mensaje de éxito
          setFormInputs({});
          MySwal.fire({
            title: '<p>' + message + '</p>',
            icon: 'success',
            confirmButtonText: t('general.ok'),
          }).then((result) => {
            window.location.href = logindir;
          });
        }
      } catch (err) {
        setError(true);
        handleError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Handles changes in form input values.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} event - The input change event.
   */
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const fieldName: string = event.target.name || event.target.id;
    setFormInputs((formInputs) => ({
      ...formInputs,
      [fieldName]: event.target.value,
    }));
  };

  /**
   * Handles errors and displays appropriate messages.
   *
   * @param {AxiosError} err - The error object.
   */
  const handleError = (err: AxiosError): void => {
    if (!err?.response) {
      MySwal.fire({
        title: `<p>${t('login.no_server_response')}</p>`,
        icon: 'error',
        confirmButtonText: t('general.ok'),
      });
    } else if (err.response?.status === 400) {
      MySwal.fire({
        title: `<p>${t('login.command_not_found')}</p>`,
        icon: 'error',
        confirmButtonText: t('general.ok'),
      });
    } else if (err.response?.status === 401) {
      MySwal.fire({
        title: `<p>${t('login.invalid_data_username_mail')}</p>`,
        icon: 'error',
        confirmButtonText: t('general.ok'),
      });
    } else if (err.response?.status === 403) {
      MySwal.fire({
        title: `<p>${t('error.no_permission')}</p>`,
        icon: 'error',
        confirmButtonText: t('general.ok'),
      });
    } else {
      MySwal.fire({
        title: `<p>${t('login.unknown_error')}</p>`,
        icon: 'error',
        confirmButtonText: t('general.ok'),
      });
    }
  };

  return {
    handleFormSubmit,
    handleInputChange,
    formInputs,
    loading,
    error,
  };
};

export default useCustomForm;
