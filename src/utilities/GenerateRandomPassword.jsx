/**
 * @fileoverview
 * Password Generator
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @module utilities/GenerateRandomPassword
 */


/**
 * Generates a random password based on the given configuration.
 *
 * @param {Object} configuration - Configuration object for password generation.
 * @param {boolean} configuration.numbers - Include numbers in the password.
 * @param {boolean} configuration.symbols - Include symbols in the password.
 * @param {boolean} configuration.capitalletters - Include capital letters in the password.
 * @param {boolean} configuration.lowercase - Include lowercase letters in the password.
 * @param {number} configuration.numberOfCharacters - Number of characters in the password.
 *
 * @returns {string} Generated password.
 */
function GenerateRandomPassword(configuration) {
    const characters = {
        numbers: '0123456789',
        symbols: '!@#$%^&*()_-+={[}]|:;<,>.?/',
        capitalletters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz'
    };

    let charactersFinals = '';
    let password = '';

    Object.keys(configuration).forEach(property => {
        if (configuration[property] === true && characters[property]) {
            charactersFinals += characters[property];
        }
    });

    charactersFinals += characters.lowercase;

    for (let i = 0; i < configuration.numberOfCharacters; i++) {
        password += charactersFinals[Math.floor(Math.random() * charactersFinals.length)];
    }

    return password;
}

export default GenerateRandomPassword;