/**
 * @fileoverview
 * This code defines a functional component called AppFormFields that is used to render a form dynamically.
 * This component is used to render a form dynamically based on the configuration provided by the server. It makes HTTP requests for configuration data and renders the form with custom fields. The component also handles permissions logic and form validation.
 * @module components/AppFormFields
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Url } from '../constants/global';
import { useTranslation } from 'react-i18next';
import { RenderForm } from './index.jsx';
import useCustomForm from '../hooks/FormHooksNormal';
import { servicePost } from '../services/postServiceExtended';
import { authStorage } from '../utilities/authStorage';
import type {
  FormBlockComponents,
  AdditionalFields,
  PostResponse,
  AppFormFieldsProps,
} from '../types/components/appFormFields.types';
import type { RequestConfig } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

/**
 * Component for rendering a form with dynamic fields.
 * @param {AppFormFieldsProps} props - Component properties.
 * @param {string} props.fpHash - Fingerprint hash for unique identification.
 * @param {string} props.name - Name of the form.
 * @param {string} props.postURL - URL for posting form data to the backend.
 * @param {string} props.postServerURL - URL for posting form data to the server.
 * @param {string} props.getServerURL - URL for getting form data from the server.
 * @param {string} props.deleteServerURL - URL for deleting form data from the server.
 * @param {string} props.id - ID for form data identification.
 * @param {AdditionalFields} props.additionalfields - Additional fields for the form.
 * @param {string} props.className - CSS class name for styling.
 * @param {boolean} props.permission - User's permission level.
 * @param {string} props.show - Determines whether to show form for admin or user.
 * @param {React.ReactNode} props.children - Children components.
 * @param {string} props.feedback - Feedback function.
 * @returns {JSX.Element} Rendered component.
 */
export default function AppFormFields({
  children,
  fpHash,
  name,
  postURL,
  postServerURL,
  getServerURL,
  deleteServerURL,
  id,
  additionalfields,
  className,
  permission,
  show,
  feedback,
  method = 'post',
}: AppFormFieldsProps): React.JSX.Element | null {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  //GET DATA FORM (reads the data stored in the backend database)
  const authTokens: string = authStorage.getAuthToken(configLogs) || ''; //Check if the user is logged in
  const authTokensSes: string = authStorage.getSessionId(configLogs) || ''; //Check if the user is logged in

  const config: RequestConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${authTokens}`,
        'X-Session-ID': authTokensSes,
        'X-Fingerprint': fpHash,
        'Content-Type': 'application/json',
      },
    }),
    [authTokens, authTokensSes, fpHash],
  );
  const postURL1: string = Url + postURL;

  const [post, setPost] = useState<PostResponse | null>(null);
  const [error, setError] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    // Always fetch form config from backend, even without id (for new records).
    // The backend getformfieldsUser endpoint only requires 'name', not 'id'.
    try {
      await servicePost(
        fpHash,
        authTokensSes,
        id || '',
        permission || false,
        postURL,
        config,
        name,
        authTokens,
        postURL1,
        t,
        setPost,
        configLogs,
      );
    } catch (err: unknown) {
      setError(true);
      logConsole(configLogs, 'error', 'Error fetching data:', err);
      console.error('Error fetching data:', err);
    }
  }, [
    fpHash,
    authTokensSes,
    id,
    permission,
    postURL,
    config,
    name,
    authTokens,
    postURL1,
    t,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const postServerURL1: string = postServerURL || '';
  const getServerURL1: string = getServerURL || '';
  const deleteServerURL1: string = deleteServerURL || '';
  const id1: string = id || '';
  const { formInputs, handleInputChange, handleFormSubmit } = useCustomForm(
    fpHash,
    postServerURL1,
    getServerURL1,
    deleteServerURL1,
    id1,
    '',
    feedback,
    method,
    'post',
    'get',
  ); //Render Form

  if (!post) return null;
  const dataform: FormBlockComponents[] = JSON.parse(post.data);
  let permissionstatus: string | number;
  if (permission === true) {
    if (show === 'admin') {
      permissionstatus = post.permission; //Check the level of permissions the user has.
    } else {
      if (post.permission === '1' || post.permission === '2') {
        permissionstatus = '3'; //Checks the permission level the user has and adds 1 to it so that it does not show the super administrator or administrator fields.
      } else {
        permissionstatus = post.permission; //Check the level of permissions the user has.
      }
    }
  } else {
    permissionstatus = 100;
  }
  let additionalfields1: AdditionalFields = additionalfields || {
    content: { body: [] },
  }; //It is not a required parameter

  return (
    <form onSubmit={handleFormSubmit}>
      {dataform.map((block: FormBlockComponents) =>
        RenderForm(
          {
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
            permission: Number(block.permission),
            permissionstatus: Number(permissionstatus),
            validate: {
              required: block.required,
              type: block.validatetype,
              check: block.check,
              minLength: block.minlength,
              maxLength: block.maxlength,
              pattern: block.pattern,
            },
            items: block.items,
          },
          'form',
        ),
      )}
      {additionalfields1.content.body.map((block: FormBlockComponents) =>
        RenderForm(
          {
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
            permission: Number(block.permission),
            permissionstatus: Number(permissionstatus),
            validate: {
              required: block.required,
              type: block.validatetype,
              check: block.check,
              minLength: block.minlength,
              maxLength: block.maxlength,
              pattern: block.pattern,
            },
            items: block.items,
          },
          'form',
        ),
      )}
      {children}
    </form>
  );
}
