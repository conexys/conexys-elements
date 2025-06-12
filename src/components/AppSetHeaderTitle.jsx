/**
 * @fileoverview
 * The AppSetHeaderTitle component is responsible for managing the page title, based on the configuration obtained from the backend.
 * This component is useful to dynamically set the page title based on the configuration obtained from the backend. Make sure that the paths and data used in this component are configured correctly in your application and in the backend. Also, note that HelmetProvider and Helmet are designed to handle the <head> meta tag in React.
 * @module components/AppSetHeaderTitle
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires react-helmet-async
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Functional component to dynamically set the page title based on settings.
 * @param {Object} props - Component properties.
 * @param {string} props.keys - Keys used for fetching settings.
 * @param {string} props.title - Base title for the page.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppSetHeaderTitle({keys, title, baseUrl, serviceData}) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const baseURL = baseUrl + "getsettings";
    const key = { keys: keys };

    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);

    /**
     * Fetches settings and updates the component state.
     */
    const fetchData = useCallback(async () => {
        try {
            await serviceData(baseURL, key, config, setPost);
        } catch (err) {
            setError(true);
            console.error('Error fetching data:', err);
        }
    }, [baseURL, key, config, serviceData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (error) {
        return <div>Error loading title</div>;
    }

    if (!post) return null;

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title} - {post}</title>
            </Helmet>
        </HelmetProvider>
    );

};

AppSetHeaderTitle.propTypes = {
    keys: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    serviceData: PropTypes.func.isRequired
};


