import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for submissions
let submissions = [
  {
    id: 'sub_demo_101',
    name: 'Gunaraj Adhikari',
    email: 'gunaraj.adhikari@university.edu',
    phone: '+977 9841234567',
    dob: '1973-04-12',
    prize: 'RS 500 for free',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    calculatedAge: 53,
    flagReason: 'Legitimate student format entered into fake giveaway portal.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_102',
    name: 'Khemmani Adhikari',
    email: 'khemmani.adhikari@university.edu',
    phone: '+977 9852345678',
    dob: '2008-11-20',
    prize: 'Free Dining',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    calculatedAge: 17,
    flagReason: 'Legitimate-looking target data captured.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_103',
    name: 'Archan Karki',
    email: 'archan.karki@student.edu',
    phone: '+977 9863456789',
    dob: '2009-08-05',
    prize: 'Free Dining',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    calculatedAge: 17,
    flagReason: 'Legitimate-looking target data captured.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_104',
    name: 'Aakrist Baral',
    email: 'aakrist.baral@student.edu',
    phone: '+977 9804567890',
    dob: '2010-09-15',
    prize: 'Free Pizza Party',
    status: 'Underage',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    calculatedAge: 15,
    flagReason: 'Underage participant (15 years old). Minor data protection flag.',
    riskScore: 'Critical',
  },
];

// Routes

// GET all submissions
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// POST new submission
app.post('/api/submissions', (req, res) => {
  const newSubmission = req.body;
  submissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

// DELETE submission by ID
app.delete('/api/submissions/:id', (req, res) => {
  const { id } = req.params;
  submissions = submissions.filter((sub) => sub.id !== id);
  res.json({ message: 'Submission deleted', id });
});

// CLEAR all submissions
app.post('/api/submissions/clear', (req, res) => {
  submissions = [];
  res.json({ message: 'All submissions cleared' });
});

// RESET to demo data
app.post('/api/submissions/reset', (req, res) => {
  submissions = [
    {
      id: 'sub_demo_101',
      name: 'Gunaraj Adhikari',
      email: 'gunaraj.adhikari@university.edu',
      phone: '+977 9841234567',
      dob: '1973-04-12',
      prize: 'RS 500 for free',
      status: 'Verified',
      timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      calculatedAge: 53,
      flagReason: 'Legitimate student format entered into fake giveaway portal.',
      riskScore: 'Critical',
    },
    {
      id: 'sub_demo_102',
      name: 'Khemmani Adhikari',
      email: 'khemmani.adhikari@university.edu',
      phone: '+977 9852345678',
      dob: '2008-11-20',
      prize: 'Free Dining',
      status: 'Verified',
      timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
      calculatedAge: 17,
      flagReason: 'Legitimate-looking target data captured.',
      riskScore: 'Critical',
    },
    {
      id: 'sub_demo_103',
      name: 'Archan Karki',
      email: 'archan.karki@student.edu',
      phone: '+977 9863456789',
      dob: '2009-08-05',
      prize: 'Free Dining',
      status: 'Verified',
      timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      calculatedAge: 17,
      flagReason: 'Legitimate-looking target data captured.',
      riskScore: 'Critical',
    },
    {
      id: 'sub_demo_104',
      name: 'Aakrist Baral',
      email: 'aakrist.baral@student.edu',
      phone: '+977 9804567890',
      dob: '2010-09-15',
      prize: 'Free Pizza Party',
      status: 'Underage',
      timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
      calculatedAge: 15,
      flagReason: 'Underage participant (15 years old). Minor data protection flag.',
      riskScore: 'Critical',
    },
  ];
  res.json(submissions);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints ready at http://localhost:${PORT}/api`);
});
