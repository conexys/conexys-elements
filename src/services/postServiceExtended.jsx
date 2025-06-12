/**
 * @fileoverview
 * 
 * @module services/postService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires @fingerprintjs/fingerprintjs
 * @requires ./postService
 * @requires ../components/index
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires axios
 */

import postserviceService from './postService.jsx';
import { Uservalidationerror } from "../components/index.jsx";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';


const handleError = (err, t, setIsError, setMessageerror) => {
    let errorMessage;
    if (!err?.response) {
        errorMessage = t('login.no_server_response');
    } else if (err.response?.status === 400) {
        errorMessage = t('login.command_not_found');
    } else if (err.response?.status === 401) {
        errorMessage = t('login.invalid_data_username_mail');
        Uservalidationerror();
    } else if (err.response?.status === 403) {
        errorMessage = t('error.no_permission');
    } else {
        errorMessage = t('login.unknown_error');
    }
    console.log('%c [Conexys] [Error] ', 'color: #fc0000', errorMessage);
    if (setIsError) setIsError(true);
    if (setMessageerror) setMessageerror(errorMessage);
};

const servicePostBasic = async (fpHash = '', sessionID, baseURL, config, setData) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    const key = { sessionID, fingerprint: visitorIdHash };
    try {
        const { data } = await axios.post(baseURL, key, config);
        if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', baseURL);
        }
        setData(data);
    } catch (error) {
        console.error(error);
    }
};

const serviceData = async (baseURL, key, config, setData) => {
    try {
        const { data } = await axios.post(baseURL, key, config);
        if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', baseURL)
        };
        setData(data.data);
    } catch (err) {
        console.error('Error fetching data:', err);
    };
};

const servicePost = async (fpHash = '', sessionID, id, permission, postURL, config, name, cxauthxc, postURL1, t, setPost) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    const key = { sessionID, itemID: id, fingerprint: visitorIdHash };

    if (permission) {
        try {
            const response = await postserviceService.postservice({
                sessionID,
                cxauthxc,
                postServerURL: postURL,
                authorization: true,
                fingerprint: visitorIdHash,
                name
            });
            setPost(response);
        } catch (err) {
            handleError(err, t);
        }
    } else {
        try {
            const { data } = await axios.post(postURL1, key, config);
            if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
                console.log('%c [Conexys] [Request] ', 'color: #55ff00', postURL1);
            }
            setPost(data);
        } catch (error) {
            console.error(error);
        }
    }
};

const servicePost2 = async (fpHash = '', sessionID, postURL, cxauthxc, t, setPost, setIsError, setError, setMessageerror, setLoading, ...rest) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    try {
        const requestData = {
            ...rest[0],
            sessionID,
            cxauthxc,
            postServerURL: postURL,
            authorization: true,
            fingerprint: visitorIdHash,
        };
        const unreadcount = await postserviceService.postservice(requestData);
        if (unreadcount.data !== undefined) {
            setPost(unreadcount.data);
        }
        if (import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true') {
            console.log('%c [Conexys] [Data] ', 'color: #55ff00', unreadcount);
        }
        setIsError(false);
    } catch (err) {
        setError(true);
        handleError(err, t, setIsError, setMessageerror);
    } finally {
        setLoading(false);
    }
};

const servicePostData = async (fpHash = '', sessionID, id, permission, postURL, config, name, cxauthxc, postURL1, t, setPost) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    const key = { sessionID, itemID: id, fingerprint: visitorIdHash };

    if (permission) {
        try {
            const response = await postserviceService.postservice({
                sessionID,
                cxauthxc,
                postServerURL: postURL,
                authorization: true,
                fingerprint: visitorIdHash,
                name
            });

            const dataform = JSON.parse(response.data);
            const updatedDataForm = await Promise.all(dataform.map(async itenform => {
                if (itenform.items !== undefined && itenform.url !== undefined) {
                    const newItems = await postserviceService.postservice({
                        sessionID,
                        cxauthxc,
                        postServerURL: itenform.url,
                        authorization: true,
                        fingerprint: visitorIdHash
                    });
                    const itemKey = itenform.itemKey;
                    const textitemKey = itenform.textitemKey;

                    const dataConverted = newItems.data.map(item => ({
                        item: item[itemKey],
                        textitem: `${item[textitemKey].charAt(0).toUpperCase() + item[textitemKey].slice(1)}`
                    }));
                    itenform.items = dataConverted;
                }
                return itenform;
            }));

            const renderresponde = {
                data: JSON.stringify(updatedDataForm),
                code: response.code,
                permission: response.permission
            };

            setPost(renderresponde);
        } catch (err) {
            handleError(err, t);
        }
    } else {
        try {
            const { data } = await axios.post(postURL1, key, config);
            if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
                console.log('%c [Conexys] [Request] ', 'color: #55ff00', postURL1);
            }
            setPost(data);
        } catch (error) {
            console.error(error);
        }
    }
};

