/**
 * @fileoverview
 * Design of a component
 * @module components/theme/Card
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Functional component representing a card with a title and content.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title of the card.
 * @param {React.ReactNode} props.children - The content of the card.
 * @param {boolean} props.inParagraph - Whether the card is rendered within a paragraph.
 * @returns {JSX.Element} JSX element representing the Card component.
 */
const Card = ({ children, title, inParagraph = false }) => {
    // Cuando inParagraph es true, usamos span en lugar de div
    const ContentContainer = inParagraph ? 'span' : 'section';
    const InnerContainer = inParagraph ? 'span' : 'div';
    
    return (
        <ContentContainer className="card">
            <InnerContainer className="card-body">
                {title && 
                    <InnerContainer className="card-title-container">
                        {inParagraph ? 
                            <span className="card-title">{title}</span> : 
                            <h5 className="card-title">{title}</h5>
                        }
                    </InnerContainer>
                }
                <InnerContainer className="card-content">
                    {children}
                </InnerContainer>
            </InnerContainer>
        </ContentContainer>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    inParagraph: PropTypes.bool,
};

export default Card;