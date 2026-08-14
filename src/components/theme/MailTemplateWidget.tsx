/**
 * @fileoverview
 * Design of a component
 * @module components/theme/MailTemplateWidget
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import { getservice2 } from '../../services/getServiceExtended';
import { Loading } from './index';
import { authStorage } from '../../utilities/authStorage';
import { logConsole } from '../../utilities/logConsole';
import type {
  MailTemplateWidgetProps,
  ThemeData,
} from '../../types/components/theme.types';
import { useConexysConfig } from '../../config/ConexysConfig';

/**
 * Component representing a user widget with profile information.
 * This component will display the user profile, can be searched by username or by user ID
 *
 * @param {MailTemplateWidgetProps} props - The properties passed to the component.
 * @param {string} props.id - The id of the mail template.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the MailTemplateWidget component.
 */
export default function MailTemplateWidget({
  id,
  fpHash,
}: MailTemplateWidgetProps): React.JSX.Element {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  // DATA
  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const [isError, setIsError] = useState<boolean>(false);
  const [getthemedata, setThemeData] = useState<ThemeData>({
    id: '',
    module: '',
    code: '',
    templateName: '',
    language: '',
    html: '',
    title: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [messageerror, setMessageerror] = useState<string>('');

  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  useEffect(() => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;
    getservice2(
      fpHash,
      sessionID,
      `gettemplatesmailid/${id}`,
      cxauthxc,
      t,
      setThemeData,
      setIsError,
      setError,
      setMessageerror,
      setLoading,
      configLogs,
    );
  }, [fpHash, sessionID, cxauthxc, t, id]);

  // Alert
  const vertical: 'top' | 'bottom' = 'top';
  const horizontal: 'left' | 'center' | 'right' = 'center';
  const Alert = forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    },
  );
  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string): void => {
      if (reason === 'clickaway') {
        return;
      }
      setIsError(false);
    },
    [],
  );
  // Alert

  const theObj: { __html: string } = { __html: getthemedata.html || '' };
  logConsole(configLogs, 'data', '', getthemedata);

  return (
    <>
      <Loading error={error} loading={loading}>
        <h3>
          {t('Setting.SUBJECT')}: {getthemedata.title}
        </h3>
        <br></br>
        <h4>{t('Setting.MESSAGE')}:</h4>
        <div dangerouslySetInnerHTML={theObj} />
      </Loading>
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={handleClose}
        key={vertical + horizontal}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {messageerror}
        </Alert>
      </Snackbar>
    </>
  );
}
