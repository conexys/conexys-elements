/**
 * @fileoverview
 * This code defines a functional component called AppDataSettings that makes an HTTP request using the axios library to obtain configuration data from a server.
 * This component is used to make an HTTP request for configuration data and renders the content of that data once the request is successfully completed. The local post state is used to handle the request response and control conditional rendering.
 * @module components/AppDataSettings
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires ../constants/global
 * @requires ../services/postServiceExtended
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Url } from '../constants/global.jsx';
import { serviceData } from '../services/postServiceExtended.jsx'; 
import PropTypes from 'prop-types';

/**
 * Component for fetching and displaying application data settings.
 * @param {Object} props - Component properties.
 * @param {string} props.keys - Keys for fetching settings.
 * @returns {JSX.Element|null} Rendered component or null if data is not available.
 */
export default function AppDataSettings({keys}) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const postURL = Url + "getsettings";
    const key = { keys: keys };

    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            await serviceData(postURL, key, config, setPost);
        } catch (err) {
            setError(true);
            console.error('Error fetching data:', err);
        }
    }, [postURL, key, config]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // If data is not available, return null
    if (!post) return null;

    return (
        <>
            {error ? <div>Error loading data</div> : post}
        </>
    );

};

AppDataSettings.propTypes = {
    keys: PropTypes.string.isRequired,
};
