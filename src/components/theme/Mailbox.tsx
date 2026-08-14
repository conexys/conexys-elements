/**
 * @fileoverview
 * @module components/dialog/AppDialogModal
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import type { MailboxProps } from '../../types/components/theme.types';

export default function Mailbox({
  msgTitle,
  msgAuthor,
  msgTarget,
  msgDate,
  theObj,
  t,
}: MailboxProps): React.JSX.Element {
  return (
    <div className="mailbox-email" style={{ marginLeft: '0px' }}>
      <div className="mailbox-email-header mb-3">
        <h3 className="mailbox-email-subject m-0 font-weight-light">
          {msgTitle}
        </h3>
        <p className="mt-2 mb-0 text-5">
          De {msgAuthor} para {msgTarget}, enviado el {msgDate}
        </p>
      </div>
      <div className="mailbox-email-container">
        <div className="mailbox-email-screen pt-4">
          <div className="card mb-3">
            <div className="card-header">
              <p className="card-title">
                {msgAuthor} <i className="fas fa-angle-right fa-fw"></i>{' '}
                {msgTarget}
              </p>
            </div>
            <div className="card-body">
              <div dangerouslySetInnerHTML={theObj} />
            </div>
            <div className="card-footer">
              <p className="m-0">
                <small>{msgDate}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
