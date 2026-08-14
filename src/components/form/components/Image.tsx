/**
 * @fileoverview
 * Form component
 * @module components/form/components/Image
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import type { ImageProps } from '../../../types/components/form.types';

/**
 * Heading component for rendering various heading sizes.
 *
 * @component
 * @param {object} props - The properties of the Image component.
 * @param {object} props.block - Information about the image.
 * @param {string} props.block.className - The CSS class for styling the image container.
 * @param {string} props.block.ref - The reference class for the image container.
 * @param {string} props.block.urlimage - The URL of the image.
 * @param {string} props.block.name - The alt text for the image.
 * @returns {JSX.Element} The rendered Heading component.
 */
const Image: React.FC<ImageProps> = ({ block }) => {
  const { className, ref, urlimage, name } = block;

  return (
    <div className={className}>
      <div className={ref}>
        {urlimage && <img alt={name} src={urlimage} />}
        <br />
        <br />
      </div>
    </div>
  );
};

export default Image;
