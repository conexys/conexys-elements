/**
 * Componente que unifica Stack y Button para acciones en modales
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onCancel - Función para manejar la cancelación
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {string} props.cancelText - Texto para el botón de cancelar
 * @param {string} props.submitText - Texto para el botón de enviar
 * @param {string} props.cancelColor - Color del botón de cancelar (default: "error")
 * @param {string} props.submitColor - Color del botón de enviar (default: "primary")
 * @param {boolean} props.isSubmitButton - Si el botón de envío es de tipo submit (default: true)
 * @param {Array} props.additionalButtons - Botones adicionales a renderizar
 * @param {Object} props.stackProps - Props adicionales para el componente Stack
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Button } from '@mui/material';

export const ActionButtons = ({
    onCancel,
    onSubmit,
    cancelText,
    submitText,
    cancelColor = "error",
    submitColor = "primary",
    isSubmitButton = true,
    additionalButtons = [],
    stackProps = {},
}) => {
    return (
        <>
        <hr />
        <Stack 
            direction="row-reverse" 
            alignItems="center" 
            spacing={1}
            {...stackProps}
        >
            <Button 
            variant="contained" 
            color={cancelColor} 
            onClick={onCancel}
            >
            {cancelText}
            </Button>
            
            {onSubmit && (
            <Button 
                variant="contained" 
                color={submitColor}
                type={isSubmitButton ? "submit" : "button"}
                onClick={!isSubmitButton ? onSubmit : undefined}
            >
                {submitText}
            </Button>
            )}
            
            {additionalButtons.map((buttonProps, index) => (
            <Button key={index} {...buttonProps} />
            ))}
        </Stack>
        </>
    );
};

ActionButtons.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    cancelText: PropTypes.string.isRequired,
    submitText: PropTypes.string,
    cancelColor: PropTypes.string,
    submitColor: PropTypes.string,
    isSubmitButton: PropTypes.bool,
    additionalButtons: PropTypes.arrayOf(PropTypes.object),
    stackProps: PropTypes.object,
};