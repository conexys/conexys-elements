/**
 * @fileoverview
 * Form component
 * The Checkbox component you provided is a simple functional component that renders a checkbox (<input type="checkbox">).
 * @module components/form/components/Checkbox
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/Checkbox
 * @requires @mui/material/FormControlLabel
 */

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import Checkboxmui from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * Checkbox component.
 *
 * @component
 * @param {object} props - The properties of the Checkbox component.
 * @param {object} props.block - Information about the checkbox.
 * @param {string} props.block.name - The name of the checkbox.
 * @param {string} props.block.id - The ID of the checkbox.
 * @param {string} props.block.className - The CSS class for styling the checkbox.
 * @param {string} props.block.label - The label for the checkbox.
 * @param {string} props.block.ref - The reference class for the checkbox container.
 * @param {string} [props.block.value] - The value of the checkbox.
 * @returns {JSX.Element} The rendered Checkbox component.
 */
const Checkbox = ({ block }) => {
    const { name, id, label, ref, value } = block;
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(value === 'true');
    }, [value]);

    const handleChange = useCallback((event) => {
        setChecked(event.target.checked);
        if (import.meta.env.VITE_SHOW_CONSOLE_DATA === 'true') {
            console.log('%c [Conexys] [Data] ', 'color: #55ff00', event.target.checked);
        }
    }, []);

    return (
        <div className={`custom-checkbox custom-control custom-control-inline ${ref}`}>
            <FormControlLabel
                control={
                    <Checkboxmui
                        name={name}
                        id={id}
                        checked={checked}
                        onChange={handleChange}
                        value={checked}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label={label}
            />
            <br />
        </div>
    );
};

Checkbox.propTypes = {
    block: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        className: PropTypes.string,
        label: PropTypes.string.isRequired,
        ref: PropTypes.string,
        value: PropTypes.string,
    }).isRequired,
};

export default Checkbox;