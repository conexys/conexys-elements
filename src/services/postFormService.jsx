/**
 * @fileoverview
 * This module is a utility for making POST requests to a server with form data.
 * @module services/postFormService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires axios
 */

import axios from "axios";

/**
 * Service function for posting form data to the server.
 *
 * @param {Object} datauser - User data object.
 * @param {string} datauser.postServerURL - Server URL for posting form data.
 * @param {boolean} datauser.authorization - Flag indicating whether authorization is required.
 * @param {Object} datauser.event - Form event object containing user input data.
 * @param {string} datauser.fingerprint - Fingerprint for user identification.
 * @param {string} datauser.cxauthxc - Authorization token (if authorization is required).
 *
 * @returns {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
const postFormService = async datauser => {
    const postServerURL = datauser.postServerURL;
    const authorization = datauser.authorization;
    var valueToPush = { };
    var $previousdata;
    for (const element of datauser.event.target) { //Reads each of the incoming data to form a new array with the form data.
        if (element.name !== ''){
            if (valueToPush[element.name] !== undefined) { //checks that the field does not repeat, if it does, it joins the data together. This is used for "Multiple selection".
                $previousdata = valueToPush[element.name];
                valueToPush[element.name] = $previousdata + ',' + element.value;
            } else {
                valueToPush[element.name] = element.value;
            }
        };
    };
    valueToPush['fingerprint'] = datauser.fingerprint;
    delete(datauser.event);
    delete(datauser.postServerURL);
    delete(datauser.authorization);
    var dataload = datauser;
    var datasend;
    dataload = [].concat(dataload, valueToPush);

    var config;
    if (authorization === true) {
        config = {
            headers: {
                'Authorization': datauser.cxauthxc,
                'Content-Type': 'application/json'
            }
        };
        datasend = dataload;
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        datasend = dataload[1];
    };
    
    try {
        const { data } = await axios.post(postServerURL, datasend, config);
        if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
            console.log('%c [Conexys] [Request] ', 'color: #55ff00', postServerURL);
        };
        return data;
    } catch (error) {
        console.error('Error posting form data:', error);
        throw error;
    }
};

export default { postFormService };

