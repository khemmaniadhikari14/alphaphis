import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppRoute } from './types';

const getRouteFromLocation = (): AppRoute => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');

  if (path === '/dashboard' || hash === 'dashboard') return '/dashboard';
  if (path === '/login' || hash === 'login') return '/login';
  return '/';
};

export default function App() {
  // Client-side routing state supporting paths and browser history
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);

  // Synchronize browser history and hash/popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', route);
      } catch {
        // Fallback for iframe environments
        window.location.hash = `#${route}`;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-600 selection:text-white">
        {/* Navigation Bar */}
        <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

        {/* Dynamic Page Views */}
        <div className="flex-1">
          {currentRoute === '/' && <HomePage onNavigate={handleNavigate} />}
          {currentRoute === '/login' && <LoginPage onNavigate={handleNavigate} />}
          {currentRoute === '/dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        </div>
      </div>
    </AuthProvider>
  );
}
