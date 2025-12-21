import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const AuthDebugger = () => {
    const [user, setUser] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        if (currentUser && currentUser.accessToken) {
            // Decode JWT token (basic decode, not verification)
            try {
                const base64Url = currentUser.accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);
                setTokenInfo(decoded);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/login';
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Authentication Debugger</h4>
                </div>
                <div className="card-body">
                    <h5>Current User Data:</h5>
                    <pre className="bg-light p-3 rounded">
                        {user ? JSON.stringify(user, null, 2) : 'No user logged in'}
                    </pre>

                    <h5 className="mt-4">Decoded JWT Token:</h5>
                    <pre className="bg-light p-3 rounded">
                        {tokenInfo ? JSON.stringify(tokenInfo, null, 2) : 'No token to decode'}
                    </pre>

                    {tokenInfo && (
                        <div className="mt-4">
                            <h5>Token Expiration:</h5>
                            <p>
                                Issued At: {new Date(tokenInfo.iat * 1000).toLocaleString()}<br />
                                Expires At: {new Date(tokenInfo.exp * 1000).toLocaleString()}<br />
                                <strong>
                                    {new Date(tokenInfo.exp * 1000) > new Date()
                                        ? '✅ Token is still valid'
                                        : '❌ Token has expired'}
                                </strong>
                            </p>
                        </div>
                    )}

                    <div className="mt-4">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout and Clear Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthDebugger;
