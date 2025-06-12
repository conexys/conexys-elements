/**
 * @fileoverview
 * Design of a component
 * @module components/theme/Timeline
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires ./Card
 * @requires react-i18next
 * @requires @mui/material/Snackbar
 * @requires @mui/material/Alert
 * @requires date-fns
 * @requires date-fns-tz
 * @requires ./index
 * @requires ../../services/postServiceExtended
 */

import React, { useEffect, useState, forwardRef }from 'react';
import Card from "./Card.jsx";
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { format, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Loading } from './index.jsx';
import { servicePost2 } from '../../services/postServiceExtended.jsx';
import PropTypes from 'prop-types';

/**
 * Component representing the formatted date.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.date - The date to be formatted.
 * @returns {JSX.Element} JSX element representing the formatted date.
 */
const Dateformat = ({date}) => {
    var formatdate;
    var actualdate;
    const timeZone = "Europe/Madrid";
    formatdate = formatInTimeZone(new Date(date), timeZone, "dd/MM/yyyy");
    actualdate = formatInTimeZone(new Date(), timeZone, "dd/MM/yyyy");
    
    return (
        <>
            {formatdate === actualdate ? "Hoy" : formatdate}
        </>
    );
};

Dateformat.propTypes = {
    date: PropTypes.string.isRequired,
};


/**
 * Component representing the formatted hour.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.hour - The hour to be formatted.
 * @returns {JSX.Element} JSX element representing the formatted hour.
 */
const Hourformat = ({hour}) => {
    var formathour;
    const timeZone = "Europe/Madrid";
    formathour = formatInTimeZone(new Date(hour), timeZone, "HH:mm:ss");

    return (
        <>{formathour}</>
    );
};

Hourformat.propTypes = {
    hour: PropTypes.string.isRequired,
};

/**
 * Component representing the timeline events.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the timeline events.
 */
const Rendertimeline = ({ fpHash }) => {
    const [t] = useTranslation("global");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const datauserlogreset = [
        {
            id: '0',
            date: "1900-01-01 00:00:01",
            log: "none",
            ip: "none"
        },
    ];

    //DATA
    const sessionID =  localStorage.getItem("cx_session");
    const cxauthxc =  localStorage.getItem("cxauthxc");
    const [isError, setIsError] = useState(false);
    const [datauserlog, setUserLog] = useState(datauserlogreset);
    const [messageerror, setMessageerror] = useState('');

    useEffect(() => {
        servicePost2(fpHash, sessionID, 'userlog', cxauthxc, t, setUserLog, setIsError, setError, setMessageerror, setLoading);
    }, [fpHash, sessionID, cxauthxc, t]);

    //Alert
    const vertical = 'top';
    const horizontal = 'center';
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsError(false);
    }
    //Alert

    var test;

    return (
        <Loading error={error} loading={loading}>
            {datauserlog.map( (item) => {
                if (item.id === '0'){
                    return (
                        <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                            <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                                {messageerror}
                            </Alert>
                        </Snackbar>
                    )
                } else {
                    if(isValid(new Date(item.date))){
                        if (test === format(new Date(item.date), "dd/MM/yyyy")){
                            test = format(new Date(item.date), "dd/MM/yyyy")
                            return (
                                <div key={item.id}>
                                    <ol className="tm-items">
                                        <li>
                                            <div className="tm-box">
                                                <p className="text-muted mb-0"><Hourformat hour={item.date}/></p>
                                                <p>{item.log}</p>
                                                <p>{item.ip}</p>
                                            </div>
                                        </li>
                                    </ol>
                                    <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                                        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                                            {messageerror}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            )
                        } else {
                            test = format(new Date(item.date), "dd/MM/yyyy")
                            return (
                                <div key={item.id}>
                                    <div className="tm-title">
                                        <h5 className="m-0 pt-2 pb-2 text-dark font-weight-semibold text-uppercase"><Dateformat date={item.date}/></h5>
                                    </div>
                                    <ol className="tm-items">
                                        <li>
                                            <div className="tm-box">
                                                <p className="text-muted mb-0"><Hourformat hour={item.date}/></p>
                                                <p>{item.log}</p>
                                                <p>{item.ip}</p>
                                            </div>
                                        </li>
                                    </ol>
                                    <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                                        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                                            {messageerror}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            )
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
                                <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                                    <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                                        {messageerror}
                                    </Alert>
                                </Snackbar>
                            </div>
                        )
                    }
                }
            })}
        </Loading>
    )
};

Rendertimeline.propTypes = {
    fpHash: PropTypes.string.isRequired,
};

/**
 * Component representing a timeline of user log events.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the Timeline component.
 */
export default function Timeline({fpHash}) {
    const [t] = useTranslation("global");
    return (
        <Card title={t('login.latest_registrations')}>
            <div className="timeline timeline-simple mt-3 mb-3">
                <div className="tm-body">
                    <Rendertimeline fpHash={fpHash}/>
                </div>
            </div>
        </Card>
        );
};

Timeline.propTypes = {
    fpHash: PropTypes.string.isRequired,
};
