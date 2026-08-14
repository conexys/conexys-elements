/**
 * @fileoverview
 */

import type { Theme } from '@mui/material/styles';
import type { DialogTitleProps } from '@mui/material/DialogTitle';

export interface BootstrapDialogProps {
  theme?: Theme;
  size: string;
}

export interface BootstrapDialogTitleProps extends Omit<
  DialogTitleProps,
  'children'
> {
  children?: React.ReactNode;
  onClose: () => void;
  color: string;
}

export interface AppDialogModalProps {
  children: React.ReactNode;
  title: string;
  type: string;
  trigger1?: number;
  trigger2?: number;
  close?: boolean;
  /** Optional actions (buttons) rendered in a sticky footer below the scrollable content */
  actions?: React.ReactNode;
}

export interface DialogConfig {
  getcolor: string;
  getsize: string;
}
