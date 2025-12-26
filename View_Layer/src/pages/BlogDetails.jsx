import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    // This data would ideally come from an API
    const blogPosts = [
        {
            id: 1,
            title: "Top 10 Skills Employers Are Looking For in 2024",
            category: "Career Advice",
            author: "Sarah Johnson",
            date: "Dec 15, 2024",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>The job market in 2024 is more competitive than ever. Employers are no longer just looking for technical proficiency; they want well-rounded individuals who can adapt to rapid changes.</p>
                <h3>1. Artificial Intelligence Literacy</h3>
                <p>Understanding how to leverage AI tools to improve productivity is now a baseline requirement in many tech and even non-tech roles.</p>
                <h3>2. Emotional Intelligence (EQ)</h3>
                <p>As we work more with machines, the ability to connect with people becomes even more valuable. Empathy, self-awareness, and social skills are top priorities.</p>
                <h3>3. Adaptability</h3>
                <p>The only constant is change. Showing that you can pivot and learn new systems quickly is a major selling point.</p>
                <p>In conclusion, focusing on a mix of high-tech skills and high-touch human skills will make you the ideal candidate in 2024.</p>
            `
        },
        {
            id: 2,
            title: "How to Ace Your Remote Job Interview",
            category: "Interview Tips",
            author: "Michael Chen",
            date: "Dec 12, 2024",
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>Remote work is here to stay, and so are remote interviews. Preparation for a virtual meeting is different from an in-person one.</p>
                <h3>Master Your Environment</h3>
                <p>Ensure your background is professional and your lighting is front-facing. Avoid being a silhouette against a bright window.</p>
                <h3>Test Your Tech</h3>
                <p>Check your microphone, camera, and internet connection 15 minutes before the start. Have a backup plan (like a phone hotspot) ready.</p>
                <p>Remember to look directly at the camera to simulate eye contact, and don't forget to smile!</p>
            `
        },
        {
            id: 3,
            title: "The Future of Work: Hybrid Models",
            category: "Industry Trends",
            author: "Emma Wilson",
            date: "Dec 10, 2024",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>The 9-to-5 desk job is undergoing a massive transformation. Hybrid work—a blend of office and remote work—is becoming the new standard.</p>
                <p>Companies are finding that employee satisfaction increases when given flexibility. However, it requires intentional communication strategies to keep teams aligned.</p>
                <p>We explore how leading tech firms are implementing "anchor days" and "virtual watercoolers" to maintain culture without the cubicles.</p>
            `
        },
        {
            id: 4,
            title: "Networking 101: Building Professional Connections",
            category: "Networking",
            author: "David Brown",
            date: "Dec 05, 2024",
            image: "https://images.unsplash.com/photo-1515169067750-d51a743a5a33?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>Networking isn't about collecting business cards; it's about building relationships. Start by offering value to others before asking for favors.</p>
                <p>LinkedIn is your most powerful tool. Keep your profile updated and engage with content in your industry to stay visible.</p>
                <p>Attend webinars, join professional groups, and don't be afraid to reach out for informational interviews.</p>
            `
        },
        {
            id: 5,
            title: "Crafting the Perfect Resume",
            category: "Resume Tips",
            author: "Alice Cooper",
            date: "Nov 28, 2024",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>Recruiters spend an average of 6 seconds looking at a resume. Yours needs to pop immediately.</p>
                <p>Use a clean layout, bullet points for readability, and quantify your achievements with numbers whenever possible.</p>
                <p>Tailor your resume for every single job application by including keywords from the job description.</p>
            `
        },
        {
            id: 6,
            title: "Mental Health in the Workplace",
            category: "Wellness",
            author: "Dr. Robert Lee",
            date: "Nov 20, 2024",
            image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&q=80",
            content: `
                <p>Stress and burnout are the leading causes of workplace turnover. Taking care of your mind is just as important as meeting your KPIs.</p>
                <p>Set boundaries for your working hours, take regular breaks, and don't hesitate to use your PTO for a mental health day.</p>
                <p>Employers are also stepping up with EAP programs and mindfulness resources. Make sure to use what's available to you.</p>
            `
        }
    ];

    useEffect(() => {
        const foundPost = blogPosts.find(p => p.id === parseInt(id));
        if (foundPost) {
            setPost(foundPost);
            window.scrollTo(0, 0);
        } else {
            navigate('/blog');
        }
    }, [id, navigate]);

    if (!post) return <div className="container py-5 mt-5">Loading...</div>;

    return (
        <div className="container py-5 mt-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{post.category}</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <img src={post.image} alt={post.title} className="w-100 rounded-4 shadow-sm mb-5" style={{ height: '450px', objectFit: 'cover' }} />

                    <div className="d-flex align-items-center mb-4 text-muted">
                        <span className="badge bg-primary rounded-pill px-3 py-2 me-3">{post.category}</span>
                        <div className="d-flex align-items-center me-4">
                            <i className="bi bi-calendar3 me-2"></i>
                            <span>{post.date}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2"></i>
                            <span>By {post.author}</span>
                        </div>
                    </div>

                    <h1 className="fw-bold display-4 mb-4 text-dark">{post.title}</h1>

                    <div className="blog-content fs-5 leading-relaxed text-secondary mb-5"
                        dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>

                    <hr className="my-5" />

                    <div className="bg-light p-4 rounded-4 d-flex align-items-center mb-5">
                        <img src={`https://ui-avatars.com/api/?name=${post.author}&background=0D6EFD&color=fff`} alt={post.author} className="rounded-circle me-4" style={{ width: '80px' }} />
                        <div>
                            <h5 className="fw-bold mb-1">Written by {post.author}</h5>
                            <p className="text-muted mb-0">Professional career consultant and industry expert with over 10 years of experience helping candidates navigate the modern job market.</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/blog" className="btn btn-outline-primary btn-lg rounded-pill px-5">
                            <i className="bi bi-arrow-left me-2"></i> Back to Blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
