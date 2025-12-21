import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // user object structure: { name: 'John Doe', role: 'jobseeker' | 'employer' | 'admin', token: '...' }

    const normalizeUser = (userData) => {
        if (!userData) return null;

        // Convert ROLE_ADMIN -> admin, ROLE_EMPLOYER -> employer, etc.
        let normalizedRole = 'jobseeker'; // Default fallback
        if (userData.role) {
            normalizedRole = userData.role.toString().replace('ROLE_', '').toLowerCase();
        } else if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
            // Handle case where backend returns roles array
            const firstRole = userData.roles[0].name || userData.roles[0];
            normalizedRole = firstRole.toString().replace('ROLE_', '').toLowerCase();
        }

        const name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'User';
        return { ...userData, name, role: normalizedRole };
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(normalizeUser(JSON.parse(storedUser)));
        }
    }, []);

    const login = (userData) => {
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = (userData) => {
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
