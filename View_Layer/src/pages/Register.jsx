import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/AuthService'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
    const [role, setRole] = useState('jobseeker');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        companyDetails: '',
        phone: '',
        location: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        AuthService.register(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password,
            role,
            formData.companyName,
            formData.companyDetails,
            formData.phone,
            formData.location
        ).then(
            () => {
                alert('Registration successful!');
                navigate('/login');
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setError(resMessage);
            }
        );
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow p-4 rounded-4">
                        <h3 className="fw-bold text-center mb-4">Create Account</h3>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex gap-2 mb-4">
                            <button
                                className={`btn flex-grow-1 ${role === 'jobseeker' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setRole('jobseeker')}
                            >
                                Job Seeker
                            </button>
                            <button
                                className={`btn flex-grow-1 ${role === 'employer' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setRole('employer')}
                            >
                                Employer
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-control"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-control"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {role === 'employer' && (
                                <div className="mb-3">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className="form-control"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Location (City)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        onChange={handleChange}
                                        placeholder="e.g. New York, USA"
                                        required
                                    />
                                </div>
                            </div>

                            {role === 'employer' && (
                                <div className="mb-3">
                                    <label className="form-label">Company Details</label>
                                    <textarea
                                        name="companyDetails"
                                        className="form-control"
                                        rows="3"
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control"
                                        onChange={handleChange}
                                        minLength={4}
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
                                <div className="form-text">Minimum 4 characters</div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 btn-lg mb-3">Sign Up</button>
                            <p className="text-center text-muted">Already have an account? <a href="/login" className='text-decoration-none'>Login</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
