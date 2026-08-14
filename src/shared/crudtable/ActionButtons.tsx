/**
 * @fileoverview
 * @module shared/crudtable/ActionButtons
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

/**
 * Component that unifies Stack and Button for actions in modals
 * @param {ActionButtonsProps} props - Component properties
 * @param {Function} props.onCancel - Function to handle cancellation
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.submitText - Text for the submit button
 * @param {string} props.cancelColor - Color of the cancel button (default: "error")
 * @param {string} props.submitColor - Color of the submit button (default: "primary")
 * @param {boolean} props.isSubmitButton - If the submit button is of type submit (default: true)
 * @param {Array} props.additionalButtons - Additional buttons to render
 * @param {Object} props.stackProps - Additional props for the Stack component
 */

import React from 'react';
import { Stack, Button } from '@mui/material';
import type { ActionButtonsProps } from '../../types/shared/crudtable.types';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSubmit,
  cancelText,
  submitText,
  cancelColor = 'error',
  submitColor = 'primary',
  isSubmitButton = true,
  additionalButtons = [],
  stackProps = {},
  noHr = false,
  formId,
}) => {
  return (
    <>
      {!noHr && <hr />}
      <Stack
        direction="row-reverse"
        alignItems="center"
        spacing={1}
        {...stackProps}
      >
        <Button variant="contained" color={cancelColor} onClick={onCancel}>
          {cancelText}
        </Button>

        {onSubmit && (
          <Button
            variant="contained"
            color={submitColor}
            type={isSubmitButton ? 'submit' : 'button'}
            form={formId}
            onClick={!isSubmitButton ? onSubmit : undefined}
          >
            {submitText}
          </Button>
        )}

        {additionalButtons.map((buttonProps, index) => (
          <Button key={index} {...buttonProps} form={formId} />
        ))}
      </Stack>
    </>
  );
};
