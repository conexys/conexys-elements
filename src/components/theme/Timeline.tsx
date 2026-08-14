/**
 * @fileoverview
 * Design of a component
 * @module components/theme/Timeline
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, forwardRef, useRef } from 'react';
import Card from './Card.jsx';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';
import { format, isValid } from 'date-fns';
import { Loading } from './index.jsx';
import { getservice2 } from '../../services/getServiceExtended';
import { authStorage } from '../../utilities/authStorage';
import type {
  DateformatProps,
  HourformatProps,
  UserLogItem,
} from '../../types/components/theme.types';
import type { FpHashProps } from '../../types/common';
import { useConexysConfig } from '../../config/ConexysConfig';

/**
 * Component representing the formatted date.
 *
 * @param {DateformatProps} props - The properties passed to the component.
 * @param {string} props.date - The date to be formatted.
 * @returns {JSX.Element} JSX element representing the formatted date.
 */
const Dateformat: React.FC<DateformatProps> = ({ date }) => {
  var formatdate;
  var actualdate;
  const timeZone = 'Europe/Madrid';

  // Use toLocaleString with specific timezone
  const dateObj = new Date(date);
  const nowObj = new Date();

  formatdate = dateObj.toLocaleDateString('es-ES', {
    timeZone: timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  actualdate = nowObj.toLocaleDateString('es-ES', {
    timeZone: timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return <>{formatdate === actualdate ? 'Today' : formatdate}</>;
};

/**
 * Component representing the formatted hour.
 *
 * @param {HourformatProps} props - The properties passed to the component.
 * @param {string} props.hour - The hour to be formatted.
 * @returns {JSX.Element} JSX element representing the formatted hour.
 */
const Hourformat: React.FC<HourformatProps> = ({ hour }) => {
  var formathour;
  const timeZone = 'Europe/Madrid';

  // Use toLocaleTimeString with specific timezone
  const timeObj = new Date(hour);
  formathour = timeObj.toLocaleTimeString('es-ES', {
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return <>{formathour}</>;
};

/**
 * Component representing the timeline events.
 *
 * @param {FpHashProps} props - The properties passed to the component.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the timeline events.
 */
const Rendertimeline: React.FC<FpHashProps> = ({ fpHash }) => {
  const configLogs = useConexysConfig();
  const [t] = useTranslation('global');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const datauserlogreset: UserLogItem[] = [
    {
      id: '0',
      date: '1900-01-01 00:00:01',
      log: 'none',
      ip: 'none',
    },
  ];

  // DATA
  const cxauthxc: string = authStorage.getAuthToken(configLogs) || ''; // Check if the user is logged in
  const sessionID: string = authStorage.getSessionId(configLogs) || ''; // Check if the user is logged in

  const [isError, setIsError] = useState<boolean>(false);
  const [datauserlog, setUserLog] = useState<UserLogItem[]>(datauserlogreset);
  const [messageerror, setMessageerror] = useState<string>('');

  const hasFetched = useRef<boolean>(false); // Prevent duplicate call

  useEffect(() => {
    if (hasFetched.current) return; // If already executed, do not run again
    hasFetched.current = true;
    getservice2(
      fpHash,
      sessionID,
      'userlog',
      cxauthxc,
      t,
      setUserLog,
      setIsError,
      setError,
      setMessageerror,
      setLoading,
      configLogs,
    );
  }, [fpHash, sessionID, cxauthxc, t]);

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

  let test: string;

  return (
    <Loading error={error} loading={loading}>
      {datauserlog.map((item) => {
        if (item.id === '0') {
          return (
            <Snackbar
              open={isError}
              autoHideDuration={6000}
              onClose={handleClose}
              key={vertical + horizontal}
              anchorOrigin={{ vertical, horizontal }}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: '100%' }}
              >
                {messageerror}
              </Alert>
            </Snackbar>
          );
        } else {
          if (isValid(new Date(item.date))) {
            if (test === format(new Date(item.date), 'dd/MM/yyyy')) {
              test = format(new Date(item.date), 'dd/MM/yyyy');
              return (
                <div key={item.id}>
                  <ol className="tm-items">
                    <li>
                      <div className="tm-box">
                        <p className="text-muted mb-0">
                          <Hourformat hour={item.date} />
                        </p>
                        <p>{item.log}</p>
                        <p>{item.ip}</p>
                      </div>
                    </li>
                  </ol>
                  <Snackbar
                    open={isError}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    key={vertical + horizontal}
                    anchorOrigin={{ vertical, horizontal }}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: '100%' }}
                    >
                      {messageerror}
                    </Alert>
                  </Snackbar>
                </div>
              );
            } else {
              test = format(new Date(item.date), 'dd/MM/yyyy');
              return (
                <div key={item.id}>
                  <div className="tm-title">
                    <h5 className="m-0 pt-2 pb-2 text-dark font-weight-semibold text-uppercase">
                      <Dateformat date={item.date} />
                    </h5>
                  </div>
                  <ol className="tm-items">
                    <li>
                      <div className="tm-box">
                        <p className="text-muted mb-0">
                          <Hourformat hour={item.date} />
                        </p>
                        <p>{item.log}</p>
                        <p>{item.ip}</p>
                      </div>
                    </li>
                  </ol>
                  <Snackbar
                    open={isError}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    key={vertical + horizontal}
                    anchorOrigin={{ vertical, horizontal }}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: '100%' }}
                    >
                      {messageerror}
                    </Alert>
                  </Snackbar>
                </div>
              );
            }
          } else {
            return (
              <div key={item.id}>
                <ol className="tm-items">
                  <li>
                    <div className="tm-box">
                      <p className="text-muted mb-0">{item.date}</p>
                      <p>{item.log}</p>
                      <p>{item.ip}</p>
                    </div>
                  </li>
                </ol>
                <Snackbar
                  open={isError}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  key={vertical + horizontal}
                  anchorOrigin={{ vertical, horizontal }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    {messageerror}
                  </Alert>
                </Snackbar>
              </div>
            );
          }
        }
      })}
    </Loading>
  );
};

/**
 * Component representing a timeline of user log events.
 *
 * @param {FpHashProps} props - The properties passed to the component.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the Timeline component.
 */
export default function Timeline({ fpHash }: FpHashProps): React.JSX.Element {
  const [t] = useTranslation('global');
  return (
    <Card title={t('login.latest_registrations')}>
      <div className="timeline timeline-simple mt-3 mb-3">
        <div className="tm-body">
          <Rendertimeline fpHash={fpHash} />
        </div>
      </div>
    </Card>
  );
}
