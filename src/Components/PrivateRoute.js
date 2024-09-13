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
};

export default PrivateRoute;
