/**
 * @fileoverview
 */

export interface PasswordConfiguration {
  numbers: boolean;
  symbols: boolean;
  capitalletters: boolean;
  lowercase: boolean;
  numberOfCharacters: number;
}

export interface CharacterSets {
  numbers: string;
  symbols: string;
  capitalletters: string;
  lowercase: string;
}
