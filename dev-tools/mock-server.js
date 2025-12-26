const http = require('http');
const url = require('url');

const PORT = 8080;

// Sample Data
const roles = [
    { id: 1, name: 'ROLE_JOBSEEKER', description: 'Job Seeker' },
    { id: 2, name: 'ROLE_EMPLOYER', description: 'Employer' },
    { id: 3, name: 'ROLE_ADMIN', description: 'Administrator' }
];

let companies = [
    { id: 1, userId: 4, name: 'TechCorp Solutions', description: 'Leading technology provider', industry: 'Technology', location: 'Seattle, WA', status: 'APPROVED' },
    { id: 2, userId: 5, name: 'Innovate Solutions Inc', description: 'Innovation-driven software development', industry: 'Software Development', location: 'Austin, TX', status: 'APPROVED' },
    { id: 3, userId: 6, name: 'Future AI', description: 'AI Research Startup', industry: 'Artificial Intelligence', location: 'San Francisco, CA', status: 'PENDING' }
];

let jobs = [
    {
        id: 1,
        company_id: 1,
        company: companies[0],
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack Developer to join our dynamic team.',
        location: 'Seattle, WA',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        category: 'Software Development',
        salaryMin: 120000,
        salaryMax: 160000,
        createdAt: "2024-12-10T10:00:00Z",
        applicationCount: 5
    },
    {
        id: 2,
        company_id: 1,
        company: companies[0],
        title: 'DevOps Engineer',
        description: 'Join our team as a DevOps Engineer to build and maintain our cloud infrastructure.',
        location: 'Seattle, WA',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        category: 'DevOps',
        salaryMin: 100000,
        salaryMax: 140000,
        createdAt: "2024-12-12T14:00:00Z",
        applicationCount: 3
    },
    {
        id: 3,
        company_id: 2,
        company: companies[1],
        title: 'Frontend Developer',
        description: 'Looking for a creative Frontend Developer to build beautiful user interfaces.',
        location: 'Austin, TX',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        category: 'Frontend Development',
        salaryMin: 80000,
        salaryMax: 110000,
        createdAt: "2024-12-14T11:00:00Z",
        applicationCount: 12
    },
    {
        id: 4,
        company_id: 2,
        company: companies[1],
        title: 'UX/UI Designer',
        description: 'Seeking a talented UX/UI Designer to create exceptional user experiences.',
        location: 'Austin, TX',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        category: 'Design',
        salaryMin: 75000,
        salaryMax: 105000,
        createdAt: "2024-12-15T16:00:00Z",
        applicationCount: 8
    }
];

let blogs = [
    {
        id: 1,
        title: "Top 10 Skills Employers Are Looking For in 2024",
        category: "Career Advice",
        author: "Sarah Johnson",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        summary: "The job market is constantly evolving. Discover the essential skills that will set you apart.",
        content: "<p>Artificial Intelligence Literacy and Emotional Intelligence are top of the list. In today's rapidly changing job market, employers are seeking candidates who can adapt and grow with emerging technologies while maintaining strong interpersonal skills.</p><p>Key skills include: AI/ML understanding, data analysis, cloud computing, cybersecurity awareness, and soft skills like communication, leadership, and problem-solving.</p>",
        createdAt: "2024-12-15T10:00:00Z"
    },
    {
        id: 2,
        title: "How to Ace Your Next Job Interview",
        category: "Interview Tips",
        author: "Michael Chen",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        summary: "Master the art of interviewing with these proven strategies and tips from industry experts.",
        content: "<p>Preparation is key to interview success. Research the company thoroughly, practice common interview questions, and prepare thoughtful questions to ask your interviewer.</p><p>Remember to dress professionally, arrive early, maintain good eye contact, and follow up with a thank-you email within 24 hours.</p>",
        createdAt: "2024-12-18T14:30:00Z"
    },
    {
        id: 3,
        title: "Remote Work: Best Practices for Productivity",
        category: "Work Culture",
        author: "Emily Rodriguez",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        summary: "Learn how to stay productive and maintain work-life balance while working from home.",
        content: "<p>Remote work offers flexibility but requires discipline. Create a dedicated workspace, establish a routine, and set clear boundaries between work and personal time.</p><p>Use productivity tools, take regular breaks, and stay connected with your team through video calls and collaboration platforms.</p>",
        createdAt: "2024-12-20T09:15:00Z"
    },
    {
        id: 4,
        title: "Navigating Career Transitions Successfully",
        category: "Career Advice",
        author: "David Thompson",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        summary: "Thinking about changing careers? Here's your comprehensive guide to making a smooth transition.",
        content: "<p>Career transitions can be challenging but rewarding. Start by identifying transferable skills, networking in your target industry, and considering additional training or certifications.</p><p>Update your resume to highlight relevant experience, be patient with the process, and don't be afraid to start in a junior position to gain industry experience.</p>",
        createdAt: "2024-12-22T11:45:00Z"
    },
    {
        id: 5,
        title: "Building Your Personal Brand on LinkedIn",
        category: "Professional Development",
        author: "Jessica Martinez",
        imageUrl: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=800&q=80",
        summary: "Leverage LinkedIn to showcase your expertise and attract career opportunities.",
        content: "<p>Your LinkedIn profile is your digital business card. Optimize your headline, write a compelling summary, and regularly share industry insights and achievements.</p><p>Engage with your network by commenting on posts, joining relevant groups, and publishing articles that demonstrate your expertise.</p>",
        createdAt: "2024-12-23T16:20:00Z"
    },
    {
        id: 6,
        title: "The Future of AI in the Workplace",
        category: "Technology",
        author: "Dr. Robert Kim",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        summary: "Explore how artificial intelligence is reshaping industries and creating new job opportunities.",
        content: "<p>AI is not replacing jobs—it's transforming them. Understanding AI tools and how to work alongside them is becoming essential across all industries.</p><p>From automated customer service to predictive analytics, AI is creating efficiency while opening new roles in AI ethics, machine learning engineering, and data science.</p>",
        createdAt: "2024-12-24T08:00:00Z"
    }
];