const serviceLockscreen = async (fpHash = '', sessionID, postURL, cxauthxc, t, setSettingsblockscreen, setSettingsblockscreentime) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    try {
        const settingslockscreen = await postserviceService.postservice({
            sessionID,
            cxauthxc,
            postServerURL: postURL,
            authorization: true,
            fingerprint: visitorIdHash
        });
        const settings = JSON.parse(settingslockscreen.data[0].settings);
        setSettingsblockscreen(settings.blockscreen === 'true');
        setSettingsblockscreentime(parseInt(settings.blockscreentime));
        if (import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true') {
            console.log('%c [Conexys] [Data] ', 'color: #55ff00', settings.blockscreen);
        }
    } catch (err) {
        handleError(err, t);
    }
};

const serviceLogout = async (fpHash = '', sessionID, cxauthxc, t, setAuthTokens) => {
    const MySwal = withReactContent(SweetAlert2);
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    try {
        const userLanguage = localStorage.getItem("userLanguage");
        const displaymode = localStorage.getItem("displaymode");
        const displayzoom = localStorage.getItem("displayzoom");
        localStorage.clear();
        localStorage.setItem("userLanguage", userLanguage);
        if (displaymode) localStorage.setItem("displaymode", displaymode);
        if (displayzoom) localStorage.setItem("displayzoom", displayzoom);

        await postserviceService.postservice({
            sessionID,
            cxauthxc,
            postServerURL: 'logout',
            authorization: true,
            fingerprint: visitorIdHash
        });
        setAuthTokens("");
    } catch (err) {
        const errorMessage = handleError(err, t);
        MySwal.fire({
            title: `<p>${errorMessage}</p>`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};

const serviceFavorites = async (type = '', fpHash = '', sessionID, postURL, cxauthxc, t, setPost, setIsError, setError, setMessageerror, setLoading, setColor, ...rest) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    try {
        const requestData = {
            ...rest[0],
            sessionID,
            cxauthxc,
            postServerURL: postURL,
            authorization: true,
            fingerprint: visitorIdHash,
        };
        const unreadcount = await postserviceService.postservice(requestData);
        if (unreadcount.data !== undefined) {
            setPost(unreadcount.data);
        }
        if (import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true') {
            console.log('%c [Conexys] [Data] ', 'color: #55ff00', unreadcount);
        }
        if (type === 'get' && unreadcount.data === true) {
            setColor('#ffcd38');
        } else if (type === 'set') {
            setColor('#ffcd38');
            localStorage.setItem("favoritessynch01", true);
            localStorage.setItem("favoritessynch02", true);
            window.dispatchEvent(new Event("favorites"));
        } else if (type === 'del') {
            setColor('');
            localStorage.setItem("favoritessynch01", true);
            localStorage.setItem("favoritessynch02", true);
            window.dispatchEvent(new Event("favorites"));
        }
        setIsError(false);
    } catch (err) {
        setError(true);
        handleError(err, t, setIsError, setMessageerror);
    } finally {
        setLoading(false);
    }
};

const serviceGetFavorites = async (fpHash = '', sessionID, postURL, cxauthxc, t, setPost, setIsError, setError, setMessageerror, setLoading, ...rest) => {
    const visitorIdHash = await getOrSetFingerprint(fpHash);
    try {
        const requestData = {
            ...rest[0],
            sessionID,
            cxauthxc,
            postServerURL: postURL,
            authorization: true,
            fingerprint: visitorIdHash,
        };
        const unreadcount = await postserviceService.postservice(requestData);
        if (unreadcount.data !== undefined) {
            setPost(unreadcount.data);
            localStorage.setItem("favoritessynch03", JSON.stringify(unreadcount.data));
        }
        if (import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true') {
            console.log('%c [Conexys] [Data] ', 'color: #55ff00', unreadcount);
        }
        setIsError(false);
    } catch (err) {
        setError(true);
        handleError(err, t, setIsError, setMessageerror);
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
    serviceGetFavorites
};