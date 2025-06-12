/**
 * @fileoverview
 * List of constants used in the system
 * @module constants/global
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

/**
 * Base URL for making requests to the REST API.
 * @type {string}
 */
const Url = window.restAPI || '';

// Log to console if the environment variable is set to 'true'
if(import.meta.env.VITE_SHOW_CONSOLE === 'true'){
    console.log('%c [Conexys] ', 'color: #55ff00', 'Console enabled -> Global request');
};

export { Url };
