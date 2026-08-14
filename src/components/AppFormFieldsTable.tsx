/**
 * @fileoverview
 * This code defines a functional component called AppFormFields, which appears to be a more generalised version of the AppFormFieldsNoUser component.
 * This component appears to be more generic and adaptable for different use cases by handling both authenticated and unauthenticated users, as well as additional permission settings and fields.
 * @module components/AppFormFieldsTable
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.4.0
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Url } from '../constants/global';
import { useTranslation } from 'react-i18next';
import { RenderForm } from './index';
import useCustomForm from '../hooks/FormHooksNormal';
import { getservice } from '../services/getService';
import { getOrSetFingerprint } from '../shared/baseFingerprintService';
import { authStorage } from '../utilities/authStorage';
import type {
  ValidationRules,
  FormBlock,
  AdditionalFields,
  PostResponse,
  AppFormFieldsTableProps,
} from '../types/components/appFormFieldsTable.types';
import { useConexysConfig } from '../config/ConexysConfig';
import { logConsole } from '../utilities/logConsole';

interface FormItem {
  items?: any[];
  url?: string;
  itemKey?: string;
  textitemKey?: string;
  [key: string]: any;
}

interface DataConverted {
  item: any;
  textitem: string;
}

interface RenderResponse {
  data: string;
  code: number;
  permission?: string;
}

/**
 * Component for rendering a form with dynamic fields, tailored for user authentication.
 * Uses GET requests instead of POST (v0.4.0).
 * @param {AppFormFieldsTableProps} props - Component properties.
 * @returns {JSX.Element | null} Rendered component.
 */
