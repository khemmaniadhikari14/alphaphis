import { UserSubmission } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all submissions from the backend
 */
export async function getSubmissionsFromAPI(): Promise<UserSubmission[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`);
    if (!response.ok) throw new Error('Failed to fetch submissions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

/**
 * Add a new submission to the backend
 */
export async function addSubmissionToAPI(submission: Omit<UserSubmission, 'id'>): Promise<UserSubmission | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (!response.ok) throw new Error('Failed to add submission');
    return await response.json();
  } catch (error) {
    console.error('Error adding submission:', error);
    return null;
  }
}

/**
 * Delete a single submission from the backend
 */
export async function deleteSubmissionFromAPI(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete submission');
    return true;
  } catch (error) {
    console.error('Error deleting submission:', error);
    return false;
  }
}

/**
 * Clear all submissions from the backend
 */
export async function clearAllSubmissionsFromAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear submissions');
    return true;
  } catch (error) {
    console.error('Error clearing submissions:', error);
    return false;
  }
}

/**
 * Reset to demo data on the backend
 */
export async function resetToDemoDataOnAPI(): Promise<UserSubmission[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reset demo data');
    return await response.json();
  } catch (error) {
    console.error('Error resetting demo data:', error);
    return [];
  }
}

/**
 * Health check - verify backend is running
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
