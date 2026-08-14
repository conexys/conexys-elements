/**
 * @fileoverview
 * Design of a component
 * @module components/theme/CardUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { getservice } from '../../services/getService';
import { Uservalidationerror } from '../../components/index';
import { Loading } from './index.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';
import { getOrSetFingerprint } from '../../shared/baseFingerprintService';
import { authStorage } from '../../utilities/authStorage';
import { logConsole } from '../../utilities/logConsole';
import type {
  CardUserProps,
  CoverStyles,
} from '../../types/components/theme.types';
import { useConexysConfig } from '../../config/ConexysConfig';

const StyledBadgeOnline = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 24,
    bottom: 10,
    backgroundColor: '#37d73f',
    border: `3px solid ${theme.palette.background.paper}`,
  },
}));

const StyledBadgeOffline = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 24,
    bottom: 10,
    border: `3px solid ${theme.palette.background.paper}`,
  },
}));

/**
 * Functional component representing a card with user information.
 *
 * @param {CardUserProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content of the card.
 * @param {string} props.user - The user's name.
 * @param {string} props.username - The user's username.
 * @param {string | boolean} props.profilepicture - The URL of the user's profile picture.
 * @param {string | boolean} props.coverpicture - The URL of the user's cover picture.
 * @param {string} props.fpHash - The fingerprint hash for unique identification.
 * @returns {JSX.Element} JSX element representing the CardUser component.
 */
export default function CardUser({
  children,
  user,
  username,
  profilepicture,
  coverpicture,
  fpHash,
}: CardUserProps): React.JSX.Element {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const editprofiledir: string = '/editprofile';

  // Verificar si el perfil visitado es del usuario logueado
  const loggedUserData =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('datauser')
      : null;
  let isOwnProfile = false;
  if (loggedUserData) {
    try {
      const parsed = JSON.parse(loggedUserData);
      isOwnProfile = parsed.username === username;
    } catch {}
  }

  const coverStyles: CoverStyles = {
    backgroundImage: `url(${coverpicture})`,
    backgroundSize: 'cover',
  };

  //DATA
  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const authorization: boolean = true;
  const [isError, setIsError] = useState<boolean>(false);
  const [datauserstatus, setUserStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [messageerror, setMessageerror] = useState<string>('');

  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  useEffect(() => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;
    if (username) {
      const getuserdata = async (): Promise<void> => {
        const visitorIdHash: string = await getOrSetFingerprint(fpHash);
        try {
          const getuserstatus = await getservice(
            {
              sessionID,
              cxauthxc,
              postServerURL: 'userstatus',
              authorization,
              fingerprint: visitorIdHash,
              userUSERNAME: username,
            },
            configLogs,
          );
          setUserStatus(getuserstatus.data);
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
            logConsole(
              configLogs,
              'error',
              '[Error] ',
              t('login.no_permission'),
            );
            setIsError(true);
            setMessageerror(t('error.no_permission'));
          } else {
            logConsole(
              configLogs,
              'error',
              '[Error] ',
              t('login.unknown_error'),
            );
            setIsError(true);
            setMessageerror(t('login.unknown_error'));
          }
        } finally {
          setLoading(false);
        }
      };
      getuserdata();
    }
  }, [username, fpHash, sessionID, cxauthxc, t]);

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

  return (
    <>
      <Loading error={error} loading={loading}>
        <section className="card">
          <header className="card-header bg-primary" style={coverStyles}>
            <div className="widget-profile-info">
              <div className="profile-picture">
                {datauserstatus ? (
                  <StyledBadgeOnline
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent=" "
                  >
                    <img
                      src={
                        typeof profilepicture === 'string'
                          ? profilepicture
                          : '/path/to/default/image.png'
                      }
                    />
                  </StyledBadgeOnline>
                ) : (
                  <StyledBadgeOffline
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent=" "
                  >
                    {profilepicture ? (
                      <img
                        src={
                          typeof profilepicture === 'string'
                            ? profilepicture
                            : ''
                        }
                      />
                    ) : (
                      <img src={''} />
                    )}
                  </StyledBadgeOffline>
                )}
              </div>
              <div className="profile-info">
                <h4 className="name font-weight-semibold mb-0">{user}</h4>
                <h5 className="role mt-0">@{username}</h5>
                <div className="profile-footer">
                  {isOwnProfile && (
                    <NavLink to={editprofiledir}>
                      ({t('System.edit_profile')})
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="card-body">{children}</div>
        </section>
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
