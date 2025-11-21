
import React from 'react';
import { Music2, ArrowRight, ArrowLeft, Search, Mic2 } from 'lucide-react';
import { SongMetadata } from '../types';

interface TuningConfigProps {
  fileName: string;
  tuning: string;
  setTuning: (t: string) => void;
  metadata: SongMetadata;
  setMetadata: (m: SongMetadata) => void;
  onGenerate: () => void;
  onCancel: () => void;
}

export const TuningConfig: React.FC<TuningConfigProps> = ({ 
  fileName, 
  tuning, 
  setTuning, 
  metadata,
  setMetadata,
  onGenerate, 
  onCancel 
}) => {
  const presets = ["Standard E", "Drop D", "Eb Standard", "D Standard", "Open G", "Open D"];

  const updateMetadata = (field: keyof SongMetadata, value: string) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 backdrop-blur-sm animate-slide-up shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Music2 className="text-brand-400" />
        Song Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Left Column: File & Tuning */}
        <div className="space-y-6">
           <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Selected File</label>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <span className="text-slate-200 truncate flex-1 font-mono text-sm">{fileName}</span>
              <button onClick={onCancel} className="text-xs text-brand-400 hover:text-brand-300 px-2 font-medium transition-colors">
                Change
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Guitar Tuning</label>
            <input
              type="text"
              value={tuning}
              onChange={(e) => setTuning(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all mb-3"
              placeholder="e.g. Standard E"
            />
            <div className="flex flex-wrap gap-2">
              {presets.slice(0, 4).map(p => (
                <button
                  key={p}
                  onClick={() => setTuning(p)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-200 ${
                    tuning === p
                      ? 'bg-brand-500 text-slate-900 border-brand-500 font-semibold'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Context Metadata */}
        <div className="space-y-4 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
           <div className="flex items-center gap-2 mb-1">
             <Search size={14} className="text-brand-400" />
             <h4 className="text-xs font-bold text-brand-100 uppercase tracking-wide">Aid AI Research (Optional)</h4>
           </div>
           <p className="text-xs text-slate-500 leading-relaxed">
             Providing details helps the AI search online for official charts to cross-reference with your audio for maximum accuracy.
           </p>

           <div className="space-y-3">
             <div>
                <label className="block text-xs text-slate-400 mb-1">Song Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => updateMetadata('title', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Master of Puppets"
                />
             </div>
             <div>
                <label className="block text-xs text-slate-400 mb-1">Artist / Band</label>
                <input
                  type="text"
                  value={metadata.artist}
                  onChange={(e) => updateMetadata('artist', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Metallica"
                />
             </div>
             <div>
                <label className="block text-xs text-slate-400 mb-1">Est. BPM</label>
                <input
                  type="text"
                  value={metadata.bpm}
                  onChange={(e) => updateMetadata('bpm', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                  placeholder="e.g. 212"
                />
             </div>
           </div>
        </div>

      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={onCancel}
          className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onGenerate}
          className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Mic2 size={18} className="animate-pulse" />
          <span>Listen, Research & Transcribe</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
