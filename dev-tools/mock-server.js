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
        salaryMax: 160000
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
        salaryMax: 140000
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
        salaryMax: 110000
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
        salaryMax: 105000
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
