/**
 * @fileoverview
 */

export interface Language {
  languages_id: string | number;
  dir: string;
}

export interface LanguagesResponse {
  data: Language[];
}
