/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputFile
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import {
  AiFillFileImage,
  AiOutlineFileZip,
  AiOutlineFile,
} from 'react-icons/ai';
import type { InputFileProps } from '../../../types/components/form.types';

type FileType = 'image' | 'zip' | 'other' | null;

/**
 * InputFile component for rendering a file input.
 *
 * @component
 * @param {object} props - The properties of the InputFile component.
 * @param {string} props.block.id - The ID of the file input.
 * @param {string} props.block.name - The name of the file input.
 * @param {string} props.block.ref - The reference class for the file input container.
 * @param {string} props.block.accept - The accepted file types.
 * @returns {JSX.Element} The rendered InputFile component.
 */
const InputFile: React.FC<InputFileProps> = ({ block }) => {
  const [t] = useTranslation('global');
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(
    t('upload.no_selected_file'),
  );
  const [fileSize, setFileSize] = useState<string>('');
  const [fileType, setFileType] = useState<FileType>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Function to check if the file is an image
  const isImageFile = (file: File): boolean => {
    return file && file.type.startsWith('image/');
  };

  // Function to check if the file is a ZIP
  const isZipFile = (file: File): boolean => {
    return (
      file &&
      (file.type === 'application/zip' ||
        file.name.toLowerCase().endsWith('.zip'))
    );
  };

  // Function to get the icon according to the file type
  const getFileIcon = (): React.JSX.Element => {
    if (fileType === 'image') {
      return <AiFillFileImage color="#1475cf" size={60} />;
    } else if (fileType === 'zip') {
      return <AiOutlineFileZip color="#1475cf" size={60} />;
    } else {
      return <AiOutlineFile color="#1475cf" size={60} />;
    }
  };

  // Function to update the real file input with the file
  const updateInputFile = (file: File): void => {
    const input = document.querySelector(`#${block.id}`) as HTMLInputElement;
    if (input && file) {
      // Create a new DataTransfer to simulate file selection
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      // Manually trigger change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const processFile = (
    file: File | undefined,
    source: 'unknown' | 'click' | 'drop' = 'unknown',
  ): void => {
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(2) + ' KB');

      if (isImageFile(file)) {
        setImage(URL.createObjectURL(file));
        setFileType('image');
      } else if (isZipFile(file)) {
        setImage(null);
        setFileType('zip');
      } else {
        setImage(null);
        setFileType('other');
      }

      // Update the real file input only if it comes from drag & drop
      if (source === 'drop') {
        updateInputFile(file);
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = event.target.files;
    processFile(files?.[0], 'click');
  };

  // Handlers for drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;

    if (files && files[0]) {
      const file = files[0];

      // Check if the file is of the accepted type
      const acceptedTypes = block.accept
        ? block.accept.split(',').map((type) => type.trim())
        : [];

      if (acceptedTypes.length > 0) {
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else {
            return file.type.includes(type.replace('*', ''));
          }
        });

        if (!isAccepted) {
          alert(t('upload.type_not_allowed') + block.accept);
          return;
        }
      }

      processFile(file, 'drop');
    }
  };

  const resetFile = (): void => {
    setFileName(t('upload.no_selected_file'));
    setFileSize('');
    setImage(null);
    setFileType(null);

    // Clear the file input as well
    const input = document.querySelector(`#${block.id}`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Prevent click from executing when clicking on the already selected file area
    if (
      (e.target as Element).closest('.uploaded-row') ||
      (e.target as Element).closest('img')
    ) {
      e.stopPropagation();
      return;
    }

    const input = document.querySelector(`#${block.id}`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <main>
      <div
        className={`uploaded-form ${isDragOver ? 'drag-over' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed #1475cf' : '2px dashed #ccc',
          backgroundColor: isDragOver
            ? 'rgba(20, 117, 207, 0.1)'
            : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <input
          id={block.id}
          name={block.name}
          type="file"
          accept={block.accept}
          className="input-field"
          hidden
          onChange={handleFileChange}
        />

        {fileType === 'image' && image ? (
          <img src={image} width={150} height={150} alt={fileName} />
        ) : fileType ? (
          <>
            {getFileIcon()}
            <p>{fileName}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              {fileType === 'zip'
                ? t('upload.zip_archive')
                : t('upload.file_selected')}
            </p>
          </>
        ) : (
          <>
            <MdCloudUpload color="#1475cf" size={60} />
            <p>
              {isDragOver
                ? t('upload.drop_file_here')
                : t('upload.drag_select')}
            </p>
          </>
        )}
      </div>

      <section className="uploaded-row">
        {fileType === 'image' ? (
          <AiFillFileImage color="#1475cf" />
        ) : fileType === 'zip' ? (
          <AiOutlineFileZip color="#1475cf" />
        ) : (
          <AiOutlineFile color="#1475cf" />
        )}
        {fileType ? (
          <span className="upload-content">
            {fileName} - {fileSize}
            <MdDelete
              onClick={resetFile}
              size={20}
              style={{ cursor: 'pointer' }}
            />
          </span>
        ) : (
          <span className="upload-content">{fileName}</span>
        )}
      </section>
    </main>
  );
};

export default InputFile;
