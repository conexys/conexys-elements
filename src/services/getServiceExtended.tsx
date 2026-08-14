/**
 * @fileoverview
 * Extended GET service functions for read-only endpoints.
 * Analogous to postServiceExtended.tsx but using axios.get().
 * @module services/getServiceExtended
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { Uservalidationerror } from '../components/index';
import { logConsole } from '../utilities/logConsole';
import { useConexysConfig } from '../config/ConexysConfig';
import { getservice } from './getService';

/**
 * Error handler shared across GET service functions.
 * Mirrors the handleError in postServiceExtended.tsx.
 */
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

/**
 * GET-based servicePostBasic: makes a GET request with fingerprint + sessionID.
 * Mirrors servicePostBasic in postServiceExtended.tsx but uses axios.get().
 *
 * @param {string} fpHash - Optional fingerprint hash override.
 * @param {string} sessionID - User session ID.
 * @param {string} baseURL - Full URL including endpoint path.
 * @param {any} config - Axios config (headers, etc).
 * @param {(data: any) => void} setData - Setter for the response data.
 * @param {ReturnType<typeof useConexysConfig>} configLogs - Config context.
 */
const getServiceBasic = async (
  fpHash: string = '',
  sessionID: string,
  baseURL: string,
  config: any,
  setData: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  const key = { sessionID, fingerprint: visitorIdHash };
  logConsole(configLogs, 'debug', '[Params] ', key);
  try {
    const response: AxiosResponse<any> = await axios.get(baseURL, {
      ...config,
      params: key,
    });
    logConsole(configLogs, 'info', '[Request] ', baseURL);
    logConsole(configLogs, 'data', '', response.data);
    setData(response.data);
  } catch (error) {
    logConsole(configLogs, 'error', '', error);
    console.error(error);
  }
};

/**
 * GET-based servicePost2: makes a GET request with auth headers + query params.
 * Mirrors servicePost2 in postServiceExtended.tsx but uses getservice().
 *
 * @param {string} fpHash - Optional fingerprint hash override.
 * @param {string} sessionID - User session ID.
 * @param {string} postURL - Endpoint name (appended to Url base).
 * @param {string} cxauthxc - JWT auth token.
 * @param {(key: string) => string} t - i18n translate function.
 * @param {(data: any) => void} setPost - Setter for the response data.
 * @param {(value: boolean) => void} setIsError - Setter for isError state.
 * @param {(value: boolean) => void} setError - Setter for error state.
 * @param {(message: string) => void} setMessageerror - Setter for error message.
 * @param {(value: boolean) => void} setLoading - Setter for loading state.
 * @param {ReturnType<typeof useConexysConfig>} configLogs - Config context.
 * @param {...any[]} rest - Additional parameters passed as query params.
 */
const getservice2 = async (
  fpHash: string = '',
  sessionID: string,
  postURL: string,
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
      postServerURL: postURL,
      authorization: true,
      fingerprint: visitorIdHash,
    };
    const result = await getservice(requestData, configLogs);
    // Handle all NestJS response formats:
    // - Object with .data property (e.g. { data: boolean, code: 200 }) → extract .data
    // - Array response (e.g. usertable returns [...]) → use directly
    // - Object without .data (e.g. { message, notification }) → use directly
    // - Primitive values (string, number) → use directly
    if (
      result &&
      typeof result === 'object' &&
      'data' in result &&
      !Array.isArray(result)
    ) {
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

/**
 * GET-based serviceData: makes a GET request and passes query params
 * to the setter callback on success.
 *
 * @param {string} baseURL - Full URL including endpoint path.
 * @param {any} params - Query parameters to send.
 * @param {any} config - Axios config (headers, etc).
 * @param {(data: any) => void} setData - Setter for the response data.
 * @param {ReturnType<typeof useConexysConfig>} configLogs - Config context.
 */
const getServiceData = async (
  baseURL: string,
  params: any,
  config: any,
  setData: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  try {
    const response = await axios.get(baseURL, {
      ...config,
      params,
    });
    logConsole(configLogs, 'debug', '[Params] ', params);
    logConsole(configLogs, 'info', '[Request] ', baseURL);
    logConsole(configLogs, 'data', '', response.data);

    // NestJS devuelve plano sin wrapper { data: ... }
    const responseData = response.data;
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      !Array.isArray(responseData)
    ) {
      setData(responseData.data);
    } else {
      setData(responseData);
    }
  } catch (err) {
    logConsole(
      configLogs,
      'error',
      'Error fetching data with getServiceData:',
      err,
    );
    console.error('Error fetching data with getServiceData:', err);
  }
};

export { getServiceBasic, getservice2, getServiceData };
