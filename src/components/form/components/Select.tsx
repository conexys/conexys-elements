/**
 * @fileoverview
 * Form component
 *
 * @module components/form/components/Switch
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Selectmui from '@mui/material/Select';
import CreatableSelect from 'react-select/creatable';
import { useTranslation } from 'react-i18next';
import type { ActionMeta, MultiValue, SingleValue } from 'react-select';
import type {
  SelectOption,
  SelectProps,
} from '../../../types/components/form.types';
import { useConexysConfig } from '../../../config/ConexysConfig';
import { logConsole } from '../../../utilities/logConsole';

const Select: React.FC<SelectProps> = ({ block }) => {
  const [t] = useTranslation('global');
  const [localValue, setLocalValue] = useState<string | SelectOption[]>(
    block.value || block?.items?.[0]?.item || '',
  );

  useEffect(() => {
    if (block.value !== undefined && block.value !== null) {
      setLocalValue(block.value);
    }
  }, [block.value]);

  useEffect(() => {
    if (block.referred) {
      updateReferredElements(localValue as string);
    }
  }, [localValue, block.items, block.referred]);

  const updateReferredElements = useCallback(
    (currentValue: string): void => {
      if (!block.referred || !block.items) return;

      Object.keys(block.items).forEach((key) => {
        const itemId = block.items[parseInt(key)].item;
        const elements = document.querySelectorAll(`.${itemId}`);
        elements.forEach((element) => {
          (element as HTMLElement).style.display =
            currentValue === itemId ? 'block' : 'none';
        });
      });
    },
    [block.items, block.referred],
  );

  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } }),
    ): void => {
      const newValue = event.target.value as string;
      setLocalValue(newValue);

      if (block.onChange) {
        block.onChange(event);
      }
    },
    [block.onChange],
  );

  const handleChangeMultiple = useCallback(
    (selectedOptions: MultiValue<SelectOption>): void => {
      setLocalValue(selectedOptions as SelectOption[]);

      if (block.onChange) {
        const syntheticEvent = {
          target: {
            name: block.name,
            value: selectedOptions,
          },
        };
        block.onChange(syntheticEvent as any);
      }
    },
    [block.onChange, block.name],
  );

  const handleCreateSingle = useCallback(
    async (
      newValue: SingleValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>,
    ): Promise<void> => {
      const configLogs = useConexysConfig();
      if (actionMeta.action === 'create-option' && newValue) {
        try {
          if (block.onCreateNew) {
            const createdOption = await block.onCreateNew(
              {
                value: newValue.value,
                label: newValue.label,
              },
              block.name,
            );

            if (createdOption) {
              setLocalValue(createdOption.value);

              if (block.onChange) {
                const syntheticEvent = {
                  target: {
                    name: block.name,
                    value: createdOption.value,
                  },
                };
                block.onChange(syntheticEvent as any);
              }
              return;
            }
          }

          setLocalValue(newValue.value);

          if (block.onChange) {
            const syntheticEvent = {
              target: {
                name: block.name,
                value: newValue.value,
              },
            };
            block.onChange(syntheticEvent as any);
          }
        } catch (error) {
          logConsole(configLogs, 'error', 'Error creating new option:', error);
          console.error('Error creating new option:', error);
        }
      } else {
        const selectedValue = newValue?.value || '';
        setLocalValue(selectedValue);

        if (block.onChange) {
          const syntheticEvent = {
            target: {
              name: block.name,
              value: selectedValue,
            },
          };
          block.onChange(syntheticEvent as any);
        }
      }
    },
    [block.onChange, block.name, block.onCreateNew],
  );

  const handleSelectWithCreate = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } }),
    ): void => {
      const newValue = event.target.value as string;

      if (newValue === '__create_new__') {
        if (block.onCreateNew) {
          block.onCreateNew(null, block.name);
        }
      } else {
        setLocalValue(newValue);

        if (block.onChange) {
          block.onChange(event);
        }
      }
    },
    [block.onChange, block.name, block.onCreateNew],
  );

  const creatableOptions = useMemo((): SelectOption[] => {
    return (
      block.items?.map((item) => ({
        value: item.value || item.item,
        label: t(item.label || item.textitem),
      })) || []
    );
  }, [block.items, t]);

  const currentCreatableValue = useMemo((): SelectOption | null => {
    return (
      creatableOptions.find((option) => option.value === localValue) || null
    );
  }, [creatableOptions, localValue]);

  if (block.type === 'createselect') {
    return (
      <>
        <br />
        <div
          className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
        >
          <InputLabel id={`${block.id}-label`}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
          <CreatableSelect
            isMulti
            name={block.name}
            inputId={block.id}
            value={Array.isArray(localValue) ? localValue : []}
            onChange={handleChangeMultiple}
            placeholder={t('general.select_addressee')}
            formatCreateLabel={(userInput) =>
              `${t('general.create')}: ${userInput}`
            }
            options={creatableOptions}
            className="react-select-container-cx"
            classNamePrefix="react-select-cx"
            menuPlacement="auto"
          />
        </div>
        <br />
      </>
    );
  } else if (block.type === 'createselectsingle') {
    return (
      <>
        <br />
        <div
          className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
        >
          <InputLabel id={`${block.id}-label`}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
          <CreatableSelect
            isClearable
            name={block.name}
            inputId={block.id}
            value={currentCreatableValue}
            onChange={handleCreateSingle}
            placeholder={block.placeholder || t('general.select_option')}
            formatCreateLabel={(userInput) =>
              `${t('general.create')}: ${userInput}`
            }
            options={creatableOptions}
            className="react-select-container-cx"
            classNamePrefix="react-select-cx"
            menuPlacement="auto"
          />
        </div>
        <br />
      </>
    );
  } else if (block.allowCreate) {
    return (
      <>
        <br />
        <div
          className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
        >
          <InputLabel id={`${block.id}-label`}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
          <Selectmui
            name={block.name}
            id={block.id}
            value={localValue || ''}
            displayEmpty
            onChange={handleSelectWithCreate}
            size="small"
            fullWidth
          >
            {block.items.map((option) => (
              <MenuItem key={option.item} value={option.item}>
                {option.isCreateOption ? (
                  <em style={{ color: '#1976d2' }}>+ {t(option.textitem)}</em>
                ) : (
                  t(option.textitem)
                )}
              </MenuItem>
            ))}
          </Selectmui>
        </div>
        <br />
      </>
    );
  } else {
    return (
      <>
        <br />
        <div
          className={`custom-checkbox custom-control custom-control-inline ${block.ref}`}
        >
          <InputLabel id={`${block.id}-label`}>
            {block.label}
            {block.validate.required && <span className="required">*</span>}
          </InputLabel>
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
              <MenuItem key={option.item} value={option.item}>
                {t(option.textitem)}
              </MenuItem>
            ))}
          </Selectmui>
        </div>
        <br />
      </>
    );
  }
};

export default Select;
