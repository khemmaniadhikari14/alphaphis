import { SubmissionStatus, UserSubmission } from '../types';
import { calculateAge } from './validation';
import {
  getSubmissionsFromAPI,
  addSubmissionToAPI,
  deleteSubmissionFromAPI,
  clearAllSubmissionsFromAPI,
  resetToDemoDataOnAPI,
  checkAPIHealth,
} from './api';

const STORAGE_KEY = 'phishing_demo_submissions';
const LEGACY_PRIZE_NAMES: Record<string, string> = {
  'iPhone 16 Pro': 'RS 500 for free',
  'Starbucks $50 Card': 'Free Dining',
  'Wireless Headphones': 'Free Dining',
};

// Fallback localStorage for when backend is unavailable
const INITIAL_DEMO_DATA: UserSubmission[] = [
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

let useBackend = true;

/**
 * Get submissions from backend API with fallback to localStorage
 */
export async function getSubmissions(): Promise<UserSubmission[]> {
  if (typeof window === 'undefined') return [];

  // Try backend first
  if (useBackend) {
    try {
      const isHealthy = await checkAPIHealth();
      if (isHealthy) {
        const submissions = await getSubmissionsFromAPI();
        return processSubmissions(submissions);
      }
    } catch (error) {
      console.warn('Backend unavailable, falling back to localStorage');
      useBackend = false;
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
      return INITIAL_DEMO_DATA;
    }
    const submissions = JSON.parse(raw) as UserSubmission[];
    return processSubmissions(submissions);
  } catch (error) {
    console.error('Failed to load submissions:', error);
    return [];
  }
}

/**
 * Add a new submission
 */
export async function addSubmission(submission: Omit<UserSubmission, 'id'>): Promise<UserSubmission | null> {
  if (useBackend) {
    try {
      const result = await addSubmissionToAPI(submission);
      return result ? processSubmissions([result])[0] : null;
    } catch (error) {
      console.warn('Backend failed, falling back to localStorage');
      useBackend = false;
    }
  }

  // Fallback to localStorage
  const newSub: UserSubmission = {
    ...submission,
    id: `sub_${Date.now()}`,
  };
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  current.push(newSub);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return newSub;
}

/**
 * Delete a submission
 */
export async function deleteSubmission(id: string): Promise<UserSubmission[]> {
  if (useBackend) {
    try {
      await deleteSubmissionFromAPI(id);
      return await getSubmissions();
    } catch (error) {
      console.warn('Backend failed, falling back to localStorage');
      useBackend = false;
    }
  }

  // Fallback to localStorage
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const filtered = current.filter((s: UserSubmission) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Clear all submissions
 */
export async function clearAllSubmissions(): Promise<void> {
  if (useBackend) {
    try {
      await clearAllSubmissionsFromAPI();
      return;
    } catch (error) {
      console.warn('Backend failed, falling back to localStorage');
      useBackend = false;
    }
  }

  // Fallback to localStorage
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Reset to demo data
 */
export async function resetToDemoData(): Promise<UserSubmission[]> {
  if (useBackend) {
    try {
      const result = await resetToDemoDataOnAPI();
      return processSubmissions(result);
    } catch (error) {
      console.warn('Backend failed, falling back to localStorage');
      useBackend = false;
    }
  }

  // Fallback to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
  return INITIAL_DEMO_DATA;
}

/**
 * Process and normalize submissions
 */
function processSubmissions(submissions: UserSubmission[]): UserSubmission[] {
  return submissions.map((submission) => {
    const calculatedAge = calculateAge(submission.dob);
    const status: SubmissionStatus = calculatedAge < 13 ? 'Underage' : 'Verified';

    return {
      ...submission,
      prize: LEGACY_PRIZE_NAMES[submission.prize] || submission.prize,
      calculatedAge,
      status,
      flagReason:
        status === 'Underage'
          ? `Student is underage (${calculatedAge} years old). Minor status flag.`
          : 'Legitimate-looking target data captured.',
      riskScore: 'Critical' as const,
    };
  });
}


