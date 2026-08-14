/**
 * @fileoverview
 * Form component
 * @module components/form/components/Heading
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import type { HeadingProps } from '../../../types/components/form.types';

/**
 * Heading component for rendering various heading sizes.
 *
 * @component
 * @param {object} props - The properties of the Heading component.
 * @param {object} props.block - Information about the heading.
 * @param {string} props.block.headline - The text content of the heading.
 * @param {number} props.block.size - The size of the heading (1 to 6).
 * @returns {JSX.Element} The rendered Heading component.
 */
const Heading: React.FC<HeadingProps> = ({ block }) => {
  const { className, ref, headline, size } = block;

  const variantMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  };

  const variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' =
    variantMap[size] || 'h1';

  // Using spans instead of divs to allow nesting inside paragraphs
  return (
    <span className={className || ''}>
      <span className={ref || ''}>
        <Typography
          variant={variant}
          gutterBottom
          component="span" // Use span for compatibility with paragraphs
          sx={{ display: 'block' }} // Keep block behavior for styling
        >
          {headline}
        </Typography>
      </span>
    </span>
  );
};

export default Heading;
