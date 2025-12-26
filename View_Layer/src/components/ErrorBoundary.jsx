import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container py-5 mt-5">
                    <div className="alert alert-danger p-5 rounded-4 shadow-sm text-center">
                        <i className="bi bi-exclamation-triangle display-1 mb-4"></i>
                        <h2 className="fw-bold">Something went wrong</h2>
                        <p className="mb-4">The page crashed while rendering. This is usually due to missing data or a coding error.</p>
                        <button
                            className="btn btn-primary px-4 py-2"
                            onClick={() => window.location.href = '/'}
                        >
                            Return to Homepage
                        </button>
                        <div className="mt-4 text-start">
                            <details style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                                <summary className="cursor-pointer text-muted">Error Details</summary>
                                {this.state.error && this.state.error.toString()}
                            </details>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
