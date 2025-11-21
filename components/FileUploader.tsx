import React, { useCallback, useState } from 'react';
import { Upload, Music, FileAudio, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../utils/fileUtils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelect = (file: File) => {
    setError(null);
    if (!file.type.startsWith('audio/')) {
      setError("Please upload a valid audio file (MP3, WAV, etc.)");
      return;
    }
    // Cap file size roughly at 20MB for browser performance safety
    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large. Please keep it under 20MB.");
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelect(files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-brand-400 bg-brand-400/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-800/50 hover:border-brand-500/50 hover:bg-slate-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        
        <div className="p-10 flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-brand-500/20 text-brand-300' : 'bg-slate-700/50 text-slate-400 group-hover:text-brand-400 group-hover:bg-slate-700'}`}>
            <Music size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-brand-200 transition-colors">
              Upload Audio File
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Drag and drop your guitar track here, or click to browse (MP3, WAV, AAC)
            </p>
          </div>

          {error && (
            <div className="flex items-center text-red-400 text-sm mt-4 bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/50">
              <AlertCircle size={14} className="mr-2" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};