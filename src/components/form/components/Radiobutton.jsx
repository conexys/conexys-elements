/**
 * @fileoverview
 * Form component
 * 
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/Radio
 * @requires @mui/material/RadioGroup
 * @requires @mui/material/InputLabel
 * @requires @mui/material/FormControlLabel
 */

import React, { useState, useEffect, useCallback } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';


const Radiobutton = ({ block }) => {
    const [selected, setSelected] = useState(block.items[0].item); // Set the first value as default

    useEffect(() => {
        setSelected(block.value);
        // Hide or show components according to initial value
        if (block.referred) {
            Object.keys(block.items).forEach((key) => {
                const itemId = block.items[key].item;
                const elements = document.querySelectorAll(`.${itemId}`);
                elements.forEach(element => {
                    element.style.display = block.value === itemId ? 'none' : 'block';
                });
            });
        }
    }, [block.value, block.items, block.referred]);

    const handleChange = useCallback((event) => {
        setSelected(event.target.value);
        // Hide or show components according to selected value
        if (block.referred) {
            Object.keys(block.items).forEach((key) => {
                const itemId = block.items[key].item;
                const elements = document.querySelectorAll(`.${itemId}`);
                elements.forEach(element => {
                    element.style.display = event.target.value === itemId ? 'none' : 'block';
                });
            });
        }
    }, [block.items, block.referred]);

    return (
        <>
            <br />
            <div className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}>
                <InputLabel id={`${block.id}-label`}>{block.label}</InputLabel>
                <TextField style={{ display: 'none' }} type='hidden' id={block.id} name={block.name} value={selected || ''} />
                <RadioGroup
                    name={`${block.name}_0011_none`}
                    id={`${block.id}_0011_none`}
                    aria-label={`${block.name}_0011_none`}
                    value={selected || ''}
                    row
                >
                    {block.items.map((option) => (
                        <FormControlLabel
                            key={option.item}
                            value={option.item}
                            control={<Radio />}
                            label={option.textitem}
                            onChange={handleChange}
                        />
                    ))}
                </RadioGroup>
            </div>
            <br />
        </>
    );
};

Radiobutton.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        ref: PropTypes.string,
        value: PropTypes.string,
        referred: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({
            item: PropTypes.string.isRequired,
            textitem: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
};

export default Radiobutton;