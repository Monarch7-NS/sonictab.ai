import React from 'react';
import { Sparkles, Zap, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigateLibrary: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateLibrary, onNavigateHome }) => {
  return (
    <header className="w-full border-b border-white/5 bg-[#05050a]/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={onNavigateHome}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-sense-accent/40 blur-lg rounded-lg group-hover:bg-sense-accent/60 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-sense-accent to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            Tab<span className="text-sense-accent">Sense</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
           {user ? (
             <>
               <nav className="hidden md:flex items-center space-x-1">
                 <button 
                   onClick={onNavigateLibrary}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                 >
                   <BookOpen className="w-4 h-4" />
                   My Library
                 </button>
               </nav>

               <div className="h-6 w-px bg-white/10 hidden md:block"></div>

               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                       <span className="text-sm font-medium text-white">{user.username}</span>
                       <span className="text-[10px] text-sense-accent uppercase tracking-wider font-bold">
                         {user.isAdmin ? 'Admin' : 'Pro Plan'}
                       </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shadow-inner">
                       <UserIcon className="w-4 h-4 text-slate-300" />
                    </div>
                 </div>
                 
                 <button 
                   onClick={onLogout}
                   className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                   title="Logout"
                 >
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
             </>
           ) : (
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-help">
                  <Zap className="w-3.5 h-3.5 text-sense-glow fill-current" />
                  <span className="text-xs font-medium text-sense-glow tracking-wide">Gemini Flash 2.5</span>
              </div>
           )}
        </div>
      </div>
    </header>
  );
};