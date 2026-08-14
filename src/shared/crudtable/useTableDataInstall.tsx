/**
 * @fileoverview
 * @module shared/crudtable/useTableDataInstall
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React, { useState } from 'react';
import useCustomForm from '../../hooks/FormHooksNormalGetPost'; //Render Form
import type { UseTableDataInstallReturn } from '../../types/shared/crudtable.types';

export const useTableDataInstall = (
  fpHash: string,
  getServerURL: string,
  postServerURL: string,
  deleteServerURL: string,
  restoreServerURL: string,
  t: any,
): UseTableDataInstallReturn => {
  //const [formStatus, setFormStatus] = useState(false);
  const [triggerShow1, setTriggerShow1] = useState(0);
  const [triggerEdit1, setTriggerEdit1] = useState(0);
  const [triggerNew1, setTriggerNew1] = useState(0);
  const [triggerPassword1, setTriggerPassword1] = useState(0);
  const [triggerDel1, setTriggerDel1] = useState(0);
  const [triggerDelMulti1, setTriggerDelMulti1] = useState(0);
  const [triggerShow2, setTriggerShow2] = useState(0);
  const [triggerEdit2, setTriggerEdit2] = useState(0);
  const [triggerNew2, setTriggerNew2] = useState(0);
  const [triggerPassword2, setTriggerPassword2] = useState(0);
  const [triggerDel2, setTriggerDel2] = useState(0);
  const [triggerDelMulti2, setTriggerDelMulti2] = useState(0);
  const [triggerShowMs1, setTriggerShowMs1] = useState(0);
  const [triggerShowMs2, setTriggerShowMs2] = useState(0);
  const [triggerVarious1, setTriggerVarious1] = useState(0); //Edit/New Various addressee
  const [triggerVarious2, setTriggerVarious2] = useState(0); //Edit/New Various addressee
  const [triggerRes1, setTriggerRes1] = useState(0); //Restore
  const [triggerRes2, setTriggerRes2] = useState(0); //Restore
  const [triggerResMulti1, setTriggerResMulti1] = useState(0); //Restore
  const [triggerResMulti2, setTriggerResMulti2] = useState(0); //Restore
  const [triggerDis1, setTriggerDis1] = useState(0); //Disable
  const [triggerDis2, setTriggerDis2] = useState(0); //Disable
  const [triggerEna1, setTriggerEna1] = useState(0); //Enable
  const [triggerEna2, setTriggerEna2] = useState(0); //Enable
  const [trigger1, setTrigger1] = useState(0);
  const [trigger2, setTrigger2] = useState(0);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Normal');
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [idmulti, setIdMulti] = useState('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  const [msgTitle, setMsgTitle] = useState('');
  const [msgAuthor, setMsgAuthor] = useState('');
  const [msgTarget, setMsgTarget] = useState('');
  const [msgDate, setMsgDate] = useState('');
  const [msgMessage, setMsgMessage] = useState('');

  const {
    formStatus,
    handleInputChange,
    handleFormSubmit,
    handleFormDelete,
    setFormStatus,
  } = useCustomForm(fpHash, postServerURL, getServerURL, deleteServerURL, id); //Render Form

  // Alert
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    setIsError(false);
  };

  return {
    formStatus,
    setFormStatus,
    triggerShow1,
    setTriggerShow1,
    triggerEdit1,
    setTriggerEdit1,
    triggerNew1,
    setTriggerNew1,
    triggerPassword1,
    setTriggerPassword1,
    triggerDel1,
    setTriggerDel1,
    triggerDelMulti1,
    setTriggerDelMulti1,
    triggerShow2,
    setTriggerShow2,
    triggerEdit2,
    setTriggerEdit2,
    triggerNew2,
    setTriggerNew2,
    triggerPassword2,
    setTriggerPassword2,
    triggerDel2,
    setTriggerDel2,
    triggerDelMulti2,
    setTriggerDelMulti2,
    title,
    setTitle,
    type,
    setType,
    username,
    setUsername,
    id,
    setId,
    idmulti,
    setIdMulti,
    isError,
    setIsError,
    handleClose,
    message,
    setMessage,
    handleFormSubmit,
    handleFormDelete,
    handleInputChange,
    triggerShowMs1,
    setTriggerShowMs1,
    triggerShowMs2,
    setTriggerShowMs2,
    trigger1,
    setTrigger1,
    trigger2,
    setTrigger2,
    triggerVarious1,
    setTriggerVarious1,
    triggerVarious2,
    setTriggerVarious2,
    msgTitle,
    setMsgTitle,
    msgAuthor,
    setMsgAuthor,
    msgTarget,
    setMsgTarget,
    msgDate,
    setMsgDate,
    msgMessage,
    setMsgMessage,
    triggerRes1,
    setTriggerRes1,
    triggerRes2,
    setTriggerRes2,
    triggerResMulti1,
    setTriggerResMulti1,
    triggerResMulti2,
    setTriggerResMulti2,
    triggerDis1,
    setTriggerDis1,
    triggerDis2,
    setTriggerDis2,
    triggerEna1,
    setTriggerEna1,
    triggerEna2,
    setTriggerEna2,
  };
};
