import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('tokenKey');

    return token ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
