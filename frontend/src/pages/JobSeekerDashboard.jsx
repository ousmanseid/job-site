import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Link } from 'react-router-dom'
import JobSeekerService from '../services/JobSeekerService'
import ApplicationService from '../services/ApplicationService'
import { useAuth } from '../context/AuthContext'

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalApplied: 0,
        savedJobs: 0,
        jobAlerts: 0,
        totalJobs: 0,
        totalCompanies: 0,
        remoteJobs: 0,
        categoryCounts: {}
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    const CATEGORY_METADATA = {
        'Software': { icon: 'bi-laptop', color: 'blue' },
        'Software Development': { icon: 'bi-laptop', color: 'blue' },
        'Design': { icon: 'bi-palette', color: 'teal' },
        'Marketing': { icon: 'bi-megaphone', color: 'orange' },
        'Sales': { icon: 'bi-bag-check', color: 'green' },
        'Customer': { icon: 'bi-headset', color: 'purple' },
        'Finance': { icon: 'bi-cash-stack', color: 'red' },
        'Management': { icon: 'bi-people', color: 'indigo' },
        'Data Science': { icon: 'bi-cpu', color: 'cyan' },
        'Other': { icon: 'bi-collection', color: 'secondary' }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch stats
                const statsRes = await JobSeekerService.getStats();
                if (statsRes && statsRes.data) {
                    console.log("Dashboard Stats fetched:", statsRes.data);
                    setStats(statsRes.data);
                }

                // Fetch recent applications
                const appsRes = await ApplicationService.getMyApplications();
                if (appsRes && Array.isArray(appsRes.data)) {
                    setRecentApplications(appsRes.data.slice(0, 3));
                }

                // Fetch recommended jobs
                const recRes = await JobSeekerService.getRecommendedJobs();
                if (recRes && Array.isArray(recRes.data)) {
                    setRecommendedJobs(recRes.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateStrength = () => {
        let strength = 20; // Base: Account created
        if (user?.firstName && user?.lastName) strength += 10;
        if (user?.email) strength += 10;
        if (user?.phone) strength += 15;
        if (user?.city) strength += 15;
        if (user?.bio) strength += 15;
        if (user?.profilePicture) strength += 15;
        return strength > 100 ? 100 : strength;
    };

    const profileStrength = calculateStrength();

    // Helper to format large numbers
    const formatCount = (count) => {
        if (loading) return "...";
        if (count === null || count === undefined) return "0";
        if (count >= 1000) return (count / 1000).toFixed(1) + 'k+';
        return count;
    };

    // Get dynamic categories from stats
    const displayCategories = Object.keys(stats.categoryCounts).length > 0
        ? Object.keys(stats.categoryCounts).map(name => ({
            name,
            count: stats.categoryCounts[name],
            ...(CATEGORY_METADATA[name] || CATEGORY_METADATA['Other'])
        }))
        : [
            { name: 'Software Development', count: 0, ...CATEGORY_METADATA['Software Development'] },
            { name: 'Design', count: 0, ...CATEGORY_METADATA['Design'] },
            { name: 'Management', count: 0, ...CATEGORY_METADATA['Management'] },
            { name: 'Data Science', count: 0, ...CATEGORY_METADATA['Data Science'] }
        ];

    return (
        <DashboardLayout role="jobseeker">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold text-dark mb-0">Overview</h4>
                    <p className="extra-small text-muted mb-0">Insights & analytics of your career journey</p>
                </div>
                <div className="d-none d-md-block">
                    <span className="text-muted small fw-medium">
                        <i className="bi bi-calendar3 me-2"></i>
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Quick Search Section */}
            <div className="content-card border-0 shadow-lg mb-4 text-white overflow-hidden p-0" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
                <div className="row g-0 align-items-center">
                    <div className="col-lg-7 p-4 p-md-5">
                        <h3 className="fw-bold mb-3">Find Your Next Big Opportunity</h3>
                        <p className="opacity-75 mb-4 small">Search across thousands of verified jobs and companies instantly.</p>
                        <div className="row g-2">
                            <div className="col-md-5">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-0 text-muted"><i className="bi bi-search"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none py-2"
                                        placeholder="Job title, skills..."
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-0 text-muted"><i className="bi bi-geo-alt"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none py-2"
                                        placeholder="Location..."
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <Link to={`/jobs?keyword=${searchKeyword}&location=${searchLocation}`} className="btn btn-teal w-100 h-100 d-flex align-items-center justify-content-center fw-bold transition-all hover-scale">
                                    Search
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 d-none d-lg-block text-center py-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="px-4 border-start border-white border-opacity-10">
                            <span className="d-block extra-small text-uppercase opacity-75 mb-3 letter-spacing-1 fw-bold">Live Market Insights</span>
                            <div className="d-flex justify-content-around">
                                <div className="text-center">
                                    <div className="fw-bold fs-3 text-white">{formatCount(stats.totalJobs)}</div>
                                    <div className="extra-small opacity-75">Active Jobs</div>
                                </div>
                                <div className="divider-vr mx-2 bg-white bg-opacity-25" style={{ width: '1px' }}></div>
                                <div className="text-center">
                                    <div className="fw-bold fs-3 text-white">{formatCount(stats.totalCompanies)}</div>
                                    <div className="extra-small opacity-75">Companies</div>
                                </div>
                                <div className="divider-vr mx-2 bg-white bg-opacity-25" style={{ width: '1px' }}></div>
                                <div className="text-center">
                                    <div className="fw-bold fs-3 text-white">{formatCount(stats.remoteJobs)}</div>
                                    <div className="extra-small opacity-75">Remote</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <Link to="/dashboard/jobseeker/applied" className="text-decoration-none h-100 d-block">
                        <div className="stat-card border-0 shadow-sm p-4 rounded-4 bg-white h-100 transition-all hover-translate-y border-bottom border-primary border-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="stat-icon bg-blue-soft text-primary rounded-3 p-3">
                                    <i className="bi bi-briefcase fs-4"></i>
                                </div>
                                <span className="badge bg-blue-soft text-primary rounded-pill small">Activity</span>
                            </div>
                            <div className="stat-value fs-2 fw-bold text-dark">{formatCount(stats.totalApplied)}</div>
                            <div className="stat-label text-muted fw-bold extra-small text-uppercase mt-1">Total Applied</div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/jobs" className="text-decoration-none h-100 d-block">
                        <div className="stat-card border-0 shadow-sm p-4 rounded-4 bg-white h-100 transition-all hover-translate-y border-bottom border-success border-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="stat-icon bg-green-soft text-success rounded-3 p-3">
                                    <i className="bi bi-heart fs-4"></i>
                                </div>
                                <span className="badge bg-green-soft text-success rounded-pill small">Ready</span>
                            </div>
                            <div className="stat-value fs-2 fw-bold text-dark">{formatCount(stats.savedJobs)}</div>
                            <div className="stat-label text-muted fw-bold extra-small text-uppercase mt-1">Saved Roles</div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/dashboard/jobseeker/alerts" className="text-decoration-none h-100 d-block">
                        <div className="stat-card border-0 shadow-sm p-4 rounded-4 bg-white h-100 transition-all hover-translate-y border-bottom border-warning border-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="stat-icon bg-orange-soft text-warning rounded-3 p-3">
                                    <i className="bi bi-bell fs-4"></i>
                                </div>
                                {stats.jobAlerts > 0 && <span className="badge bg-danger text-white rounded-pill small">{stats.jobAlerts} New</span>}
                            </div>
                            <div className="stat-value fs-2 fw-bold text-dark">{formatCount(stats.jobAlerts)}</div>
                            <div className="stat-label text-muted fw-bold extra-small text-uppercase mt-1">New Alerts</div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <div className="stat-card border-0 shadow-sm p-4 rounded-4 bg-white h-100 transition-all hover-translate-y border-bottom border-info border-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon bg-teal-soft text-teal rounded-3 p-3">
                                <i className="bi bi-star fs-4"></i>
                            </div>
                            <span className="badge bg-teal-soft text-teal rounded-pill small">AI Picks</span>
                        </div>
                        <div className="stat-value fs-2 fw-bold text-dark">{formatCount(stats.totalJobs > 0 ? Math.min(stats.totalJobs, 12) : 0)}</div>
                        <div className="stat-label text-muted fw-bold extra-small text-uppercase mt-1">Recommended</div>
                    </div>
                </div>
            </div>

            {/* Popular Categories */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 px-1 text-dark">Jobs by Industry</h5>
                <Link to="/jobs" className="btn btn-sm btn-link text-decoration-none small fw-bold">Explore All <i className="bi bi-arrow-right small"></i></Link>
            </div>
            <div className="row g-3 mb-5">
                {displayCategories.map((cat, idx) => (
                    <div key={idx} className="col-md-4 col-lg-2">
                        <Link to={`/jobs?category=${cat.name}`} className="text-decoration-none">
                            <div className="content-card p-3 text-center h-100 transition-all hover-card cursor-pointer border-0 shadow-sm bg-white">
                                <div className={`mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center bg-${cat.color}-soft text-${cat.color}`} style={{ width: '55px', height: '55px', fontSize: '1.4rem' }}>
                                    <i className={`bi ${cat.icon}`}></i>
                                </div>
                                <div className="fw-bold small text-dark mb-1 text-truncate" title={cat.name}>{cat.name}</div>
                                <div className="text-muted extra-small">{formatCount(cat.count)} jobs</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Recent Applications */}
                <div className="col-lg-8">
                    <div className="content-card h-100 border-0 shadow-sm bg-white p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0">My Applications</h5>
                                <p className="text-muted extra-small mb-0">Status tracking for your recent submissons</p>
                            </div>
                            <Link to="/dashboard/jobseeker/applied" className="btn btn-sm btn-teal-soft text-teal text-decoration-none fw-bold px-3 py-2 rounded-pill">Track All</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table theme-table mb-0">
                                <thead className="bg-light">
                                    <tr style={{ fontSize: '0.8rem' }}>
                                        <th className="border-0 rounded-start text-muted py-3">POSITION</th>
                                        <th className="border-0 text-muted py-3">COMPANY</th>
                                        <th className="border-0 text-muted py-3">STATUS</th>
                                        <th className="border-0 rounded-end text-muted py-3">DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted border-0">
                                            <div className="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
                                            Loading applications...
                                        </td></tr>
                                    ) : recentApplications.length > 0 ? (
                                        recentApplications.map(app => (
                                            <tr key={app.id} style={{ fontSize: '0.9rem' }} className="align-middle">
                                                <td className="py-3 border-0"><span className="fw-bold text-dark">{app.job?.title || 'Unknown Role'}</span></td>
                                                <td className="py-3 border-0 text-muted">{app.job?.company?.name || 'Unknown Company'}</td>
                                                <td className="py-3 border-0">
                                                    <span className={`badge rounded-pill px-3 py-2 fw-medium ${app.status === 'ACCEPTED' ? 'bg-success-soft text-success' :
                                                        app.status === 'REJECTED' ? 'bg-danger-soft text-danger' :
                                                            'bg-orange-soft text-warning'
                                                        }`}>
                                                        {app.status === 'SUBMITTED' ? 'Pending' : app.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 border-0 text-muted small">{new Date(app.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-5 border-0">
                                            <div className="py-2">
                                                <i className="bi bi-send-dash fs-1 text-muted opacity-25 d-block mb-3"></i>
                                                <p className="text-muted small mb-0">Ready to start? Apply to your first job today!</p>
                                            </div>
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="col-lg-4">
                    <div className="content-card h-100 border-0 shadow-sm bg-white p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0 text-dark">Top For You</h5>
                                <p className="text-muted extra-small mb-0">Curated recommendations</p>
                            </div>
                            <button className="btn btn-sm btn-light rounded-circle" disabled={loading}><i className="bi bi-arrow-clockwise"></i></button>
                        </div>
                        <div className="d-grid gap-3">
                            {loading ? (
                                [1, 2, 3].map(n => (
                                    <div key={n} className="p-3 border border-light rounded-4 bg-light bg-opacity-50 animate-pulse">
                                        <div className="h-10 bg-secondary bg-opacity-10 rounded w-75 mb-2"></div>
                                        <div className="h-10 bg-secondary bg-opacity-10 rounded w-50"></div>
                                    </div>
                                ))
                            ) : recommendedJobs.length > 0 ? (
                                recommendedJobs.map((job) => (
                                    <div key={job.id} className="p-3 border border-light rounded-4 shadow-sm-hover transition-all hover-translate-y bg-white">
                                        <div className="d-flex align-items-start mb-3">
                                            <div className="bg-light rounded-4 p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                                {job.company?.logo ? (
                                                    <img src={job.company.logo} alt="Logo" className="w-100 h-100 object-fit-contain" />
                                                ) : (
                                                    <i className="bi bi-building fs-5 text-primary"></i>
                                                )}
                                            </div>
                                            <div className="flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                                                <div className="fw-bold text-dark small mb-1" style={{ lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{job.title}</div>
                                                <div className="text-muted extra-small text-truncate">{job.company?.name || 'Top Company'}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                            <div className="d-flex flex-column overflow-hidden flex-grow-1 me-2">
                                                <span className="text-teal fw-bold small text-truncate">
                                                    {job.salaryMax ? `$${(job.salaryMax / 1000).toFixed(1)}k/yr` : 'Negotiable'}
                                                </span>
                                                <span className="extra-small text-muted text-truncate">{job.location || 'Remote'}</span>
                                            </div>
                                            <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-teal rounded-pill px-3 py-1 fw-bold flex-shrink-0" style={{ fontSize: '0.7rem' }}>View</Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-stars fs-2 text-warning d-block mb-3 opacity-25"></i>
                                    <p className="extra-small text-muted px-4 mb-0">Complete your profile to unlock tailored job recommendations.</p>
                                </div>
                            )}
                        </div>
                        <Link to="/jobs" className="btn btn-outline-light text-dark w-100 mt-3 py-2 text-decoration-none fw-bold small border-light rounded-pill hover-bg-light transition-all">Explore All Jobs</Link>
                    </div>
                </div>
            </div>

            {/* Account Insight Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="content-card border-0 shadow-sm bg-white p-4">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="fw-bold text-dark mb-2">Maximize Your Hire Probability!</h5>
                                <p className="text-muted small mb-3">Completed profiles are <span className="text-primary fw-bold">3x more likely</span> to get noticed by recruiters. Add your phone, bio, and a profile picture to get started.</p>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="progress flex-grow-1" style={{ height: '8px', maxWidth: '300px', borderRadius: '10px' }}>
                                        <div className="progress-bar bg-teal" role="progressbar" style={{ width: `${profileStrength}%`, borderRadius: '10px' }}></div>
                                    </div>
                                    <span className="extra-small fw-bold text-dark">{profileStrength}% Complete</span>
                                </div>
                            </div>
                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                <Link to="/dashboard/jobseeker/profile" className="btn btn-teal text-white px-4 py-2 rounded-pill fw-bold hover-scale transition-all">Complete Profile <i className="bi bi-arrow-right ms-2"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default JobSeekerDashboard
