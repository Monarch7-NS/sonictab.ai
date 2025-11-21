
import React, { useState } from 'react';
import { Copy, Check, Download, Globe, ExternalLink } from 'lucide-react';
import { TabResult } from '../types';

interface TabViewerProps {
  result: TabResult;
}

export const TabViewer: React.FC<TabViewerProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const { rawText: tabs, sourceUrls } = result;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([tabs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sonictab-generated.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* Sources / Research Section */}
      {sourceUrls && sourceUrls.length > 0 && (
        <div className="bg-slate-900/50 border border-brand-500/30 rounded-lg p-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 text-brand-300 text-sm font-medium">
            <Globe size={14} />
            <span>AI Research Sources Used:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sourceUrls.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-brand-300 px-2 py-1 rounded border border-slate-700 transition-colors truncate max-w-[200px]"
              >
                <span className="truncate">{source.title}</span>
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            <span className="ml-2 text-xs font-mono text-slate-500">AI_GENERATED_TABS.txt</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-brand-400 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-brand-400 transition-colors"
              title="Download .txt"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-x-auto bg-[#0d1117]">
          <pre className="font-mono text-sm leading-relaxed text-brand-50 whitespace-pre">
            {tabs}
          </pre>
        </div>
      </div>
    </div>
  );
};
