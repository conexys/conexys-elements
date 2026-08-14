/**
 * @fileoverview
 * Service function for making a DELETE request to the server with JSON data.
 * Analogous to postService.tsx but using axios.delete().
 * @module services/deleteService
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
 * Service function for making a DELETE request to the server.
 *
 * @param {PostServiceBaseParams} datauser - User data object.
 * @returns {Promise<ServiceDataResponse>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
export const deleteservice = async (
  datauser: PostServiceBaseParams,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<ServiceDataResponse> => {
  const deleteURL: string = Url + datauser.postServerURL;
  const { authorization, postServerURL, cxauthxc, ...requestData } = datauser;

  let headers: any;
  if (authorization === true || authorization === 'true') {
    headers = {
      Authorization: `Bearer ${cxauthxc}`,
      'X-Session-ID': datauser.sessionID || '',
      'X-Fingerprint': datauser.fingerprint || '',
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  logConsole(configLogs, 'debug', '[Payload] ', requestData);

  try {
    const response: AxiosResponse<ServiceDataResponse> = await axios.delete(
      deleteURL,
      {
        headers,
        data: requestData,
      },
    );
    logConsole(configLogs, 'info', '[Request] ', deleteURL);
    return response.data;
  } catch (error) {
    logConsole(configLogs, 'error', 'Error deleting data:', error);
    console.error('Error deleting data:', error);
    throw error;
  }
};

export default { deleteservice };
