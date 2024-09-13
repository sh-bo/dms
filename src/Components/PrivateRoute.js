<<<<<<< HEAD
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const employeeType = localStorage.getItem("employeeType");

  if (!employeeType) {
    // If no employeeType in localStorage, redirect to the login page
    return <Navigate to="/auth" />;
  }

  // Check if the employeeType is allowed for this route
  if (allowedRoles.includes(employeeType)) {
    return children;
  } else {
    // If the user doesn't have permission, you can redirect to a "not authorized" page or dashboard
    return <Navigate to="/" />;
  }
=======
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';  // Assuming UserContext is in /context folder

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();

  // If the user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check if the user role is allowed to access this route
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;  // Redirect to homepage if role is not allowed
  }

  return children;
>>>>>>> 9c2e08c1303f505d8e1b011b77a20c46472f84ba
};

export default PrivateRoute;
