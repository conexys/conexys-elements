/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalGetPost
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires axios
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires react-i18next
 * @requires ../services/postFormServiceGetPost
 * @requires ../services/deleteFormService
 * @requires @fingerprintjs/fingerprintjs
 */

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormServiceGetPost from '../services/postFormServiceGetPost.jsx';
import deleteFormService from '../services/deleteFormService.jsx';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';

/**
 * Custom React hook for handling form submissions, updates, and deletions.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} postServerURL - The URL for submitting form data.
 * @param {string} getServerURL - The URL for fetching form data.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} id - The identifier for the form data.
 * @returns {Object} An object containing functions and states for form handling.
 */
const useCustomForm = (fpHash, postServerURL, getServerURL, deleteServerURL, id) => { //setAuth if true it is to store the session start data, only use for login.
    const [t] = useTranslation("global");
    const MySwal = withReactContent(SweetAlert2);
    const [formInputs, setFormInputs] = useState({});
    const [formStatus, setFormStatus] = useState(false); //Check if the form accepted everything and was correct to close the modal.
    const [checkdata, setCheckdata] = useState(false) ;//Delete the data that is in the form.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    

    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in
    const iditem = id;
    //SET DATA FORM (sends the data to the backend to update the data in the database.)
    const authorization = true;

    /**
     * Handles the form submission.
     *
     * @param {Event} event - The form submission event.
     * @returns {Promise<void>} A promise that resolves after handling the submission.
     */
    const handleFormSubmit = async (event) => {
        MySwal.fire({
            title: '<p>'+t('Plugin.installing')+'</p>',
            html: '<object data="../public/gear-spinner.svg" type="image/svg+xml" width="100"></object>',
            showCancelButton: false,
            showCloseButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            confirmButtonText: t('general.ok')
        });
        const visitorIdHash = await getOrSetFingerprint(fpHash);

        event.preventDefault();
        try {
            const dataform = await postFormServiceGetPost.postFormServiceGetPost({
                iditem,
                sessionID,
                cxauthxc,
                postServerURL,
                authorization,
                fingerprint: visitorIdHash,
                event
            });
            setFormStatus(true); //Check if the form accepted everything and was correct to close the modal.
            setCheckdata(false); //Delete the data that is in the form.
            if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
                console.log('%c [Conexys] ', 'color: #55ff00', dataform);
            };
            //MUESTRA UN RESULTADO (Do this Optional)
            MySwal.fire({
                title: '<p>'+t('Plugin.completeinstallation')+'</p>',
                icon: 'success',
                confirmButtonText: t('general.ok')
            }).then((result) => {
                if (dataform.data === 'plugins_instal_successfully'){
                    window.location.reload();
                }
            });
        } catch (err) {
            setError(true);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };
    //SET DATA FORM

    //DELETE
    /**
     * Handles the form deletion.
     *
     * @param {Object} event - The deletion event.
     * @param {string} event.id - The identifier for the data to be deleted.
     * @returns {Promise<void>} A promise that resolves after handling the deletion.
     */
    const handleFormDelete = async (event) => {
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
            if (dataform.data === 'plugins_deleted_successfully'){
                MySwal.fire({
                    title: '<p>Desinstalacion completa</p>',
                    icon: 'success',
                    confirmButtonText: t('general.ok')
                }).then((result) => {
                    window.location.reload();
                });
            }
        } catch (err) {
            setError(true);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };
    //DELETE

    /**
     * Handles form input changes.
     *
     * @param {Event} event - The input change event.
     */
    const handleInputChange = (event) => {
        event.persist();
        setFormInputs((formInputs) => ({
            ...formInputs,
            [event.target.name]: event.target.value
        }));
        setFormStatus(false); //Check if the form accepted everything and was correct to close the modal.
    }

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

    //GET DATA FORM (reads the data stored in the sel backend database)
    const config = useMemo(() => ({
        headers: {
            'Authorization': cxauthxc,
            'Content-Type': 'application/json'
        }
    }), [cxauthxc]);
    //const key = { sessionID: sessionID, itemID: id, fingerprint: fingerprint }

    if (id === ''){ //Delete the data that is in the form.
        if (checkdata === false){
            setCheckdata(true);
            Object.keys(formInputs).forEach(
                (key) => (formInputs[key] !== null) ? formInputs[key] = '' : formInputs[key]
            );
        };
    };

    useEffect(() => {
        const setFp = async () => {
            setCheckdata(false); //Delete the data that is in the form.
            if (id !== ''){
                const visitorIdHash = await getOrSetFingerprint(fpHash);
                const key = { sessionID: sessionID, itemID: id, fingerprint: visitorIdHash };
                try {
                    const response = await axios.post(getServerURL, key, config);
                    if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
                        console.log('%c [Conexys] [Request] ', 'color: #55ff00', getServerURL);
                    }
                    setFormInputs(response.data.data[0]);
                } catch (error) {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('error.token_has_expired'));
                    setError(true);
                } finally {
                    setLoading(false);
                }
                setFormStatus(false); //Check if the form accepted everything and was correct to close the modal.
            };
        };
        setFp();
    }, [id]);
    //GET DATA FORM

    return {
    handleFormSubmit,
    handleInputChange,
    handleFormDelete,
    formInputs,
    formStatus,
    setFormStatus,
    loading,
    error
    };
};

export default useCustomForm;
