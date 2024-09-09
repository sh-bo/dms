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
};

export default PrivateRoute;
