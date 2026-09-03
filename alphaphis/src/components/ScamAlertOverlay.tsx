import React, { useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Lock,
  Globe,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { UserSubmission } from '../types';
import { sounds } from '../utils/audio';

interface ScamAlertOverlayProps {
  isOpen: boolean;
  submission: UserSubmission | null;
  onClose: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToLogin: () => void;
}

export const ScamAlertOverlay: React.FC<ScamAlertOverlayProps> = ({
  isOpen,
  submission,
  onClose,
  onNavigateToDashboard,
  onNavigateToLogin,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playAlert();
    }
  }, [isOpen]);

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4">
  <div className="w-full max-w-md rounded-3xl border-4 border-emerald-500 bg-white p-8 text-center shadow-2xl">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
      <CheckCircle2 className="h-9 w-9" />
    </div>
    <h2 className="text-2xl font-black text-neutral-900">Success!</h2>
    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
      Your request has been submitted successfully. You will receive an email soon with further details.
    </p>
    <button
      type="button"
      onClick={onClose}
      className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
    >
      Back to Home
    </button>
  </div>
</div>
  );
};
