/**
 * @fileoverview API de servicios compartidos para plugins
 * 
 * @module shared/sharedServicesAPI
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 1.0.0
 * @requires ../services/postServiceExtended
 * @requires ../services/postService
 * @requires ../services/deleteFormService
 * @requires ../services/postFormService
 * @requires ../services/postFormServiceGetPost
 * @requires ../services/restoreFormService
 * @requires ../shared/baseFingerprintService
 * @requires ../constants/global
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
    serviceGetFavorites
} from '../services/postServiceExtended.jsx';
import postService from '../services/postService.jsx';
import deleteFormService from '../services/deleteFormService.jsx';
import postFormService from '../services/postFormService.jsx';
import postFormServiceGetPost from '../services/postFormServiceGetPost.jsx';
import restoreFormService from '../services/restoreFormService.jsx';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';
import { Url } from '../constants/global.jsx';

/**
 * Inicializa y expone los servicios compartidos en el objeto window
 */
export const initializeSharedServices = () => {
    // Evitar reinicialización si ya existe
    if (window.conexysServices) return;
    
    // Objeto de Servicios compartidos
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
            restoreFormService: restoreFormService.restoreFormService
        },
        
        // Utilidades compartidas
        utils: {
            getFingerprint: getOrSetFingerprint,
            baseUrl: Url
        },
        
        // Helper para obtener datos de autenticación
        getAuthData: () => {
            return {
                sessionID: localStorage.getItem("cx_session"),
                authToken: localStorage.getItem("cxauthxc")
            };
        }
    };
    
    if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
        console.log('%c [Conexys] [Shared Services] ', 'color: #3498db', 'Services initialized and shared with plugins');
    };
};