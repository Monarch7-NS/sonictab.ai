import React, { useEffect, useRef, useState } from 'react';
import { Copy, Download, Play, Pause, Volume2, ArrowLeft, FileCode, Save, Check } from 'lucide-react';
import { TabFile, SavedTab, SongMetadata } from '../types';
import { saveTab } from '../services/backend';

interface TabDisplayProps {
  tabFile: TabFile;
  metadata?: SongMetadata;
  onNewSong: () => void;
  isSavedMode?: boolean; // True if viewing from library
}

export const TabDisplay: React.FC<TabDisplayProps> = ({ tabFile, metadata, onNewSong, isSavedMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(isSavedMode);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.6;
  }, []);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([tabFile.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${tabFile.name.replace(/\s+/g, '_')}_TAB.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tabFile.content);
  };

  const handleSave = async () => {
    if (hasSaved || isSaving) return;
    setIsSaving(true);
    try {
      const metaToSave: SongMetadata = metadata || {
        title: tabFile.name,
        artist: 'Unknown',
        tuning: 'Standard E',
        bpm: 'N/A'
      };
      await saveTab(metaToSave, tabFile.content);
      setHasSaved(true);
    } catch (e) {
      console.error("Failed to save", e);
      alert("Failed to save to library");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10">
      
      {/* Player Header Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
         {/* Custom Audio Player */}
         <div className="glass-panel flex-1 rounded-2xl p-3 flex items-center gap-4 pr-6 shadow-lg">
             <button 
                onClick={() => {
                   if (!tabFile.audioUrl) return; // Handle cases where audio might not be available
                    if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play();
                    setIsPlaying(!isPlaying);
                }}
                disabled={!tabFile.audioUrl}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg shrink-0 group ${
                  !tabFile.audioUrl 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-sense-accent to-indigo-600 hover:to-indigo-500 shadow-sense-accent/20'
                }`}
             >
                {isPlaying ? <Pause className="w-5 h-5 text-white fill-current" /> : <Play className="w-5 h-5 text-white fill-current ml-0.5" />}
             </button>

             <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1.5">
                   <span className="font-bold text-white tracking-wide truncate pr-4">{tabFile.name}</span>
                   <span className="font-mono text-sense-glow">
                     {tabFile.audioUrl ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'No Audio Source'}
                   </span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-1.5 bg-[#05050a] rounded-full overflow-hidden w-full cursor-pointer" onClick={(e) => {
                   if(audioRef.current && tabFile.audioUrl) {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const x = e.clientX - rect.left;
                       const p = x / rect.width;
                       audioRef.current.currentTime = p * duration;
                   }
                }}>
                    <div 
                      className="h-full bg-sense-accent rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                      style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
                    />
                </div>
             </div>

             {tabFile.audioUrl && (
               <>
                 <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
                 <Volume2 className="w-5 h-5 text-slate-500 shrink-0 hidden sm:block" />
                 
                 <audio 
                    ref={audioRef} 
                    src={tabFile.audioUrl} 
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onEnded={() => setIsPlaying(false)}
                 />
               </>
             )}
         </div>

         {/* Action Buttons */}
         <div className="flex gap-3">
           {!hasSaved && (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="glass-panel px-6 h-[72px] rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2 shrink-0 shadow-lg border-sense-accent/30"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
           )}
           
           {hasSaved && !isSavedMode && (
             <div className="glass-panel px-6 h-[72px] rounded-2xl text-sm font-bold text-green-400 flex items-center gap-2 shrink-0 shadow-lg border-green-500/20 bg-green-500/5">
                <Check className="w-4 h-4" />
                Saved
             </div>
           )}

           <button 
              onClick={onNewSong}
              className="glass-panel px-6 h-[72px] rounded-2xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 shrink-0 shadow-lg"
           >
              <ArrowLeft className="w-4 h-4" />
              {isSavedMode ? 'Back to Library' : 'New Song'}
           </button>
         </div>
      </div>

      {/* Code Editor Window */}
      <div className="rounded-xl border border-white/10 bg-[#0b0f19] overflow-hidden shadow-2xl flex flex-col h-[70vh] relative group">
        
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-sense-accent/5 to-transparent pointer-events-none"></div>

        {/* Mac Window Header */}
        <div className="flex items-center justify-between bg-[#0f111a] border-b border-black px-4 h-12 shrink-0 relative z-10">
           <div className="flex items-center gap-2 w-24">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
           </div>

           <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide font-mono text-slate-400 bg-black/40 border border-white/5">
              <FileCode className="w-3 h-3 text-sense-accent" />
              {metadata?.artist ? `${metadata.artist}_-_${metadata.title}.tab` : 'GENERATED_TAB.txt'}
           </div>

           <div className="flex items-center gap-1 w-24 justify-end">
              <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg" title="Copy">
                 <Copy className="w-4 h-4" />
              </button>
              <button onClick={handleDownload} className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg" title="Download">
                 <Download className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto p-8 font-mono text-sm leading-relaxed custom-scrollbar bg-[#0b0f19] relative z-10">
          <div className="text-slate-300 whitespace-pre selection:bg-sense-accent/30 selection:text-white">
            {tabFile.content}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="px-4 py-1.5 bg-[#0f111a] border-t border-black text-[10px] text-slate-500 font-mono flex justify-between shrink-0 relative z-10">
           <div className="flex gap-4">
             <span>UTF-8</span>
             <span className="text-sense-accent">Guitar Tablature</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-sense-accent animate-pulse"></div>
             <span>Gemini 3 Pro Engine</span>
           </div>
        </div>
      </div>
    </div>
  );
};