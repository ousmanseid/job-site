import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyService from '../services/CompanyService';

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchCompanies();
    }, [page, searchQuery]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            let response;
            if (searchQuery) {
                response = await CompanyService.searchCompanies(searchQuery, page);
            } else {
                response = await CompanyService.getAllCompanies(page);
            }
            if (response.data && response.data.content) {
                setCompanies(response.data.content);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchCompanies();
    };

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5 mt-4">
                <h1 className="fw-bold display-5 mb-3">Top Companies</h1>
                <p className="text-muted lead">Discover great places to work</p>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm p-3 mb-5 rounded-4 bg-white mx-auto" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSearch}>
                    <div className="row g-2">
                        <div className="col-md-9">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 py-3"
                                    placeholder="Company name, industry, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-teal w-100 h-100 text-white fw-bold">Search</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : companies.length > 0 ? (
                    companies.map(company => (
                        <div key={company.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card transition-all">
                                <div className="mx-auto bg-light rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="img-fluid rounded-circle" />
                                    ) : (
                                        <span className="fw-bold fs-3 text-secondary">{company.name.charAt(0)}</span>
                                    )}
                                </div>
                                <h5 className="fw-bold mb-1">{company.name}</h5>
                                <p className="text-muted small mb-3">{company.industry || 'Industry not specified'}</p>

                                <div className="d-flex justify-content-center gap-2 mb-4">
                                    <span className="badge bg-light text-muted fw-normal"><i className="bi bi-geo-alt me-1"></i> {company.city || 'Remote'}</span>
                                    <span className="badge bg-light text-muted fw-normal"><i className="bi bi-people me-1"></i> {company.size || 'N/A'}</span>
                                </div>

                                <Link to={`/companies/${company.id}`} className="btn btn-outline-primary btn-sm rounded-pill w-100 mt-auto">View Profile</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5 w-100">
                        <i className="bi bi-building display-1 text-light mb-3"></i>
                        <p className="text-muted">No companies found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
