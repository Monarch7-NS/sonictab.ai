import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { AudioPlayer } from './components/AudioPlayer';
import { TabViewer } from './components/TabViewer';
import { TuningConfig } from './components/TuningConfig';
import { AnalysisStatus, AudioFile, TabResult, SongMetadata } from './types';
import { fileToGenerativePart } from './utils/fileUtils';
import { generateTabsFromAudio } from './services/geminiService';
import { Loader2, RefreshCcw, Music2, Zap } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [tabResult, setTabResult] = useState<TabResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Config State
  const [tuning, setTuning] = useState<string>("Standard E");
  const [metadata, setMetadata] = useState<SongMetadata>({
    title: "",
    artist: "",
    bpm: ""
  });

  const handleFileSelect = async (file: File) => {
    try {
      setStatus(AnalysisStatus.PROCESSING_FILE);
      const url = URL.createObjectURL(file);
      
      // Get Base64 Data
      const { inlineData } = await fileToGenerativePart(file);
      
      setAudioFile({
        file,
        url,
        base64: inlineData.data,
        mimeType: inlineData.mimeType
      });

      setStatus(AnalysisStatus.FILE_READY);

    } catch (error) {
      console.error("Error reading file:", error);
      setStatus(AnalysisStatus.ERROR);
      setErrorMessage("Failed to read the audio file. Please try again.");
    }
  };

  const handleStartGeneration = async () => {
    if (audioFile) {
      await processAudio(audioFile.base64, audioFile.mimeType);
    }
  };

  const processAudio = async (base64Data: string, mimeType: string) => {
    try {
      setStatus(AnalysisStatus.GENERATING_TABS);
      setErrorMessage(null);
      
      const fileName = audioFile?.file.name || "Unknown Audio File";

      const result = await generateTabsFromAudio(
        base64Data, 
        mimeType, 
        tuning, 
        metadata,
        fileName
      );
      
      setTabResult(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error: any) {
      console.error("Tab generation failed:", error);
      setStatus(AnalysisStatus.ERROR);
      setErrorMessage(error.message || "Failed to generate tabs from this audio.");
    }
  };

  const resetApp = () => {
    if (audioFile?.url) {
      URL.revokeObjectURL(audioFile.url);
    }
    setStatus(AnalysisStatus.IDLE);
    setAudioFile(null);
    setTabResult(null);
    setErrorMessage(null);
    setTuning("Standard E");
    setMetadata({ title: "", artist: "", bpm: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* HERO SECTION */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-12 mt-8 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              <span className="text-white">Turn Audio into </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-600">
                Tabs
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload your guitar riff, solo, or song. Gemini Flash AI will listen, research, and transcribe it instantly.
            </p>
          </div>
        )}

        {/* UPLOADER SECTION */}
        {status === AnalysisStatus.IDLE && (
          <div className="w-full flex justify-center animate-slide-up">
            <FileUploader onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* CONFIGURATION STATE */}
        {status === AnalysisStatus.FILE_READY && audioFile && (
          <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
            <TuningConfig 
              fileName={audioFile.file.name}
              tuning={tuning}
              setTuning={setTuning}
              metadata={metadata}
              setMetadata={setMetadata}
              onGenerate={handleStartGeneration}
              onCancel={resetApp}
            />
            <div className="w-full max-w-2xl opacity-75">
              <AudioPlayer src={audioFile.url} fileName={audioFile.file.name} />
            </div>
          </div>
        )}

        {/* LOADING / PROCESSING STATE */}
        {(status === AnalysisStatus.PROCESSING_FILE || status === AnalysisStatus.GENERATING_TABS) && (
          <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto py-16 space-y-6 animate-pulse-subtle">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
              <Loader2 className="w-16 h-16 text-brand-400 animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {status === AnalysisStatus.PROCESSING_FILE ? "Reading Audio File..." : "Gemini AI is Analyzing..."}
              </h3>
              <div className="flex flex-col items-center space-y-1 text-slate-400 text-sm">
                 {status === AnalysisStatus.GENERATING_TABS && (
                    <div className="flex items-center gap-2 text-brand-300">
                       <Zap size={12} />
                       <span>Thinking & Searching online...</span>
                    </div>
                 )}
                 <span>
                   {status === AnalysisStatus.PROCESSING_FILE 
                    ? "Preparing file..." 
                    : "This typically takes 10-20 seconds."}
                 </span>
              </div>
            </div>
            {/* Fake visualizer bars */}
            <div className="flex items-end gap-1 h-8">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-brand-500/50 rounded-full animate-music-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === AnalysisStatus.ERROR && (
          <div className="w-full max-w-md mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mb-4">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Transcription Failed</h3>
            <p className="text-slate-400 mb-6">{errorMessage}</p>
            <button 
              onClick={resetApp}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Try Another File
            </button>
          </div>
        )}

        {/* RESULTS SECTION */}
        {status === AnalysisStatus.COMPLETED && audioFile && tabResult && (
          <div className="w-full max-w-5xl flex flex-col gap-8 animate-fade-in">
            
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
               <div className="w-full md:w-2/3">
                 <AudioPlayer src={audioFile.url} fileName={audioFile.file.name} />
               </div>
               <button 
                 onClick={resetApp}
                 className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors w-full md:w-auto"
               >
                 <Music2 className="w-4 h-4 mr-2" />
                 New Song
               </button>
            </div>

            {/* Tabs Display */}
            <div className="w-full">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
                 <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Tuning: {tuning}</span>
                 {metadata.title && <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Song: {metadata.title}</span>}
                 <span className="bg-brand-900/30 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20 flex items-center gap-1">
                   <Zap size={10} /> Gemini 2.5 Flash
                 </span>
              </div>
              <TabViewer result={tabResult} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;