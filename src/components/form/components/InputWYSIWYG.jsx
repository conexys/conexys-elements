/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputWYSIWYG
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires jodit-react
 * @requires react-i18next
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * inputwysiwyg component for rendering a JoditEditor for text input.
 *
 * @component
 * @param {object} props - The properties of the inputwysiwyg component.
 * @param {object} props.block - Information about the JoditEditor input.
 * @param {string} props.block.id - The ID of the JoditEditor input.
 * @param {string} props.block.name - The name of the JoditEditor input.
 * @param {string} props.block.label - The label for the JoditEditor input.
 * @param {string} props.block.value - The initial value of the JoditEditor input.
 * @returns {JSX.Element} The rendered inputwysiwyg component.
 */
const InputWYSIWYG = ({ block }) => {
    const [t] = useTranslation("global");

    const [textEditor, setTextEditor] = useState(block.value || '');
    const editor = useRef(null);

    const config = useMemo(
		() => ({
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder: t('general.start_typings') || 'Start typings...',
            language: t('language.name')
		}),
		[t]
	);

    const handleBlur = useCallback((newContent) => {
        setTextEditor(newContent);
    }, []);

    return (
        <div className={`form-group ${block.ref}`}>
            <label>{block.label}</label>
            <input type='hidden' id={block.id} name={block.name} value={textEditor || block.value || ''} />
            <div>
                <JoditEditor
                    ref={editor}
                    value={block.value || ''}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={handleBlur} // preferred to use only this option to update the content for performance reasons
                    onChange={() => {}}
                />
            </div>
        </div>
    );
};

InputWYSIWYG.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        ref: PropTypes.string,
    }).isRequired,
};

export default InputWYSIWYG;
