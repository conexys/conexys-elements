/**
 * @fileoverview
 * This module exports utility functions for checking the existence of a username and email using API calls.
 * Checks if the username and email, for a new registration, already exist.
 * This code contains two functions (checkExistsUsername and checkExistsMail) that check whether a username or email address already exists in the system for a new registration.
 * These functions are used to perform asynchronous checks for the existence of a user name or e-mail address in the system during a registration process.
 * @module utils/checkExists
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { Url } from '../../../../constants/global';
import { logConsole } from '../../../../utilities/logConsole';
import type {
  ApiResponseString,
  CheckMailRequest,
  CheckUsernameRequest,
} from '../../../../types/components/form.types';
import { useConexysConfig } from '../../../../config/ConexysConfig';

/**
 * URL for checking the existence of a username.
 * @type {string}
 */
const postURLusername: string = Url + 'checkusername';

/**
 * URL for checking the existence of an email.
 * @type {string}
 */
const postURLmail: string = Url + 'checkmail';

/**
 * Axios configuration for API calls.
 * @type {AxiosRequestConfig}
 */
const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Asynchronously checks the existence of a username using an API call.
 * @async
 * @function
 * @param {string} value - The username to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the username is valid, otherwise false.
 */
const checkExistsUsername = async (
  { username, sessionID }: CheckUsernameRequest,
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<boolean> => {
  const requestData: CheckUsernameRequest = {
    username: username,
    sessionID: sessionID,
  };
  logConsole(configLogs, 'debug', '[Payload] ', requestData);
  try {
    const { data }: { data: ApiResponseString } = await axios.post(
      postURLusername,
      requestData,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', postURLusername);
    logConsole(configLogs, 'data', '', data.result);
    return data.result === 'Valid';
  } catch (err: unknown) {
    logConsole(configLogs, 'error', '', err);
    console.error(err);
    return false;
  }
};

/**
 * Asynchronously checks the existence of an email using an API call.
 * @async
 * @function
 * @param {CheckMailRequest} params - The object containing email and session.
 * @returns {Promise<boolean>} A Promise that resolves to true if the email is valid, otherwise false.
 */
const checkExistsMail = async (
  { email, sessionID }: CheckMailRequest,
  configLogs: ReturnType<typeof useConexysConfig>,
): Promise<boolean> => {
  const requestData: CheckMailRequest = { email: email, sessionID: sessionID };
  logConsole(configLogs, 'debug', '[Payload] ', requestData);
  try {
    const { data }: { data: ApiResponseString } = await axios.post(
      postURLmail,
      requestData,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', postURLmail);
    logConsole(configLogs, 'data', '', data.result);
    return data.result === 'Valid';
  } catch (err: unknown) {
    logConsole(configLogs, 'error', '', err);
    console.error(err);
    return false;
  }
};

export { checkExistsUsername, checkExistsMail };
