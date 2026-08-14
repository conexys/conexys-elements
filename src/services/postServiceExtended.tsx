/**
 * @fileoverview
 *
 * @module services/postService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import postserviceService from './postService';
import { deleteservice } from './deleteService';
import { getservice } from './getService';
import { Uservalidationerror } from '../components/index';
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  FormItem,
  DataConverted,
  RenderResponse,
} from '../types/services/postServiceExtended.types';
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

const servicePostBasic = async (
  fpHash: string = '',
  sessionID: string,
  baseURL: string,
  config: any,
  setData: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  const key = { sessionID, fingerprint: visitorIdHash };
  logConsole(configLogs, 'debug', '[Payload] ', key);
  try {
    const response: AxiosResponse<any> = await axios.post(baseURL, key, config);
    logConsole(configLogs, 'info', '[Request] ', baseURL);
    logConsole(configLogs, 'data', '', response.data);
    setData(response.data);
  } catch (error) {
    logConsole(configLogs, 'error', '', error);
    console.error(error);
  }
};

const serviceData = async (
  baseURL: string,
  key: any,
  config: any,
  setData: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  logConsole(configLogs, 'debug', '[Payload] ', key);
  try {
    const response = await axios.post(baseURL, key, config);
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
    logConsole(configLogs, 'error', 'Error fetching data:', err);
    console.error('Error fetching data:', err);
  }
};

const servicePost = async (
  fpHash: string = '',
  sessionID: string,
  id: string,
  permission: boolean,
  postURL: string,
  config: any,
  name: string,
  cxauthxc: string,
  postURL1: string,
  t: (key: string) => string,
  setPost: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  const key = { sessionID, itemID: id, fingerprint: visitorIdHash };

  if (permission) {
    try {
      const response = await getservice(
        {
          sessionID,
          cxauthxc,
          postServerURL: postURL,
          authorization: true,
          fingerprint: visitorIdHash,
          name,
        },
        configLogs,
      );
      setPost(response);
    } catch (err) {
      handleError(err as AxiosError, t, configLogs);
    }
  } else {
    logConsole(configLogs, 'debug', '[Payload] ', key);
    try {
      const response: AxiosResponse<any> = await axios.post(
        postURL1,
        key,
        config,
      );
      logConsole(configLogs, 'info', '[Request] ', postURL1);
      logConsole(configLogs, 'data', '', response.data);
      setPost(response.data);
    } catch (error) {
      logConsole(configLogs, 'error', '', error);
      console.error(error);
    }
  }
};

const servicePost2 = async (
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
    const unreadcount = await postserviceService.postservice(
      requestData,
      configLogs,
    );
    if (unreadcount.data !== undefined) {
      setPost(unreadcount.data);
    }
    logConsole(configLogs, 'data', '', unreadcount);
    setIsError(false);
  } catch (err) {
    setError(true);
    handleError(err as AxiosError, t, configLogs, setIsError, setMessageerror);
  } finally {
    setLoading(false);
  }
};

const servicePostData = async (
  fpHash: string = '',
  sessionID: string,
  id: string,
  permission: boolean,
  postURL: string,
  config: any,
  name: string,
  cxauthxc: string,
  postURL1: string,
  t: (key: string) => string,
  setPost: (data: any) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  const key = { sessionID, itemID: id, fingerprint: visitorIdHash };

  if (permission) {
    try {
      const response = await postserviceService.postservice(
        {
          sessionID,
          cxauthxc,
          postServerURL: postURL,
          authorization: true,
          fingerprint: visitorIdHash,
          name,
        },
        configLogs,
      );

      const dataform = JSON.parse(response.data);
      const updatedDataForm = await Promise.all(
        dataform.map(async (itenform: FormItem) => {
          if (itenform.items !== undefined && itenform.url !== undefined) {
            const newItems = await postserviceService.postservice(
              {
                sessionID,
                cxauthxc,
                postServerURL: itenform.url,
                authorization: true,
                fingerprint: visitorIdHash,
              },
              configLogs,
            );
            const itemKey = itenform.itemKey;
            const textitemKey = itenform.textitemKey;

            const dataConverted: DataConverted[] = newItems.data.map(
              (item: any) => ({
                item: item[itemKey!],
                textitem: `${item[textitemKey!].charAt(0).toUpperCase() + item[textitemKey!].slice(1)}`,
              }),
            );
            itenform.items = dataConverted;
          }
          return itenform;
        }),
      );

      const renderresponde: RenderResponse = {
        data: JSON.stringify(updatedDataForm),
        code: response.code,
        permission: response.permission,
      };

      setPost(renderresponde);
    } catch (err) {
      handleError(err as AxiosError, t, configLogs);
    }
  } else {
    logConsole(configLogs, 'debug', '[Payload] ', key);
    try {
      const response: AxiosResponse<any> = await axios.post(
        postURL1,
        key,
        config,
      );
      logConsole(configLogs, 'info', '[Request] ', postURL1);
      setPost(response.data);
    } catch (error) {
      logConsole(configLogs, 'error', '', error);
      console.error(error);
    }
  }
};

const serviceLockscreen = async (
  fpHash: string = '',
  sessionID: string,
  postURL: string,
  cxauthxc: string,
  t: (key: string) => string,
  setSettingsblockscreen: (value: boolean) => void,
  setSettingsblockscreentime: (value: number) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  try {
    const settingslockscreen = await postserviceService.postservice(
      {
        sessionID,
        cxauthxc,
        postServerURL: postURL,
        authorization: true,
        fingerprint: visitorIdHash,
      },
      configLogs,
    );
    const rawSettings =
      settingslockscreen.settings ||
      settingslockscreen.data?.[0]?.settings ||
      '{}';
    const settings =
      typeof rawSettings === 'object' ? rawSettings : JSON.parse(rawSettings);
    setSettingsblockscreen(settings.blockscreen === 'true');
    setSettingsblockscreentime(parseInt(settings.blockscreentime));
    logConsole(configLogs, 'data', '', settings.blockscreen);
  } catch (err) {
    handleError(err as AxiosError, t, configLogs);
  }
};

const serviceLogout = async (
  fpHash: string = '',
  sessionID: string,
  cxauthxc: string,
  t: (key: string) => string,
  setAuthTokens: (tokens: string) => void,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<void> => {
  const MySwal = withReactContent(SweetAlert2);
  const visitorIdHash: string = await getOrSetFingerprint(fpHash);
  try {
    const userLanguage: string | null = localStorage.getItem('userLanguage');
    const displaymode: string | null = localStorage.getItem('displaymode');
    const displayzoom: string | null = localStorage.getItem('displayzoom');

    localStorage.clear();
    authStorage.removeAuthData(configLogs);

    if (userLanguage) localStorage.setItem('userLanguage', userLanguage);
    if (displaymode) localStorage.setItem('displaymode', displaymode);
    if (displayzoom) localStorage.setItem('displayzoom', displayzoom);

    await postserviceService.postservice(
      {
        sessionID,
        cxauthxc,
        postServerURL: 'logout',
        authorization: true,
        fingerprint: visitorIdHash,
      },
      configLogs,
    );
    setAuthTokens('');
  } catch (err) {
    const errorMessage: string = handleError(err as AxiosError, t, configLogs);
    MySwal.fire({
      title: `<p>${errorMessage}</p>`,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

const serviceFavorites = async (
  type: string = '',
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
  setColor: (color: string) => void,
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
    let unreadcount;
    if (type === 'del') {
      unreadcount = await deleteservice(requestData, configLogs);
    } else if (type === 'get') {
      unreadcount = await getservice(requestData, configLogs);
    } else {
      unreadcount = await postserviceService.postservice(
        requestData,
        configLogs,
      );
    }
    // Handle both wrapped ({ data, code }) and direct (array, object) responses
    if (
      unreadcount &&
      typeof unreadcount === 'object' &&
      'data' in unreadcount &&
      !Array.isArray(unreadcount)
    ) {
      setPost(unreadcount.data);
    } else {
      setPost(unreadcount);
    }
    logConsole(configLogs, 'data', '', unreadcount);
    const favoriteValue =
      unreadcount &&
      typeof unreadcount === 'object' &&
      'data' in unreadcount &&
      !Array.isArray(unreadcount)
        ? unreadcount.data
        : unreadcount;
    if (type === 'get' && favoriteValue === true) {
      setColor('#ffcd38');
    } else if (type === 'set') {
      setColor('#ffcd38');
      localStorage.setItem('favoritessynch01', 'true');
      localStorage.setItem('favoritessynch02', 'true');
      window.dispatchEvent(new Event('favorites'));
    } else if (type === 'del') {
      setColor('');
      localStorage.setItem('favoritessynch01', 'true');
      localStorage.setItem('favoritessynch02', 'true');
      window.dispatchEvent(new Event('favorites'));
    }
    setIsError(false);
  } catch (err) {
    setError(true);
    handleError(err as AxiosError, t, configLogs, setIsError, setMessageerror);
  } finally {
    setLoading(false);
  }
};

const serviceGetFavorites = async (
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
    const unreadcount = await getservice(requestData, configLogs);
    // Handle both wrapped ({ data, code }) and direct (array, object) responses
    const responseData =
      unreadcount &&
      typeof unreadcount === 'object' &&
      'data' in unreadcount &&
      !Array.isArray(unreadcount)
        ? unreadcount.data
        : unreadcount;
    setPost(responseData);
    localStorage.setItem('favoritessynch03', JSON.stringify(responseData));
    logConsole(configLogs, 'data', '', unreadcount);
    setIsError(false);
  } catch (err) {
    setError(true);
    handleError(err as AxiosError, t, configLogs, setIsError, setMessageerror);
  } finally {
    setLoading(false);
  }
};

export {
  servicePostBasic,
  serviceData,
  servicePost,
  servicePost2,
  servicePostData,
  serviceLockscreen,
  serviceLogout,
  serviceFavorites,
  serviceGetFavorites,
};
