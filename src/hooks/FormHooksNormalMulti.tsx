/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalMulti
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useState } from 'react';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import type { AxiosError } from 'axios';
import deleteFormService from '../services/deleteFormService';
import restoreFormService from '../services/restoreFormService';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type { UseCustomFormMultiReturn } from '../types/hooks/formHooksNormalMulti.types';
import type {
  DeleteEvent,
  DeleteServiceParams,
  RestoreServiceParams,
} from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Custom React hook for handling deletion of multiple forms.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} restoreServerURL - The URL for deleting form data.
 * @returns {UseCustomFormMultiReturn} An object containing functions and states for form deletion.
 */
const useCustomFormMulti = (
  fpHash: string,
  deleteServerURL: string,
  restoreServerURL: string,
): UseCustomFormMultiReturn => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const MySwal = withReactContent(SweetAlert2);
  const [formStatus, setFormStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; //Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; //Check if the user is logged in

  /**
   * Handles the deletion of multiple forms.
   *
   * @param {DeleteEvent} event - The deletion event.
   * @returns {Promise<void>} A promise that resolves after handling the deletion.
   */
  const handleFormDeleteMulti = async (event: DeleteEvent): Promise<void> => {
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
   * Handles the restoration of multiple forms.
   *
   * @param {DeleteEvent} event - The restoration event.
   * @returns {Promise<void>} A promise that resolves after handling the restoration.
   */
  const handleFormRestoreMulti = async (event: DeleteEvent): Promise<void> => {
    const visitorIdHash: string = await getOrSetFingerprint(fpHash, configLogs);
    const id: string = event.id;
    try {
      const restoreParams: RestoreServiceParams = {
        sessionID,
        cxauthxc,
        restoreServerURL,
        fingerprint: visitorIdHash,
        id,
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
    handleFormDeleteMulti,
    handleFormRestoreMulti,
    formStatus,
    loading,
    error,
  };
};

export default useCustomFormMulti;
