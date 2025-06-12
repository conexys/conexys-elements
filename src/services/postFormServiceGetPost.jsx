/**
 * @fileoverview
 * This back end uses Axios to make a POST request to the server with form data, including the ability to handle files.
 * This postFormServiceGetPost module uses FormData to build the form payload and makes a POST request to the server. The function handles both success and errors of the request and returns the response data or an error object.
 * @module services/postFormServiceGetPost
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires axios
 */

import axios from "axios";

/**
 * Service function for posting form data, including files, to the server.
 *
 * @param {Object} datauser - User data object.
 * @param {string} datauser.postServerURL - Server URL for posting form data.
 * @param {boolean} datauser.authorization - Flag indicating whether authorization is required.
 * @param {Object} datauser.event - Form event object containing user input data.
 * @param {string} datauser.iditem - Identifier for the form item.
 * @param {string} datauser.sessionID - User session identifier.
 * @param {string} datauser.fingerprint - Fingerprint for user identification.
 * @param {string} datauser.cxauthxc - Authorization token (if authorization is required).
 *
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
const postFormServiceGetPost = async datauser => {
    const postServerURL = datauser.postServerURL;
    const authorization = datauser.authorization;
    var formData = new FormData();
    for (const element of datauser.event.target) { //Reads each of the incoming data to form a new array with the form data.
        if (element.type === 'file'){
            const file = element.files[0];
            formData.append("file", file);
        } else {
            if (element.name !== ''){
                formData.append(element.name, element.value);
            };
        };
    };
    formData.append('iditem', datauser.iditem);
    formData.append('sessionID', datauser.sessionID);
    formData.append('fingerprint', datauser.fingerprint);
    delete(datauser.event);
    delete(datauser.postServerURL);
    delete(datauser.authorization);
    var config;
    if (authorization === true) {
        config = {
            headers: {
                'Authorization': datauser.cxauthxc,
                'Content-Type': 'multipart/form-data'
            }
        };
    } else {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
    };
    try {
        const { data } = await axios.post(postServerURL, formData, config);
        if(import.meta.env.REACT_APP_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', postServerURL);
        };
        return data;
    } catch (error) {
        console.error('Error posting form data:', error);
        throw error;
    }
};

export default { postFormServiceGetPost };
