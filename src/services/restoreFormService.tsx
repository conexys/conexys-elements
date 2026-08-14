/**
 * @fileoverview
 * This file contains a service module for making restore requests to a server using Axios.
 * This restoreFormService module exports an asynchronous function that makes a POST request to the server using Axios. The function takes a datauser object as a parameter, from which cxauthxc, restoreServerURL, and other data is extracted and sent in the body of the request. The function handles both success and errors in the request and returns the response data or an error object.
 * This type of module is useful for centralising the logic for handling restore requests and reusing it in different parts of your application.
 * @module services/restoreFormService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { logConsole } from '../utilities/logConsole';
import type { RestoreServiceParams, ServiceResponse } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Default config without logging for fallback (plugins, non-component callers).
 */
const defaultConfig: ReturnType<typeof useConexysConfig> = {
  enableLogs: false,
  enableLogsError: false,
  enableLogsWarning: false,
  enableLogsInfo: false,
  enableLogsData: false,
  enableLogsDebug: false,
  developmentMode: false,
};

/**
 * Service function for restoring form data.
 *
 * @param {RestoreServiceParams} datauser - User data object.
 * @param {ReturnType<typeof useConexysConfig>} [configLogs] - Config context for logging.
 * @returns {Promise<ServiceResponse>} A promise that resolves to the response data from the server.
 */
const restoreFormService = async (
  datauser: RestoreServiceParams & { httpMethod?: 'post' | 'patch' },
  configLogs?: ReturnType<typeof useConexysConfig>,
): Promise<ServiceResponse> => {
  const { cxauthxc, restoreServerURL, httpMethod, ...datasend } = datauser;
  const logs = configLogs || defaultConfig;

  const config = {
    headers: {
      Authorization: `Bearer ${cxauthxc}`,
      'X-Session-ID': datauser.sessionID || '',
      'X-Fingerprint': datauser.fingerprint || '',
      'Content-Type': 'application/json',
    },
  };

  logConsole(logs, 'debug', '[Payload] ', datasend);

  try {
    const response: AxiosResponse<ServiceResponse> =
      httpMethod === 'patch'
        ? await axios.patch(restoreServerURL, datasend, config)
        : await axios.post(restoreServerURL, datasend, config);
    logConsole(logs, 'info', '[Request] ', restoreServerURL);
    return response.data;
  } catch (error) {
    logConsole(
      logs,
      'debug',
      '[Error Response] ',
      (error as any)?.response?.data,
    );
    console.error('Error restoring form data:', error);
    throw error;
  }
};

export default { restoreFormService };
