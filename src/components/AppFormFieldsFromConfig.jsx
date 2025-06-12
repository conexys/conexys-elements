/**
 * @fileoverview
 * This component renders form fields based on configurations passed as props,
 * rather than fetching the configuration from an API.
 * @module components/AppFormFieldsFromConfig
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 * @requires React
 * @requires react-i18next
 * @requires ./index
 */

import React, { useMemo } from 'react';
import { RenderForm } from "./index.jsx";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useCustomForm from "../hooks/FormHooksNormal.jsx";

/**
 * Component for rendering form fields based on a provided configuration.
 * @param {Object} props - Component properties.
 * @param {Object} props.formInputs - Form input values.
 * @param {Function} props.handleInputChange - Function to handle input changes.
 * @param {string} props.fpHash - Fingerprint hash for unique user identification.
 * @param {string} props.postServerURL - URL for posting form data to the server.
 * @param {string} props.getServerURL - URL for getting form data from the server.
 * @param {string} props.deleteServerURL - URL for deleting form data from the server.
 * @param {string} props.id - Form ID.
 * @param {Array} props.userlist - List of users for select options.
 * @param {Function} props.getFormFn - Function to get normal form configuration.
 * @param {string} props.className - CSS class name for styling.
 * @param {number} props.permissionstatus - User's permission status.
 * @param {boolean} props.nouser - Specifies if the form is for a user with no authentication.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppFormFieldsFromConfig({
    formInputs: externalFormInputs, 
    handleInputChange: externalHandleInputChange, 
    fpHash, 
    postServerURL, 
    getServerURL, 
    deleteServerURL = '', 
    id = '', 
    userlist = [], 
    settings = [], 
    languages = [], 
    getFormFn, 
    className = "form-control", 
    permissionstatus = 2, 
    nouser,
    t: externalTranslation // Nuevo parámetro para recibir la traducción externa
}) {
    const [defaultT] = useTranslation("global");

    const t = externalTranslation || defaultT;

    const useServerForm = Boolean(fpHash && postServerURL && getServerURL && deleteServerURL);
    
    // If server URLs are provided, use useCustomForm hook, otherwise use external inputs and handlers
    const { formInputs: serverFormInputs, handleInputChange: serverHandleInputChange } = useServerForm 
        ? useCustomForm(fpHash, postServerURL, getServerURL, deleteServerURL, id)
        : { formInputs: {}, handleInputChange: () => {} };

    // Use either server-managed form state or external props
    const formInputs = useServerForm ? serverFormInputs : externalFormInputs;
    const handleInputChange = useServerForm ? serverHandleInputChange : externalHandleInputChange;

    // Get form configuration based on form type
    const formConfig = useMemo(() => {
        return getFormFn ? getFormFn(t, formInputs, handleInputChange, userlist, settings, languages) : null;
    }, [t, formInputs, handleInputChange, userlist, settings, languages, getFormFn]);

    if (!formConfig || !formConfig.content || !formConfig.content.body) {
        return null;
    }

    return (
        <>
        {formConfig.content.body.map(block => RenderForm({
            component: block.component,
            type: block.type,
            label: block.label,
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

AppFormFieldsFromConfig.propTypes = {
    formInputs: PropTypes.object,
    handleInputChange: PropTypes.func,
    fpHash: PropTypes.string,
    postServerURL: PropTypes.string,
    getServerURL: PropTypes.string,
    deleteServerURL: PropTypes.string,
    id: PropTypes.string,
    userlist: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    getFormFn: PropTypes.func,
    className: PropTypes.string,
    permissionstatus: PropTypes.number,
    nouser: PropTypes.string,
};
