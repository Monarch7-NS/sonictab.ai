
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, ArrowLeft, Search, Key, ArrowRight, Wand2 } from 'lucide-react';

interface SongConfigurationProps {
  file: File;
  onBack: () => void;
  onStart: (metadata: { title: string; artist: string; tuning: string; bpm: string }) => void;
}

const SUGGESTED_TUNINGS = [
  "Standard E", 
  "Drop D", 
  "Eb Standard", 
  "Drop C#",
  "Drop C",
  "Drop B", 
  "Open G",
  "DADGAD"
];

export const SongConfiguration: React.FC<SongConfigurationProps> = ({ file, onBack, onStart }) => {
  const [tuning, setTuning] = useState("Standard E");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [bpm, setBpm] = useState("");
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
  }, [audioUrl]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Configuration Card */}
      <div className="glass-panel rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
        
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sense-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-sense-accent/20 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-sense-accent" />
          </div>
          Metadata & Tuning
        </h2>

        {/* Selected File */}
        <div className="mb-8 relative z-10">
          <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block ml-1">Source Audio</label>
          <div className="bg-[#0f111a]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-sense-accent/30 transition-colors">
             <div className="flex items-center gap-4 overflow-hidden">
               <div className="w-10 h-10 rounded-full bg-sense-accent/10 flex items-center justify-center">
                 <Volume2 className="w-5 h-5 text-sense-accent" />
               </div>
               <span className="text-slate-200 font-medium text-sm truncate">{file.name}</span>
             </div>
             <button onClick={onBack} className="text-xs text-slate-400 hover:text-white font-medium transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
               Change
             </button>
          </div>
        </div>

        {/* Tuning Selection */}
        <div className="mb-8 relative z-10">
          <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block ml-1">Guitar Tuning</label>
          
          {/* Text Input for Manual Entry */}
          <input 
            type="text" 
            value={tuning}
            onChange={(e) => setTuning(e.target.value)}
            placeholder="Select a preset or type your own (e.g. Drop A)"
            className="w-full bg-[#0f111a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all mb-3"
          />

          {/* Quick Select Chips */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TUNINGS.map((t) => (
              <button
                key={t}
                onClick={() => setTuning(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  tuning === t 
                    ? 'bg-sense-accent text-white border-sense-accent shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                    : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* AI Research Section */}
        <div className="border-t border-white/5 pt-6 mb-8 relative z-10">
           <div className="flex items-center gap-2 text-sense-glow mb-2">
             <Search className="w-4 h-4" />
             <span className="text-xs font-bold tracking-wide uppercase">Research Context</span>
           </div>
           <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">
             Provide song details to enable Gemini's <span className="text-white font-medium">Search & Verify</span> engine. This drastically improves accuracy by cross-referencing live performances and official tabs.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Song Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master of Puppets"
                  className="w-full bg-[#0f111a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Artist / Band</label>
                <input 
                  type="text" 
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Metallica"
                  className="w-full bg-[#0f111a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Est. BPM</label>
                <input 
                  type="text" 
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  placeholder="e.g. 212"
                  className="w-full bg-[#0f111a] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sense-accent/50 focus:ring-1 focus:ring-sense-accent/50 transition-all"
                />
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={onBack}
            className="w-14 h-12 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onStart({ title, artist, tuning, bpm })}
            className="flex-1 h-12 bg-gradient-to-r from-sense-accent to-indigo-600 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sense-accent/25 transition-all hover:shadow-sense-accent/40 hover:-translate-y-0.5"
          >
            <Key className="w-4 h-4" />
            <span>Generate Tablature</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div className="glass-panel rounded-xl p-4 flex items-center gap-4 shadow-2xl">
        <button 
           onClick={handlePlayPause}
           className="w-10 h-10 rounded-full bg-sense-accent/20 flex items-center justify-center text-sense-accent hover:bg-sense-accent hover:text-white transition-all shrink-0"
        >
           {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
           <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium truncate pr-4">Previewing: {file.name}</span>
              <span className="font-mono text-slate-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
           </div>
           {/* Progress Bar */}
           <div 
             className="h-1.5 bg-[#05050a] rounded-full overflow-hidden w-full cursor-pointer relative group"
             onClick={(e) => {
                if(audioRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const p = x / rect.width;
                    audioRef.current.currentTime = p * duration;
                }
             }}
           >
             <div 
               className="h-full bg-slate-600 rounded-full group-hover:bg-sense-accent transition-colors"
               style={{width: `${(currentTime / duration) * 100}%`}}
             />
           </div>
        </div>
        
        <Volume2 className="w-5 h-5 text-slate-600 shrink-0" />

        <audio 
           ref={audioRef} 
           src={audioUrl} 
           onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
           onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
           onEnded={() => setIsPlaying(false)}
        />
      </div>

    </div>
  );
};
