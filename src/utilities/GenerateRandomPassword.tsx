/**
 * @fileoverview
 * Password Generator
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @module utilities/GenerateRandomPassword
 */

import type {
  PasswordConfiguration,
  CharacterSets,
} from '../types/utilities/generateRandomPassword.types';

/**
 * Generates a random password based on the given configuration.
 *
 * @param {PasswordConfiguration} configuration - Configuration object for password generation.
 * @param {boolean} configuration.numbers - Include numbers in the password.
 * @param {boolean} configuration.symbols - Include symbols in the password.
 * @param {boolean} configuration.capitalletters - Include capital letters in the password.
 * @param {boolean} configuration.lowercase - Include lowercase letters in the password.
 * @param {number} configuration.numberOfCharacters - Number of characters in the password.
 *
 * @returns {string} Generated password.
 */
function GenerateRandomPassword(configuration: PasswordConfiguration): string {
  const characters: CharacterSets = {
    numbers: '0123456789',
    symbols: '!@#$%^&*()_-+={[}]|:;<,>.?/',
    capitalletters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
  };

  let charactersFinals: string = '';
  let password: string = '';

  Object.keys(configuration).forEach((property: string) => {
    if (
      configuration[property as keyof PasswordConfiguration] === true &&
      characters[property as keyof CharacterSets]
    ) {
      charactersFinals += characters[property as keyof CharacterSets];
    }
  });

  charactersFinals += characters.lowercase;

  for (let i = 0; i < configuration.numberOfCharacters; i++) {
    password +=
      charactersFinals[Math.floor(Math.random() * charactersFinals.length)];
  }

  return password;
}

export default GenerateRandomPassword;
