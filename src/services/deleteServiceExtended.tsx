/**
 * @fileoverview
 * Extended service functions for DELETE requests.
 * Analogous to postServiceExtended.tsx but for DELETE HTTP method.
 * @module services/deleteServiceExtended
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import { deleteservice } from './deleteService';
import { Uservalidationerror } from '../components/index';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  FormItem,
  DataConverted,
  RenderResponse,
} from '../types/services/postServiceExtended.types';
import { useConexysConfig } from '../config/ConexysConfig';

const handleError = (
  err: AxiosError,
  t: (key: string) => string,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
  setIsError?: (value: boolean) => void,
  setMessageerror?: (message: string) => void,
): string => {
  let errorMessage: string;
  if (!err?.response) {
    errorMessage = t('login.no_server_response');
  } else if (err.response?.status === 400) {
    errorMessage = t('login.command_not_found');
  } else if (err.response?.status === 401) {
    errorMessage = t('login.invalid_data_username_mail');
    Uservalidationerror(configLogs);
  } else if (err.response?.status === 403) {
    errorMessage = t('error.no_permission');
  } else {
    errorMessage = t('login.unknown_error');
  }
  logConsole(configLogs, 'error', '[Error] ', errorMessage);
  if (setIsError) setIsError(true);
  if (setMessageerror) setMessageerror(errorMessage);
  return errorMessage;
};

const serviceDelete2 = async (
  fpHash: string = '',
  sessionID: string,
  deleteURL: string,
  cxauthxc: string,
  t: (key: string) => string,
  setPost: (data: any) => void,
  setIsError: (value: boolean) => void,
  setError: (value: boolean) => void,
  setMessageerror: (message: string) => void,
  setLoading: (value: boolean) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
  ...rest: any[]
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  try {
    const requestData = {
      ...rest[0],
      sessionID,
      cxauthxc,
      postServerURL: deleteURL,
      authorization: true,
      fingerprint: visitorIdHash,
    };
    const response = await deleteservice(requestData, configLogs);
    if (response.data !== undefined) {
      setPost(response.data);
    }
    logConsole(configLogs, 'data', '', response);
    setIsError(false);
  } catch (err) {
    setError(true);
    handleError(err as AxiosError, t, configLogs, setIsError, setMessageerror);
  } finally {
    setLoading(false);
  }
};

export { serviceDelete2 };
