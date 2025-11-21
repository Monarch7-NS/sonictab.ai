import React from 'react';
import { Guitar, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-lg text-slate-900">
            <Guitar size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SonicTab AI
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-medium text-brand-400 bg-brand-400/10 px-3 py-1 rounded-full border border-brand-400/20">
          <Zap size={12} />
          <span>Gemini Flash 2.5</span>
        </div>
      </div>
    </header>
  );
};