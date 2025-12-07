import React, { useRef, useState } from 'react';
import { Music, Upload, Mic } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (file: File, base64: string) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file (MP3, WAV, AAC)');
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      onAudioReady(file, base64Data);
    };
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto aspect-[2.5/1] rounded-3xl transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden
        ${isDragOver 
          ? 'border-2 border-sense-accent bg-sense-accent/5 scale-[1.02] shadow-[0_0_40px_rgba(139,92,246,0.2)]' 
          : 'border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-sense-accent/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]'}
      `}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-sense-accent/10 rounded-full blur-[50px]"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]"></div>
      </div>

      <div className="flex flex-col items-center space-y-6 z-10 pointer-events-none">
        <div className="relative">
            <div className={`absolute inset-0 bg-sense-accent rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${isDragOver ? 'opacity-60' : ''}`}></div>
            <div className="relative w-16 h-16 rounded-full bg-[#1e2030] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                {isDragOver ? (
                    <Upload className="w-7 h-7 text-sense-accent animate-bounce" />
                ) : (
                    <Music className="w-7 h-7 text-slate-400 group-hover:text-sense-accent transition-colors" />
                )}
            </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {isDragOver ? 'Drop Audio File Here' : 'Upload Your Track'}
          </h3>
          <p className="text-sm text-slate-400 font-light tracking-wide">
            Supports <span className="text-sense-glow font-medium">MP3, WAV, AAC</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-white/5 px-3 py-1 rounded-full bg-black/20">
           <Mic className="w-3 h-3" />
           <span>AI Listening Engine Active</span>
        </div>
      </div>
    </div>
  );
};