import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [role, setRole] = useState('jobseeker');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyDetails: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would call the API
        console.log('Registering:', { ...formData, role });

        if (role === 'employer') {
            alert('Registration successful! Please wait for Admin approval before you can post jobs.');
        } else {
            alert('Registration successful!');
        }

        navigate('/login');
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow p-4 rounded-4">
                        <h3 className="fw-bold text-center mb-4">Create Account</h3>

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
                            <div className="mb-3">
                                <label className="form-label">{role === 'employer' ? 'Contact Person Name' : 'Full Name'}</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
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
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
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
