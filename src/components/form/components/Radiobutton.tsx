/**
 * @fileoverview
 * Form component
 *
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import type {
  RadioItem,
  RadiobuttonProps,
} from '../../../types/components/form.types';

const Radiobutton: React.FC<RadiobuttonProps> = ({ block }) => {
  const [selected, setSelected] = useState<string>(block.items[0].item); // Set the first value as default

  useEffect(() => {
    setSelected(block.value || '');
    // Hide or show components according to initial value
    if (block.referred) {
      Object.keys(block.items).forEach((key) => {
        const itemId = block.items[parseInt(key)].item;
        const elements = document.querySelectorAll(`.${itemId}`);
        elements.forEach((element) => {
          (element as HTMLElement).style.display =
            block.value === itemId ? 'none' : 'block';
        });
      });
    }
  }, [block.value, block.items, block.referred]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setSelected(event.target.value);
      // Hide or show components according to selected value
      if (block.referred) {
        Object.keys(block.items).forEach((key) => {
          const itemId = block.items[parseInt(key)].item;
          const elements = document.querySelectorAll(`.${itemId}`);
          elements.forEach((element) => {
            (element as HTMLElement).style.display =
              event.target.value === itemId ? 'none' : 'block';
          });
        });
      }
    },
    [block.items, block.referred],
  );

  return (
    <>
      <br />
      <div
        className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
      >
        <InputLabel id={`${block.id}-label`}>{block.label}</InputLabel>
        <TextField
          style={{ display: 'none' }}
          type="hidden"
          id={block.id}
          name={block.name}
          value={selected || ''}
        />
        <RadioGroup
          name={`${block.name}_0011_none`}
          id={`${block.id}_0011_none`}
          aria-label={`${block.name}_0011_none`}
          value={selected || ''}
          onChange={handleChange}
          row
        >
          {block.items.map((option: RadioItem) => (
            <FormControlLabel
              key={option.item}
              value={option.item}
              control={<Radio />}
              label={option.textitem}
            />
          ))}
        </RadioGroup>
      </div>
      <br />
    </>
  );
};

export default Radiobutton;
