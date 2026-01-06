import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioRecorder } from './components/AudioRecorder';
import { SongConfiguration } from './components/SongConfiguration';
import { TabDisplay } from './components/TabDisplay';
import { Login } from './components/Login';
import { Library } from './components/Library';
import { TabFile, AppState, SongMetadata, User, SavedTab } from './types';
import { generateTabFromAudio } from './services/gemini';
import { getCurrentUser, logout } from './services/backend';
import { Sparkles, Music2, Mic2, Search, Wand2, AlertCircle, ServerCrash, RefreshCcw } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<SongMetadata | undefined>(undefined);
  const [tabFile, setTabFile] = useState<TabFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<boolean>(false);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAppState(AppState.UPLOAD);
        } else {
          setAppState(AppState.LOGIN);
        }
        setBackendError(false);
      } catch (e) {
        console.error("Backend connection failed:", e);
        setBackendError(true);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setAppState(AppState.UPLOAD);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAppState(AppState.LOGIN);
    setSelectedFile(null);
    setAudioBase64(null);
    setTabFile(null);
  };

  const handleAudioReady = (file: File, base64: string) => {
    setSelectedFile(file);
    setAudioBase64(base64);
    setAppState(AppState.CONFIGURATION);
    setError(null);
  };

  const handleStartTranscription = async (metadata: SongMetadata) => {
    if (!selectedFile || !audioBase64) return;

    setAppState(AppState.PROCESSING);
    setCurrentMetadata(metadata);
    setError(null);
    
    try {
      const audioUrl = URL.createObjectURL(selectedFile);
      const content = await generateTabFromAudio(audioBase64, selectedFile.type, metadata);
      
      setTabFile({
        name: metadata.title || selectedFile.name,
        content,
        audioUrl
      });
      
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError(err.message || "Failed to generate tabs. The AI service may be busy.");
      setAppState(AppState.UPLOAD);
    }
  };

  const handleBackToUpload = () => {
    setSelectedFile(null);
    setAudioBase64(null);
    setAppState(AppState.UPLOAD);
  };

  const handleNewSong = () => {
    setAppState(AppState.UPLOAD);
    setTabFile(null);
    setSelectedFile(null);
    setAudioBase64(null);
    setCurrentMetadata(undefined);
    setError(null);
  };

  const handleLoadSavedTab = (savedTab: SavedTab) => {
    setTabFile({
      name: savedTab.title,
      content: savedTab.content,
      audioUrl: '' 
    });
    setCurrentMetadata({
      title: savedTab.title,
      artist: savedTab.artist,
      tuning: savedTab.tuning,
      bpm: savedTab.bpm,
      note: ''
    });
    setAppState(AppState.RESULT);
  };

  if (backendError) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <ServerCrash className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Backend Disconnected</h1>
          <p className="text-slate-400 mb-6">Could not connect to the API server.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-sense-accent hover:bg-sense-accentHover text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (appState === AppState.LOGIN) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-200 font-sans flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sense-accent/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <Header 
        user={user} 
        onLogout={handleLogout} 
        onNavigateLibrary={() => setAppState(AppState.LIBRARY)}
        onNavigateHome={() => setAppState(AppState.UPLOAD)}
      />

      <main className="flex-1 flex flex-col items-center p-6 md:p-12 relative z-10 w-full">
        {appState === AppState.UPLOAD && (
          <div className="w-full max-w-5xl flex flex-col items-center text-center mt-8 md:mt-16 space-y-16 fade-in animate-in duration-1000 slide-in-from-bottom-4">
            <div className="space-y-8 max-w-4xl relative">
              <div className="inline-flex items-center space-x-2 glass-panel px-3 py-1 rounded-full border border-sense-accent/30">
                 <Sparkles className="w-3.5 h-3.5 text-sense-accent" />
                 <span className="text-xs font-medium text-sense-glow uppercase tracking-widest">AI-Powered Studio</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                Convert Audio <br/>
                to <span className="text-gradient relative inline-block">
                    Tabs
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-sense-accent opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00027 7.00003C33.8954 3.33336 126.497 -1.99998 198.003 2.00003" stroke="currentColor" strokeWidth="3"/></svg>
                   </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
                Hello, <span className="text-white font-medium">{user?.username}</span>. Upload any song or riff. TabSense uses <span className="text-white font-medium">Gemini 3 Pro</span> to listen, research, and generate flawless tablature.
              </p>
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-6 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sense-accent to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#05050a] rounded-[1.9rem]">
                <AudioRecorder onAudioReady={handleAudioReady} isProcessing={false} />
              </div>
              
              {error && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-5 py-4 rounded-xl flex items-start gap-4 text-sm shadow-xl">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-red-300">Generation Failed</span>
                          <span className="text-left text-red-200/80 leading-relaxed">{error}</span>
                        </div>
                    </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
              ={[
                 { icon: Music2, title: "Audio Perception", desc: "Detects tuning, key, and rhythm by ear." },
                 { icon: Search, title: "Web Research", desc: "Cross-references official tabs & live videos." },
                 { icon: Wand2, title: "Instant Tabs", desc: "Generates professional ASCII tabs in seconds." }
               ].map((f, i) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl text-left hover:bg-white/5 transition-colors group cursor-default">
                     <div className="w-12 h-12 rounded-xl bg-sense-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <f.icon className="w-6 h-6 text-sense-accent" />
                     </div>
                     <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                     <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
               ))}
            </div>
          </div>
        )}

        {appState === AppState.LIBRARY && (
          <Library onLoadTab={handleLoadSavedTab} onNewTab={handleNewSong} />
        )}

        {appState === AppState.CONFIGURATION && selectedFile && (
           <SongConfiguration 
              file={selectedFile} 
              onBack={handleBackToUpload}
              onStart={handleStartTranscription}
           />
        )}

        {appState === AppState.PROCESSING && (
          <div className="w-full max-w-4xl flex flex-col items-center text-center mt-32 space-y-8 fade-in animate-in duration-700 relative">
             <div className="w-full max-w-2xl aspect-[3/1] rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center space-y-6 relative overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sense-accent/10 to-transparent animate-pulse-slow"></div>
                <div className="relative">
                   <div className="absolute inset-0 bg-sense-accent blur-xl opacity-20 animate-pulse"></div>
                   <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-sense-accent border-t-transparent rounded-full animate-spin"></div>
                   </div>
                </div>
                <div className="space-y-2 z-10">
                  <h3 className="text-xl font-semibold text-white">Analyzing Audio...</h3>
                  <p className="text-slate-400 text-sm">Gemini 3 Pro is processing harmonies & researching official charts.</p>
                </div>
             </div>
          </div>
        )}

        {appState === AppState.RESULT && tabFile && (
          <div className="w-full pt-6">
            <TabDisplay 
              tabFile={tabFile} 
              metadata={currentMetadata}
              onNewSong={appState === AppState.RESULT && !tabFile.audioUrl ? () => setAppState(AppState.LIBRARY) : handleNewSong}
              isSavedMode={!tabFile.audioUrl} 
            />
          </div>
        )}
      </main>
    </div>
  );
}