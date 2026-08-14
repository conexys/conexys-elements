/**
 * @fileoverview
 * Form component
 * @module components/form/components/Info
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import Alert from '@mui/material/Alert';
import type { InfoProps } from '../../../types/components/form.types';

/**
 * Displays a text in the form to inform or warn
 *
 * @component
 * @param {object} props
 * @param {object} props.block
 * @param {string} props.block.variant
 * @param {string} props.block.ref
 * @param {string} props.block.severity
 * @param {string} props.block.warning
 * @param {string} props.block.texthtml
 * @returns {JSX.Element}
 */
const Info: React.FC<InfoProps> = ({ block }) => {
  const { variant, ref, severity, warning, texthtml } = block;
  const theObj: { __html: string } = { __html: texthtml };

  return (
    <div className={ref}>
      <Alert
        variant={variant}
        severity={severity}
        color={warning}
        className="infobackground"
      >
        <div dangerouslySetInnerHTML={theObj} />
      </Alert>
      <br />
    </div>
  );
};

export default Info;
