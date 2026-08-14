/**
 * @fileoverview
 * @module components/NotFound
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Functional component for rendering a 404 Not Found page.
 */
export default function NotFound(): React.JSX.Element {
  const { t } = useTranslation('global');

  return (
    <div className="not-found-container" role="alert" aria-live="assertive">
      <h1>404 - {t('notfound.title')}</h1>
      <p>{t('notfound.message')}</p>
      <Link to="/" className="home-link">
        {t('notfound.home')}
      </Link>
    </div>
  );
}
