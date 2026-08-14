/**
 * @fileoverview
 * Render forms. Create forms and call the components that make up each of these.
 * This RenderForm script is a function that takes a configuration block (like the ones that seem to be used in a form) and returns the corresponding React component based on the type of the block.
 * This script is a flexible way to render different form components based on the provided configuration.
 * @module components/form/RenderForm
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { createElement } from 'react';
import {
  Info,
  Heading,
  InputText,
  Checkbox,
  InputWYSIWYG,
  FormLogin,
  InputPassword,
  InputFile,
  Switch,
  Select,
  Radiobutton,
  Text,
  Button,
  Image,
} from './components';
import type { FormBlock } from '../../types/components/form.types';

type ComponentType = React.ComponentType<any>;

//Load the form components
const Components: Record<string, ComponentType> = {
  heading: Heading,
  inputtext: InputText,
  checkbox: Checkbox,
  switch: Switch,
  select: Select,
  radiobutton: Radiobutton,
  info: Info,
  inputwysiwyg: InputWYSIWYG,
  inputfile: InputFile,
  formlogin: FormLogin,
  inputpassword: InputPassword,
  text: Text,
  button: Button,
  image: Image,
};

/**
 * Render a form component based on the provided block and type.
 * @param {FormBlock} block - The block containing information about the component.
 * @param {string} type - The type of form rendering ('nouser' or other).
 * @returns {JSX.Element | string} - The rendered form component or an empty string.
 */
const RenderForm = (
  block: FormBlock,
  type: string,
): React.JSX.Element | string => {
  if (typeof Components[block.component] !== 'undefined') {
    const Component = Components[block.component];

    if (!Component) {
      return (
        <div>The component {block.component} has not been created yet.</div>
      );
    }

    const hasPermission = block.permission >= block.permissionstatus;

    if (type === 'nouser' || block.type !== 'passwordnorm') {
      return hasPermission
        ? createElement(Component, { key: block.name, block })
        : '';
    }
  }

  return '';
};

export default RenderForm;
