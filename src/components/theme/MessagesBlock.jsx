/**
 * @fileoverview
 * Design of a component
 * @module components/theme/MessagesBlock
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires react-router-dom
 * @requires @mui/material/Badge
 * @requires @mui/material/styles
 * @requires react-i18next
 * @requires ../../services/postServiceExtended
 * @requires @mui/material/Snackbar
 * @requires @mui/material/Alert
 * @requires ./index
 */

import React, { useEffect, useState, useCallback, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { servicePost2 } from '../../services/postServiceExtended.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Loading } from './index.jsx';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

/**
 * Functional component representing a block for displaying messages and notifications.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content of the messages block.
 * @param {string} props.fpHash - The fingerprint hash for user identification.
 * @returns {JSX.Element} JSX element representing the MessagesBlock component.
 */
export default function MessagesBlock ({children, fpHash}) {
    const [t] = useTranslation("global");

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -13,
            top: 0,
            padding: '0 4px',
        },
    }));

    //Show the number of messages
    //DATA
    const sessionID =  localStorage.getItem("cx_session");
    const cxauthxc =  localStorage.getItem("cxauthxc");
    const [unreadcount, setUnreadCount] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messageerror, setMessageerror] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpenMenu = useCallback(() => setOpen(true), []);
    const handleCloseMenu = useCallback(() => setOpen(false), []);
    
    useEffect(() => {
        servicePost2(fpHash, sessionID, 'unreadcount', cxauthxc, t, setUnreadCount, setIsError, setError, setMessageerror, setLoading);
    }, []);

    const newmessagedir = "/messages/newmessage";
    const messagesdir = "/messages/messages";
    const sendmessagesdir = "/messages/sendmessages";
    const draftdir = "/messages/draft";
    const notificationsdir = "/messages/notifications";
    const favouritedir = "/messages/favourite";
    const recyclebindir = "/messages/recyclebin";

    //Alert
    const vertical = 'top';
    const horizontal = 'center';
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsError(false);
    }, []);
    //Alert

    const actions = [
        { icon: <NavLink to={recyclebindir} className="menu-item"><DeleteIcon /></NavLink>, name: t('Notify.paperbin') },
        { icon: <NavLink to={favouritedir} className="menu-item"><FavoriteIcon /></NavLink>, name: t('Notify.favorites') },
        { icon: <NavLink to={notificationsdir} className="menu-item"><NotificationsIcon /></NavLink>, name: t('Notify.notifications')  },
        { icon: <NavLink to={draftdir} className="menu-item"><DraftsIcon /></NavLink>, name: t('Notify.draft_messages') },
        { icon: <NavLink to={sendmessagesdir} className="menu-item"><SendIcon /></NavLink>, name: t('Notify.sent_messages') },
        { icon: <NavLink to={messagesdir} className="menu-item"><AllInboxIcon /></NavLink>, name: t('Notify.inbox') },
        { icon: <NavLink to={newmessagedir} className="menu-item"><AddCircleOutlineIcon /></NavLink>, name: t('Notify.write_a_new_message') },
    ];

    return (
        <>
        <Loading type='appnotifications' error={error} loading={loading}>
            <section className="content-with-menu mailbox">
                <div className="content-with-menu-container" data-mailbox="" data-mailbox-view="folder">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <NavLink to={newmessagedir} className="btn btn-block btn-primary btn-md pt-2 pb-2 text-3">
                                        <i className="bx bx-envelope me-1 text-4 top-2 position-relative"></i> 
                                        {t('Notify.write_a_new_message')}
                                    </NavLink>
                                    <ul className="list-unstyled mt-3 pt-3">
                                        <li>
                                            <NavLink to={messagesdir} className="menu-item"><AllInboxIcon /> {t('Notify.inbox')} <StyledBadge badgeContent={unreadcount.message} overlap="circular" color="error"></StyledBadge></NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={sendmessagesdir} className="menu-item"><SendIcon /> {t('Notify.sent_messages')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={draftdir} className="menu-item"><DraftsIcon /> {t('Notify.draft_messages')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={notificationsdir} className="menu-item"><NotificationsIcon />{t('Notify.notifications')} <StyledBadge badgeContent={unreadcount.notification} overlap="circular" color="error"></StyledBadge></NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={favouritedir} className="menu-item"><FavoriteIcon /> {t('Notify.favorites')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={recyclebindir} className="menu-item"><DeleteIcon /> {t('Notify.paperbin')}</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mailbox-folder">
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
                    tooltipPlacement='left'
                    onClick={handleCloseMenu}
                />
                ))}
            </SpeedDial>
        </Loading>
        <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal} anchorOrigin={{ vertical, horizontal }}>
            <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                {messageerror}
            </Alert>
        </Snackbar>
        </>
    );
}

MessagesBlock.propTypes = {
    children: PropTypes.node.isRequired,
    fpHash: PropTypes.string.isRequired,
};
