/**
 * @fileoverview
 * Form component
 * 
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/Switch
 * @requires @mui/material/FormControlLabel
 */

import React, { useState, useEffect, useCallback } from "react";
import Switchmui from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';

const Switch = ({ block }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(block.value === 'true');
        // Hide or show components according to initial value
        if (block.referred) {
            const elements = document.querySelectorAll(`.${block.name}`);
            elements.forEach(element => {
                element.style.display = block.value === 'true' ? 'block' : 'none';
            });
        }
    }, [block.value, block.name, block.referred]);

    const handleChange = useCallback((event) => {
        setChecked(event.target.checked);
        // Hide or show components according to selected value
        if (block.referred) {
            const elements = document.querySelectorAll(`.${block.name}`);
            elements.forEach(element => {
                element.style.display = event.target.checked ? 'block' : 'none';
            });
        }
    }, [block.name, block.referred]);

    return (
        <>
            <div className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}>
                <FormControlLabel
                    control={
                        <Switchmui
                            name={block.name}
                            id={block.id}
                            checked={checked}
                            onChange={handleChange}
                            value={checked}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label={block.label}
                />
            </div>
            <br />
        </>
    );
};

Switch.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        ref: PropTypes.string,
        value: PropTypes.string,
        referred: PropTypes.bool,
    }).isRequired,
};

export default Switch;