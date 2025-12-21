import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'jobseeker') return '/dashboard/jobseeker';
        if (user.role === 'employer') return '/dashboard/employer';
        if (user.role === 'admin') return '/dashboard/admin';
        return '/';
    }

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-transparent">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <div className="bg-dark text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>SJP</span>
                    </div>
                    <span className="fw-bold text-dark fs-5">SMART JOB PORTAL</span>
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/jobs">Find Jobs</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/companies">Companies</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                        {user && (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
                                    to={getDashboardLink()}
                                >
                                    Dashboard
                                </Link>
                            </li>
                        )}
                        <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
                    </ul>
                    <div className="d-flex align-items-center flex-column flex-lg-row gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <>
                                <span className="fw-bold">Hi, {user.name || 'User'}</span>
                                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-nav-login">Login</Link>
                                <Link to="/register" className="btn-nav-register text-decoration-none">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
