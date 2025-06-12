/**
 * @fileoverview
 * Component dialog box
 * This AppDialogModal component is a custom dialog that uses the Dialog component of Material-UI.
 * This component is quite versatile and can be used to display different types of content in a dialog with custom styles.
 * @module components/dialog/AppDialogModal
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires prop-types
 * @requires @mui/material/styles
 * @requires @mui/material/Dialog
 * @requires @mui/material/DialogTitle
 * @requires @mui/material/DialogContent
 * @requires @mui/material/IconButton
 * @requires @mui/icons-material/Close
 */

import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Styled MUI Dialog component with custom styling.
 * @param {object} theme - The MUI theme object.
 * @param {string} size - The size of the dialog.
 * @returns {JSX.Element} - The styled Dialog component.
 */
const BootstrapDialog = styled(Dialog)(({ theme, size }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': { 
        maxWidth: '1024px',
        width: size,
        margin: '8px',
        borderRadius: '4px'
    }
}));

/**
 * Custom DialogTitle component with Bootstrap styling.
 * @param {object} props - The component props.
 * @param {string} props.color - The background color of the title.
 * @param {React.ReactNode} props.children - The title content.
 * @param {Function} props.onClose - The function to close the dialog.
 * @returns {JSX.Element} - The styled DialogTitle component.
 */
function BootstrapDialogTitle({ children, onClose, color, ...other }) {
    return (
        <DialogTitle sx={{ m: 0, p: 1.5, backgroundColor: color, color: '#FFF'}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        opacity: '.75'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
};

/**
 * AppDialogModal component for displaying custom dialogs.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the dialog.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.type - The type of the dialog ('Normal', 'Delete', etc.).
 * @param {boolean} props.trigger1 - Whether to trigger opening the dialog.
 * @param {boolean} props.trigger2 - Whether to trigger closing the dialog.
 * @param {boolean} props.close - Whether to close the dialog.
 * @returns {JSX.Element} - The AppDialogModal component.
 */
const AppDialogModal = ({ children, title, type, trigger1, trigger2, close }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (trigger1) {
            setOpen(true);
        };
    }, [trigger1]);

    useEffect(() => {
        if (trigger2) {
            setOpen(false);
        };
    }, [trigger2]);

    useEffect(() => {
        if (close === true) {
            setOpen(false);
        };
    }, [close]);

    const { getcolor, getsize } = useMemo(() => {
        switch (type) {
            case 'Delete':
                return { getcolor: '#d2322d', getsize: '400px' };
            case 'DeleteMax':
                return { getcolor: '#d2322d', getsize: '1024px' };
            case 'Restore':
                return { getcolor: '#11951b', getsize: '400px' };
            default:
                return { getcolor: '#0088CC', getsize: '1024px' };
        }
    }, [type]);

    return (
        <div>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={open}
                disableEscapeKeyDown
                size={getsize}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpen(false)} color={getcolor}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {children}
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};

AppDialogModal.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    trigger1: PropTypes.number,
    trigger2: PropTypes.number,
    close: PropTypes.bool,
};

export default AppDialogModal;