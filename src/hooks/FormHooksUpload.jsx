/**
 * @fileoverview
 * Designed to download current data from the database and update the values.
 * @module hooks/FormHooksIpload
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires axios
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires ../services/postFormService
 * @requires react-i18next
 * @requires ../components/index
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import postFormService from '../services/postFormService.jsx';
import { useTranslation } from 'react-i18next';
import { Uservalidationerror } from "../components/index.jsx";
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';

/**
 * Custom React hook for handling form submissions with optional feedback.
 *
 * @param {string} fpHash - Hash for fingerprint identification (optional).
 * @param {string} getServerURL - URL for getting data from the server.
 * @param {string} postServerURL - URL for posting form data to the server.
 * @param {string} feedback - Success message to be displayed in the alert (optional).
 * @param {string} id - Identifier for the form data.
 * @param {boolean} reset - Indicates whether to reset the form after submission.
 * @returns {Object} An object containing functions and states for form handling.
 */
const useCustomForm = (fpHash, getServerURL, postServerURL, feedback, id, reset = false) => {
    const [t] = useTranslation("global");
    const MySwal = withReactContent(SweetAlert2);
    
    const [formInputs, setFormInputs] = useState({});
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in

    //SET DATA FORM (sends the data to the backend to update the data in the database.)
    const authorization = true;

    /**
     * Handles the submission of the form data.
     *
     * @param {Object} event - The form submission event.
     * @returns {Promise<void>} A promise that resolves after handling the form submission.
     */
    const handleFormSubmit = async (event) => {
        const visitorIdHash = await getOrSetFingerprint(fpHash);
        // Check the name attribute to determine which button was clicked
        const ButtonPressed = event.nativeEvent.submitter.id; //If the button has a button ID you can identify which button has been clicked to send it to the backend. This is used for messaging buttons, whether it is sent or in draft.
        event.preventDefault();
        try {
            const dataform = await postFormService.postFormService({
                sessionID,
                cxauthxc,
                postServerURL,
                authorization,
                fingerprint: visitorIdHash,
                event,
                id,
                ButtonPressed: ButtonPressed
            });
            if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
                console.log('%c [Conexys] ', 'color: #55ff00', dataform);
            };
            setResult(dataform);

            if(feedback){
                MySwal.fire({
                    title: '<p>'+feedback+'</p>',
                    icon: 'success',
                    confirmButtonText: t('general.ok')
                }).then((result) => {
                    if (result.isConfirmed) {
                        setResult('')
                        if (reset === true){
                            window.location.reload();
                        }
                    }
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

    /**
     * Handles changes in form input values.
     *
     * @param {Object} event - The input change event.
     */
    const handleInputChange = useCallback((event) => {
        event.persist();
        setFormInputs((prevInputs) => ({
            ...prevInputs,
            [event.target.name]: event.target.value
        }));
    }, []);

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
            if (feedback) {
                MySwal.fire({
                    title: `<p>${t('login.password_is_not_correct')}</p>`,
                    icon: 'error',
                    confirmButtonText: t('general.ok')
                });
            } else {
                MySwal.fire({
                    title: `<p>${t('login.invalid_data_username_mail')}</p>`,
                    icon: 'error',
                    confirmButtonText: t('general.ok')
                });
                Uservalidationerror();
            }
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

        if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
            console.error('%c [Conexys] [Error] ', 'color: #fc0000', err);
        }
    };

    //GET DATA FORM (reads the data stored in the sel backend database)
    const config = useMemo(() => ({
        headers: {
            'Authorization': cxauthxc,
            'Content-Type': 'application/json'
        }
    }), [cxauthxc]);
    //const key = { sessionID: sessionID, fingerprint: fingerprint }

    useEffect(() => {
        const setFp = async () => {
            const visitorIdHash = await getOrSetFingerprint(fpHash);
            const key = { sessionID: sessionID, itemID: id, fingerprint: visitorIdHash };
            try {
                const response = await axios.post(getServerURL, key, config);

                if (import.meta.env.VITE_SHOW_CONSOLE === 'true') {
                    console.log('%c [Conexys] [Request] ', 'color: #55ff00', getServerURL);
                }

                setFormInputs(response.data.data[0]);
            } catch (error) {
                console.error('%c [Conexys] [Error] ', 'color: #fc0000', t('error.token_has_expired'));
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        setFp();
    }, [id]);
    //GET DATA FORM

    return {
    handleFormSubmit,
    handleInputChange,
    formInputs, 
    result,
    loading,
    error
    };
};

export default useCustomForm;
