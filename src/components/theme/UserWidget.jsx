/**
 * @fileoverview
 * Design of a component
 * @module components/theme/UserWidget
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires ./CardUser
 * @requires ../../../src/assets/images/user.png
 * @requires ../../services/postService
 * @requires react-i18next
 * @requires @mui/material/Snackbar
 * @requires @mui/material/Alert
 * @requires ../../components/index
 * @requires @fingerprintjs/fingerprintjs
 * @requires ../../constants/global
 * @requires ./index
 * @requires ../../services/postServiceExtended
 */

import React, { useEffect, useState, forwardRef } from 'react';
import CardUser from "./CardUser.jsx";
//import UserImg from '../../../src/assets/images/user.png';
import postserviceService from '../../services/postService.jsx';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Uservalidationerror } from "../../components/index.jsx";
import { Url } from '../../constants/global.jsx';
import { Loading } from './index.jsx';
import { servicePost2 } from '../../services/postServiceExtended.jsx';
import PropTypes from 'prop-types';
import { getOrSetFingerprint } from '../../shared/baseFingerprintService.jsx';

/**
 * Component representing a user widget with profile information.
 * This component will display the user profile, searchable by user name or user ID.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.username - The username of the user.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the UserWidget component.
 */
export default function UserWidget({ username, fpHash }) {
    const [t] = useTranslation("global");

    //DATA
    const sessionID =  localStorage.getItem("cx_session");
    const cxauthxc =  localStorage.getItem("cxauthxc");
    const [isError, setIsError] = useState(false);
    const [datauserdata, setUserData] = useState('');
    const [datausertype, setUsertype] = useState('');
    const authorization = true;
    const [avatar, setAvatar] = useState(false);
    const [cover, setCover] = useState(false);
    const [rollist, setRollist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [messageerror, setMessageerror] = useState('');

    useEffect(() => {
        servicePost2(fpHash, sessionID, 'rollist', cxauthxc, t, setRollist, setIsError, setError, setMessageerror, setLoading);
    }, [fpHash, sessionID, cxauthxc, t]);

    useEffect(() => {
        const getuserdata = async () => {
            const visitorIdHash = await getOrSetFingerprint(fpHash);
            try {
                const getuserdata = await postserviceService.postservice({
                    sessionID,
                    cxauthxc,
                    postServerURL:'getdatausername',
                    authorization,
                    fingerprint: visitorIdHash,
                    userUSERNAME: username
                });
                setUserData(getuserdata.data[0]);

                const userTypeObject = rollist ? rollist.find(item => item.id === getuserdata.data[0].user_type) : null;
                const userType = userTypeObject ? userTypeObject.user_type : getuserdata.data[0].user_type;
                setUsertype (userType)

                if(getuserdata.data[0].profile_pic === '' || getuserdata.data[0].profile_pic === null){
                    //setAvatar(UserImg)
                } else {
                    setAvatar(Url+'../uploads/avatar/'+getuserdata.data[0].profile_pic)
                }
                if(getuserdata.data[0].cover_pic === '' || getuserdata.data[0].cover_pic === null){
                    setCover('')
                } else {
                    setCover(Url+'../uploads/cover/'+getuserdata.data[0].cover_pic)
                }
                if(import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true'){
                    console.log('%c [Conexys] [Data] ', 'color: #55ff00', getuserdata.data[0]);
                };
                setIsError(false);
            } catch (err) {
                setError(true);
                if (!err?.response) {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('login.no_server_response'));
                    setIsError(true);
                    setMessageerror(t('login.no_server_response'));
                } else if (err.response?.status === 400) {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('login.command_not_found'));
                    setIsError(true);
                    setMessageerror(t('login.command_not_found'));
                } else if (err.response?.status === 401) {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('login.invalid_data_username_mail'));
                    setIsError(true)
                    setMessageerror(t('login.invalid_data_username_mail'));
                    Uservalidationerror();
                } else if (err.response?.status === 403) {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('error.no_permission'));
                    setIsError(true)
                    setMessageerror(t('error.no_permission'));
                } else {
                    console.log('%c [Conexys] [Error] ', 'color: #fc0000', t('login.unknown_error'));
                    setIsError(true);
                    setMessageerror(t('login.unknown_error'));
                }
            } finally {
                setLoading(false);
            }
        }
        getuserdata();
    }, [rollist, fpHash, sessionID, cxauthxc, t, username]);

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

    const theObj = {__html:datauserdata.biography};

    return (
        <>
            <Loading error={error} loading={loading}>
                <CardUser user={datauserdata.name+' '+datauserdata.lastname} username={datauserdata.username} profilepicture={avatar} coverpicture={cover} fpHash={fpHash}>
                    <h3>{t('login.biography')}</h3>
                    <div dangerouslySetInnerHTML={theObj} />
                    <hr className="solid short"/>
                    <ul className="simple-todo-list mt-3">
                        <li><b>{t('login.username')}</b>: {datauserdata.username}</li>
                        <li><b>{t('login.email')}</b>: {datauserdata.email}</li>
                        <li><b>{t('login.name')}</b>: {datauserdata.name}</li>
                        <li><b>{t('login.lastname')}</b>: {datauserdata.lastname}</li>
                        <li><b>{t('User.type_of_user')}</b>: {datausertype}</li>
                    </ul>
                </CardUser>
            </Loading>
        <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
            <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                {messageerror}
            </Alert>
        </Snackbar>
        </>
    );
};

UserWidget.propTypes = {
    username: PropTypes.string.isRequired,
    fpHash: PropTypes.string.isRequired,
};
