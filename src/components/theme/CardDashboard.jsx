/**
 * @fileoverview
 * Design of a component
 * @module components/theme/CardDashboard
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Functional component representing a dashboard card with a title and content.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title of the dashboard card.
 * @param {React.ReactNode} props.children - The content of the dashboard card.
 * @returns {JSX.Element} JSX element representing the CardDashboard component.
 */
export default function CardDashboard({ children, title }) {
    return (
        <section className="card grid-square-dashboard">
            <header className="card-header dragHandle">
                <h2 className="card-title">{title}</h2>
            </header>
            <div className="card-body">
                {children}
            </div>
        </section>
    );
}

CardDashboard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};