
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');

const jobs = [
    {
        title: 'MERN Stack Developer',
        type: 'full-time',
        description: 'Develop full-stack web applications using MongoDB, Express, React and Node.js.',
        responsibilities: ['Build REST APIs', 'Develop React interfaces', 'Work with MongoDB'],
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        preferredSkills: ['Express.js', 'Git'],
        location: 'Chennai',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 25000,
        salaryMax: 40000,
        salaryType: 'monthly'
    },
    {
        title: 'Frontend Developer Intern',
        type: 'internship',
        description: 'Create responsive and user-friendly web interfaces.',
        responsibilities: ['Develop UI components', 'Fix frontend bugs'],
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        preferredSkills: ['Tailwind CSS'],
        location: 'Bangalore',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 10000,
        salaryMax: 15000,
        salaryType: 'stipend'
    },
    {
        title: 'Python Backend Developer',
        type: 'full-time',
        description: 'Build backend applications and APIs using Python.',
        responsibilities: ['Develop APIs', 'Write backend logic'],
        requiredSkills: ['Python', 'Django', 'REST API', 'SQL'],
        preferredSkills: ['FastAPI'],
        location: 'Chennai',
        workMode: 'on-site',
        experience: 'Fresher',
        salaryMin: 20000,
        salaryMax: 35000,
        salaryType: 'monthly'
    },
    {
        title: 'Java Backend Developer',
        type: 'full-time',
        description: 'Develop enterprise backend applications using Java and Spring Boot.',
        responsibilities: ['Build REST APIs', 'Connect databases'],
        requiredSkills: ['Java', 'Spring Boot', 'MySQL'],
        preferredSkills: ['Hibernate', 'Maven'],
        location: 'Hyderabad',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 25000,
        salaryMax: 40000,
        salaryType: 'monthly'
    },
    {
        title: 'Cloud Engineer',
        type: 'full-time',
        description: 'Support cloud infrastructure and deployment operations.',
        responsibilities: ['Manage cloud resources', 'Monitor deployments'],
        requiredSkills: ['AWS', 'Linux', 'Networking'],
        preferredSkills: ['Docker', 'Terraform'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: '0-1 years',
        salaryMin: 30000,
        salaryMax: 45000,
        salaryType: 'monthly'
    },
    {
        title: 'Cybersecurity Intern',
        type: 'internship',
        description: 'Assist with security monitoring and vulnerability assessment.',
        responsibilities: ['Review security alerts', 'Document findings'],
        requiredSkills: ['Networking', 'Linux', 'Cybersecurity basics'],
        preferredSkills: ['Python', 'AWS'],
        location: 'Chennai',
        workMode: 'on-site',
        experience: 'Fresher',
        salaryMin: 8000,
        salaryMax: 12000,
        salaryType: 'stipend'
    },
    {
        title: 'React Native Developer',
        type: 'full-time',
        description: 'Build cross-platform mobile applications.',
        responsibilities: ['Develop mobile screens', 'Integrate APIs'],
        requiredSkills: ['JavaScript', 'React Native', 'REST API'],
        preferredSkills: ['Firebase'],
        location: 'Coimbatore',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 20000,
        salaryMax: 35000,
        salaryType: 'monthly'
    },
    {
        title: 'DevOps Engineer',
        type: 'full-time',
        description: 'Support CI/CD pipelines and cloud deployments.',
        responsibilities: ['Maintain deployment pipelines', 'Monitor applications'],
        requiredSkills: ['Linux', 'Git', 'Docker', 'AWS'],
        preferredSkills: ['Jenkins', 'Kubernetes'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: '0-1 years',
        salaryMin: 30000,
        salaryMax: 50000,
        salaryType: 'monthly'
    },
    {
        title: 'Full Stack Developer Intern',
        type: 'internship',
        description: 'Work on frontend and backend web development.',
        responsibilities: ['Build web pages', 'Develop APIs'],
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        preferredSkills: ['React', 'MongoDB'],
        location: 'Madurai',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 10000,
        salaryMax: 15000,
        salaryType: 'stipend'
    },
    {
        title: 'Data Science Intern',
        type: 'internship',
        description: 'Assist with data analysis and machine learning projects.',
        responsibilities: ['Clean datasets', 'Build analysis reports'],
        requiredSkills: ['Python', 'Pandas', 'NumPy'],
        preferredSkills: ['Scikit-learn', 'SQL'],
        location: 'Chennai',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 10000,
        salaryMax: 15000,
        salaryType: 'stipend'
    },
    {
        title: 'UI UX Design Intern',
        type: 'internship',
        description: 'Design accessible and user-friendly application interfaces.',
        responsibilities: ['Create wireframes', 'Prepare prototypes'],
        requiredSkills: ['UI Design', 'UX Design', 'Figma'],
        preferredSkills: ['HTML', 'CSS'],
        location: 'Coimbatore',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 8000,
        salaryMax: 12000,
        salaryType: 'stipend'
    },
    {
        title: 'Machine Learning Engineer',
        type: 'full-time',
        description: 'Develop and evaluate machine learning models.',
        responsibilities: ['Prepare datasets', 'Train ML models'],
        requiredSkills: ['Python', 'Machine Learning', 'Pandas'],
        preferredSkills: ['TensorFlow', 'Scikit-learn'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 25000,
        salaryMax: 40000,
        salaryType: 'monthly'
    }
];

async function addJobs() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in server/.env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        const recruiter = await User.findOne({ role: 'recruiter' });

        if (!recruiter) {
            throw new Error('No recruiter account found. Create a recruiter first.');
        }

        const profile = await RecruiterProfile.findOne({
            userId: recruiter._id
        });

        if (!profile) {
            throw new Error('Recruiter profile not found.');
        }

        let added = 0;
        let skipped = 0;

        for (const jobData of jobs) {
            const existing = await Job.findOne({
                title: jobData.title,
                recruiterId: recruiter._id
            });

            if (existing) {
                console.log('Skipped existing job:', jobData.title);
                skipped++;
                continue;
            }

            await Job.create({
                ...jobData,
                recruiterId: recruiter._id,
                recruiterProfile: profile._id,
                companyName: profile.companyName || 'CareerMatch Demo Tech',
                status: 'active',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            console.log('Added:', jobData.title);
            added++;
        }

        console.log('\nJob insertion completed!');
        console.log('Added:', added);
        console.log('Skipped:', skipped);
        console.log('Total sample jobs:', jobs.length);

    } catch (error) {
        console.error('Error:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

addJobs();
