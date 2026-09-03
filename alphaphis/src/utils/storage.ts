import { SubmissionStatus, UserSubmission } from '../types';
import { calculateAge } from './validation';

const STORAGE_KEY = 'phishing_demo_submissions';

const LEGACY_PRIZE_NAMES: Record<string, string> = {
  'iPhone 16 Pro': 'RS 500 for free',
  'Starbucks $50 Card': 'Free Dining',
  'Wireless Headphones': 'Free Dining',
};

// Initial educational seed data representing simulated campus phishing catches
const INITIAL_DEMO_DATA: UserSubmission[] = [
  {
    id: 'sub_demo_101',
    name: 'Jordan Bell',
    email: 'jordan.bell@university.edu',
    phone: '(555) 234-8891',
    dob: '2003-04-12',
    prize: 'RS 500 for free',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    calculatedAge: 23,
    flagReason: 'Legitimate student format entered into fake giveaway portal.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_102',
    name: 'Alex Morgan',
    email: 'fake_tester99@gmail.com',
    phone: '(555) 492-1204',
    dob: '2001-11-20',
    prize: 'Free Dining',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    calculatedAge: 24,
    flagReason: 'Legitimate-looking target data captured.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_103',
    name: 'Emma Watson',
    email: 'emma.watson@student.edu',
    phone: '555-000-4821',
    dob: '2002-08-05',
    prize: 'Free Dining',
    status: 'Verified',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    calculatedAge: 24,
    flagReason: 'Legitimate-looking target data captured.',
    riskScore: 'Critical',
  },
  {
    id: 'sub_demo_104',
    name: 'Taylor Reed',
    email: 'freshman_applicant@highschool.org',
    phone: '(555) 918-3329',
    dob: '2010-09-15',
    prize: 'Free Pizza Party',
    status: 'Underage',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    calculatedAge: 15,
    flagReason: 'Underage participant (15 years old). Minor data protection flag.',
    riskScore: 'Critical',
  },
];

export function getSubmissions(): UserSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial educational sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
      return INITIAL_DEMO_DATA;
    }
    const submissions = (JSON.parse(raw) as UserSubmission[]).map((submission) => {
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return submissions;
  } catch (error) {
    console.error('Failed to parse submissions from localStorage:', error);
    return [];
  }
}

export function saveSubmission(
  entry: Omit<UserSubmission, 'id' | 'timestamp' | 'riskScore'>
): UserSubmission {
  const newSubmission: UserSubmission = {
    ...entry,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    riskScore: entry.status === 'Verified' || entry.status === 'Underage' ? 'Critical' : 'High',
  };

  try {
    const existing = getSubmissions();
    const updated = [newSubmission, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save submission to localStorage:', error);
  }

  return newSubmission;
}

export function deleteSubmission(id: string): UserSubmission[] {
  try {
    const existing = getSubmissions();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete submission from localStorage:', error);
    return [];
  }
}

export function resetToDemoData(): UserSubmission[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
    return INITIAL_DEMO_DATA;
  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return [];
  }
}

export function clearAllSubmissions(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear submissions:', error);
  }
}
