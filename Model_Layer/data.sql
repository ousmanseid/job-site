-- Sample Data for Smart Job Portal Database
USE job_portal_db;

-- Insert Roles
INSERT INTO roles (name, description) VALUES
('ROLE_JOBSEEKER', 'Job Seeker who can search and apply for jobs'),
('ROLE_EMPLOYER', 'Employer who can post jobs and manage applications'),
('ROLE_ADMIN', 'System Administrator with full access');

-- Insert Sample Users (password is 'password123' encrypted with BCrypt)
INSERT INTO users (email, password, first_name, last_name, phone, city, state, country, is_active, is_verified, is_email_verified) VALUES
('admin@jobportal.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Admin', 'User', '555-0001', 'San Francisco', 'CA', 'USA', TRUE, TRUE, TRUE),
('john.doe@email.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'John', 'Doe', '555-0102', 'New York', 'NY', 'USA', TRUE, TRUE, TRUE),
('jane.smith@email.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Jane', 'Smith', '555-0103', 'Los Angeles', 'CA', 'USA', TRUE, TRUE, TRUE),
('techcorp@company.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Tech', 'Corp', '555-0201', 'Seattle', 'WA', 'USA', TRUE, TRUE, TRUE),
('innovate@company.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'Innovate', 'Solutions', '555-0202', 'Austin', 'TX', 'USA', TRUE, TRUE, TRUE);

-- Assign Roles to Users
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 3), -- Admin user
(2, 1), -- John Doe - Job Seeker
(3, 1), -- Jane Smith - Job Seeker
(4, 2), -- Tech Corp - Employer
(5, 2); -- Innovate Solutions - Employer

-- Insert Companies
INSERT INTO companies (user_id, name, description, industry, company_size, website, city, state, country, contact_phone, contact_email, is_verified, verification_status, verified_at) VALUES
(4, 'TechCorp Solutions', 'Leading technology solutions provider specializing in cloud computing and AI', 'Technology', '500-1000', 'https://techcorp.example.com', 'Seattle', 'WA', 'USA', '555-0201', 'hr@techcorp.example.com', TRUE, 'APPROVED', NOW()),
(5, 'Innovate Solutions Inc', 'Innovation-driven software development company', 'Software Development', '100-500', 'https://innovate.example.com', 'Austin', 'TX', 'USA', '555-0202', 'careers@innovate.example.com', TRUE, 'APPROVED', NOW());

-- Insert Jobs
INSERT INTO jobs (company_id, title, description, requirements, responsibilities, benefits, location, city, state, country, job_type, work_mode, category, experience_level, education_level, skills_required, salary_min, salary_max, salary_currency, salary_period, is_salary_negotiable, openings, application_deadline, is_active, status, published_at) VALUES
(1, 'Senior Full Stack Developer', 'We are looking for an experienced Full Stack Developer to join our dynamic team.', 
'5+ years of experience in full-stack development\nProficiency in React, Node.js, and MongoDB\nExperience with cloud platforms (AWS/Azure)\nStrong problem-solving skills', 
'Develop and maintain web applications\nCollaborate with cross-functional teams\nWrite clean, maintainable code\nParticipate in code reviews', 
'Health insurance\n401(k) matching\nFlexible work hours\nRemote work options\nProfessional development budget', 
'Seattle, WA', 'Seattle', 'WA', 'USA', 'FULL_TIME', 'HYBRID', 'Software Development', 'Senior', 'Bachelor', 
'React, Node.js, MongoDB, AWS, Docker, Kubernetes', 120000.00, 160000.00, 'USD', 'ANNUAL', TRUE, 2, DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, 'OPEN', NOW()),

(1, 'DevOps Engineer', 'Join our team as a DevOps Engineer to build and maintain our cloud infrastructure.',
'3+ years in DevOps/SRE role\nExperience with CI/CD pipelines\nKnowledge of containerization\nScripting skills (Python, Bash)',
'Manage cloud infrastructure\nImplement CI/CD pipelines\nMonitor system performance\nAutomatedeployment processes',
'Competitive salary\nHealth benefits\nStock options\nLearning opportunities',
'Seattle, WA', 'Seattle', 'WA', 'USA', 'FULL_TIME', 'REMOTE', 'DevOps', 'Mid-Level', 'Bachelor',
'AWS, Docker, Kubernetes, Jenkins, Terraform, Python', 100000.00, 140000.00, 'USD', 'ANNUAL', TRUE, 3, DATE_ADD(NOW(), INTERVAL 45 DAY), TRUE, 'OPEN', NOW()),

(2, 'Frontend Developer', 'Looking for a creative Frontend Developer to build beautiful user interfaces.',
'2+ years of frontend development\nExpert in React and TypeScript\nExperience with responsive design\nKnowledge of web accessibility',
'Build responsive web applications\nCollaborate with designers\nOptimize performance\nEnsure cross-browser compatibility',
'Flexible schedule\nRemote-first culture\nHealth insurance\nAnnual bonuses',
'Austin, TX', 'Austin', 'TX', 'USA', 'FULL_TIME', 'REMOTE', 'Frontend Development', 'Mid-Level', 'Bachelor',
'React, TypeScript, HTML5, CSS3, JavaScript, Redux', 80000.00, 110000.00, 'USD', 'ANNUAL', FALSE, 1, DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, 'OPEN', NOW()),

(2, 'UX/UI Designer', 'Seeking a talented UX/UI Designer to create exceptional user experiences.',
'3+ years in UX/UI design\nProficiency in Figma and Adobe XD\nStrong portfolio\nUnderstanding of user-centered design',
'Create wireframes and prototypes\nConduct user research\nDesign intuitive interfaces\nCollaborate with development team',
'Creative environment\nFlexible hours\nProfessional growth\nHealth benefits',
'Austin, TX', 'Austin', 'TX', 'USA', 'FULL_TIME', 'HYBRID', 'Design', 'Mid-Level', 'Bachelor',
'Figma, Adobe XD, Sketch, User Research, Prototyping', 75000.00, 105000.00, 'USD', 'ANNUAL', TRUE, 1, DATE_ADD(NOW(), INTERVAL 60 DAY), TRUE, 'OPEN', NOW());

-- Insert Sample CVs
INSERT INTO cvs (user_id, title, summary, experience, education, skills, is_default, is_public) VALUES
(2, 'John Doe - Software Developer', 
'Experienced full-stack developer with 6 years in web development',
'Senior Developer at ABC Tech (2020-Present)\nJunior Developer at XYZ Corp (2018-2020)',
'BS in Computer Science, State University (2018)',
'JavaScript, React, Node.js, Python, SQL, AWS',
TRUE, TRUE),

(3, 'Jane Smith - Frontend Specialist',
'Creative frontend developer passionate about user experience',
'Frontend Developer at Digital Agency (2019-Present)\nJunior Developer at StartupCo (2017-2019)',
'BS in Web Design, Tech Institute (2017)',
'React, TypeScript, HTML5, CSS3, UI/UX Design',
TRUE, TRUE);

-- Insert Sample Applications
INSERT INTO applications (job_id, applicant_id, cv_id, cover_letter, status) VALUES
(1, 2, 1, 'I am excited to apply for the Senior Full Stack Developer position. With my extensive experience in React and Node.js, I believe I would be a great fit for your team.', 'SUBMITTED'),
(3, 3, 2, 'I am very interested in the Frontend Developer role. My experience in building responsive applications aligns perfectly with your requirements.', 'REVIEWED');

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Application Submitted', 'Your application for Senior Full Stack Developer has been submitted successfully.', 'JOB_APPLICATION', FALSE),
(3, 'Application Reviewed', 'Your application for Frontend Developer has been reviewed by the employer.', 'APPLICATION_STATUS', FALSE),
(4, 'New Application', 'You have received a new application for Senior Full Stack Developer position.', 'JOB_APPLICATION', FALSE);

-- Insert Sample Blogs
INSERT INTO blogs (title, content, category, author, image_url, summary, created_at, updated_at) VALUES
('Top 10 Career Skills in 2025', '<h3>Essential Skills for the Modern Workplace</h3><p>In 2025, employers are looking for a unique blend of technical proficiency and soft skills. Emotional intelligence, AI literacy, and adaptability are at the top of the list.</p><h4>1. AI Literacy</h4><p>Understanding how to leverage AI tools to augment your work is no longer optional...</p>', 'Career Advice', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', 'The job market is constantly evolving. Discover the essential technical and soft skills that will set you apart from the competition this year.', NOW(), NOW()),
('How to Ace Your Remote Job Interview', '<h3>Mastering Virtual Selection</h3><p>Remote interviews require a different preparation strategy. From lighting to background and technical stability, every detail matters.</p><h4>Lighting is Key</h4><p>Position yourself so that light falls on your face, not behind you...</p>', 'Interview Tips', 'David Chen', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80', 'Remote work is here to stay, and so are remote interviews. Learn how to prepare your tech, setting, and answers for a flawless virtual interview.', NOW(), NOW()),
('The Future of Work: Hybrid Models', '<h3>The Shift in Workplace Culture</h3><p>The traditional 9-to-5 is being replaced by flexible, hybrid models. This shift promises better work-life balance but requires new communication styles.</p>', 'Industry Trends', 'Emma Wilson', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', 'Is the 9-to-5 dead? Explore how leading tech firms are implementing hybrid work models to keep teams productive and happy.', NOW(), NOW());
