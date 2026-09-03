import React, { useState } from 'react';
import { SpinWheel } from '../components/SpinWheel';
import { RedeemModal } from '../components/RedeemModal';
import { ScamAlertOverlay } from '../components/ScamAlertOverlay';
import { RecentWinners } from '../components/RecentWinners';
import { Prize, UserSubmission, AppRoute } from '../types';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<UserSubmission | null>(null);

  const handlePrizeWon = (prize: Prize) => {
    setWonPrize(prize);
  };

  const handleOpenRedeem = () => {
    setIsRedeemOpen(true);
  };

  const handleSubmissionComplete = (submission: UserSubmission) => {
    setLastSubmission(submission);
    setIsAlertOpen(true);
  };

  return (
    <div id="home-page" className="min-h-screen pb-16">
      {/* Simulation Header Banner */}
      

      {/* Main Hero & Spin Wheel Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
         

          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Spin the Wheel & <span className="text-blue-600">Claim Your Student Prize!</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
            All registered undergraduate and graduate students get 1 free lucky spin. Win RS 500 for free, Free Dining, Wireless Headphones, Free coffee Party, Rs 100 recharge, or Free airbuds!
          </p>
        </div>

        {/* Spin Wheel Component */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 mb-10 flex flex-col items-center">
          <SpinWheel
            onPrizeWon={handlePrizeWon}
            onOpenRedeem={handleOpenRedeem}
            wonPrize={wonPrize}
          />
        </div>

        {/* Static List of Recent Winners */}
        <RecentWinners />

        {/* Educational Explainer Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Why does this demonstration exist?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                College campuses are prime targets for phishing schemes. Malicious actors disguise fake giveaways as university-sanctioned events to harvest campus portal credentials, date of birth, and phone numbers. This interactive demo demonstrates how quickly sensitive data is compromised when urgency and high-value prizes overpower critical thinking.
              </p>
            </div>
          </div>
        </div>

        {/* Clean educational footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neutral-400" />
            <span>PhishAware Demonstration Portal • Campus Cyber Defense Educational Project</span>
          </div>
          <div className="text-neutral-400 text-[11px]">
            <span>Security Officer console accessible via /login</span>
          </div>
        </footer>
      </main>

      {/* Redeem Modal (Phishing Form) */}
      <RedeemModal
        isOpen={isRedeemOpen}
        prize={wonPrize}
        onClose={() => setIsRedeemOpen(false)}
        onSubmitted={handleSubmissionComplete}
      />

      {/* Full-Screen Scam Alert Overlay */}
      <ScamAlertOverlay
        isOpen={isAlertOpen}
        submission={lastSubmission}
        onClose={() => setIsAlertOpen(false)}
        onNavigateToDashboard={() => {
          setIsAlertOpen(false);
          onNavigate('/dashboard');
        }}
        onNavigateToLogin={() => {
          setIsAlertOpen(false);
          onNavigate('/login');
        }}
      />
    </div>
  );
};
