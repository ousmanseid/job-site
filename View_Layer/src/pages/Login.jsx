import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthService from '../services/AuthService'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await AuthService.login(email, password);
            console.log('Login response:', user);
            login(user);

            // Redirection logic (use the same logic as normalizeUser or just check the raw role)
            const rawRole = user.role || (user.roles && user.roles[0]) || '';
            const normalizedRole = rawRole.toString().replace('ROLE_', '').toLowerCase();

            console.log('Raw role:', rawRole);
            console.log('Normalized role:', normalizedRole);

            // Redirect based on role
            if (normalizedRole === 'admin') {
                console.log('Redirecting to admin dashboard');
                navigate('/dashboard/admin');
            } else if (normalizedRole === 'employer') {
                console.log('Redirecting to employer dashboard');
                navigate('/dashboard/employer');
            } else if (normalizedRole === 'jobseeker') {
                console.log('Redirecting to jobseeker dashboard');
                navigate('/dashboard/jobseeker');
            } else {
                console.log('Unknown role, redirecting to home');
                navigate('/');
            }
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setError(resMessage);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 shadow p-4 rounded-4">
                        <h3 className="fw-bold text-center mb-4">Welcome Back</h3>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    placeholder="e.g. john@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg"
                                        value={password}
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ zIndex: 0 }}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 btn-lg mb-4 mt-2">Login</button>

                            <p className="text-center text-muted">Don't have an account? <a href="/register" className='text-decoration-none fw-bold'>Sign up</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
