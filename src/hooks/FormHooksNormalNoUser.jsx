/**
 * @fileoverview
 * Designed to upload data from a form without a user and without downloading data from the database (Loading, forgotpassword, signup and others).
 * @module hooks/FormHooksNormalNoUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 * @requires react-i18next
 * @requires ../services/postFormService
 * @requires ../Auth
 * @requires react-router-dom
 * @requires ../constants/global
 * @requires @fingerprintjs/fingerprintjs
 * @requires axios
 */

import { useState } from "react";
import SweetAlert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import postFormService from '../services/postFormService.jsx';
import { useAuth } from "../Auth.jsx";
import { Navigate } from 'react-router-dom';
import { Url } from '../constants/global.jsx';
import axios from "axios";
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';

/**
 * Custom React hook for handling form submissions.
 *
 * @param {string} postServerURL - The URL for posting form data.
 * @param {boolean} setAuth - Indicates whether to update authentication tokens.
 * @param {string} message - Success message to be displayed in the alert.
 * @returns {Object} An object containing functions and states for form handling.
 */
const useCustomForm = (postServerURL, setAuth, message) => { //setAuth if true it is to store the session start data, only use for login.
    const { setAuthTokens } = useAuth();
    const [t] = useTranslation("global");
    const MySwal = withReactContent(SweetAlert2);
    const [formInputs, setFormInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    

    //SET DATA FORM (sends the data to the backend to update the data in the database.)
    /**
     * Handles the submission of the form data.
     *
     * @param {Object} event - The form submission event.
     * @returns {Promise<void>} A promise that resolves after handling the form submission.
     */
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const visitorId = await getOrSetFingerprint();
        //VERIFICATION OF ERRORS IN THE FIELDS
        var error = false;
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length
        while ( i-- ) {
            values.push( localStorage.getItem(keys[i]) )
            if (localStorage.getItem(keys[i]) === "errorfoundfield") {
                error = true;
                MySwal.fire({
                    title: '<p>'+t('error.checkthefields')+'</p>',
                    icon: 'error',
                    confirmButtonText: t('accept.Aceptar')
                });
            };
        };
        const logindir = "/login";
        //VERIFICATION OF ERRORS IN THE FIELDS
        const authorization = false;
        if (error === false){
            try {
                const dataform = await postFormService.postFormService({
                    postServerURL,
                    authorization,
                    fingerprint: visitorId,
                    event
                });
                if (setAuth === true){
                    if (dataform.data.v2fa === 'true'){
                        var authorized = false;
                        MySwal.fire({
                            title: t('login.twostepverificationcode'),
                            input: "text",
                            inputAttributes: {
                                autocapitalize: "off"
                            },
                            showCancelButton: true,
                            confirmButtonText: t('general.validate'),
                            showLoaderOnConfirm: true,
                            preConfirm: async (login) => {
                                try {
                                    const postServerURL2 = Url + "authTwostep";
                                    var config;
                                    config = {
                                        headers: {
                                            'Authorization': dataform.data.auth,
                                            'Content-Type': 'application/json'
                                        }
                                    };
                                    var dataload = dataform.data;
                                    dataload = [].concat(dataload, visitorId);
                                    dataload = [].concat(dataload, login);
                                    await axios.post(postServerURL2, dataload, config);
                                    authorized = true;
                                } catch (error) {
                                    MySwal.showValidationMessage(t('error.incorrectvalidationcode'));
                                }
                            },
                            allowOutsideClick: () => !MySwal.isLoading()
                        }).then((result) => {
                            if (authorized === true){
                                if(import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true'){
                                    console.log('%c [Conexys] [Data] ', 'color: #55ff00', 'Authorised');
                                }
                                setAuthTokens(dataform);
                            } else {
                                console.log('%c [Conexys] [Error] ', 'color: #fc0000', 'Unauthorised');
                            }
                        });
                    } else {
                        setAuthTokens(dataform);
                    }
                }
                if (message){
                    MySwal.fire({
                        title: '<p>'+message+'</p>',
                        icon: 'success',
                        confirmButtonText: '<a class="swal2-confirm swal2-styled" style="background-color: rgb(48, 133, 214); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);" href="'+logindir+'">'+t('general.ok')+'</a>'
                    }).then((result) => {
                        return <Navigate to={logindir} /> //Check if it is working, in principle it is not.
                    });
                };
            } catch (err) {
                setError(true);
                handleError(err);
            } finally {
                setLoading(false);
            }
        };
    };
    //SET DATA FORM

    /**
     * Handles changes in form input values.
     *
     * @param {Object} event - The input change event.
     */
    const handleInputChange = (event) => {
        event.persist();
        setFormInputs((formInputs) => ({
            ...formInputs,
            [event.target.name]: event.target.value
        }));
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

    return {
    handleFormSubmit,
    handleInputChange,
    formInputs,
    loading,
    error
    };
};

export default useCustomForm;
