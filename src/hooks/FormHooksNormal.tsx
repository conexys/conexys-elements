/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * The useCustomForm hook is a custom hook designed to handle form logic, specifically in the context of forms that are not linked to specific users and do not download data from the database, such as registration forms, password recovery forms, etc.
 * @module hooks/FormHooksNormal
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormService from '../services/postFormService';
import patchFormService from '../services/patchFormService';
import deleteFormService from '../services/deleteFormService';
import restoreFormService from '../services/restoreFormService';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { Url } from '../constants/global';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  ProfileResponse,
  UseCustomFormReturn,
} from '../types/hooks/formHooksNormal.types';
import type {
  FormInputs,
  DeleteEvent,
  FormResult,
  DeleteServiceParams,
  RestoreServiceParams,
  PostFormServiceBaseParams,
} from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Custom React hook for handling form submissions, updates, and deletions.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} postServerURL - The URL for submitting form data.
 * @param {string} getServerURL - The URL for fetching form data.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} restoreServerURL - The URL for deleting form data.
 * @param {string} id - The identifier for the form data.
 * @param {string} feedback - Feedback message to display on successful form submission.
 * @returns {UseCustomFormReturn} An object containing functions and states for form handling.
 */
const useCustomForm = (
  fpHash: string,
  postServerURL: string,
  getServerURL: string,
  deleteServerURL: string,
  id: string,
  restoreServerURL: string,
  feedback?: string,
  method: 'post' | 'patch' = 'post',
  restoreMethod: 'post' | 'patch' = 'post',
  fetchMethod: 'post' | 'get' = 'post',
): UseCustomFormReturn => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const MySwal = withReactContent(SweetAlert2);
  const [formInputs, setFormInputs] = useState<FormInputs>({});
  const [formStatus, setFormStatus] = useState<boolean>(false);
  const [checkdata, setCheckdata] = useState<boolean>(false);
  const [result, setResult] = useState<FormResult>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; //Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; //Check if the user is logged in

  const iditem: string = id;
  const authorization: boolean = true;

  const updateDataUser = async (visitorIdHash: string): Promise<void> => {
    const getProfile: string = Url + 'getprofile';

    try {
      const response = await axios.get(getProfile, {
        headers: {
          Authorization: `Bearer ${cxauthxc}`,
          'X-Session-ID': sessionID,
          'X-Fingerprint': visitorIdHash,
          'Content-Type': 'application/json',
        },
      });

      logConsole(configLogs, 'info', '[Request] ', getProfile);

      // NestJS devuelve el perfil plano (sin wrapper { data: [...] })
      const profileData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      const profile = profileData?.data ? profileData.data : profileData;

      localStorage.setItem(
        'datauser',
        JSON.stringify({
          name: profile.name,
          lastname: profile.lastname,
          email: profile.email,
          username: profile.username,
          language: profile.language,
        }),
      );
    } catch (error) {
      logConsole(configLogs, 'error', '', t('error.token_has_expired'));
      console.error(error);
    }
  };

  /**
   * Handles the form submission.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} A promise that resolves after handling the submission.
   */
  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);
    const ButtonPressed: string = (event.nativeEvent as any).submitter.id;
    event.preventDefault();
    try {
      const postParams: PostFormServiceBaseParams & {
        httpMethod?: 'post' | 'patch';
      } = {
        iditem,
        sessionID,
        cxauthxc,
        postServerURL,
        authorization,
        fingerprint: visitorIdHash,
        event,
        ButtonPressed: ButtonPressed,
        httpMethod: method,
      };
      const dataform =
        method === 'patch'
          ? await patchFormService.patchFormService(postParams, configLogs)
          : await postFormService.postFormService(postParams, configLogs);
      setFormStatus(true);
      setCheckdata(false);

      logConsole(configLogs, 'info', '', dataform);

      setResult(dataform);

      if (sessionID) {
        await updateDataUser(visitorIdHash);
      }

      if (feedback) {
        MySwal.fire({
          title: '<p>' + feedback + '</p>',
          icon: 'success',
          confirmButtonText: t('general.ok'),
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
    } catch (err) {
      setError(true);
      handleError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the form restore.
   *
   * @param {DeleteEvent} event - The restore event.
   * @returns {Promise<void>} A promise that resolves after handling the restore.
   */
  const handleFormRestore = async (event: DeleteEvent): Promise<void> => {
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);
    const id: string = event.id;
    try {
      const restoreParams: RestoreServiceParams & {
        httpMethod?: 'post' | 'patch';
      } = {
        sessionID,
        cxauthxc,
        restoreServerURL,
        fingerprint: visitorIdHash,
        id,
        httpMethod: restoreMethod,
      };
      const dataform = await restoreFormService.restoreFormService(
        restoreParams,
        configLogs,
      );
      setFormStatus(true);
      logConsole(configLogs, 'info', '', dataform);
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
  const handleInputChange = useCallback(
    (
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
      // Only fetch if we have a record id (skip for new/empty id even with GET method)
      if (id !== '') {
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
          let response;
          if (fetchMethod === 'get') {
            const url = getServerURL + id;
            response = await axios.get(url, config);
            logConsole(configLogs, 'info', '[Request] ', url);
          } else {
            response = await axios.post(getServerURL, key, config);
            logConsole(configLogs, 'info', '[Request] ', getServerURL);
          }

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
    handleFormRestore,
    formInputs,
    formStatus,
    setFormStatus,
    loading,
    error,
    result,
  };
};

export default useCustomForm;
