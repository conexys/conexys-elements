/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * The useCustomForm hook is a custom hook designed to handle form logic, specifically in the context of forms that are not linked to specific users and do not download data from the database, such as registration forms, password recovery forms, etc.
 * @module hooks/FormHooksNormal
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires axios
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires react-i18next
 * @requires ../services/postFormService
 * @requires ../services/deleteFormService
 * @requires ../services/restoreFormService
 * @requires @fingerprintjs/fingerprintjs
 */

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormService from '../services/postFormService.jsx';
import deleteFormService from '../services/deleteFormService.jsx';
import restoreFormService from '../services/restoreFormService.jsx';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';
import { Url } from '../constants/global.jsx';

/**
 * Custom React hook for handling form submissions, updates, and deletions.
 *
 * @param {string} fpHash - The fingerprint hash for user identification.
 * @param {string} postServerURL - The URL for submitting form data.
 * @param {string} getServerURL - The URL for fetching form data.
 * @param {string} deleteServerURL - The URL for deleting form data.
 * @param {string} restoreServerURL - The URL for deleting form data.
 * @param {string} id - The identifier for the form data.
 * @param {string} feedback - Feedback message to display on successful form submission.
 * @returns {Object} An object containing functions and states for form handling.
 */
const useCustomForm = (fpHash, postServerURL, getServerURL, deleteServerURL, id, restoreServerURL, feedback) => { //setAuth if true it is to store the session start data, only use for login.
    const [t] = useTranslation("global");
    const MySwal = withReactContent(SweetAlert2);
    const [formInputs, setFormInputs] = useState({});
    const [formStatus, setFormStatus] = useState(false); //Check if the form accepted everything and was correct to close the modal.
    const [checkdata, setCheckdata] = useState(false); //Delete the data that is in the form.
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in
    const iditem = id;
    //SET DATA FORM (sends the data to the backend to update the data in the database.)
    const authorization = true;

    const updateDataUser = async (visitorIdHash) => {
        const getProfile = Url + "getprofile"; // Ajusta la URL según tu configuración
        
        try {
            const response = await axios.post(getProfile, 
                { sessionID, fingerprint: visitorIdHash }, 
                config
            );

            if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
                console.log('%c [Conexys] [Request] ', 'color: #55ff00', getProfile);
            }

            localStorage.setItem("datauser", JSON.stringify({
                name: response.data.data[0].name,
                lastname: response.data.data[0].lastname,
                email: response.data.data[0].email,
                username: response.data.data[0].username,
                language: response.data.data[0].language
            }));
        } catch (error) {
            console.error('%c [Conexys] [Error] ', 'color: #fc0000', t('error.token_has_expired'));
        }
    };

    /**
     * Handles the form submission.
     *
     * @param {Event} event - The form submission event.
     * @returns {Promise<void>} A promise that resolves after handling the submission.
     */
    const handleFormSubmit = async (event) => {
        const visitorIdHash = await getOrSetFingerprint(fpHash);
        // Check the name attribute to determine which button was clicked
        const ButtonPressed = event.nativeEvent.submitter.id; //If the button has a button ID you can identify which button has been clicked to send it to the backend. This is used for messaging buttons, whether it is sent or in draft.
        event.preventDefault();
        try {
            const dataform = await postFormService.postFormService({
                iditem,
                sessionID,
                cxauthxc,
                postServerURL,
                authorization,
                fingerprint: visitorIdHash,
                event,
                ButtonPressed: ButtonPressed
            });
            setFormStatus(true); //Check if the form accepted everything and was correct to close the modal.
            setCheckdata(false); //Delete the data that is in the form.
            
            if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
                console.log('%c [Conexys] ', 'color: #55ff00', dataform);
            };

            setResult(dataform);

            // Actualiza el localStorage datauser después de un envío exitoso
            if (sessionID) {
                await updateDataUser(visitorIdHash);
            }

            if(feedback){
                MySwal.fire({
                    title: '<p>'+feedback+'</p>',
                    icon: 'success',
                    confirmButtonText: t('general.ok')
                });
            };
            
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
     * Handles the form deletion.
     *
     * @param {Object} event - The deletion event.
     * @param {string} event.id - The identifier for the data to be deleted.
     * @returns {Promise<void>} A promise that resolves after handling the deletion.
     */
    const handleFormRestore = async (event) => {
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
    };

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
    handleFormRestore,
    formInputs,
    formStatus,
    setFormStatus,
    loading,
    error,
    result
    };
};

export default useCustomForm;
