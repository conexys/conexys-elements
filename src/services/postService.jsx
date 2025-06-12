/**
 * @fileoverview
 * This back end uses Axios to make a POST request to the server with JSON data.
 * This postservice function uses Axios to make a POST request to the server with JSON data. The function handles both success and errors in the request and returns the response data or an error object. You can adjust the error handling logic according to your specific needs.
 * @module services/postService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires axios
 * @requires ../constants/global
 */

import axios from "axios";
import { Url } from '../constants/global.jsx';

/**
 * Service function for making a POST request to the server.
 *
 * @param {Object} datauser - User data object.
 * @param {string} datauser.postServerURL - Server URL for the POST request.
 * @param {boolean} datauser.authorization - Flag indicating whether authorization is required.
 * @param {string} datauser.cxauthxc - Authorization token (if authorization is required).
 *
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
export const postservice = async datauser => {
    const postURL = Url + datauser.postServerURL;
    const authorization = datauser.authorization;
    var config;
    if (authorization === true) {
        config = {
            headers: {
                'Authorization': datauser.cxauthxc,
                'Content-Type': 'application/json'
            }
        };
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    };
    delete(datauser.postServerURL);
    delete(datauser.authorization);

    try {
        const { data } = await axios.post(postURL, datauser, config);
        if(import.meta.env.REACT_APP_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', postURL);
        };
        return data;
    } catch (error) {
        console.error('Error posting form data:', error);
        throw error;
    }
};

export default { postservice };