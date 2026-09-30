/**
 * @fileoverview
 * Form component
 *
 * A date-picker input backed by MUI X `DatePicker` and the `dayjs` adapter.
 * Renders a calendar to select a date, following the same `block`-driven
 * pattern as the rest of the Conexys form components.
 *
 * @module components/form/components/InputDate
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import type {
  ApiError,
  InputDateProps,
} from '../../../types/components/form.types';
import { useConexysConfig } from '../../../config/ConexysConfig';
import { Uservalidationerror } from '../../../components/index';

type NullableDayjs = Dayjs | null;

/**
 * InputDate component for rendering a calendar-based date picker.
 *
 * @component
 * @param {object} props - The properties of the InputDate component.
 * @param {object} props.block - Information about the date input.
 * @returns {JSX.Element} The rendered InputDate component.
 */
const InputDate: React.FC<InputDateProps> = React.memo(
  ({ block }) => {
    const configLogs = useConexysConfig();
    const [t] = useTranslation('global');

    const currentValue: NullableDayjs = block.value
      ? (block.value as unknown as Dayjs)
      : null;

    const handleChange = (newValue: NullableDayjs): void => {
      if (!block.onChange) return;

      const syntheticEvent = {
        target: {
          name: block.name,
          // A valid date: ISO-8601 string (or empty string when cleared).
          value: newValue ? newValue.format('YYYY-MM-DD') : '',
        },
      };

      block.onChange(syntheticEvent as any);
    };

    const handleError = (err: unknown): void => {
      const error = err as ApiError;
      if (error?.response?.status === 401) Uservalidationerror(configLogs);
    };

    return (
      <div className={`form-group ${block.ref ?? ''}`}>
        <InputLabel htmlFor={block.id}>
          {block.label}
          {block.validate?.required && <span className="required">*</span>}
        </InputLabel>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={block.placeholder ?? block.label}
              value={currentValue}
              onChange={handleChange}
              slotProps={{
                textField: {
                  id: block.id,
                  name: block.name,
                  size: 'small',
                  fullWidth: true,
                  required: block.validate?.required,
                  error: Boolean(block.error),
                  helperText: block.helperText,
                },
              }}
              format="DD/MM/YYYY"
              onError={handleError}
            />
          </LocalizationProvider>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.block.value === nextProps.block.value &&
      prevProps.block.name === nextProps.block.name &&
      prevProps.block.label === nextProps.block.label &&
      prevProps.block.onChange === nextProps.block.onChange
    );
  },
);

export default InputDate;
