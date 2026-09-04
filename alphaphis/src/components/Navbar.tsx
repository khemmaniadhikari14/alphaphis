import React from 'react';
import { Sparkles, LayoutDashboard, LogOut, UserCheck } from 'lucide-react';
import { AppRoute } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { isAuthenticated, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/assets/ing-skill-academy.png"
            alt="ING Skill Academy"
            className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-neutral-900 tracking-tight">
                Spin and Win
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              One spin. One surprise. Your moment.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-wheel-btn"
            onClick={() => onNavigate('/')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentRoute === '/'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spin Wheel</span>
          </button>

          {isAuthenticated && (
            <>
              <button
                id="nav-dashboard-btn"
                onClick={() => onNavigate('/dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRoute === '/dashboard'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <div className="h-5 w-px bg-neutral-200 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{username}</span>
              </div>

              <button
                id="nav-logout-btn"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1.5"
                title="Log out of Security Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
