/**
 * @fileoverview
 * This back end uses Axios to make a POST request to the server with form data, including the ability to handle files.
 * This postFormServiceGetPost module uses FormData to build the form payload and makes a POST request to the server. The function handles both success and errors of the request and returns the response data or an error object.
 * @module services/postFormServiceGetPost
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { logConsole } from '../utilities/logConsole';
import type { PostFormServiceGetPostParams } from '../types/services/postFormServiceGetPost.types';
import type { ServiceResponse } from '../types/common';
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
 * Service function for posting form data, including files, to the server.
 *
 * @param {PostFormServiceGetPostParams} datauser - User data object.
 * @param {ReturnType<typeof useConexysConfig>} [configLogs] - Config context for logging.
 * @returns {Promise<ServiceResponse>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
const postFormServiceGetPost = async (
  datauser: PostFormServiceGetPostParams,
  configLogs?: ReturnType<typeof useConexysConfig>,
): Promise<ServiceResponse> => {
  const {
    postServerURL,
    authorization,
    event,
    iditem,
    sessionID,
    fingerprint,
    cxauthxc,
  } = datauser;
  const logs = configLogs || defaultConfig;
  const formData = new FormData();

  // Reads each of the incoming data to form a new array with the form data
  for (const element of event.target as any) {
    if (element.type === 'file') {
      const file: File = element.files[0];
      formData.append('file', file);
    } else {
      if (element.name !== '') {
        formData.append(element.name, element.value);
      }
    }
  }

  formData.append('iditem', iditem);
  formData.append('sessionID', sessionID);
  formData.append('fingerprint', fingerprint);

  let config: any;
  if (authorization === true) {
    config = {
      headers: {
        Authorization: `Bearer ${cxauthxc}`,
        'X-Session-ID': sessionID,
        'X-Fingerprint': fingerprint,
        'Content-Type': 'multipart/form-data',
      },
    };
  } else {
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  logConsole(logs, 'debug', '[Payload] ', {
    iditem,
    sessionID,
    fingerprint,
    file: formData.get('file'),
  });

  try {
    const response: AxiosResponse<ServiceResponse> = await axios.post(
      postServerURL,
      formData,
      config,
    );
    logConsole(logs, 'info', '[Request] ', postServerURL);
    return response.data;
  } catch (error) {
    logConsole(logs, 'error', 'Error posting form data:', error);
    console.error('Error posting form data:', error);
    throw error;
  }
};

export default { postFormServiceGetPost };
