/**
 * @fileoverview
 * Dashboard Error Page Header Component
 * This code defines a React component called AppHeaderPage404, which represents the header of a 404 error page in the control panel.
 * This component provides a header structure similar to the AppHeaderPage component, but is designed specifically for 404 error pages. It includes elements such as the page title, breadcrumb navigation links and a button to open or close the right menu. The right menu handling logic and styles are similar to the previous component.
 * @module components/pages/AppHeaderPage404
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/Typography
 * @requires @mui/material/Breadcrumbs
 * @requires @mui/material/Link
 * @requires react-icons/bi
 */

import React, { useState, useCallback, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { BiHomeAlt } from "react-icons/bi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { NavLink } from 'react-router-dom';

/**
 * React functional component representing the header of a 404 error page.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title of the 404 error page.
 * @returns {JSX.Element} JSX element representing the AppHeaderPage404 component.
 */
const AppHeaderPage404 = ({title}) => {
    const [menuRigth, setOpenMenuRigth] = useState(false);

    const handleClickMenuRigth = useCallback(() => {
        setOpenMenuRigth(prev => !prev);
        document.getElementById("themeclass").classList.toggle('sidebar-right-opened');
    }, []);

    useEffect(() => {
        if (menuRigth) {
            document.getElementById("themeclass").classList.add('sidebar-right-opened');
        } else {
            document.getElementById("themeclass").classList.remove('sidebar-right-opened');
        }
    }, [menuRigth]);

    const iconStyles = {
        fontSize: '33px',
        marginTop: '-6px', 
        marginLeft: '6px', 
        cursor: 'pointer',
        color: '#c3c3c3',
        width: '45px',
    };

    /**
     * JSX representing the AppHeaderPage404 component.
     * @returns {JSX.Element}
     */
    return (
        <header className="page-header">
            <Typography variant="h2" gutterBottom>{title}&nbsp;&nbsp;&nbsp;</Typography>
            <div className="right-wrapper0 text-end">
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs0" style={{color: '#c3c3c3', display: 'inline-block', lineHeight: '50px'}}>
                    <NavLink to="/dashboard" style={{color: '#c3c3c3'}}>
                        <i style={{fontSize: '1.4rem'}}><BiHomeAlt /></i>
                    </NavLink>
                </Breadcrumbs>
                {import.meta.env.VITE_DEVELOPMENT_MODE === 'true' ? (
                    <Link onClick={handleClickMenuRigth} className="sidebar-right-toggle0">
                    {menuRigth ? (
                        <i><BiChevronRight style={iconStyles}/></i>
                    ) : (
                        <i><BiChevronLeft style={iconStyles}/></i>
                    )}
                    </Link>
                ) : (
                    <i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
                )}
            </div>
        </header>
    );

};

export default AppHeaderPage404;