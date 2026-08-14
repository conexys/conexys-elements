/**
 * @fileoverview
 * Form component
 * The Checkbox component you provided is a simple functional component that renders a checkbox (<input type="checkbox">).
 * @module components/form/components/Checkbox
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Checkboxmui from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { logConsole } from '../../../utilities/logConsole';
import type { CheckboxProps } from '../../../types/components/form.types';
import { useConexysConfig } from '../../../config/ConexysConfig';

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
const Checkbox: React.FC<CheckboxProps> = ({ block }) => {
  const configLogs = useConexysConfig();
  const { name, id, label, ref, value } = block;
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(value === true || value === 'true');
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      // Propagar cambio a formInputs para que el formulario padre pueda reaccionar
      if (block.onChange) {
        const syntheticEvent = {
          target: {
            name: name || id,
            id: id || '',
            value: event.target.checked ? 'true' : 'false',
            type: 'checkbox',
          },
        } as React.ChangeEvent<HTMLInputElement>;
        block.onChange(syntheticEvent);
      }
      logConsole(configLogs, 'data', '', event.target.checked);
    },
    [block, name, id],
  );

  return (
    <div
      className={`custom-checkbox custom-control custom-control-inline ${ref}`}
    >
      <FormControlLabel
        control={
          <Checkboxmui
            name={name}
            id={id}
            checked={checked}
            onChange={handleChange}
            value={checked}
          />
        }
        label={label}
      />
      <br />
    </div>
  );
};

export default Checkbox;
