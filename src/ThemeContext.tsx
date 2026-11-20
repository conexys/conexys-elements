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

const THEME_HOST_ID = 'themeclass';

const getThemeHostElement = (): HTMLElement =>
  document.getElementById(THEME_HOST_ID) ?? document.documentElement;

/**
 * Active theme mode, as published by the host application.
 *
 * The `dark` class is the visual truth, so it is read first: a plugin must
 * follow the host even if `localStorage` lags behind. When there is no class
 * yet (early mount), the canonical stored value is used, and finally the
 * system preference. Legacy values (`'true'`/`'false'`) are ignored.
 */
const readHostMode = (): ThemeMode => {
  if (getThemeHostElement().classList.contains('dark')) {
    return 'dark';
  }

  const savedMode = localStorage.getItem('displaymode');
  if (savedMode === 'dark' || savedMode === 'light') {
    return savedMode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getInitialMode = (): ThemeMode => readHostMode();

// Theme context provider
export const ThemeContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode: ThemeMode = prevMode === 'light' ? 'dark' : 'light';
      // Both signals are updated synchronously (and idempotently, so the
      // double invocation of StrictMode is harmless): the class observer
      // cannot read a stale mode between this update and the effect that
      // commits `mode`.
      localStorage.setItem('displaymode', newMode);
      getThemeHostElement().classList.toggle('dark', newMode === 'dark');
      return newMode;
    });
  }, []);

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  // Single source of truth for the CSS theme class.
  //
  // The `dark` class on <html id="themeclass"> drives the legacy CSS in
  // theme.css (`html.dark ...`). It MUST follow `mode` on every change, not
  // only on mount: when the host changes the theme, components keeping their
  // own copy of the state would leave the class (i.e. the page background)
  // stale.
  useEffect(() => {
    getThemeHostElement().classList.toggle('dark', mode === 'dark');
  }, [mode]);

  // Follow theme changes made outside this provider.
  //
  // A plugin is mounted in its own ReactDOM root, so the ThemeProvider of the
  // host application does not reach it: the provider of the plugin would keep
  // the mode captured on mount and MUI components (tables, dialogs...) would
  // not repaint. The host publishes the active mode by toggling the `dark`
  // class and writing `displaymode`, so observing both keeps every React tree
  // in sync.
  const syncWithHost = useCallback((): void => {
    const nextMode = readHostMode();
    setMode((prevMode) => (prevMode === nextMode ? prevMode : nextMode));
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(syncWithHost);
    observer.observe(getThemeHostElement(), {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cross-tab changes and focus recovery.
    window.addEventListener('storage', syncWithHost);
    window.addEventListener('focus', syncWithHost);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', syncWithHost);
      window.removeEventListener('focus', syncWithHost);
    };
  }, [syncWithHost]);

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
