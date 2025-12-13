import React, { useState } from 'react';
import { login, register } from '../services/backend';
import { Sparkles, ArrowRight, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (isRegistering) {
        const result = await register(username, password);
        user = result.user;
      } else {
        const result = await login(username, password);
        user = result.user;
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || (isRegistering ? 'Registration failed' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sense-accent/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-sense-accent/40 blur-lg rounded-lg"></div>
            <div className="relative bg-gradient-to-br from-sense-accent to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <Sparkles className="w-7 h-7 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 mt-2">
            {isRegistering ? 'Join TabSense AI today' : 'Sign in to TabSense AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">Username</label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-sense-accent transition-colors" />
               </div>
               <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#05050a]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all placeholder:text-slate-600"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">Password</label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-sense-accent transition-colors" />
               </div>
               <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05050a]/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all placeholder:text-slate-600"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm py-2 px-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-sense-accent to-indigo-600 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sense-accent/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
           <p className="text-sm text-slate-500 mb-4">
             {isRegistering ? "Already have an account?" : "Don't have an account?"}
             <button 
               onClick={() => {
                 setIsRegistering(!isRegistering);
                 setError(null);
                 setPassword('');
               }}
               className="ml-2 text-sense-accent hover:text-white font-medium transition-colors"
             >
               {isRegistering ? "Sign In" : "Create Account"}
             </button>
           </p>

           {!isRegistering && (
             <p className="text-xs text-slate-600 mt-2">
               Default Admin Account: <span className="font-mono text-sense-accent/70">admin</span> / <span className="font-mono text-sense-accent/70">admin</span>
             </p>
           )}
        </div>
      </div>
    </div>
  );
};