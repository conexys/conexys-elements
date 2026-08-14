/**
 * @fileoverview
 * Component dialog box
 * This AppDialogModal component is a custom dialog that uses the Dialog component of Material-UI.
 * This component is quite versatile and can be used to display different types of content in a dialog with custom styles.
 * @module components/dialog/AppDialogModal
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import type {
  BootstrapDialogProps,
  BootstrapDialogTitleProps,
  AppDialogModalProps,
  DialogConfig,
} from '../../types/components/dialog.types';

/**
 * Styled MUI Dialog component with custom styling.
 * @param {object} theme - The MUI theme object.
 * @param {string} size - The size of the dialog.
 * @returns {JSX.Element} - The styled Dialog component.
 */
const BootstrapDialog = styled(Dialog)<BootstrapDialogProps>(
  ({ theme, size }) => ({
    '& .MuiDialogContent-root': {
      padding: theme?.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme?.spacing(1.5, 2),
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: theme?.palette?.background?.default || '#fff',
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
    },
    '& .MuiDialog-paper': {
      maxWidth: '1024px',
      width: size,
      margin: '8px',
      borderRadius: '4px',
      maxHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

/**
 * Custom DialogTitle component with Bootstrap styling.
 * @param {object} props - The component props.
 * @param {string} props.color - The background color of the title.
 * @param {React.ReactNode} props.children - The title content.
 * @param {Function} props.onClose - The function to close the dialog.
 * @returns {JSX.Element} - The styled DialogTitle component.
 */
function BootstrapDialogTitle({
  children,
  onClose,
  color,
  ...other
}: BootstrapDialogTitleProps): React.JSX.Element {
  return (
    <DialogTitle
      sx={{ m: 0, p: 1.5, backgroundColor: color, color: '#FFF' }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            opacity: '.75',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

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
const AppDialogModal: React.FC<AppDialogModalProps> = ({
  children,
  title,
  type,
  trigger1,
  trigger2,
  close,
  actions,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (trigger1) {
      setOpen(true);
    }
  }, [trigger1]);

  useEffect(() => {
    if (trigger2) {
      setOpen(false);
    }
  }, [trigger2]);

  useEffect(() => {
    if (close === true) {
      setOpen(false);
    }
  }, [close]);

  const { getcolor, getsize }: DialogConfig = useMemo(() => {
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
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
          color={getcolor}
        >
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ overflowY: 'auto', flex: '1 1 auto' }}>
          {children}
        </DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </BootstrapDialog>
    </div>
  );
};

export default AppDialogModal;
