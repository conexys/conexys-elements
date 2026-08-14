/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalGetPost
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useState, useEffect, useMemo } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormServiceGetPost from '../services/postFormServiceGetPost';
import deleteFormService from '../services/deleteFormService';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  PostFormServiceGetPostParams,
  UseCustomFormReturn,
} from '../types/hooks/formHooksNormalGetPost.types';
import type {
  FormInputs,
  DeleteEvent,
  DeleteServiceParams,
} from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Custom React hook for handling form submissions, updates, and deletions.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} postServerURL - The URL for submitting form data.
 * @param {string} getServerURL - The URL for fetching form data.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} id - The identifier for the form data.
 * @returns {UseCustomFormReturn} An object containing functions and states for form handling.
 */
const useCustomForm = (
  fpHash: string,
  postServerURL: string,
  getServerURL: string,
  deleteServerURL: string,
  id: string,
): UseCustomFormReturn => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const MySwal = withReactContent(SweetAlert2);
  const [formInputs, setFormInputs] = useState<FormInputs>({});
  const [formStatus, setFormStatus] = useState<boolean>(false);
  const [checkdata, setCheckdata] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; //Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; //Check if the user is logged in

  const iditem: string = id;
  const authorization: boolean = true;

  /**
   * Handles the form submission.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} A promise that resolves after handling the submission.
   */
  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    MySwal.fire({
      title: '<p>' + t('Plugin.installing') + '</p>',
      html: '<object data="../public/gear-spinner.svg" type="image/svg+xml" width="100"></object>',
      showCancelButton: false,
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      confirmButtonText: t('general.ok'),
    });
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);

    event.preventDefault();
    try {
      const postParams: PostFormServiceGetPostParams = {
        iditem,
        sessionID,
        cxauthxc,
        postServerURL,
        authorization,
        fingerprint: visitorIdHash,
        event,
      };
      const dataform = await postFormServiceGetPost.postFormServiceGetPost(
        postParams,
        configLogs,
      );
      setFormStatus(true);
      setCheckdata(false);
      logConsole(configLogs, 'info', '', dataform);
      MySwal.fire({
        title: '<p>' + t('Plugin.completeinstallation') + '</p>',
        icon: 'success',
        confirmButtonText: t('general.ok'),
      }).then((result) => {
        if (dataform.data === 'plugins_instal_successfully') {
          window.location.reload();
        }
      });
    } catch (err) {
      setError(true);
      handleError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the form deletion.
   *
   * @param {DeleteEvent} event - The deletion event.
   * @returns {Promise<void>} A promise that resolves after handling the deletion.
   */
  const handleFormDelete = async (event: DeleteEvent): Promise<void> => {
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);
    const id: string = event.id;
    try {
      const deleteParams: DeleteServiceParams = {
        sessionID,
        cxauthxc,
        deleteServerURL,
        fingerprint: visitorIdHash,
        id,
      };
      const dataform = await deleteFormService.deleteFormService(
        deleteParams,
        configLogs,
      );
      setFormStatus(true);
      logConsole(configLogs, 'info', '', dataform);
      if (dataform.data === 'plugins_deleted_successfully') {
        MySwal.fire({
          title: '<p>Desinstalacion completa</p>',
          icon: 'success',
          confirmButtonText: t('general.ok'),
        }).then((result) => {
          window.location.reload();
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
   * Handles form input changes.
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
    setFormStatus(false);
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

  if (id === '') {
    if (checkdata === false) {
      setCheckdata(true);
      Object.keys(formInputs).forEach((key) =>
        formInputs[key] !== null ? (formInputs[key] = '') : formInputs[key],
      );
    }
  }

  useEffect(() => {
    const setFp = async (): Promise<void> => {
      setCheckdata(false);
      if (id !== '') {
        const visitorIdHash: string = await getOrSetFingerprint(
          fpHash,
          configLogs,
        );
        try {
          // GET con itemID como query param (FingerprintGuard usa headers)
          const response = await axios.get(getServerURL, {
            headers: config.headers,
            params: { itemID: id },
          });
          logConsole(configLogs, 'info', '[Request] ', getServerURL);

          // NestJS devuelve plano; manejar ambos formatos
          const responseData = response.data;
          const formData = Array.isArray(responseData)
            ? responseData[0]
            : typeof responseData?.data === 'object' &&
                responseData.data !== null
              ? Array.isArray(responseData.data)
                ? responseData.data[0]
                : responseData.data
              : responseData;
          setFormInputs(formData);
        } catch (error) {
          logConsole(
            configLogs,
            'error',
            '[Error] ',
            t('error.token_has_expired'),
          );
          setError(true);
        } finally {
          setLoading(false);
        }
        setFormStatus(false);
      }
    };
    setFp();
  }, [id]);

  return {
    handleFormSubmit,
    handleInputChange,
    handleFormDelete,
    formInputs,
    formStatus,
    setFormStatus,
    loading,
    error,
  };
};

export default useCustomForm;
