/**
 * @fileoverview
 * Uservalidationerror is a functional component that performs certain actions and then redirects to the login page. It deletes certain entries in local storage and then redirects the user to the login path.
 * @module components/Uservalidationerror
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { authStorage } from '../utilities/authStorage';
import { useConexysConfig } from '../config/ConexysConfig';

// Extract the admin prefix from the current URL.
const currentPath: string = window.location.pathname;
const pathParts: string[] = currentPath.split('/').filter(Boolean);
let adminPrefix: string = '';
if (
  pathParts.length > 1 &&
  ['login', 'signup', 'forgot_password', 'dashboard'].some(
    (s) => pathParts[1] === s,
  )
) {
  // The URL is like /admin/login → prefix = /admin.
  adminPrefix = '/' + pathParts[0];
}
const logindir: string = adminPrefix + '/login';

/**
 * Clears user-related data from local storage and redirects to the login page.
 * @returns {JSX.Element} React element to trigger navigation.
 */
const Uservalidationerror = (
  configLogs: ReturnType<typeof useConexysConfig>,
): React.JSX.Element => {
  localStorage.removeItem('datauser');
  localStorage.removeItem('sidebarleft');
  localStorage.removeItem('cxl0k2mw'); //Remove Lock status
  authStorage.removeAuthData(configLogs);
  return <Navigate to={logindir} />;
};

export default Uservalidationerror;
