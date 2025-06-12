/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalMulti
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires react-i18next
 * @requires ../services/deleteFormService
 * @requires ../services/restoreFormService
 * @requires @fingerprintjs/fingerprintjs
 */

import { useState } from "react";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import deleteFormService from '../services/deleteFormService.jsx';
import restoreFormService from '../services/restoreFormService.jsx';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';

/**
 * Custom React hook for handling deletion of multiple forms.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} restoreServerURL - The URL for deleting form data.
 * @returns {Object} An object containing functions and states for form deletion.
 */
const useCustomFormMulti = (fpHash, deleteServerURL, restoreServerURL) => { //setAuth if true it is to store the session start data, only use for login.
    const [t] = useTranslation("global");;
    const MySwal = withReactContent(SweetAlert2)
    const [formStatus, setFormStatus] = useState(false); //Check if the form accepted everything and was correct to close the modal.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in
    
    
    //DELETE
    /**
     * Handles the deletion of multiple forms.
     *
     * @param {Object} event - The deletion event.
     * @param {string} event.id - The identifier for the data to be deleted.
     * @returns {Promise<void>} A promise that resolves after handling the deletion.
     */
    const handleFormDeleteMulti = async (event) => {
        const visitorIdHash = await getOrSetFingerprint(fpHash);
        const id = event.id;
        try {
            const dataform = await deleteFormService.deleteFormService({
                sessionID,
                cxauthxc,
                deleteServerURL,
                fingerprint: visitorIdHash,
                id
            });
            setFormStatus(true); //Check if the form accepted everything and was correct to close the modal.
            if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
                console.log('%c [Conexys] ', 'color: #55ff00', dataform);
            };
        } catch (err) {
            setError(true);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };
    //DELETE

    //RESTORE
    /**
     * Handles the deletion of multiple forms.
     *
     * @param {Object} event - The deletion event.
     * @param {string} event.id - The identifier for the data to be deleted.
     * @returns {Promise<void>} A promise that resolves after handling the deletion.
     */
    const handleFormRestoreMulti = async (event) => {
        const visitorIdHash = await getOrSetFingerprint(fpHash);
        const id = event.id;
        try {
            const dataform = await restoreFormService.restoreFormService({
                sessionID,
                cxauthxc,
                restoreServerURL,
                fingerprint: visitorIdHash,
                id
            });
            setFormStatus(true); //Check if the form accepted everything and was correct to close the modal.
            if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
                console.log('%c [Conexys] ', 'color: #55ff00', dataform);
            };
        } catch (err) {
            setError(true);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };
    //RESTORE

    /**
     * Handles errors and displays appropriate messages.
     *
     * @param {Object} err - The error object.
     */
    const handleError = (err) => {
        if (!err?.response) {
            MySwal.fire({
                title: `<p>${t('login.no_server_response')}</p>`,
                icon: 'error',
                confirmButtonText: t('general.ok')
            });
        } else if (err.response?.status === 400) {
            MySwal.fire({
                title: `<p>${t('login.command_not_found')}</p>`,
                icon: 'error',
                confirmButtonText: t('general.ok')
            });
        } else if (err.response?.status === 401) {
            MySwal.fire({
                title: `<p>${t('login.invalid_data_username_mail')}</p>`,
                icon: 'error',
                confirmButtonText: t('general.ok')
            });
        } else if (err.response?.status === 403) {
            MySwal.fire({
                title: `<p>${t('error.no_permission')}</p>`,
                icon: 'error',
                confirmButtonText: t('general.ok')
            });
        } else {
            MySwal.fire({
                title: `<p>${t('login.unknown_error')}</p>`,
                icon: 'error',
                confirmButtonText: t('general.ok')
            });
        }
    };

    return {
    handleFormDeleteMulti,
    handleFormRestoreMulti,
    formStatus,
    loading,
    error
    };
}

export default useCustomFormMulti;
