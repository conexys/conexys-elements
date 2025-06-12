/**
 * @fileoverview
 * This module exports utility functions for checking the existence of a username and email using API calls.
 * Checks if the username and email, for a new registration, already exist.
 * This code contains two functions (checkExistsUsername and checkExistsMail) that check whether a username or email address already exists in the system for a new registration.
 * These functions are used to perform asynchronous checks for the existence of a user name or e-mail address in the system during a registration process.
 * @module utils/checkExists
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @see checkExistsUsername
 * @see checkExistsMail
 * @requires axios
 * @requires ../../constants/global
 */

import axios from "axios";
import { Url } from '../../../../constants/global.jsx';

/**
 * URL for checking the existence of a username.
 * @type {string}
 */
const postURLusername = Url + "checkusername";

/**
 * URL for checking the existence of an email.
 * @type {string}
 */
const postURLmail = Url + "checkmail";

/**
 * Axios configuration for API calls.
 * @type {object}
 */
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * Asynchronously checks the existence of a username using an API call.
 * @async
 * @function
 * @param {string} value - The username to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the username is valid, otherwise false.
 */
const checkExistsUsername = async value => {
    try {
        const { data } = await axios.post(postURLusername, value, config);
        if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', postURLusername);
        };
        return data.data.result === 'Valid';
    } catch (err) {
        return false;
    };
};

/**
 * Asynchronously checks the existence of an email using an API call.
 * @async
 * @function
 * @param {string} value - The email to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the email is valid, otherwise false.
 */
const checkExistsMail = async value => {
    try {
        const { data } = await axios.post(postURLmail, value, config);
        if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', postURLmail);
        };
        return data.data.result === 'Valid';
    } catch (err) {
        return false;
    };
};

export { checkExistsUsername, checkExistsMail };