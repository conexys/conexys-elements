/**
 * @fileoverview Shared services API for plugins
 *
 * @module shared/sharedServicesAPI
 * @description Provides shared services and utilities for plugins.
 * @version 0.3.0
 */

import {
  servicePostBasic,
  serviceData,
  servicePost,
  servicePost2,
  servicePostData,
  serviceLockscreen,
  serviceLogout,
  serviceFavorites,
  serviceGetFavorites,
} from '../services/postServiceExtended';
import postService from '../services/postService';
import deleteFormService from '../services/deleteFormService';
import postFormService from '../services/postFormService';
import postFormServiceGetPost from '../services/postFormServiceGetPost';
import restoreFormService from '../services/restoreFormService';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { Url } from '../constants/global';
import { logConsole } from '../utilities/logConsole';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Interface for post services
 */
interface PostServices {
  postBasic: typeof servicePostBasic;
  getData: typeof serviceData;
  post: typeof servicePost;
  post2: typeof servicePost2;
  postData: typeof servicePostData;
  lockscreen: typeof serviceLockscreen;
  logout: typeof serviceLogout;
  favorites: typeof serviceFavorites;
  getFavorites: typeof serviceGetFavorites;
  postService: typeof postService.postservice;
  deleteFormService: typeof deleteFormService.deleteFormService;
  postFormService: typeof postFormService.postFormService;
  postFormServiceGetPost: typeof postFormServiceGetPost.postFormServiceGetPost;
  restoreFormService: typeof restoreFormService.restoreFormService;
}

/**
 * Interface for shared utilities
 */
interface SharedUtils {
  getFingerprint: typeof getOrSetFingerprint;
  baseUrl: string;
}

/**
 * Interface for authentication data
 */
interface AuthData {
  sessionID: string | null;
  authToken: string | null;
}

/**
 * Interface for Conexys shared services
 */
interface ConexysServices {
  /** Post services */
  postServices: PostServices;
  /** Shared utilities */
  utils: SharedUtils;
  /** Helper to retrieve authentication data */
  getAuthData: () => AuthData;
}

/**
 * Extension of the Window object to include conexysServices
 */
declare global {
  interface Window {
    conexysServices?: ConexysServices;
  }
}

/**
 * Initializes and exposes shared services on the window object
 * @returns {void}
 */
export const initializeSharedServices = (): void => {
  const configLogs = useConexysConfig();
  // Avoid reinitialization if it already exists
  if (window.conexysServices) return;

  // Shared services object
  window.conexysServices = {
    postServices: {
      postBasic: servicePostBasic,
      getData: serviceData,
      post: servicePost,
      post2: servicePost2,
      postData: servicePostData,
      lockscreen: serviceLockscreen,
      logout: serviceLogout,
      favorites: serviceFavorites,
      getFavorites: serviceGetFavorites,
      postService: postService.postservice,
      deleteFormService: deleteFormService.deleteFormService,
      postFormService: postFormService.postFormService,
      postFormServiceGetPost: postFormServiceGetPost.postFormServiceGetPost,
      restoreFormService: restoreFormService.restoreFormService,
    },

    // Shared utilities
    utils: {
      getFingerprint: getOrSetFingerprint,
      baseUrl: Url,
    },

    // Helper to retrieve authentication data
    getAuthData: (): AuthData => {
      return {
        sessionID: localStorage.getItem('cx_session'),
        authToken: localStorage.getItem('cxauthxc'),
      };
    },
  };

  logConsole(
    configLogs,
    'info',
    '[Shared Services] ',
    'Services initialized and shared with plugins',
  );
};