export default function AppFormFieldsTable({
  name,
  fpHash,
  postURL,
  postServerURL,
  getServerURL,
  deleteServerURL,
  id,
  additionalfields,
  className,
  permission,
  show,
  nouser,
  fetchMethod,
}: AppFormFieldsTableProps): React.JSX.Element | null {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  //GET DATA FORM (reads the data stored in the backend database)
  const authTokens: string = authStorage.getAuthToken(configLogs) || '';
  const authTokensSes: string = authStorage.getSessionId(configLogs) || '';

  const config = useMemo(
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

  const getURL: string = Url + (postURL || '');
  const [post, setPost] = useState<PostResponse | null>(null);
  const [error, setError] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const visitorIdHash: string = await getOrSetFingerprint(fpHash);

      if (permission) {
        // Fetch form fields via GET with params
        const response = await getservice(
          {
            sessionID: authTokensSes,
            cxauthxc: authTokens,
            postServerURL: postURL || '',
            authorization: true,
            fingerprint: visitorIdHash,
            name: name || '',
          },
          configLogs,
        );

        // response has { data, code, permission }
        // data is a stringified JSON array of form blocks
        if (!response.data) {
          throw new Error('No form fields data returned from server');
        }
        const dataform: FormItem[] = JSON.parse(response.data);

        // Resolve dynamic items (fetch via GET for each form item with url)
        const updatedDataForm = await Promise.all(
          dataform.map(async (itenform: FormItem) => {
            if (itenform.items !== undefined && itenform.url !== undefined) {
              const newItems = await getservice(
                {
                  sessionID: authTokensSes,
                  cxauthxc: authTokens,
                  postServerURL: itenform.url,
                  authorization: true,
                  fingerprint: visitorIdHash,
                },
                configLogs,
              );
              const itemKey = itenform.itemKey;
              const textitemKey = itenform.textitemKey;

              // Handle both direct array response and wrapped { data: [...] } response
              const itemsArray: any[] = Array.isArray(newItems)
                ? newItems
                : newItems?.data || [];
              const dataConverted: DataConverted[] = itemsArray.map(
                (item: any) => ({
                  item: item[itemKey!],
                  textitem: `${item[textitemKey!].charAt(0).toUpperCase() + item[textitemKey!].slice(1)}`,
                }),
              );
              itenform.items = dataConverted;
            }
            return itenform;
          }),
        );

        const renderresponde: RenderResponse = {
          data: JSON.stringify(updatedDataForm),
          code: response.code,
          permission: response.permission,
        };

        setPost(renderresponde);
      } else {
        // No permission needed — simple GET without auth params
        const response = await getservice(
          {
            sessionID: authTokensSes,
            cxauthxc: authTokens,
            postServerURL: postURL || '',
            authorization: false,
            fingerprint: visitorIdHash,
          },
          configLogs,
        );
        setPost(response);
      }
    } catch (err) {
      setError(true);
      logConsole(configLogs, 'error', 'Error fetching data:', err);
      console.error('Error fetching data:', err);
    }
  }, [
    fpHash,
    authTokensSes,
    permission,
    postURL,
    name,
    authTokens,
    configLogs,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const postServerURL1: string = postServerURL;
  const getServerURL1: string = getServerURL;
  const deleteServerURL1: string = deleteServerURL;
  const id1: string = id;
  const { formInputs, handleInputChange } = useCustomForm(
    fpHash,
    postServerURL1,
    getServerURL1,
    deleteServerURL1,
    id1,
    deleteServerURL1,
    undefined,
    'post',
    'post',
    fetchMethod || 'post',
  );

  if (!post) return null;

  const dataform: FormBlock[] = JSON.parse(post.data);
  let permissionstatus: number;

  if (permission === true) {
    if (show === 'admin') {
      permissionstatus = parseInt(post.permission);
    } else {
      if (post.permission === '1' || post.permission === '2') {
        permissionstatus = 3;
      } else {
        permissionstatus = parseInt(post.permission);
      }
    }
  } else {
    permissionstatus = 100;
  }

  const additionalfields1: AdditionalFields = additionalfields || {
    content: { body: [] },
  };

  return (
    <>
      {dataform.map((block: FormBlock) =>
        RenderForm(
          {
            component: block.component,
            type: block.type,
            label: t(block.label),
            id: block.name || block.id || '',
            name: block.name || block.id || '',
            placeholder: block.placeholder,
            className: className,
            value: formInputs[block.name || block.id || ''],
            onChange: handleInputChange,
            style: block.style,
            autocomplete: block.autocomplete,
            texthtml: block.texthtml,
            variant: block.variant,
            severity: block.severity,
            color: block.color,
            headline: block.headline,
            size: block.size,
            permission: block.permission || 0,
            permissionstatus: permissionstatus,
            validate: {
              required:
                block.required || (block.validate && block.validate.required),
              type:
                block.validatetype || (block.validate && block.validate.type),
              check: block.check || (block.validate && block.validate.check),
              minLength:
                block.minlength || (block.validate && block.validate.minLength),
              maxLength:
                block.maxlength || (block.validate && block.validate.maxLength),
              pattern:
                block.pattern || (block.validate && block.validate.pattern),
            } as ValidationRules,
            items: block.items || [],
          },
          nouser || '',
        ),
      )}
      {additionalfields1.content.body.map((block: FormBlock) =>
        RenderForm(
          {
            component: block.component,
            type: block.type,
            label: t(block.label),
            id: block.name || block.id || '',
            name: block.name || block.id || '',
            placeholder: block.placeholder,
            className: className,
            value: formInputs[block.name || block.id || ''],
            onChange: handleInputChange,
            style: block.style,
            autocomplete: block.autocomplete,
            texthtml: block.texthtml,
            variant: block.variant,
            severity: block.severity,
            color: block.color,
            headline: block.headline,
            size: block.size,
            permission: block.permission || 0,
            permissionstatus: permissionstatus,
            validate: {
              required:
                block.required || (block.validate && block.validate.required),
              type:
                block.validatetype || (block.validate && block.validate.type),
              check: block.check || (block.validate && block.validate.check),
              minLength:
                block.minlength || (block.validate && block.validate.minLength),
              maxLength:
                block.maxlength || (block.validate && block.validate.maxLength),
              pattern:
                block.pattern || (block.validate && block.validate.pattern),
            } as ValidationRules,
            items: block.items || [],
          },
          nouser || '',
        ),
      )}
    </>
  );
}
