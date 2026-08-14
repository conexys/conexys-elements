/**
 * @fileoverview
 * Design of a component
 * @module components/theme/MessagesBlock
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
import { NavLink } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { getservice2 } from '../../services/getServiceExtended';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import { Loading } from './index';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { authStorage } from '../../utilities/authStorage';
import type {
  MessagesBlockProps,
  UnreadCountTheme,
  SpeedDialActionType,
} from '../../types/components/theme.types';
import { useConexysConfig } from '../../config/ConexysConfig';

/**
 * Functional component representing a block for displaying messages and notifications.
 *
 * @param {MessagesBlockProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content of the messages block.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the MessagesBlock component.
 */
export default function MessagesBlock({
  children,
  fpHash,
}: MessagesBlockProps): React.JSX.Element {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -13,
      top: 0,
      padding: '0 4px',
    },
  }));

  // Show the number of messages
  // DATA
  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const [unreadcount, setUnreadCount] = useState<UnreadCountTheme | any>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [messageerror, setMessageerror] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const handleOpenMenu = useCallback((): void => setOpen(true), []);
  const handleCloseMenu = useCallback((): void => setOpen(false), []);

  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  useEffect(() => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;

    getservice2(
      fpHash,
      sessionID,
      'unreadcount',
      cxauthxc,
      t,
      setUnreadCount,
      setIsError,
      setError,
      setMessageerror,
      setLoading,
      configLogs,
    );
  }, []);

  const newmessagedir: string = '/messages/newmessage';
  const messagesdir: string = '/messages/messages';
  const sendmessagesdir: string = '/messages/sendmessages';
  const draftdir: string = '/messages/draft';
  const notificationsdir: string = '/messages/notifications';
  const favouritedir: string = '/messages/favourite';
  const recyclebindir: string = '/messages/recyclebin';

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

  const actions: SpeedDialActionType[] = [
    {
      icon: (
        <NavLink to={recyclebindir} className="menu-item">
          <DeleteIcon />
        </NavLink>
      ),
      name: t('Notify.paperbin'),
    },
    {
      icon: (
        <NavLink to={favouritedir} className="menu-item">
          <FavoriteIcon />
        </NavLink>
      ),
      name: t('Notify.favorites'),
    },
    {
      icon: (
        <NavLink to={notificationsdir} className="menu-item">
          <NotificationsIcon />
        </NavLink>
      ),
      name: t('Notify.notifications'),
    },
    {
      icon: (
        <NavLink to={draftdir} className="menu-item">
          <DraftsIcon />
        </NavLink>
      ),
      name: t('Notify.draft_messages'),
    },
    {
      icon: (
        <NavLink to={sendmessagesdir} className="menu-item">
          <SendIcon />
        </NavLink>
      ),
      name: t('Notify.sent_messages'),
    },
    {
      icon: (
        <NavLink to={messagesdir} className="menu-item">
          <AllInboxIcon />
        </NavLink>
      ),
      name: t('Notify.inbox'),
    },
    {
      icon: (
        <NavLink to={newmessagedir} className="menu-item">
          <AddCircleOutlinedIcon />
        </NavLink>
      ),
      name: t('Notify.write_a_new_message'),
    },
  ];

  return (
    <>
      <Loading type="appnotifications" error={error} loading={loading}>
        <section className="content-with-menu mailbox">
          <div
            className="content-with-menu-container"
            data-mailbox=""
            data-mailbox-view="folder"
            style={{ height: 'calc(100vh - 50px)' }}
          >
            <menu id="content-menu" className="inner-menu" role="menu">
              <div className="nano">
                <div className="nano-content">
                  <div className="inner-menu-content">
                    <NavLink
                      to={newmessagedir}
                      className="btn btn-block btn-primary btn-md pt-2 pb-2 text-3"
                    >
                      <i className="bx bx-envelope me-1 text-4 top-2 position-relative"></i>
                      {t('Notify.write_a_new_message')}
                    </NavLink>
                    <ul className="list-unstyled mt-3 pt-3">
                      <li>
                        <NavLink to={messagesdir} className="menu-item">
                          <AllInboxIcon /> {t('Notify.inbox')}{' '}
                          <StyledBadge
                            badgeContent={unreadcount.message}
                            overlap="circular"
                            color="error"
                          ></StyledBadge>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={sendmessagesdir} className="menu-item">
                          <SendIcon /> {t('Notify.sent_messages')}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={draftdir} className="menu-item">
                          <DraftsIcon /> {t('Notify.draft_messages')}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={notificationsdir} className="menu-item">
                          <NotificationsIcon />
                          {t('Notify.notifications')}{' '}
                          <StyledBadge
                            badgeContent={unreadcount.notification}
                            overlap="circular"
                            color="error"
                          ></StyledBadge>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={favouritedir} className="menu-item">
                          <FavoriteIcon /> {t('Notify.favorites')}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={recyclebindir} className="menu-item">
                          <DeleteIcon /> {t('Notify.paperbin')}
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </menu>
            <div
              className="inner-body mailbox-folder"
              style={{ overflowY: 'auto', height: 'calc(100vh - 50px)' }}
            >
              {children}
            </div>
          </div>
        </section>
        <SpeedDial
          className="speed-menu"
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleCloseMenu}
          onOpen={handleOpenMenu}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              className="speed-action"
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              tooltipPlacement="left"
              onClick={handleCloseMenu}
            />
          ))}
        </SpeedDial>
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
