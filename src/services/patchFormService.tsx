/**
 * @fileoverview
 * This module is a utility for making PATCH requests to a server with form data.
 * Analogous to postFormService.tsx but using axios.patch().
 * @module services/patchFormService
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { logConsole } from '../utilities/logConsole';
import type { ValueToPush } from '../types/services/postFormService.types';
import type { PostFormServiceBaseParams } from '../types/common';
import { useConexysConfig } from '../config/ConexysConfig';

/**
 * Service function for patching form data to the server.
 *
 * @param {PostFormServiceBaseParams} datauser - User data object.
 * @returns {Promise<any>} A promise that resolves to the response data from the server.
 * @throws Will throw an error if the server request fails.
 */
const patchFormService = async (
  datauser: PostFormServiceBaseParams,
  configLogs?: ReturnType<typeof useConexysConfig> | null,
): Promise<any> => {
  const { postServerURL, authorization, event, fingerprint, ...restData } =
    datauser;

  const valueToPush: ValueToPush = { fingerprint };
  let previousdata: string | boolean;

  // Obtener los elementos del formulario de forma segura
  const formElement = (event?.currentTarget ||
    event?.target) as HTMLFormElement | null;
  if (formElement?.elements) {
    for (let i = 0; i < formElement.elements.length; i++) {
      const element = formElement.elements[i] as HTMLInputElement;
      if (element.name !== '') {
        let elementValue;

        // Checkboxes: usar checked (boolean) en vez de value ("on"/undefined)
        if (element.type === 'checkbox') {
          elementValue = element.checked;
        } else {
          elementValue = element.value;
        }

        if (valueToPush[element.name] !== undefined) {
          // checks that the field does not repeat, if it does, it joins the data together
          previousdata = valueToPush[element.name];
          valueToPush[element.name] = previousdata + ',' + elementValue;
        } else {
          valueToPush[element.name] = elementValue;
        }
      }
    }
  }

  const dataload = [restData, valueToPush];

  let config: any;
  let datasend: any;

  if (authorization === true) {
    config = {
      headers: {
        Authorization: `Bearer ${datauser.cxauthxc}`,
        'X-Session-ID': datauser.sessionID || '',
        'X-Fingerprint': datauser.fingerprint || '',
        'Content-Type': 'application/json',
      },
    };
    // NestJS espera un objeto plano, no un array [restData, valueToPush]
    datasend = { ...dataload[1] };
    if (datauser.sessionID) {
      datasend.sessionID = datauser.sessionID;
    }
    if (datauser.ButtonPressed) {
      datasend.ButtonPressed = datauser.ButtonPressed;
    }
    if (datauser.iditem) {
      datasend.itemID = datauser.iditem;
    } else if (datauser.id) {
      datasend.itemID = datauser.id;
    }
  } else {
    config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    datasend = dataload[1];
  }

  logConsole(configLogs, 'debug', '[Payload] ', datasend);

  try {
    const response: AxiosResponse<any> = await axios.patch(
      postServerURL,
      datasend,
      config,
    );
    logConsole(configLogs, 'info', '[Request] ', postServerURL);
    return response.data;
  } catch (error) {
    logConsole(
      configLogs,
      'debug',
      '[Error Response] ',
      (error as any)?.response?.data,
    );
    console.error('Error patching form data:', error);
    throw error;
  }
};

export default { patchFormService };
