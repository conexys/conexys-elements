/**
 * @fileoverview
 * Uservalidationerror is a functional component that performs certain actions and then redirects to the login page. It deletes certain entries in local storage and then redirects the user to the login path.
 * @module components/Uservalidationerror
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires react-router-dom
 */

import { Navigate } from 'react-router-dom';

const logindir = "/login";

/**
 * Clears user-related data from local storage and redirects to the login page.
 * @returns {JSX.Element} React element to trigger navigation.
 */
const Uservalidationerror = () => {
    localStorage.removeItem("cxauthxc");
    localStorage.removeItem("datauser");
    localStorage.removeItem("cx_session");
    localStorage.removeItem("sidebarleft");
    localStorage.removeItem("cxl0k2mw"); //Remove Lock status
    return <Navigate to={logindir} />;
};

export default Uservalidationerror;