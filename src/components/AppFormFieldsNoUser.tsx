/**
 * @fileoverview
 * This code defines a functional component called AppFormFieldsNoUser, which is similar to AppFormFields but is designed to be used when the user is not authenticated.
 * This component is used to render a form dynamically when the user is not authenticated, using a unique fingerprint to identify the user instead of authentication. The form is rendered based on the configuration provided by the server.
 * @module components/AppFormFieldsNoUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Url } from '../constants/global';
import { useTranslation } from 'react-i18next';
import { RenderForm } from './index';
import useCustomForm from '../hooks/FormHooksNormalNoUser';
import { getServiceData } from '../services/getServiceExtended';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import type {
  ValidationRules,
  FormBlockComponents,
  AdditionalFields,
  AppFormFieldsNoUserProps,
} from '../types/components/appFormFieldsNoUser.types';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

/**
 * Component for rendering a form with dynamic fields when user authentication is not required.
 * @param {AppFormFieldsNoUserProps} props - Component properties.
 * @returns {JSX.Element | null} Rendered component.
 */
export default function AppFormFieldsNoUser({
  children,
  name,
  postURL,
  postServerURL,
  additionalfields,
  className,
}: AppFormFieldsNoUserProps): React.JSX.Element | null {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  // FINGERPRINT, Unique ID security system for the PC user navigator
  const [fingerprint, setFingerprint] = useState<string>('');

  // GET DATA FORM (reads the data stored in the backend database)
  const authTokens: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const authTokensSes: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${authTokens}`,
        'X-Session-ID': authTokensSes,
        'X-Fingerprint': fingerprint,
        'Content-Type': 'application/json',
      },
    }),
    [authTokens, authTokensSes, fingerprint],
  );

  const baseURL: string = Url + postURL;
  const [post, setPost] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      if (hasFetched.current) return; // If already executed, do not run again
      hasFetched.current = true;

      const fp = await getOrSetFingerprint();
      setFingerprint(fp);
      const keyWithFingerprint = {
        name: name,
        sessionID: authTokensSes,
        fingerprint: fp,
      };
      await getServiceData(
        baseURL,
        keyWithFingerprint,
        config,
        setPost,
        configLogs,
      );
    } catch (err) {
      setError(true);
      logConsole(configLogs, 'error', 'Error fetching data:', err);
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const postServerURL1: string = postServerURL;
  const message: string = t('login.registration_successful');
  const { formInputs, handleInputChange, handleFormSubmit } = useCustomForm(
    postServerURL1,
    false,
    message,
  );

  if (!post) return null;

  const dataform: FormBlockComponents[] = JSON.parse(post);
  const permissionstatus: number = 100;
  let additionalfields1: AdditionalFields = additionalfields || {
    content: { body: [] },
  };

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
            permission: block.permission || 0,
            permissionstatus: permissionstatus,
            validate: {
              required: block.required,
              type: block.validatetype,
              check: block.check,
              minLength: block.minlength,
              maxLength: block.maxlength,
              pattern: block.pattern,
            } as ValidationRules,
            items: block.items,
          },
          'nouser',
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
            permission: block.permission || 0,
            permissionstatus: permissionstatus,
            validate: {
              required: block.required,
              type: block.validatetype,
              check: block.check,
              minLength: block.minlength,
              maxLength: block.maxlength,
              pattern: block.pattern,
            } as ValidationRules,
            items: block.items,
          },
          'nouser',
        ),
      )}
      {children}
    </form>
  );
}
