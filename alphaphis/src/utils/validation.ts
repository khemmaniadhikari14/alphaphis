import { SubmissionStatus } from '../types';

/**
 * Calculates exact age based on ISO/Date string
 */
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

export function parseEuropeanDate(dateString: string): string {
  const match = dateString.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return dateString;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  status: SubmissionStatus;
  calculatedAge: number;
  flagReason: string;
}

/**
 * Validates phishing form inputs and determines classification:
 * - Age < 13 -> "Underage"
 * - Else -> "Verified"
 */
export function evaluateSubmission(formData: {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const cleanEmail = (formData.email || '').trim().toLowerCase();
  const cleanPhone = (formData.phone || '').trim();
  const cleanPassword = (formData.password || '').trim();
  const cleanConfirmPassword = (formData.confirmPassword || '').trim();
  const cleanDob = parseEuropeanDate(formData.dob || '');

  // Basic format validation
  if (!cleanEmail) {
    errors.email = 'Campus / Personal email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!cleanPassword) {
    errors.password = 'Password is required to authenticate student claim';
  } else if (cleanPassword.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  if (!cleanConfirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (cleanPassword !== cleanConfirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!cleanPhone) {
    errors.phone = 'Phone number is required for SMS prize code';
  } else if (!/^\d{10}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid Nepali phone number (10 digits)';
  }

  if (!cleanDob) {
    errors.dob = 'Date of birth is required for eligibility verification';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDob) || calculateAge(cleanDob) === 0 && cleanDob.slice(0, 4) !== new Date().getFullYear().toString()) {
    errors.dob = 'Use the European date format DD/MM/YYYY';
  }

  const calculatedAge = calculateAge(cleanDob);

  let status: SubmissionStatus = 'Verified';
  let flagReason = 'Legitimate-looking target data captured.';

  // Underage check (under 13)
  if (calculatedAge < 13) {
    status = 'Underage';
    flagReason = `Student is underage (${calculatedAge} years old). Minor status flag.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    status,
    calculatedAge,
    flagReason,
  };
}
