/**
 * @fileoverview
 * Extended PATCH service functions.
 * Analogous to postServiceExtended.tsx but using axios.patch().
 * @module services/patchServiceExtended
 * @version 0.1.0
 */

import patchService from './patchService';
import { Uservalidationerror } from '../components/index';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { logConsole } from '../utilities/logConsole';
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

const servicePatch2 = async (
  fpHash: string = '',
  sessionID: string,
  patchURL: string,
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
      postServerURL: patchURL,
      authorization: true,
      fingerprint: visitorIdHash,
    };
    const result = await patchService.patchservice(requestData, configLogs);
    if (result.data !== undefined) {
      setPost(result.data);
    } else {
      setPost(result);
    }
    logConsole(configLogs, 'data', '', result);
    setIsError(false);
  } catch (err) {
    setError(true);
    handleError(err as AxiosError, t, configLogs, setIsError, setMessageerror);
  } finally {
    setLoading(false);
  }
};

export { servicePatch2 };
