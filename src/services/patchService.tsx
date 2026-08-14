/**
 * @fileoverview
 * Service function for making a PATCH request to the server with JSON data.
 * Analogous to postService.tsx but using axios.patch().
 * @module services/patchService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
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
 * Service function for making a PATCH request to the server.
 *
 * @param {PostServiceBaseParams} datauser - User data object.
 * @returns {Promise<ServiceDataResponse>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
export const patchservice = async (
  datauser: PostServiceBaseParams,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<ServiceDataResponse> => {
  const patchURL: string = Url + datauser.postServerURL;
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
    const response: AxiosResponse<ServiceDataResponse> = await axios.patch(
      patchURL,
      requestData,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', patchURL);
    return response.data;
  } catch (error) {
    logConsole(configLogs, 'error', 'Error patching form data', error);
    console.error('Error patching form data:', error);
    throw error;
  }
};

export default { patchservice };
