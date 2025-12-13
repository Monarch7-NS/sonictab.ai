import React, { useEffect, useState } from 'react';
import { SavedTab } from '../types';
import { getUserTabs, deleteTab } from '../services/backend';
import { Calendar, Trash2, FileText, Music, Play } from 'lucide-react';

interface LibraryProps {
  onLoadTab: (tab: SavedTab) => void;
  onNewTab: () => void;
}

export const Library: React.FC<LibraryProps> = ({ onLoadTab, onNewTab }) => {
  const [tabs, setTabs] = useState<SavedTab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      const data = await getUserTabs();
      setTabs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this tab?')) {
      await deleteTab(id);
      loadTabs();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-sense-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Library</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your saved AI transcriptions</p>
        </div>
        <button 
          onClick={onNewTab}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Music className="w-4 h-4" />
          Create New
        </button>
      </div>

      {tabs.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No tabs saved yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">Upload an audio file to generate your first transcription.</p>
          <button 
            onClick={onNewTab}
            className="text-sense-accent hover:text-white font-medium transition-colors"
          >
            Start Transcribing &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => onLoadTab(tab)}
              className="group bg-[#0f111a]/60 border border-white/5 hover:border-sense-accent/50 hover:bg-[#0f111a] p-5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-sense-accent/10"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-full bg-sense-accent flex items-center justify-center shadow-lg transform translate-x-2 group-hover:translate-x-0 transition-transform">
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                 </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-sense-accent transition-colors">{tab.title}</h3>
                  <p className="text-slate-400 text-sm">{tab.artist}</p>
                </div>
                
                <div className="flex-1 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span>Tuning</span>
                    <span className="text-slate-300 font-mono">{tab.tuning}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <span>BPM</span>
                    <span className="text-slate-300 font-mono">{tab.bpm}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                   <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(tab.createdAt).toLocaleDateString()}</span>
                   </div>
                   <button 
                     onClick={(e) => handleDelete(e, tab.id)}
                     className="p-2 -mr-2 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};