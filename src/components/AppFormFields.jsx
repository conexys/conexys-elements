/**
 * @fileoverview
 * This code defines a functional component called AppFormFields that is used to render a form dynamically.
 * This component is used to render a form dynamically based on the configuration provided by the server. It makes HTTP requests for configuration data and renders the form with custom fields. The component also handles permissions logic and form validation.
 * @module components/AppFormFields
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires ../constants/global
 * @requires react-i18next
 * @requires ./index"
 * @requires ../hooks/FormHooksNormal
 * @requires ../services/postServiceExtended
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Url } from '../constants/global.jsx';
import { useTranslation } from 'react-i18next';
import { RenderForm } from "./index.jsx";
import useCustomForm from "../hooks/FormHooksNormal.jsx";
import { servicePost } from '../services/postServiceExtended.jsx';
import PropTypes from 'prop-types';

/**
 * Component for rendering a form with dynamic fields.
 * @param {Object} props - Component properties.
 * @param {string} props.fpHash - Fingerprint hash for unique identification.
 * @param {string} props.name - Name of the form.
 * @param {string} props.postURL - URL for posting form data to the backend.
 * @param {string} props.postServerURL - URL for posting form data to the server.
 * @param {string} props.getServerURL - URL for getting form data from the server.
 * @param {string} props.deleteServerURL - URL for deleting form data from the server.
 * @param {string} props.id - ID for form data identification.
 * @param {Object} props.additionalfields - Additional fields for the form.
 * @param {string} props.className - CSS class name for styling.
 * @param {string} props.permission - User's permission level.
 * @param {string} props.show - Determines whether to show form for admin or user.
 * @param {React.ReactNode} props.children - Children components.
 * @param {Function} props.feedback - Feedback function.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppFormFields({children, fpHash, name, postURL, postServerURL, getServerURL, deleteServerURL, id, additionalfields, className, permission, show, feedback}) {
    const [t] = useTranslation("global");

    //GET DATA FORM (reads the data stored in the backend database)
    const cxauthxc = localStorage.getItem("cxauthxc") || ""; //Check if the user is logged in
    const sessionID = localStorage.getItem("cx_session") || ""; //Check if the user is logged in

    const config = useMemo(() => ({
        headers: {
            'Authorization': cxauthxc,
            'Content-Type': 'application/json'
        }
    }), [cxauthxc]);
    const postURL1 = Url + postURL;
    
    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            await servicePost(fpHash, sessionID, id, permission, postURL, config, name, cxauthxc, postURL1, t, setPost);
        } catch (err) {
            setError(true);
            console.error('Error fetching data:', err);
        }
    }, [fpHash, sessionID, id, permission, postURL, config, name, cxauthxc, postURL1, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const postServerURL1 = postServerURL;
    const getServerURL1 = getServerURL;
    const deleteServerURL1 = deleteServerURL;
    const id1 = id;
    const { formInputs, handleInputChange, handleFormSubmit } = useCustomForm(fpHash, postServerURL1, getServerURL1, deleteServerURL1, id1, '', feedback); //Render Form

    if (!post) return null;
    const dataform =  JSON.parse(post.data);
    var permissionstatus;
    if (permission === true){
        if (show === 'admin'){
            permissionstatus = post.permission ;//Check the level of permissions the user has.
        } else {
            if (post.permission === "1" || post.permission === "2"){
                permissionstatus = "3"; //Checks the permission level the user has and adds 1 to it so that it does not show the super administrator or administrator fields.
            } else {
                permissionstatus = post.permission; //Check the level of permissions the user has.
            }
        }
    } else {
        permissionstatus = 100;
    }
    var additionalfields1 = additionalfields; //It is not a required parameter
    if (!additionalfields1){
        additionalfields1 = {content: {body: []}};
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
            }))}
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
            }))}
            {children}
        </form>
    );
};

AppFormFields.propTypes = {
    children: PropTypes.node,
    fpHash: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    postURL: PropTypes.string.isRequired,
    postServerURL: PropTypes.string.isRequired,
    getServerURL: PropTypes.string.isRequired,
    deleteServerURL: PropTypes.string,
    id: PropTypes.string,
    additionalfields: PropTypes.object,
    className: PropTypes.string,
    permission: PropTypes.bool,
    show: PropTypes.string,
    feedback: PropTypes.string.isRequired,
};
