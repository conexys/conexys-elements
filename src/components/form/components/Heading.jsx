/**
 * @fileoverview
 * Form component
 * @module components/form/components/Heading
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires @mui/material/Typography
 */

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

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
const Heading = ({ block }) => {
    const { className, ref, headline, size } = block;

    const variantMap = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6',
    };

    const variant = variantMap[size] || 'h1';

    // Usando spans en lugar de divs para permitir su anidamiento dentro de párrafos
    return (
        <span className={className || ''}>
            <span className={ref || ''}>
                <Typography 
                    variant={variant} 
                    gutterBottom 
                    component="span" // Usar span para compatibilidad con párrafos
                    sx={{ display: 'block' }} // Mantener el comportamiento de bloque para estilo
                >
                    {headline}
                </Typography>
            </span>
        </span>
    );
};

Heading.propTypes = {
    block: PropTypes.shape({
        headline: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        className: PropTypes.string,
        ref: PropTypes.string,
    }).isRequired,
};

export default Heading;