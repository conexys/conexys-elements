/**
 * @fileoverview
 * This back end uses Axios to make a POST request to the server with JSON data.
 * This postservice function uses Axios to make a POST request to the server with JSON data. The function handles both success and errors in the request and returns the response data or an error object. You can adjust the error handling logic according to your specific needs.
 * @module services/postService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { Url } from '../constants/global';
import { logConsole } from '../utilities/logConsole';
import type {
  PostServiceBaseParams,
  ServiceDataResponse,
} from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Service function for making a POST request to the server.
 *
 * @param {PostServiceBaseParams} datauser - User data object.
 * @returns {Promise<ServiceDataResponse>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
export const postservice = async (
  datauser: PostServiceBaseParams,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<ServiceDataResponse> => {
  const postURL: string = Url + datauser.postServerURL;
  const { authorization, postServerURL, cxauthxc, ...requestData } = datauser;

  let config: any;
  if (authorization === true || authorization === 'true') {
    config = {
      headers: {
        Authorization: `Bearer ${cxauthxc}`,
        'X-Session-ID': datauser.sessionID || '',
        'X-Fingerprint': datauser.fingerprint || '',
        'Content-Type': 'application/json',
      },
    };
  } else {
    config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  logConsole(configLogs, 'debug', '[Payload] ', requestData);

  try {
    const response: AxiosResponse<ServiceDataResponse> = await axios.post(
      postURL,
      requestData,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', postURL);
    return response.data;
  } catch (error) {
    logConsole(configLogs, 'error', 'Error posting form data:', error);
    console.error('Error posting form data:', error);
    throw error;
  }
};

export default { postservice };
