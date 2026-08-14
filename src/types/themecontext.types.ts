/**
 * @fileoverview
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  toggleColorMode: () => void;
  mode: ThemeMode;
}
