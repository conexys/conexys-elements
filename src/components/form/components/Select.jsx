/**
 * @fileoverview
 * Form component
 * 
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/MenuItem
 * @requires @mui/material/InputLabel
 * @requires @mui/material/Select
 * @requires react-select/creatable
 * @requires react-i18next
 */

import React, { useState, useEffect, useCallback } from "react";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Selectmui from '@mui/material/Select';
import CreatableSelect from 'react-select/creatable';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const Select = ({ block }) => {
    const [t] = useTranslation("global");
    const [localValue, setLocalValue] = useState(block.value || block?.items?.[0]?.item || "");
    
    useEffect(() => {
        if (block.value !== undefined && block.value !== null) {
            setLocalValue(block.value);
        }
    }, [block.value]);

    useEffect(() => {
        if (block.referred) {
            updateReferredElements(localValue);
        }
    }, [localValue, block.items, block.referred]);

    const updateReferredElements = useCallback((currentValue) => {
        if (!block.referred || !block.items) return;
        
        Object.keys(block.items).forEach((key) => {
            const itemId = block.items[key].item;
            const elements = document.querySelectorAll(`.${itemId}`);
            elements.forEach(element => {
                element.style.display = currentValue === itemId ? 'block' : 'none';
            });
        });
    }, [block.items, block.referred]);

    const handleChange = useCallback((event) => {
        const newValue = event.target.value;
        setLocalValue(newValue);
        
        if (block.onChange) {
            const syntheticEvent = {
                target: {
                    name: block.name,
                    value: newValue
                },
                persist: () => {}
            };
            block.onChange(syntheticEvent);
        }
    }, [block.onChange, block.name]);

    const handleChangeMultiple = useCallback((selectedOptions) => {
        setLocalValue(selectedOptions);
        
        if (block.onChange) {
            const syntheticEvent = {
                target: {
                    name: block.name,
                    value: selectedOptions
                },
                persist: () => {}
            };
            block.onChange(syntheticEvent);
        }
    }, [block.onChange, block.name]);

    if (block.type === 'createselect') {
        return (
            <>
                <br />
                <div className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}>
                    <InputLabel id={`${block.id}-label`}>{block.label}{block.validate.required && <span className="required">*</span>}</InputLabel>
                    <CreatableSelect
                        isMulti
                        name={block.name}
                        inputId={block.id}
                        value={localValue}
                        onChange={handleChangeMultiple}
                        placeholder={t('general.select_addressee')}
                        formatCreateLabel={userInput => `Crear: ${userInput}`}
                        options={block.items}
                        className="react-select-container-cx"
                        classNamePrefix="react-select-cx"
                        menuPlacement="auto"
                    />
                </div>
                <br />
            </>
        );
    } else {
        return (
            <>
                <br />
                <div className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}>
                    <InputLabel id={`${block.id}-label`}>{block.label}{block.validate.required && <span className="required">*</span>}</InputLabel>
                    <Selectmui
                        name={block.name}
                        id={block.id}
                        value={localValue || ''}
                        displayEmpty
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    >
                        {block.items.map((option) => (
                            <MenuItem key={option.item} value={option.item}>{t(option.textitem)}</MenuItem>
                        ))}
                    </Selectmui>
                </div>
                <br />
            </>
        );
    }
};

Select.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        ref: PropTypes.string,
        value: PropTypes.string,
        referred: PropTypes.bool,
        onChange: PropTypes.func, // Añadir esta prop es crucial
        items: PropTypes.arrayOf(PropTypes.shape({
            item: PropTypes.string,
            textitem: PropTypes.string,
        })).isRequired,
        validate: PropTypes.shape({
            required: PropTypes.bool,
        }).isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
};

export default Select;