/**
 * @fileoverview
 * Form component
 * @module components/form/components/Text
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import type { TextProps } from '../../../types/components/form.types';

/**
 * Text component for rendering text content.
 *
 * @component
 * @param {object} props - The properties of the Text component.
 * @param {object} props.block - Information about the text content.
 * @param {string} props.block.text - The text content.
 * @param {string} props.block.className - The CSS class for styling the text container.
 * @param {string} props.block.ref - The reference class for the text container.
 * @returns {JSX.Element} The rendered Text component.
 */
const Text: React.FC<TextProps> = ({ block }) => {
  return (
    <div className={block.className}>
      <div className={block.ref}>
        {block.text}
        <br />
        <br />
      </div>
    </div>
  );
};

export default Text;
