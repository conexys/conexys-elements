/**
 * @fileoverview
 * This file contains a service module for making kill requests to a server using Axios.
 * This deleteFormService module exports an asynchronous function that makes a POST request to the server using Axios. The function takes a datauser object as a parameter, from which cxauthxc, deleteServerURL, and other data is extracted and sent in the body of the request. The function handles both success and errors in the request and returns the response data or an error object.
 * This type of module is useful for centralising the logic for handling delete requests and reusing it in different parts of your application.
 * @module services/deleteFormService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires axios
 */

import axios from "axios";

/**
 * Service function for deleting form data.
 *
 * @param {Object} datauser - User data object.
 * @param {string} datauser.cxauthxc - Authorization token.
 * @param {string} datauser.deleteServerURL - Server URL for deleting form data.
 * @param {Object} datauser - Additional data to be sent for deletion.
 *
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 */
const deleteFormService = async datauser => {
    const cxauthxc = datauser.cxauthxc;
    const deleteServerURL = datauser.deleteServerURL;
    delete(datauser.deleteServerURL);
    var datasend = datauser;

    const config = {
        headers: {
            'Authorization': cxauthxc,
            'Content-Type': 'application/json'
        }
    };

    try {
        const { data } = await axios.post(deleteServerURL, datasend, config);
        if(import.meta.env.REACT_APP_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', deleteServerURL);
        };
        return data;
    } catch (error) {
        console.error('Error deleting form data:', error);
        throw error;
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { deleteFormService };