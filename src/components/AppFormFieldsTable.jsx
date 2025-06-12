/**
 * @fileoverview
 * This code defines a functional component called AppFormFields, which appears to be a more generalised version of the AppFormFieldsNoUser component.
 * This component appears to be more generic and adaptable for different use cases by handling both authenticated and unauthenticated users, as well as additional permission settings and fields.
 * @module components/AppFormFieldsTable
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires axios
 * @requires ../constants/global
 * @requires react-i18next
 * @requires ./index
 * @requires ../hooks/FormHooksNormal
 * @requires ../services/postServiceExtended
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Url } from '../constants/global.jsx';
import { useTranslation } from 'react-i18next';
import { RenderForm } from "./index.jsx";
import useCustomForm from "../hooks/FormHooksNormal.jsx";
import { servicePostData } from '../services/postServiceExtended.jsx';
import PropTypes from 'prop-types';

/**
 * Component for rendering a form with dynamic fields, tailored for user authentication.
 * @param {Object} props - Component properties.
 * @param {string} props.name - Name of the form.
 * @param {string} props.fpHash - Fingerprint hash for unique user identification.
 * @param {string} props.postURL - URL for posting form data to the backend.
 * @param {string} props.postServerURL - URL for posting form data to the server.
 * @param {string} props.getServerURL - URL for getting form data from the server.
 * @param {string} props.deleteServerURL - URL for deleting form data from the server.
 * @param {string} props.id - User ID.
 * @param {Object} props.additionalfields - Additional fields for the form.
 * @param {string} props.className - CSS class name for styling.
 * @param {boolean} props.permission - User's permission status.
 * @param {string} props.show - Specifies the type of user data to display (admin, user, etc.).
 * @param {boolean} props.nouser - Specifies if the form is for a user with no authentication.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppFormFieldsTable({name, fpHash, postURL, postServerURL, getServerURL, deleteServerURL, id, additionalfields, className, permission, show, nouser}) {
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
            await servicePostData(fpHash, sessionID, id, permission, postURL, config, name, cxauthxc, postURL1, t, setPost);
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
    const { formInputs, handleInputChange } = useCustomForm(fpHash, postServerURL1, getServerURL1, deleteServerURL1, id1); //Render Form

    if (!post) return null;
    const dataform =  JSON.parse(post.data);
    var permissionstatus;
    if (permission === true){
        if (show === 'admin'){
            permissionstatus = post.permission; //Check the level of permissions the user has.
        } else {
            if (post.permission === "1" || post.permission === "2"){
                permissionstatus = "3"; //Checks the permission level the user has and adds 1 to it so that it does not show the super administrator or administrator fields.
            } else {
                permissionstatus = post.permission; //Check the level of permissions the user has.
            };
        };
    } else {
        permissionstatus = 100;
    };
    var additionalfields1 = additionalfields; //It is not a required parameter
    if (!additionalfields1){
        additionalfields1 = { content: { body: [] } };
    };

    return (
        <>
            {dataform.map(block => RenderForm({
                component: block.component,
                type: block.type,
                label: t(block.label),
                id: block.name || block.id,
                name: block.name || block.id,
                placeholder: block.placeholder,
                className: className,
                value: formInputs[block.name || block.id],
                onChange: handleInputChange,
                style: block.style,
                autocomplete: block.autocomplete,
                texthtml: block.texthtml,
                variant: block.variant,
                severity: block.severity,
                color: block.color,
                headline: block.headline,
                size: block.size,
                permission: block.permission,
                permissionstatus: permissionstatus,
                validate: {
                    required: block.required || (block.validate && block.validate.required),
                    type: block.validatetype || (block.validate && block.validate.type),
                    check: block.check || (block.validate && block.validate.check),
                    minLength: block.minlength || (block.validate && block.validate.minLength),
                    maxLength: block.maxlength || (block.validate && block.validate.maxLength),
                    pattern: block.pattern || (block.validate && block.validate.pattern),
                },
                items: block.items || []
            }, nouser))}
            {additionalfields1.content.body.map(block => RenderForm({
                component: block.component,
                type: block.type,
                label: t(block.label),
                id: block.name || block.id,
                name: block.name || block.id,
                placeholder: block.placeholder,
                className: className,
                value: formInputs[block.name || block.id],
                onChange: handleInputChange,
                style: block.style,
                autocomplete: block.autocomplete,
                texthtml: block.texthtml,
                variant: block.variant,
                severity: block.severity,
                color: block.color,
                headline: block.headline,
                size: block.size,
                permission: block.permission,
                permissionstatus: permissionstatus,
                validate: {
                    required: block.required || (block.validate && block.validate.required),
                    type: block.validatetype || (block.validate && block.validate.type),
                    check: block.check || (block.validate && block.validate.check),
                    minLength: block.minlength || (block.validate && block.validate.minLength),
                    maxLength: block.maxlength || (block.validate && block.validate.maxLength),
                    pattern: block.pattern || (block.validate && block.validate.pattern),
                },
                items: block.items || []
            }, nouser))}
        </>
    );

};

AppFormFieldsTable.propTypes = {
    name: PropTypes.string,
    fpHash: PropTypes.string.isRequired,
    postURL: PropTypes.string,
    postServerURL: PropTypes.string.isRequired,
    getServerURL: PropTypes.string.isRequired,
    deleteServerURL: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    additionalfields: PropTypes.object,
    className: PropTypes.string,
    permission: PropTypes.bool.isRequired,
    show: PropTypes.string.isRequired,
    nouser: PropTypes.string,
};
