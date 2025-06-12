/**
 * @fileoverview
 * Design of a component
 * @module components/theme/MailTemplateWidget
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires react-i18next
 * @requires @mui/material/Snackbar
 * @requires @mui/material/Alert
 * @requires ../../services/postServiceExtended
 * @requires ./index
 */

import React, { useEffect, useState, useCallback, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { servicePost2 } from '../../services/postServiceExtended.jsx';
import { Loading } from './index.jsx';
import PropTypes from 'prop-types';

/**
 * Component representing a user widget with profile information.
 * Este componente mostrara el perfil de usuario, se puede buscar por el nombre de usuario o por si ID de usuario
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.username - The username of the user.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the UserWidget component.
 */
export default function MailTemplateWidget({id, fpHash}) {
    const [t] = useTranslation("global");

    //DATA
    const sessionID =  localStorage.getItem("cx_session");
    const cxauthxc =  localStorage.getItem("cxauthxc");
    const [isError, setIsError] = useState(false);
    const [getthemedata, setThemeData] = useState([{
        id: "",
        module: "",
        code: "",
        template_name: "",
        language: "",
        html: "",
        title: ""
    }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [messageerror, setMessageerror] = useState('');

    useEffect(() => {
        servicePost2(fpHash, sessionID, 'gettemplatesmailid', cxauthxc, t, setThemeData, setIsError, setError, setMessageerror, setLoading, {itemID: id});
    }, [fpHash, sessionID, cxauthxc, t, id]);

    //Alert
    const vertical = 'top';
    const horizontal = 'center';
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
    });
    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsError(false);
    }, []);
    //Alert

    const theObj = {__html:getthemedata[0].html};
    if(import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true'){
        console.log('%c [Conexys] [Data] ', 'color: #55ff00', getthemedata);
    }

    return (
        <>
            <Loading error={error} loading={loading}>
                <h3>{t('Setting.SUBJECT')}: {getthemedata[0].title}</h3>
                <br></br>
                <h4>{t('Setting.MESSAGE')}:</h4>
                <div dangerouslySetInnerHTML={theObj} />
            </Loading>
            <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {messageerror}
                </Alert>
            </Snackbar>
        </>
    );
}

MailTemplateWidget.propTypes = {
    id: PropTypes.string.isRequired,
    fpHash: PropTypes.string.isRequired,
};
