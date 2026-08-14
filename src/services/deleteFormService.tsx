/**
 * @fileoverview
 * This file contains a service module for making kill requests to a server using Axios.
 * This deleteFormService module exports an asynchronous function that makes a POST request to the server using Axios. The function takes a datauser object as a parameter, from which cxauthxc, deleteServerURL, and other data is extracted and sent in the body of the request. The function handles both success and errors in the request and returns the response data or an error object.
 * This type of module is useful for centralising the logic for handling delete requests and reusing it in different parts of your application.
 * @module services/deleteFormService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { logConsole } from '../utilities/logConsole';
import type { DeleteServiceParams, ServiceResponse } from '../types/common';
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
 * Service function for deleting form data.
 *
 * @param {DeleteServiceParams} datauser - User data object.
 * @param {ReturnType<typeof useConexysConfig>} [configLogs] - Config context for logging.
 * @returns {Promise<ServiceResponse>} A promise that resolves to the response data from the server.
 */
const deleteFormService = async (
  datauser: DeleteServiceParams,
  configLogs?: ReturnType<typeof useConexysConfig>,
): Promise<ServiceResponse> => {
  const { cxauthxc, deleteServerURL, ...datasend } = datauser;
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
    const response: AxiosResponse<ServiceResponse> = await axios.delete(
      deleteServerURL,
      { data: datasend, ...config },
    );
    logConsole(logs, 'info', '[Request] ', deleteServerURL);
    return response.data;
  } catch (error) {
    logConsole(logs, 'error', 'Error deleting form data:', error);
    console.error('Error deleting form data:', error);
    throw error;
  }
};

export default { deleteFormService };
