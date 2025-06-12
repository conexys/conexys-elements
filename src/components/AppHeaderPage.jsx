/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @fileoverview Componente de cabecera para páginas de la aplicación
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, forwardRef, useCallback, memo } from 'react';
import Typography from '@mui/material/Typography';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { BiHomeAlt, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { Loading } from './theme/index.jsx';
import { serviceFavorites } from '../services/postServiceExtended.jsx';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * React functional component representing the header of a page.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title of the page.
 * @param {string} props.fpHash - The fingerprint hash for unique identification.
 * @returns {JSX.Element} JSX element representing the AppHeaderPage component.
 */
const AppHeaderPage = memo(({ fpHash, title }) => {
    const [t] = useTranslation("Basicplugincrud");
    
    // Obtenemos el componente y los servicios compartidos
    //const Loading = window.conexysComponents?.UI?.Loading;
    //const serviceFavorites = window.conexysServices?.postServices?.favorites;

    
    // Estados agrupados por funcionalidad
    const [menuRigth, setOpenMenuRigth] = useState(false);
    const [favoriteStatus, setFavoriteStatus] = useState({
        favoritesList: '',
        color: '',
        loading: true,
        error: false
    });
    const [notification, setNotification] = useState({
        isOpen: false,
        message: '',
    });

    // Datos de sesión
    const sessionID = localStorage.getItem("cx_session");
    const cxauthxc = localStorage.getItem("cxauthxc");
    const hash = window.location.pathname;
    
    // Manejo de favoritos
    const updateFavoriteStatus = useCallback((favoritesList, color) => {
        setFavoriteStatus(prev => ({
            ...prev,
            favoritesList,
            color
        }));
    }, []);

    const handleServiceError = useCallback((error, message) => {
        setFavoriteStatus(prev => ({
            ...prev,
            error,
            loading: false
        }));
        setNotification({
            isOpen: true,
            message
        });
    }, []);

    const handleServiceLoading = useCallback((loading) => {
        setFavoriteStatus(prev => ({
            ...prev,
            loading
        }));
    }, []);

    // Cargar favoritos al inicio
    useEffect(() => {
        serviceFavorites(
            'get',
            fpHash,
            sessionID,
            'getfavorites',
            cxauthxc,
            t,
            (favoritesList) => updateFavoriteStatus(favoritesList, ''),
            (isError) => setNotification(prev => ({ ...prev, isOpen: isError })),
            (error) => setFavoriteStatus(prev => ({ ...prev, error })),
            (message) => setNotification(prev => ({ ...prev, message })),
            handleServiceLoading,
            (color) => setFavoriteStatus(prev => ({ ...prev, color })),
            { url: hash }
        );
    }, [fpHash, sessionID, cxauthxc, t, hash, updateFavoriteStatus, handleServiceLoading]);

    // Manejadores de eventos con useCallback
    const handleClickMenuRigth = useCallback(() => {
        setOpenMenuRigth(prev => !prev);
    }, []);

    const handleClickFav = useCallback(() => {
        if (import.meta.env.REACT_APP_SHOW_CONSOLE === 'true') {
            console.log('%c [Conexys] ', 'color: #55ff00', hash);
        }

        const action = favoriteStatus.favoritesList === false ? 'set' : 'del';
        const endpoint = favoriteStatus.favoritesList === false ? 'setfavorites' : 'delfavorites';
        const payload = favoriteStatus.favoritesList === false 
            ? { url: hash, title: title }
            : { url: hash };

        serviceFavorites(
            action,
            fpHash,
            sessionID,
            endpoint,
            cxauthxc,
            t,
            (favoritesList) => updateFavoriteStatus(favoritesList, ''),
            (isError) => setNotification(prev => ({ ...prev, isOpen: isError })),
            (error) => handleServiceError(error, ''),
            (message) => setNotification(prev => ({ ...prev, message })),
            handleServiceLoading,
            (color) => setFavoriteStatus(prev => ({ ...prev, color })),
            payload
        );
    }, [favoriteStatus.favoritesList, fpHash, hash, sessionID, cxauthxc, t, title, updateFavoriteStatus, handleServiceError, handleServiceLoading]);

    const handleCloseNotification = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Estilos
    const iconStyles = {
        fontSize: '33px',
        marginTop: '-6px', 
        marginLeft: '6px', 
        cursor: 'pointer',
        color: '#c3c3c3',
        width: '45px',
    };
    
    const iconFav = {
        fontSize: '14px',
        marginTop: '-4px',
        color: favoriteStatus.color
    };

    return (
        <>
            <header className="page-header">
                <Typography variant="h2" gutterBottom>
                    {title}&nbsp;&nbsp;&nbsp;
                    {Loading && (
                        <Loading 
                            type='appnotifications' 
                            error={favoriteStatus.error} 
                            loading={favoriteStatus.loading}
                        >
                            <OverlayTrigger 
                                key='top' 
                                placement='top' 
                                overlay={<Tooltip>{t('basicplugin_add_to_Favorites')}</Tooltip>}
                            >
                                <Button 
                                    className="btn-shadow mr-3 btn btn-xs btn-dark add_favorite_btn" 
                                    onClick={handleClickFav}
                                >
                                    <i><FaStar style={iconFav}/></i>
                                </Button>
                            </OverlayTrigger>
                        </Loading>
                    )}
                </Typography>
                <div className="right-wrapper0 text-end">
                    <Breadcrumbs 
                        aria-label="breadcrumb" 
                        className="breadcrumbs0" 
                        style={{color: '#c3c3c3', display: 'inline-block', lineHeight: '50px'}}
                    >
                        <Link href="/" style={{color: '#c3c3c3'}}>
                            <i style={{fontSize: '1.4rem'}}><BiHomeAlt /></i>
                        </Link>
                        <Typography color="c3c3c3">{title}</Typography>
                    </Breadcrumbs>
                    <Link onClick={handleClickMenuRigth} className="sidebar-right-toggle0">
                        <i>{menuRigth ? <BiChevronRight style={iconStyles}/> : <BiChevronLeft style={iconStyles}/>}</i>
                    </Link>
                </div>
            </header>
            <Snackbar 
                open={notification.isOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity='error' sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
});

AppHeaderPage.propTypes = {
    fpHash: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default AppHeaderPage;