let users = [
    { id: 1, email: 'admin@jobportal.com', password: 'password123', role: 'ADMIN', firstName: 'Admin', lastName: 'User' },
    { id: 2, email: 'john.doe@email.com', password: 'password123', role: 'JOBSEEKER', firstName: 'John', lastName: 'Doe' },
    { id: 4, email: 'techcorp@company.com', password: 'password123', role: 'EMPLOYER', firstName: 'Tech', lastName: 'Corp' }
];

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    if (path.endsWith('/') && path.length > 1) {
        path = path.substring(0, path.length - 1);
    }

    console.log(`${req.method} ${path}`);

    // Read body for POST/PUT requests
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let payload = {};
        try {
            payload = body ? JSON.parse(body) : {};
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }

        // API Routes
        if (path === '/api/jobs' && req.method === 'GET') {
            const query = parsedUrl.query;
            let filteredJobs = [...jobs];

            if (query.keyword) {
                filteredJobs = filteredJobs.filter(j =>
                    j.title.toLowerCase().includes(query.keyword.toLowerCase()) ||
                    j.description.toLowerCase().includes(query.keyword.toLowerCase())
                );
            }
            if (query.location) {
                filteredJobs = filteredJobs.filter(j =>
                    j.location.toLowerCase().includes(query.location.toLowerCase())
                );
            }
            if (query.category) {
                filteredJobs = filteredJobs.filter(j =>
                    j.category === query.category
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                content: filteredJobs,
                totalElements: filteredJobs.length,
                totalPages: 1,
                size: 10,
                number: 0
            }));
        } else if (path.startsWith('/api/jobs/') && req.method === 'GET') {
            const id = parseInt(path.split('/').pop());
            const job = jobs.find(j => j.id === id);
            if (job) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(job));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Job not found' }));
            }
        } else if (path === '/api/auth/login' && req.method === 'POST') {
            const { email, password } = payload;
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    accessToken: 'mock-jwt-token-' + user.role,
                    tokenType: 'Bearer',
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid email or password' }));
            }
        } else if (path === '/api/auth/register' && req.method === 'POST') {
            const userData = payload;
            userData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push(userData);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered successfully' }));
        }

        // Blog Endpoints
        else if (path === '/api/blogs' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(blogs));
        } else if (path.startsWith('/api/blogs/') && req.method === 'GET') {
            const id = parseInt(path.split('/').pop());
            const blog = blogs.find(b => b.id === id);
            if (blog) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(blog));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Blog not found' }));
            }
        } else if (path === '/api/blogs' && req.method === 'POST') {
            const newBlog = payload;
            newBlog.id = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
            newBlog.createdAt = new Date().toISOString();
            blogs.push(newBlog);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBlog));
        } else if (path.startsWith('/api/blogs/') && req.method === 'PUT') {
            const id = parseInt(path.split('/').pop());
            const index = blogs.findIndex(b => b.id === id);
            if (index !== -1) {
                blogs[index] = { ...blogs[index], ...payload, updatedAt: new Date().toISOString() };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(blogs[index]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Blog not found' }));
            }
        } else if (path.startsWith('/api/blogs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = blogs.findIndex(b => b.id === id);
            if (index !== -1) {
                blogs.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Blog deleted' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Blog not found' }));
            }
        }

        // Employer Endpoints
        else if (path === '/api/employer/company' && req.method === 'GET') {
            const userId = parseInt(parsedUrl.query.userId);
            const company = companies.find(c => c.userId === userId);
            if (company) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(company));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company not found for this user' }));
            }
        } else if (path === '/api/employer/company' && req.method === 'PUT') {
            const userId = parseInt(parsedUrl.query.userId);
            const index = companies.findIndex(c => c.userId === userId);
            if (index !== -1) {
                companies[index] = { ...companies[index], ...payload };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(companies[index]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company not found' }));
            }
        } else if (path === '/api/employer/jobs' && req.method === 'GET') {
            const userId = parseInt(parsedUrl.query.userId);
            const company = companies.find(c => c.userId === userId);
            if (company) {
                const employerJobs = jobs.filter(j => j.company_id === company.id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(employerJobs));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
            }
        } else if (path === '/api/employer/jobs' && req.method === 'POST') {
            const userId = parseInt(parsedUrl.query.userId);
            const company = companies.find(c => c.userId === userId);
            if (company) {
                const newJob = payload;
                newJob.id = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
                newJob.company_id = company.id;
                newJob.company = company;
                jobs.push(newJob);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newJob));
            } else {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Only registered companies can post jobs' }));
            }
        } else if (path.startsWith('/api/employer/jobs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                jobs.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Job deleted' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Job not found' }));
            }
        } else if (path === '/api/employer/stats' && req.method === 'GET') {
            const userId = parseInt(parsedUrl.query.userId);
            const company = companies.find(c => c.userId === userId);
            if (company) {
                const companyJobs = jobs.filter(j => j.company_id === company.id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    activeJobs: companyJobs.length,
                    applicants: 12,
                    pendingReview: 3
                }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Stats not found' }));
            }
        }

        // Admin Endpoints
        else if (path === '/api/admin/stats' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                users: users.length,
                jobs: jobs.length,
                companies: companies.length,
                alerts: companies.filter(c => c.status === 'PENDING').length
            }));
        } else if (path === '/api/admin/users' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } else if (path === '/api/admin/users' && req.method === 'POST') {
            const newUser = payload;
            newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } else if (path.startsWith('/api/admin/users/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            if (id === 1) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cannot delete the main admin account' }));
                return;
            }
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User deleted successfully' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        } else if (path === '/api/admin/jobs' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jobs));
        } else if (path === '/api/admin/jobs' && req.method === 'POST') {
            const newJob = payload;
            newJob.id = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
            if (newJob.company_id) {
                newJob.company = companies.find(c => c.id === newJob.company_id);
            }
            jobs.push(newJob);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newJob));
        } else if (path.startsWith('/api/admin/jobs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                jobs.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Job deleted successfully' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Job not found' }));
            }
        } else if (path === '/api/admin/companies' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(companies));
        } else if (path.startsWith('/api/admin/companies/') && path.endsWith('/approve')) {
            const segments = path.split('/');
            const id = parseInt(segments[segments.indexOf('companies') + 1]);
            const company = companies.find(c => c.id === id);
            if (company) {
                company.status = 'APPROVED';
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company approved' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company not found' }));
            }
        } else if (path.startsWith('/api/admin/companies/') && path.endsWith('/reject')) {
            const segments = path.split('/');
            const id = parseInt(segments[segments.indexOf('companies') + 1]);
            const company = companies.find(c => c.id === id);
            if (company) {
                company.status = 'REJECTED';
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company rejected' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company not found' }));
            }
        } else if (path.startsWith('/api/admin/companies/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = companies.findIndex(c => c.id === id);
            if (index !== -1) {
                companies.splice(index, 1);
                jobs = jobs.filter(j => j.company_id !== id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company and associated jobs deleted' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Company not found' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not Found' }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Mock Backend Server running at http://localhost:${PORT}/api`);
});
