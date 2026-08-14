/**
 * @fileoverview
 * This service uses Axios to make a GET request to the server with query parameters.
 * Analogous to postService.tsx but for GET endpoints.
 * @module services/getService
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
 * Service function for making a GET request to the server.
 * Request data is sent as query parameters.
 *
 * @param {PostServiceBaseParams} datauser - User data object.
 * @returns {Promise<ServiceDataResponse>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
export const getservice = async (
  datauser: PostServiceBaseParams,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<ServiceDataResponse> => {
  const getURL: string = Url + datauser.postServerURL;
  const {
    authorization,
    postServerURL,
    cxauthxc,
    sessionID,
    fingerprint,
    ...requestData
  } = datauser;

  let config: any;
  if (authorization === true || authorization === 'true') {
    config = {
      headers: {
        Authorization: `Bearer ${cxauthxc}`,
        'X-Session-ID': sessionID || '',
        'X-Fingerprint': fingerprint || '',
      },
      params: requestData,
    };
  } else {
    config = {
      params: requestData,
    };
  }

  logConsole(configLogs, 'debug', '[Payload] ', requestData);

  try {
    const response: AxiosResponse<ServiceDataResponse> = await axios.get(
      getURL,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', getURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data with GET:', error);
    throw error;
  }
};

export default { getservice };
