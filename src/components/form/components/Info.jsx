/**
 * @fileoverview
 * Form component
 * @module components/form/components/Info
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires @mui/material/Alert
 */

import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

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
const Info = ({ block }) => {
    const { variant, ref, severity, warning, texthtml } = block;
    const theObj = {__html:block.texthtml};
    
    return (
        <div className={ref}>
            <Alert variant={variant} severity={severity} color={warning} className="infobackground">
                <div dangerouslySetInnerHTML={theObj} />
            </Alert>
            <br />
        </div>
    );
};

Info.propTypes = {
    block: PropTypes.shape({
        variant: PropTypes.string.isRequired,
        ref: PropTypes.string,
        severity: PropTypes.string.isRequired,
        warning: PropTypes.string,
        texthtml: PropTypes.string.isRequired,
    }).isRequired,
};

export default Info;