import React from 'react'

const Contact = () => {
    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-5 rounded-4">
                        <h2 className="fw-bold text-center mb-4">Get in Touch</h2>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control form-control-lg" placeholder="Your Name" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control form-control-lg" placeholder="your@email.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea className="form-control form-control-lg" rows="4"></textarea>
                            </div>
                            <button className="btn btn-primary btn-lg w-100">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
