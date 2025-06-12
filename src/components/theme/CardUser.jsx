/**
 * @fileoverview
 * Design of a component
 * @module components/theme/CardUser
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires react-router-dom
 * @requires react-i18next
 * @requires ../../assets/images/user.png
 * @requires @mui/material/Badge
 * @requires @mui/material/styles
 * @requires ../../services/postService
 * @requires @fingerprintjs/fingerprintjs
 * @requires ../../components/index
 * @requires ./index'
 * @requires @mui/material/Snackbar
 * @requires @mui/material/Alert
 */

/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//import UserImg from '../../assets/images/user.png';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import postserviceService from '../../services/postService.jsx';
import { Uservalidationerror } from "../../components/index.jsx";
import { Loading } from './index.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { getOrSetFingerprint } from '../../shared/baseFingerprintService.jsx';

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
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content of the card.
 * @param {string} props.user - The user's name.
 * @param {string} props.username - The user's username.
 * @param {string} props.profilepicture - The URL of the user's profile picture.
 * @param {string} props.coverpicture - The URL of the user's cover picture.
 * @param {string} props.fpHash - The fingerprint hash for unique identification.
 * @returns {JSX.Element} JSX element representing the CardUser component.
 */
export default function CardUser ({children, user, username, profilepicture, coverpicture, fpHash}) {
    const [t] = useTranslation("global");
    const editprofiledir = "/editprofile";

    const coverStyles = {
        backgroundImage: `url(${coverpicture})`,
        backgroundSize: 'cover'
    };

    //DATA
    const sessionID =  localStorage.getItem("cx_session");
    const cxauthxc =  localStorage.getItem("cxauthxc");
    const authorization = true;
    const [isError, setIsError] = useState(false);
    const [datauserstatus, setUserStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [messageerror, setMessageerror] = useState('');

    useEffect(() => {
        if(username){
        const getuserdata = async () => {
            const visitorIdHash = await getOrSetFingerprint(fpHash);
            try {
                const getuserstatus = await postserviceService.postservice({
                    sessionID,
                    cxauthxc,
                    postServerURL:'userstatus',
                    authorization,
                    fingerprint: visitorIdHash,
                    userUSERNAME: username
                });
                setUserStatus(getuserstatus.data);
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
        }
    }, [username, fpHash, sessionID, cxauthxc, t]);

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

    return (
        <>
            <Loading error={error} loading={loading}>
                <section className="card">
                    <header className="card-header bg-primary" style={coverStyles} >
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
                                    {profilepicture ? (
                                        <img src={profilepicture} />
                                    ) : (
                                        {/*<img src={UserImg} />*/}
                                    )}
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
                                        <img src={profilepicture} />
                                    ) : (
                                        {/*<img src={UserImg} />*/}
                                    )}
                                </StyledBadgeOffline>
                            )}
                            </div>
                            <div className="profile-info">
                                <h4 className="name font-weight-semibold mb-0">{user}</h4>
                                <h5 className="role mt-0">@{username}</h5>
                                <div className="profile-footer">
                                    <NavLink  to={editprofiledir}>({t('System.edit_profile')})</NavLink>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="card-body">
                        {children}
                    </div>
                </section>
            </Loading>
            <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {messageerror}
                </Alert>
            </Snackbar>
        </>
    );
}

CardUser.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.string.isRequired,
    username: PropTypes.string,
    profilepicture: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    coverpicture: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    fpHash: PropTypes.string.isRequired,
};