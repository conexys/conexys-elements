/**
 * @fileoverview
 * Form component
 *
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Switchmui from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { SwitchProps } from '../../../types/components/form.types';

const Switch: React.FC<SwitchProps> = ({ block }) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(block.value === 'true');
    // Hide or show components according to initial value
    if (block.referred) {
      const elements = document.querySelectorAll(`.${block.name}`);
      elements.forEach((element) => {
        (element as HTMLElement).style.display =
          block.value === 'true' ? 'block' : 'none';
      });
    }
  }, [block.value, block.name, block.referred]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setChecked(event.target.checked);
      // Hide or show components according to selected value
      if (block.referred) {
        const elements = document.querySelectorAll(`.${block.name}`);
        elements.forEach((element) => {
          (element as HTMLElement).style.display = event.target.checked
            ? 'block'
            : 'none';
        });
      }
    },
    [block.name, block.referred],
  );

  return (
    <>
      <div
        className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
      >
        <FormControlLabel
          control={
            <Switchmui
              name={block.name}
              id={block.id}
              checked={checked}
              onChange={handleChange}
              value={checked}
              slotProps={{ htmlInput: { 'aria-label': 'controlled' } }}
            />
          }
          label={block.label}
        />
      </div>
      <br />
    </>
  );
};

export default Switch;
