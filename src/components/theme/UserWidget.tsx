/**
 * @fileoverview
 * Design of a component
 * @module components/theme/UserWidget
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, forwardRef, useRef } from 'react';
import CardUser from './CardUser.jsx';
import { getservice } from '../../services/getService';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import { Uservalidationerror } from '../../components/index';
import { Url } from '../../constants/global';
import { Loading } from './index';
import { getservice2 } from '../../services/getServiceExtended';
import { getOrSetFingerprint } from '../../shared/baseFingerprintService';
import { authStorage } from '../../utilities/authStorage';
import { logConsole } from '../../utilities/logConsole';
import type {
  UserWidgetProps,
  UserDataTheme,
} from '../../types/components/theme.types';
import type { RoleItem } from '../../types/common';
import { useConexysConfig } from '../../config/ConexysConfig';

/**
 * Component representing a user widget with profile information.
 * This component will display the user profile, searchable by user name or user ID.
 *
 * @param {UserWidgetProps} props - The properties passed to the component.
 * @param {string} props.username - The username of the user.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the UserWidget component.
 */
export default function UserWidget({
  username,
  useravatar,
  fpHash,
}: UserWidgetProps): React.JSX.Element {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  // DATA
  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const [isError, setIsError] = useState<boolean>(false);
  const [datauserdata, setUserData] = useState<UserDataTheme | any>('');
  const [datausertype, setUsertype] = useState<string>('');
  const authorization: boolean = true;
  const [avatar, setAvatar] = useState<string>('/path/to/default/image.png');
  const [cover, setCover] = useState<string>('');
  const [rollist, setRollist] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [messageerror, setMessageerror] = useState<string>('');
  const hasFetched = useRef<boolean>(false); // Prevent duplicate call
  const [rollistLoaded, setRollistLoaded] = useState<boolean>(false); // Nuevo estado

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadRollist = async () => {
      await getservice2(
        fpHash,
        sessionID,
        'rollist',
        cxauthxc,
        t,
        setRollist,
        setIsError,
        setError,
        setMessageerror,
        setLoading,
        configLogs,
      );
      setRollistLoaded(true);
    };
    loadRollist();
  }, [fpHash, sessionID, cxauthxc, t, configLogs]);

  useEffect(() => {
    if (!rollistLoaded || !username) return;

    const getuserdata = async (): Promise<void> => {
      setLoading(true); // Reiniciar loading
      const visitorIdHash: string = await getOrSetFingerprint(fpHash);
      try {
        const response = await getservice(
          {
            sessionID,
            cxauthxc,
            postServerURL: 'getdatausername',
            authorization,
            fingerprint: visitorIdHash,
            userUSERNAME: username,
          },
          configLogs,
        );

        const userData = Array.isArray(response) ? response[0] : response;
        setUserData(userData);

        const userTypeObject: RoleItem | undefined =
          rollist.length > 0
            ? rollist.find(
                (item: RoleItem) =>
                  String(item.id) === String(userData.user_type),
              )
            : undefined;
        const userType: string = userTypeObject
          ? userTypeObject.user_type
          : userData.user_type;
        setUsertype(userType);

        if (userData.profile_pic === '' || userData.profile_pic === null) {
          setAvatar(useravatar);
        } else {
          setAvatar(Url + '../uploads/avatar/' + userData.profile_pic);
        }
        if (userData.cover_pic === '' || userData.cover_pic === null) {
          setCover('');
        } else {
          setCover(Url + '../uploads/cover/' + userData.cover_pic);
        }
        logConsole(configLogs, 'data', '', userData);
        setIsError(false);
      } catch (err: any) {
        setError(true);
        if (!err?.response) {
          logConsole(
            configLogs,
            'error',
            '[Error] ',
            t('login.no_server_response'),
          );
          setIsError(true);
          setMessageerror(t('login.no_server_response'));
        } else if (err.response?.status === 400) {
          logConsole(
            configLogs,
            'error',
            '[Error] ',
            t('login.command_not_found'),
          );
          setIsError(true);
          setMessageerror(t('login.command_not_found'));
        } else if (err.response?.status === 401) {
          logConsole(
            configLogs,
            'error',
            '[Error] ',
            t('login.invalid_data_username_mail'),
          );
          setIsError(true);
          setMessageerror(t('login.invalid_data_username_mail'));
          Uservalidationerror(configLogs);
        } else if (err.response?.status === 403) {
          logConsole(configLogs, 'error', '[Error] ', t('login.no_permission'));
          setIsError(true);
          setMessageerror(t('error.no_permission'));
        } else {
          logConsole(configLogs, 'error', '[Error] ', t('login.unknown_error'));
          setIsError(true);
          setMessageerror(t('login.unknown_error'));
        }
      } finally {
        setLoading(false);
      }
    };
    getuserdata();
  }, [
    rollistLoaded,
    rollist,
    fpHash,
    sessionID,
    cxauthxc,
    t,
    username,
    useravatar,
    configLogs,
  ]);

  // Alert
  const vertical: 'top' | 'bottom' = 'top';
  const horizontal: 'left' | 'center' | 'right' = 'center';
  const Alert = forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    },
  );
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    setIsError(false);
  };
  // Alert

  const theObj: { __html: string } = { __html: datauserdata.biography || '' };

  return (
    <>
      <Loading error={error} loading={loading}>
        <CardUser
          user={datauserdata.name + ' ' + datauserdata.lastname}
          username={datauserdata.username}
          profilepicture={avatar}
          coverpicture={cover}
          fpHash={fpHash}
        >
          <h3>{t('login.biography')}</h3>
          <div dangerouslySetInnerHTML={theObj} />
          <hr className="solid short" />
          <ul className="simple-todo-list mt-3">
            <li>
              <b>{t('login.username')}</b>: {datauserdata.username}
            </li>
            <li>
              <b>{t('login.email')}</b>: {datauserdata.email}
            </li>
            <li>
              <b>{t('login.name')}</b>: {datauserdata.name}
            </li>
            <li>
              <b>{t('login.lastname')}</b>: {datauserdata.lastname}
            </li>
            <li>
              <b>{t('User.type_of_user')}</b>: {datausertype}
            </li>
          </ul>
        </CardUser>
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
