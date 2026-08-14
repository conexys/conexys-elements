/**
 * @fileoverview
 * @module ThemeContext
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeMode, ThemeContextType } from './types/themecontext.types';
import type { ChildrenProps } from './types/common';

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useThemeContext must be used within a ThemeContextProvider',
    );
  }
  return context;
};

// Define themes outside the component
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#262c33',
          color: '#ffffff',
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ecedf0',
    },
  },
});

// Theme context provider
export const ThemeContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const getInitialMode = (): ThemeMode => {
    const savedMode = localStorage.getItem('displaymode') as ThemeMode;
    if (savedMode) {
      return savedMode;
    }
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDarkMode ? 'dark' : 'light';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode: ThemeMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('displaymode', newMode);
      return newMode;
    });
  }, []);

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('displaymode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

    return () =>
      darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
