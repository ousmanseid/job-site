import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard based on their role
        const dashboardMap = {
            'admin': '/dashboard/admin',
            'employer': '/dashboard/employer',
            'jobseeker': '/dashboard/jobseeker'
        };

        const redirectPath = dashboardMap[user.role] || '/';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
