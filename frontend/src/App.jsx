import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Companies from './pages/Companies'
import CompanyDetails from './pages/CompanyDetails'
import JobDetails from './pages/JobDetails'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import JobSeekerProfile from './pages/JobSeekerProfile'
import JobSeekerApplications from './pages/JobSeekerApplications'
import JobSeekerCV from './pages/JobSeekerCV'
import JobSeekerAlerts from './pages/JobSeekerAlerts'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerProfile from './pages/EmployerProfile'
import EmployerPostJob from './pages/EmployerPostJob'
import EmployerManageJobs from './pages/EmployerManageJobs'
import EmployerApplications from './pages/EmployerApplications'
import AdminDashboard from './pages/AdminDashboard'
import AdminSettings from './pages/AdminSettings'
import AdminCVTemplates from './pages/AdminCVTemplates'
import AdminUsers from './pages/AdminUsers'
import AdminApprovals from './pages/AdminApprovals'
import JobSeekerProfileView from './pages/JobSeekerProfileView'
import EmployerEditJob from './pages/EmployerEditJob'
import BlogDetails from './pages/BlogDetails'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

const AppContent = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const location = useLocation();
    const isDashboardRoute = location.pathname.startsWith('/dashboard');
    const hideNavbar = isDashboardRoute || isAdmin;

    return (
        <div className={`min-vh-100 d-flex flex-column font-poppins ${!hideNavbar ? 'has-navbar' : ''}`}>
            {!hideNavbar && <Navbar />}
            <main className="flex-grow-1">
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Home />} />
                        <Route path="/jobs" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Jobs />} />
                        <Route path="/companies" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Companies />} />
                        <Route path="/companies/:id" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <CompanyDetails />} />
                        <Route path="/jobs/:id" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <JobDetails />} />
                        <Route path="/about" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <About />} />
                        <Route path="/blog" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Blog />} />
                        <Route path="/blog/:id" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <BlogDetails />} />
                        <Route path="/contact" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Contact />} />
                        <Route path="/login" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Login />} />
                        <Route path="/register" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Register />} />

                        {/* Protected Dashboard Routes */}
                        <Route
                            path="/dashboard/jobseeker"
                            element={
                                <ProtectedRoute allowedRoles={['jobseeker']}>
                                    <JobSeekerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/jobseeker/profile"
                            element={
                                <ProtectedRoute allowedRoles={['jobseeker']}>
                                    <JobSeekerProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/jobseeker/applied"
                            element={
                                <ProtectedRoute allowedRoles={['jobseeker']}>
                                    <JobSeekerApplications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/jobseeker/cv"
                            element={
                                <ProtectedRoute allowedRoles={['jobseeker']}>
                                    <JobSeekerCV />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/jobseeker/alerts"
                            element={
                                <ProtectedRoute allowedRoles={['jobseeker']}>
                                    <JobSeekerAlerts />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/profile"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/post-job"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerPostJob />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/jobs"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerManageJobs />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/applications"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerApplications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/applicant/:id"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <JobSeekerProfileView />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/employer/edit-job/:id"
                            element={
                                <ProtectedRoute allowedRoles={['employer']}>
                                    <EmployerEditJob />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/admin/settings"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminSettings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/admin/cv"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminCVTemplates />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/admin/approvals"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminApprovals />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/features" element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <Home />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ErrorBoundary>
            </main>

            {!hideNavbar && (
                <footer className="bg-white py-5 border-top mt-auto">
                    <div className="container text-center">
                        <p className="text-muted mb-0">&copy; 2024 Smart Job Portal. All rights reserved.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    )
}

export default App
