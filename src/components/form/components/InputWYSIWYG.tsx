/**
 * @fileoverview
 * Form component
 * @module components/form/components/InputWYSIWYG
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useTranslation } from 'react-i18next';
import type { InputWYSIWYGProps } from '../../../types/components/form.types';
import { sanitizeHtml } from '../../../utilities/sanitizeHtml';

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
const InputWYSIWYG: React.FC<InputWYSIWYGProps> = React.memo(
  ({ block }) => {
    const [t] = useTranslation('global');

    // Analisis004 06/A4-04 (T6-3): sanitize when entering the editor and when
    // saving; output sanitization alone is not enough with iframe:false.
    const safeValue = useMemo(() => sanitizeHtml(block.value || ''), [block.value]);
    const [textEditor, setTextEditor] = useState<string>(safeValue);
    const editor = useRef<any>(null);

    useEffect(() => {
      setTextEditor(safeValue);
    }, [safeValue]);

    const config = useMemo(
      () => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        // SECURITY NOTE (Analisis002 C1 — Jodit safeMode): intentionally NOT
        // enabled. `safeMode` is a plugin *debug* toggle, not a sanitizer: it
        // replaces the toolbar with a list of installed plugins and does NOT
        // neutralize `<script>`, `<iframe>` or event-handler attributes.
        //
        // The real XSS mitigation for this rich-text editor is *output*
        // sanitization: every place that renders user HTML through
        // `dangerouslySetInnerHTML` runs it through `sanitizeHtml()` (which
        // wraps DOMPurify.sanitize) — see utilities/sanitizeHtml.ts and its
        // call sites (AppDataSettingsHTML, UserWidget, MailTemplateWidget,
        // Mailbox, Info, …). DO NOT re-enable `safeMode` here as a hardening
        // measure; rely on DOMPurify at render time instead.
        // See docs: Mejoras_Seguridad/Analisis_2/JUSTIFICACION-JODIT-SAFEMODE.md
        toolbarAdaptive: false,
        allowTags: [
          'p',
          'br',
          'b',
          'strong',
          'i',
          'em',
          'u',
          's',
          'ul',
          'ol',
          'li',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'code',
          'pre',
          'a',
          'img',
          'hr',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td',
          'div',
          'span',
        ],
        placeholder:
          (textEditor && textEditor !== '<p><br></p>') ||
          (block.value && block.value !== '<p><br></p>')
            ? ''
            : t('general.start_typings') || 'Start typings...',
        language: t('language.name'),
      }),
      [t, textEditor, block.value],
    );

    const handleBlur = useCallback((newContent: string): void => {
      setTextEditor(sanitizeHtml(newContent));
    }, []);

    return (
      <div className={`form-group ${block.ref}`}>
        <label>{block.label}</label>
        <input
          type="hidden"
          id={block.id}
          name={block.name}
          value={sanitizeHtml(textEditor || block.value || '')}
        />
        <div>
          <JoditEditor
            ref={editor}
            value={safeValue}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={handleBlur} // preferred to use only this option to update the content for performance reasons
            onChange={() => {}}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Re-render only when the value or field name changes.
    return (
      prevProps.block.value === nextProps.block.value &&
      prevProps.block.name === nextProps.block.name &&
      prevProps.block.label === nextProps.block.label
    );
  },
);

export default InputWYSIWYG;
