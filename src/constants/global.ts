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
const Url: string = (window as any).restAPI || '';

export { Url };
