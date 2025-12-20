import React from 'react'

const About = () => {
    return (
        <div className="container py-5 mt-5">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <h2 className="fw-bold mb-4">About Smart Job Portal</h2>
                    <p className="lead text-muted">We are dedicated to connecting talent with opportunity on a global scale.</p>
                    <p className="text-muted">Our mission is to make the job search process as seamless and efficient as possible for both employers and job seekers.</p>
                </div>
                <div className="col-lg-6">
                    {/* Placeholder Image */}
                    <div className="bg-light rounded-4 w-100" style={{ height: '300px' }}></div>
                </div>
            </div>
        </div>
    )
}

export default About
