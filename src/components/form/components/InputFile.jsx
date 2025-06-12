/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputFile
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires React
 * @requires react-i18next
 */

import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * InputFile component for rendering a file input.
 *
 * @component
 * @param {object} props - The properties of the InputFile component.
 * @param {object} props.block - Information about the file input.
 * @param {string} props.block.id - The ID of the file input.
 * @param {string} props.block.name - The name of the file input.
 * @param {string} props.block.ref - The reference class for the file input container.
 * @returns {JSX.Element} The rendered InputFile component.
 */
const InputFile = ({ block }) => {
    const [t] = useTranslation("global");
    const [file, setFile] = useState();

    /**
     * Handles the change event of the file input.
     *
     * @param {object} event - The change event.
     */
    const handleFileChange = (event) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        };
    };

    return (
        <div className={block.ref}>
            <div>
                <label htmlFor={block.id} className="sr-only">
                    {t('System.chooseafile')}
                </label>
                <input id={block.id} name={block.name} type="file" onChange={handleFileChange} />
            </div>
            {file && (
                <section>
                    {t('System.filedetails')}:
                    <ul>
                        <li>{t('System.name')}: {file.name}</li>
                        <li>{t('System.type')}: {file.type}</li>
                        <li>{t('System.size')}: {file.size} {t('System.bytes')}</li>
                    </ul>
                </section>
            )}
        </div>
    );
};

InputFile.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        ref: PropTypes.string,
    }).isRequired,
};

export default InputFile;