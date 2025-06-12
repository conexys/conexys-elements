/**
 * @fileoverview
 * This code defines a functional component called AppFormFieldsNoUser, which is similar to AppFormFields but is designed to be used when the user is not authenticated.
 * This component is used to render a form dynamically when the user is not authenticated, using a unique fingerprint to identify the user instead of authentication. The form is rendered based on the configuration provided by the server.
 * @module components/AppFormFieldsNoUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires axios
 * @requires ../constants/global
 * @requires react-i18next
 * @requires ./index
 * @requires ../hooks/FormHooksNormalNoUser
 * @requires @fingerprintjs/fingerprintjs
 * @requires ../services/postServiceExtended
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Url } from '../constants/global.jsx';
import { useTranslation } from 'react-i18next';
import { RenderForm } from "./index.jsx";
import useCustomForm from "../hooks/FormHooksNormalNoUser.jsx";
import { serviceData } from '../services/postServiceExtended.jsx';
import PropTypes from 'prop-types';
import { getOrSetFingerprint } from '../shared/baseFingerprintService.jsx';

/**
 * Component for rendering a form with dynamic fields when user authentication is not required.
 * @param {Object} props - Component properties.
 * @param {string} props.children - Child components to be rendered within the form.
 * @param {string} props.name - Name of the form.
 * @param {string} props.postURL - URL for posting form data to the backend.
 * @param {string} props.postServerURL - URL for posting form data to the server.
 * @param {Object} props.additionalfields - Additional fields for the form.
 * @param {string} props.className - CSS class name for styling.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppFormFieldsNoUser({children, name, postURL, postServerURL, additionalfields, className}) {
    const [t] = useTranslation("global");

    //FINGERPRINT, Unique ID security system for the PC user navigator
    const fingerprint = getOrSetFingerprint();

    //GET DATA FORM (reads the data stored in the backend database)
    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in

    const config = useMemo(() => ({
        headers: {
            'Authorization': cxauthxc,
            'Content-Type': 'application/json'
        }
    }), [cxauthxc]);
    const baseURL = Url + postURL;
    const key = { name: name, sessionID: sessionID, fingerprint: fingerprint };
    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            await serviceData(baseURL, key, config, setPost);
        } catch (err) {
            setError(true);
            console.error('Error fetching data:', err);
        }
    }, [baseURL, key, config]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const postServerURL1 = postServerURL;
    const message = t('login.registration_successful');
    const { formInputs, handleInputChange, handleFormSubmit } = useCustomForm(postServerURL1, false, message);

    if (!post) return null;
    const dataform =  JSON.parse(post);
    var permissionstatus = 100;
    var additionalfields1 = additionalfields; //It is not a required parameter
    if (!additionalfields1){
        additionalfields1 = {content: { body: [] }};
    };

    return (
        <form onSubmit={handleFormSubmit}>
            {dataform.map(block => RenderForm({
                component: block.component,
                type: block.type,
                label: t(block.label),
                id: block.name,
                name: block.name,
                placeholder: block.placeholder,
                className: className,
                value: formInputs[block.name],
                onChange: handleInputChange,
                style: block.style,
                autocomplete: block.autocomplete,
                permission: block.permission,
                permissionstatus: permissionstatus,
                validate: {
                    required: block.required,
                    type: block.validatetype,
                    check: block.check,
                    minLength: block.minlength,
                    maxLength: block.maxlength,
                    pattern: block.pattern,
                },
                items: block.items
            }, 'nouser'))}
            {additionalfields1.content.body.map(block => RenderForm({
                component: block.component,
                type: block.type,
                label: t(block.label),
                id: block.name,
                name: block.name,
                placeholder: block.placeholder,
                className: className,
                value: formInputs[block.name],
                onChange: handleInputChange,
                style: block.style,
                autocomplete: block.autocomplete,
                permission: block.permission,
                permissionstatus: permissionstatus,
                validate: {
                    required: block.required,
                    type: block.validatetype,
                    check: block.check,
                    minLength: block.minlength,
                    maxLength: block.maxlength,
                    pattern: block.pattern,
                },
                items: block.items
            }, 'nouser'))}
            {children}
        </form>
    );
};

AppFormFieldsNoUser.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    postURL: PropTypes.string.isRequired,
    postServerURL: PropTypes.string.isRequired,
    additionalfields: PropTypes.object,
    className: PropTypes.string,
};
