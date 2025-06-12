/**
 * @fileoverview
 * Form component
 * @module components/form/components/Button
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 */

import React from "react";
import PropTypes from 'prop-types';

/**
 * Heading component for rendering various heading sizes.
 *
 * @component
 * @param {object} props - The properties of the Button component.
 * @param {object} props.block - Information about the button.
 * @param {string} props.block.text - The text content of the button.
 * @param {string} props.block.className - The class name for the button container.
 * @param {string} props.block.classNameButton - The class name for the button element.
 * @param {function} props.block.onclick - The click handler for the button.
 * @param {string} props.block.id - The id for the button element.
 * @param {string} props.block.type - The type of the button element.
 * @returns {JSX.Element} The rendered Button component.
 */
const Button = ({ block }) => {
    const { className, ref, classNameButton, onclick, id, type, text } = block;

    return (
        <div className={className}>
            <div className={ref}>
                <button className={classNameButton} onClick={onclick} id={id} type={type}>
                    {text}
                </button>
                <br /><br />
            </div>
        </div>
    );
};

Button.propTypes = {
    block: PropTypes.shape({
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        ref: PropTypes.string,
        classNameButton: PropTypes.string,
        onclick: PropTypes.func,
        id: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

export default Button;