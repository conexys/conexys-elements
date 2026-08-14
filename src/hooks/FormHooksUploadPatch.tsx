/**
 * @fileoverview
 * Designed to download current data from the database and update the values.
 * Same as FormHooksUpload.tsx but uses PATCH method instead of POST.
 * @module hooks/FormHooksUploadPatch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import patchFormService from '../services/patchFormService';
import { useTranslation } from 'react-i18next';
import { Uservalidationerror } from '../components/index';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  PostFormServiceParams,
  UseCustomFormReturn,
} from '../types/hooks/formHooksUpload.types';
import type { FormInputs, FormResult } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Custom React hook for handling form submissions with PATCH method.
 *
 * @param {string} fpHash - Hash for fingerprint identification (optional).
 * @param {string} getServerURL - URL for getting data from the server.
 * @param {string} patchServerURL - URL for patching form data to the server.
 * @param {string} feedback - Success message to be displayed in the alert (optional).
 * @param {string} id - Identifier for the form data.
 * @param {boolean} reset - Indicates whether to reset the form after submission.
 * @returns {UseCustomFormReturn} An object containing functions and states for form handling.
 */
const useCustomFormPatch = (
  fpHash: string,
  getServerURL: string,
  patchServerURL: string,
  feedback?: string,
  id?: string,
  reset: boolean = false,
): UseCustomFormReturn => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const MySwal = withReactContent(SweetAlert2);

  const [formInputs, setFormInputs] = useState<FormInputs>({});
  const [result, setResult] = useState<FormResult>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; //Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; //Check if the user is logged in

  const authorization: boolean = true;

  /**
   * Handles the submission of the form data.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} A promise that resolves after handling the form submission.
   */
  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);
    const ButtonPressed: string = (event.nativeEvent as any).submitter.id;
    event.preventDefault();
    try {
      const patchParams: PostFormServiceParams = {
        sessionID,
        cxauthxc,
        postServerURL: patchServerURL,
        authorization,
        fingerprint: visitorIdHash,
        event,
        id: id || '',
        ButtonPressed: ButtonPressed,
      };
      const dataform = await patchFormService.patchFormService(
        patchParams,
        configLogs,
      );
      logConsole(configLogs, 'info', '', dataform);
      setResult(dataform);

      if (feedback) {
        MySwal.fire({
          title: '<p>' + feedback + '</p>',
          icon: 'success',
          confirmButtonText: t('general.ok'),
        }).then((result) => {
          if (result.isConfirmed) {
            setResult({});
            if (reset === true) {
              window.location.reload();
            }
          }
        });
      }
    } catch (err) {
      setError(true);
      handleError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles changes in form input values.
   *
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} event - The input change event.
   */
  const handleInputChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ): void => {
      const fieldName: string = event.target.name || event.target.id;
      setFormInputs((prevInputs) => ({
        ...prevInputs,
        [fieldName]: event.target.value,
      }));
    },
    [],
  );

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
      if (feedback) {
        MySwal.fire({
          title: `<p>${t('login.password_is_not_correct')}</p>`,
          icon: 'error',
          confirmButtonText: t('general.ok'),
        });
      } else {
        MySwal.fire({
          title: `<p>${t('login.invalid_data_username_mail')}</p>`,
          icon: 'error',
          confirmButtonText: t('general.ok'),
        });
        Uservalidationerror(configLogs);
      }
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

    logConsole(configLogs, 'error', '', err);
    console.error(err);
  };

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${cxauthxc}`,
        'X-Session-ID': sessionID,
        'X-Fingerprint': fpHash,
        'Content-Type': 'application/json',
      },
    }),
    [cxauthxc, sessionID, fpHash],
  );

  useEffect(() => {
    const setFp = async (): Promise<void> => {
      const visitorIdHash: string = await getOrSetFingerprint(
        fpHash,
        configLogs,
      );
      const key = {
        sessionID: sessionID,
        itemID: id,
        fingerprint: visitorIdHash,
      };
      try {
        const response = await axios.post(getServerURL, key, config);

        logConsole(configLogs, 'info', '[Request] ', getServerURL);

        // NestJS devuelve plano; manejar ambos formatos
        const responseData = response.data;
        const formData = Array.isArray(responseData)
          ? responseData[0]
          : typeof responseData?.data === 'object' && responseData.data !== null
            ? Array.isArray(responseData.data)
              ? responseData.data[0]
              : responseData.data
            : responseData;
        setFormInputs(formData);
      } catch (error) {
        logConsole(configLogs, 'error', '', t('error.token_has_expired'));
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    setFp();
  }, [id, getServerURL, config, fpHash, sessionID, t]);

  return {
    handleFormSubmit,
    handleInputChange,
    formInputs,
    result,
    loading,
    error,
  };
};

export default useCustomFormPatch;
