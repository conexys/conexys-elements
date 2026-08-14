/**
 * @fileoverview
 * React component for displaying an error message.
 * Error page
 * This code defines a React component called AppError, which represents an error page.
 * AppError is a component that displays an error page with relevant information and suggested steps to the user in case something goes wrong in the application.
 * @module components/pages/AppHeaderPage
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
import Typography from '@mui/material/Typography';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { BiHomeAlt } from 'react-icons/bi';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { serviceFavorites } from '../services/postServiceExtended';
import { Loading } from './theme';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';
import { authStorage } from '../utilities/authStorage';
import { logConsole } from '../utilities/logConsole';
import type {
  AppHeaderPageProps,
  IconStyles,
} from '../types/components/pages.types';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * React functional component representing the header of a page.
 *
 * @component
 * @param {AppHeaderPageProps} props - The properties passed to the component.
 * @param {string} props.title - The title of the page.
 * @param {string} props.fpHash - The fingerprint hash for unique identification.
 * @returns {JSX.Element} JSX element representing the AppHeaderPage component.
 */
const AppHeaderPage: React.FC<AppHeaderPageProps> = ({ fpHash, title }) => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');
  const { developmentMode } = useConexysConfig();

  const [menuRigth, setOpenMenuRigth] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [messageerror, setMessageerror] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [color, setColor] = useState<string>('');
  const [getfavorites, setFavoritesList] = useState<boolean | string>('');

  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const hash: string = window.location.pathname;

  useEffect(() => {
    // Read the user's favourites database
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;
    serviceFavorites(
      'get',
      fpHash,
      sessionID,
      'getfavorites',
      cxauthxc,
      t,
      setFavoritesList,
      setIsError,
      setError,
      setMessageerror,
      setLoading,
      setColor,
      configLogs,
      { url: hash },
    );
  }, []);

  const handleClickMenuRigth = useCallback((): void => {
    setOpenMenuRigth((prev) => !prev);
    const themeElement = document.getElementById('themeclass');
    if (themeElement) {
      themeElement.classList.toggle('sidebar-right-opened');
    }
  }, []);

  const handleClickFav = useCallback((): void => {
    logConsole(configLogs, 'info', '', hash);
    if (color !== '#ffcd38') {
      // Save the new parameter in the database, add or remove the new bookmark.
      serviceFavorites(
        'set',
        fpHash,
        sessionID,
        'setfavorites',
        cxauthxc,
        t,
        setFavoritesList,
        setIsError,
        setError,
        setMessageerror,
        setLoading,
        setColor,
        configLogs,
        { url: hash, title: title },
      );
    } else {
      serviceFavorites(
        'del',
        fpHash,
        sessionID,
        'delfavorites',
        cxauthxc,
        t,
        setFavoritesList,
        setIsError,
        setError,
        setMessageerror,
        setLoading,
        setColor,
        configLogs,
        { url: hash },
      );
    }
  }, [fpHash, sessionID, cxauthxc, t, color, hash, title]);

  const iconStyles: IconStyles = {
    fontSize: '33px',
    marginTop: '-6px',
    marginLeft: '6px',
    cursor: 'pointer',
    color: '#c3c3c3',
    width: '45px',
  };

  const iconFav: IconStyles = {
    fontSize: '14px',
    marginTop: '-4px',
    color: color,
  };

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

  return (
    <>
      <header className="page-header">
        <Typography variant="h2" gutterBottom>
          {title}&nbsp;&nbsp;&nbsp;
          <Loading type="appnotifications" error={error} loading={loading}>
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>{t('User.addtofavorites')}</Tooltip>}
            >
              <Button
                className="btn-shadow mr-3 btn btn-xs btn-dark add_favorite_btn"
                onClick={handleClickFav}
              >
                <i>
                  <FaStar style={iconFav} />
                </i>
              </Button>
            </OverlayTrigger>
          </Loading>
        </Typography>
        <div className="right-wrapper0 text-end">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="breadcrumbs0"
            style={{
              color: '#c3c3c3',
              display: 'inline-block',
              lineHeight: '50px',
            }}
          >
            <NavLink to="/dashboard" style={{ color: '#c3c3c3' }}>
              <i style={{ fontSize: '1.4rem' }}>
                <BiHomeAlt />
              </i>
            </NavLink>
            <Typography color="c3c3c3">{title}</Typography>
          </Breadcrumbs>
          {developmentMode ? (
            <Link
              onClick={handleClickMenuRigth}
              className="sidebar-right-toggle0"
            >
              {menuRigth ? (
                <i>
                  <BiChevronRight style={iconStyles} />
                </i>
              ) : (
                <i>
                  <BiChevronLeft style={iconStyles} />
                </i>
              )}
            </Link>
          ) : (
            <i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
          )}
        </div>
      </header>
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
};

export default AppHeaderPage;
