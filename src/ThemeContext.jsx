import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create context
const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

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
export const ThemeContextProvider = ({ children }) => {
    const getInitialMode = () => {
        const savedMode = localStorage.getItem("displaymode");
        if (savedMode) {
            return savedMode;
        }
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? 'dark' : 'light';
    };

    const [mode, setMode] = useState(getInitialMode);

    const toggleColorMode = useCallback(() => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem("displaymode", newMode);
            return newMode;
        });
    }, []);

    const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

    useEffect(() => {
        const handleSystemThemeChange = (e) => {
            if (!localStorage.getItem("displaymode")) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    if(import.meta.env.VITE_SHOW_CONSOLE === 'false'){
        console.clear();
    }

    return (
        <ThemeContext.Provider value={{ toggleColorMode, mode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};