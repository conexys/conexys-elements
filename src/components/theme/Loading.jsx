/**
 * @fileoverview
 * @module components/header/AppNotifications
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires react-cssfx-loading
 * @requires @mui/icons-material/GppBad
 * @requires react-i18next
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FadingBalls } from "react-cssfx-loading";
import GppBadIcon from '@mui/icons-material/GppBad';

/**
 * Component to display a Loading
 * @param {object} props - The component props.
 * @param {string} props.type - The type of loading indicator.
 * @param {boolean} props.error - Indicates if there is an error.
 * @param {boolean} props.loading - Indicates if the content is loading.
 * @param {React.ReactNode} props.children - The content to display when not loading.
 * @returns {JSX.Element} - The Loading component.
 */
const Loading = ({children, type, error, loading}) => {
    if (type === 'flex'){
        return (
            <div className="bounce-loader" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <FadingBalls color="#777"/>
            </div>
        );
    } else if (type === 'appnotifications'){
        return (
            <>
                {error ? (
                    <ul className="notifications">
                        <li>
                            <div style={{top: 10}}>ERROR</div>
                        </li>
                    </ul>
                ) : (
                    loading ? (
                        <ul className="notifications">
                            <li>
                                <div style={{top: 10}}><FadingBalls color="#777"/></div>
                            </li>
                        </ul>
                    ) : (
                        children
                    )
                )}
            </>
        )
    } else {
        return (
            <>
                {error ? (
                    <div><GppBadIcon /> </div>
                ) : (
                    loading ? (
                        <div><FadingBalls color="#777"/></div>
                    ) : (
                        children
                    )
                )}
            </>
        );
    };
};

Loading.propTypes = {
    type: PropTypes.string,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.node,
};

export default Loading;