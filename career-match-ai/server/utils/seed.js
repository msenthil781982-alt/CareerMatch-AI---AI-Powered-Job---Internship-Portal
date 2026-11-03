require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected for seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@careermatch.ai',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91-9999000001',
      location: 'Bangalore'
    });

    // Create Recruiters
    const recruiterData = [
      { name: 'Ravi Kumar', email: 'ravi@techcorp.com', password: 'Recruiter@123', phone: '+91-9876543210', location: 'Bangalore', company: 'TechCorp Solutions', industry: 'Information Technology', size: '201-500', desc: 'Leading IT solutions provider with 15+ years of excellence.' },
      { name: 'Priya Sharma', email: 'priya@innovate.in', password: 'Recruiter@123', phone: '+91-9876543211', location: 'Hyderabad', company: 'Innovate India', industry: 'Product Development', size: '51-200', desc: 'Product company building next-gen SaaS tools.' },
      { name: 'Arjun Mehta', email: 'arjun@datawise.co', password: 'Recruiter@123', phone: '+91-9876543212', location: 'Mumbai', company: 'DataWise Analytics', industry: 'Data & Analytics', size: '11-50', desc: 'Data-driven company transforming businesses with AI.' }
    ];

    const recruiters = [];
    const recruiterProfiles = [];

    for (const rd of recruiterData) {
      const user = await User.create({
        name: rd.name, email: rd.email, password: rd.password,
        role: 'recruiter', phone: rd.phone, location: rd.location
      });
      recruiters.push(user);
      const rp = await RecruiterProfile.create({
        userId: user._id,
        companyName: rd.company,
        companyDescription: rd.desc,
        industry: rd.industry,
        companySize: rd.size,
        website: `https://www.${rd.company.toLowerCase().replace(/\s+/g, '')}.com`,
        headquarters: rd.location
      });
      recruiterProfiles.push(rp);
    }

    console.log('✅ Created 3 recruiters');

    // Create Students
    const studentData = [
      { name: 'Ananya Singh', email: 'ananya@student.com', password: 'Student@123', phone: '+91-8765432100', location: 'Delhi', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'MongoDB'], college: 'Delhi Technological University', degree: 'B.Tech CSE', year: '2025' },
      { name: 'Karthik Reddy', email: 'karthik@student.com', password: 'Student@123', phone: '+91-8765432101', location: 'Hyderabad', skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'SQL', 'Pandas'], college: 'IIIT Hyderabad', degree: 'B.Tech IT', year: '2025' },
      { name: 'Meera Nair', email: 'meera@student.com', password: 'Student@123', phone: '+91-8765432102', location: 'Kochi', skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Docker'], college: 'NIT Calicut', degree: 'B.Tech CSE', year: '2024' },
      { name: 'Rahul Gupta', email: 'rahul@student.com', password: 'Student@123', phone: '+91-8765432103', location: 'Pune', skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST APIs'], college: 'Pune University', degree: 'B.E. CSE', year: '2025' },
      { name: 'Divya Patel', email: 'divya@student.com', password: 'Student@123', phone: '+91-8765432104', location: 'Ahmedabad', skills: ['Data Analysis', 'Python', 'SQL', 'Tableau', 'Excel', 'Power BI'], college: 'IIT Gandhinagar', degree: 'B.Tech CE', year: '2024' }
    ];

    const students = [];

    for (const sd of studentData) {
      const user = await User.create({
        name: sd.name, email: sd.email, password: sd.password,
        role: 'student', phone: sd.phone, location: sd.location
      });
      students.push(user);
      await StudentProfile.create({
        userId: user._id,
        college: sd.college,
        degree: sd.degree,
        graduationYear: sd.year,
        skills: sd.skills,
        headline: `${sd.degree} Student at ${sd.college}`,
        bio: `Passionate developer looking for exciting opportunities.`,
        profileComplete: true,
        resume: {
          filename: `sample-resume-${user._id}.pdf`,
          originalName: `${sd.name.replace(' ', '_')}_Resume.pdf`,
          path: `uploads/resumes/sample-resume.pdf`,
          uploadDate: new Date(),
          size: 150000
        }
      });
    }

    console.log('✅ Created 5 students');

    // Create Jobs
    const jobsData = [
      {
        title: 'MERN Stack Developer',
        type: 'full-time',
        description: 'We are looking for a skilled MERN Stack Developer to join our growing team. You will build scalable web applications using MongoDB, Express.js, React, and Node.js.',
        responsibilities: ['Develop RESTful APIs with Node.js and Express', 'Build responsive UIs with React', 'Design and manage MongoDB databases', 'Collaborate with the design team', 'Write clean, maintainable code'],
        requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
        preferredSkills: ['Redux', 'TypeScript', 'Docker'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: '1-3 years',
        salaryMin: 600000, salaryMax: 1200000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        recruiterIndex: 0
      },
      {
        title: 'Frontend Developer Intern',
        type: 'internship',
        description: 'Exciting internship opportunity for students passionate about frontend development. Work with our product team to build amazing user interfaces.',
        responsibilities: ['Build UI components with React', 'Implement responsive designs', 'Write unit tests', 'Participate in code reviews'],
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        preferredSkills: ['Tailwind CSS', 'TypeScript'],
        location: 'Remote',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 15000, salaryMax: 25000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        recruiterIndex: 1
      },
      {
        title: 'Python Backend Developer',
        type: 'full-time',
        description: 'Join our backend team to build scalable Python services using Django and FastAPI. You will design APIs, optimize database queries, and ensure high availability.',
        responsibilities: ['Build Django/FastAPI REST APIs', 'Design PostgreSQL schemas', 'Write automated tests', 'Deploy using Docker and CI/CD'],
        requiredSkills: ['Python', 'Django', 'REST APIs', 'SQL', 'Docker'],
        preferredSkills: ['FastAPI', 'Redis', 'Celery'],
        location: 'Hyderabad',
        workMode: 'on-site',
        experience: '1-2 years',
        salaryMin: 700000, salaryMax: 1400000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        recruiterIndex: 2
      },
      {
        title: 'Data Analyst Intern',
        type: 'internship',
        description: 'Work with our data team to analyze business data and generate actionable insights. Ideal for students with strong analytical skills.',
        responsibilities: ['Analyze large datasets with Python', 'Create dashboards in Tableau/Power BI', 'Generate weekly reports', 'Support data-driven decision making'],
        requiredSkills: ['Python', 'SQL', 'Data Analysis', 'Excel'],
        preferredSkills: ['Tableau', 'Power BI', 'Pandas'],
        location: 'Mumbai',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 18000, salaryMax: 30000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        recruiterIndex: 2
      },
      {
        title: 'AI/ML Engineer Intern',
        type: 'internship',
        description: 'Work on cutting-edge machine learning projects. Help build intelligent recommendation systems and predictive models.',
        responsibilities: ['Train and evaluate ML models', 'Prepare and clean datasets', 'Implement NLP pipelines', 'Publish model metrics'],
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy'],
        preferredSkills: ['PyTorch', 'Scikit-learn', 'Hugging Face'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 20000, salaryMax: 35000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        recruiterIndex: 1
      },
      {
        title: 'Java Backend Developer',
        type: 'full-time',
        description: 'We are looking for a Java developer to work on enterprise-grade microservices using Spring Boot. You will design robust backend systems.',
        responsibilities: ['Develop Spring Boot microservices', 'Design and optimize MySQL databases', 'Implement REST APIs', 'Write JUnit tests'],
        requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Maven'],
        preferredSkills: ['Kubernetes', 'Kafka', 'Redis'],
        location: 'Pune',
        workMode: 'hybrid',
        experience: '2-4 years',
        salaryMin: 900000, salaryMax: 1800000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        recruiterIndex: 0
      },
      {
        title: 'Cloud Engineer',
        type: 'full-time',
        description: 'Looking for a Cloud Engineer to manage AWS infrastructure, implement CI/CD pipelines, and ensure high availability of our services.',
        responsibilities: ['Manage AWS EC2, S3, Lambda', 'Implement Terraform IaC', 'Build CI/CD with GitHub Actions', 'Monitor with CloudWatch'],
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
        preferredSkills: ['Python', 'Ansible', 'Prometheus'],
        location: 'Remote',
        workMode: 'remote',
        experience: '2-4 years',
        salaryMin: 1000000, salaryMax: 2000000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        recruiterIndex: 2
      },
      {
        title: 'Cybersecurity Intern',
        type: 'internship',
        description: 'Join our security team to identify vulnerabilities and strengthen our infrastructure. Hands-on experience with penetration testing and security audits.',
        responsibilities: ['Perform security audits', 'Test for OWASP vulnerabilities', 'Review firewall rules', 'Document security findings'],
        requiredSkills: ['Network Security', 'Linux', 'Python', 'OWASP'],
        preferredSkills: ['Metasploit', 'Burp Suite', 'Wireshark'],
        location: 'Bangalore',
        workMode: 'on-site',
        experience: 'Fresher',
        salaryMin: 15000, salaryMax: 22000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        recruiterIndex: 0
      },
      {
        title: 'React Native Developer',
        type: 'full-time',
        description: 'Build cross-platform mobile applications using React Native. You will work with iOS and Android teams to deliver high-quality mobile experiences.',
        responsibilities: ['Develop React Native apps', 'Integrate REST APIs', 'Optimize app performance', 'Publish to App Store and Play Store'],
        requiredSkills: ['React Native', 'JavaScript', 'REST APIs', 'Git'],
        preferredSkills: ['TypeScript', 'Redux', 'Firebase'],
        location: 'Hyderabad',
        workMode: 'hybrid',
        experience: '1-3 years',
        salaryMin: 700000, salaryMax: 1500000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        recruiterIndex: 1
      },
      {
        title: 'DevOps Engineer',
        type: 'full-time',
        description: 'We need a DevOps Engineer to streamline our development pipelines and maintain our cloud infrastructure on AWS.',
        responsibilities: ['Manage Docker and Kubernetes clusters', 'Build CI/CD pipelines', 'Monitor application performance', 'Implement logging with ELK stack'],
        requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'Linux', 'AWS'],
        preferredSkills: ['Terraform', 'Ansible', 'Python'],
        location: 'Chennai',
        workMode: 'on-site',
        experience: '2-5 years',
        salaryMin: 1200000, salaryMax: 2200000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        recruiterIndex: 0
      },
      {
        title: 'Full Stack Developer Intern',
        type: 'internship',
        description: 'An exciting opportunity to work on a full stack product from day one. You will get exposure to React, Node.js, and MongoDB in a fast-paced startup environment.',
        responsibilities: ['Build features end-to-end', 'Design database schemas', 'Write API endpoints', 'Fix bugs and improve code quality'],
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
        preferredSkills: ['TypeScript', 'Redux', 'AWS'],
        location: 'Hyderabad',
        workMode: 'remote',
        experience: 'Fresher',
        salaryMin: 12000, salaryMax: 20000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        recruiterIndex: 1
      },
      {
        title: 'Data Science Intern',
        type: 'internship',
        description: 'Work with our data science team to build ML models and generate insights from large datasets.',
        responsibilities: ['Collect and clean datasets', 'Train classification models', 'Evaluate model performance', 'Visualize results'],
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'NumPy', 'Matplotlib'],
        preferredSkills: ['Scikit-learn', 'Pandas', 'TensorFlow'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 18000, salaryMax: 28000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        recruiterIndex: 2
      },
      {
        title: 'UI/UX Design Intern',
        type: 'internship',
        description: 'Design beautiful and intuitive user interfaces. You will work closely with product managers and developers.',
        responsibilities: ['Create wireframes and prototypes', 'Design UI components in Figma', 'Conduct user research', 'Implement responsive designs'],
        requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        preferredSkills: ['Adobe XD', 'Illustrator', 'HTML', 'CSS'],
        location: 'Mumbai',
        workMode: 'hybrid',
        experience: 'Fresher',
        salaryMin: 12000, salaryMax: 18000, salaryType: 'stipend',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        recruiterIndex: 1
      },
      {
        title: 'Node.js Backend Developer',
        type: 'full-time',
        description: 'Build performant and scalable backend services using Node.js. Work with real-time WebSocket integrations and microservices.',
        responsibilities: ['Design RESTful and GraphQL APIs', 'Build WebSocket services', 'Implement caching with Redis', 'Write integration tests'],
        requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JavaScript'],
        preferredSkills: ['GraphQL', 'Redis', 'WebSockets', 'Docker'],
        location: 'Bangalore',
        workMode: 'hybrid',
        experience: '1-3 years',
        salaryMin: 800000, salaryMax: 1600000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        recruiterIndex: 0
      },
      {
        title: 'Machine Learning Engineer',
        type: 'full-time',
        description: 'Join our AI team to build production-grade machine learning models for recommendation systems, NLP, and computer vision.',
        responsibilities: ['Build and train ML models', 'Deploy models using FastAPI', 'Monitor model performance', 'Improve model accuracy over time'],
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Scikit-learn', 'SQL'],
        preferredSkills: ['PyTorch', 'MLflow', 'Kubernetes', 'Spark'],
        location: 'Hyderabad',
        workMode: 'hybrid',
        experience: '1-4 years',
        salaryMin: 1000000, salaryMax: 2000000, salaryType: 'yearly',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        recruiterIndex: 2
      }
    ];

    const createdJobs = [];

    for (const jd of jobsData) {
      const recruiter = recruiters[jd.recruiterIndex];
      const rp = recruiterProfiles[jd.recruiterIndex];
      const job = await Job.create({
        ...jd,
        recruiterId: recruiter._id,
        recruiterProfile: rp._id,
        companyName: rp.companyName
      });
      createdJobs.push(job);
    }

    console.log(`✅ Created ${createdJobs.length} jobs/internships`);

    // Create Applications
    const appData = [
      { studentIdx: 3, jobIdx: 0, status: 'shortlisted', score: 92 },   // Rahul → MERN
      { studentIdx: 0, jobIdx: 1, status: 'applied', score: 88 },        // Ananya → Frontend Intern
      { studentIdx: 1, jobIdx: 4, status: 'interview', score: 85 },      // Karthik → AI/ML Intern
      { studentIdx: 4, jobIdx: 3, status: 'selected', score: 90 },       // Divya → Data Analyst
      { studentIdx: 2, jobIdx: 5, status: 'under-review', score: 78 },   // Meera → Java
      { studentIdx: 3, jobIdx: 10, status: 'applied', score: 95 },       // Rahul → Full Stack Intern
      { studentIdx: 1, jobIdx: 11, status: 'shortlisted', score: 80 },   // Karthik → Data Science
      { studentIdx: 0, jobIdx: 0, status: 'under-review', score: 75 },   // Ananya → MERN
    ];

    for (const ad of appData) {
      const student = students[ad.studentIdx];
      const job = createdJobs[ad.jobIdx];
      const profile = await StudentProfile.findOne({ userId: student._id });

      const studentSkillsLower = profile.skills.map(s => s.toLowerCase());
      const matchedSkills = job.requiredSkills.filter(s => studentSkillsLower.includes(s.toLowerCase()));
      const missingSkills = job.requiredSkills.filter(s => !studentSkillsLower.includes(s.toLowerCase()));

      await Application.create({
        studentId: student._id,
        jobId: job._id,
        resume: { filename: profile.resume.filename, path: profile.resume.path },
        coverLetter: 'I am excited to apply for this position and believe my skills align well with the requirements.',
        matchScore: ad.score,
        matchedSkills,
        missingSkills,
        status: ad.status,
        statusHistory: [
          { status: 'applied', updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          ...(ad.status !== 'applied' ? [{ status: ad.status, updatedAt: new Date() }] : [])
        ]
      });

      await Job.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });
    }

    console.log('✅ Created demo applications');
    console.log('\n🎉 Seed complete! Demo accounts:');
    console.log('Admin:     admin@careermatch.ai    / Admin@123');
    console.log('Student:   ananya@student.com      / Student@123');
    console.log('Student:   karthik@student.com     / Student@123');
    console.log('Student:   meera@student.com       / Student@123');
    console.log('Student:   rahul@student.com       / Student@123');
    console.log('Student:   divya@student.com       / Student@123');
    console.log('Recruiter: ravi@techcorp.com       / Recruiter@123');
    console.log('Recruiter: priya@innovate.in       / Recruiter@123');
    console.log('Recruiter: arjun@datawise.co       / Recruiter@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
