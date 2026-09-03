import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { RegistrationWizard } from './components/RegistrationWizard';
import { 
  Building2, 
  ShieldCheck, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Cpu, 
  FileText,
  Github
} from 'lucide-react';

const THEME_KEY = 'PRODESK_THEME_SPRINT7';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    } catch (e) {
      console.error('Theme toggle error', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Navbar Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  PRODESK<span className="text-blue-600">IT</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                  Sprint 07 • Enterprise Form Portal
                </span>
              </div>
            </Link>

            <div className="flex items-center space-x-3 text-xs">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold transition-all flex items-center space-x-1"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span className="uppercase text-[10px] hidden sm:inline">{theme}</span>
              </button>

              <a
                href="https://github.com/TimeLineOfficial/Sprint-7"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-700 font-semibold flex items-center space-x-1.5 hover:bg-slate-800"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Repository</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<RegistrationWizard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              © 2026 Prodesk IT Software Engineering Team. Sprint 07 Deliverable.
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Phase 1 (FSM)</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Phase 2 (RegEx)</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Phase 3 (Zod &amp; Debounce)</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
