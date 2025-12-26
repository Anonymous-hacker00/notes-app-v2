
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { geminiService } from '../services/gemini';

interface EditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onDone: () => void;
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate, onDone, history }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showAiMenu, setShowAiMenu] = useState(false);

  useEffect(() => {
    setSummary(null);
    setSuggestedTags([]);
  }, [note.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...note, title: e.target.value, updatedAt: Date.now() });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...note, content: e.target.value, updatedAt: Date.now() });
  };

  const handleSummarize = async () => {
    if (!note.content) return;
    setIsSummarizing(true);
    const result = await geminiService.summarizeNote(note.content);
    setSummary(result);
    setIsSummarizing(false);
    setShowAiMenu(false);
  };

  const handleSuggestTags = async () => {
    if (!note.content) return;
    setIsSuggesting(true);
    const result = await geminiService.suggestTags(note.content);
    const newTags = result.filter(tag => !note.tags.includes(tag));
    setSuggestedTags(newTags);
    setIsSuggesting(false);
    setShowAiMenu(false);
  };

  const toggleChecklist = () => {
    const lines = note.content.split('\n');
    const newContent = lines.map(line => line.startsWith('☐ ') ? line.substring(2) : `☐ ${line}`).join('\n');
    onUpdate({ ...note, content: newContent, updatedAt: Date.now() });
  };

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const formattedTime = new Date(note.updatedAt).toLocaleTimeString([], { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  });
  const formattedDate = new Date(note.updatedAt).toLocaleDateString();

  return (
    <div className="flex flex-col h-full relative bg-[#0c0c0c]">
      {/* Top Header Section */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={onDone} className="p-2 text-gray-400 hover:text-white active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={history.undo} 
            disabled={!history.canUndo}
            className={`p-2 transition-transform active:scale-90 ${history.canUndo ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button 
            onClick={history.redo} 
            disabled={!history.canRedo}
            className={`p-2 transition-transform active:scale-90 ${history.canRedo ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
          <button className="p-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button onClick={onDone} className="p-2 text-blue-400 active:scale-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden px-6 pb-24">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="bg-transparent text-3xl font-bold text-white outline-none w-full border-none focus:ring-0 placeholder:text-gray-600 mb-2"
        />

        {/* Integrated Metadata Separator */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
            {wordCount} words
          </span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-right bg-white/5 px-2 py-0.5 rounded">
            {formattedDate} | {formattedTime}
          </span>
        </div>

        {summary && (
          <div className="mb-6 p-4 glass-surface glass-surface--fallback rounded-2xl text-sm text-blue-200 animate-in fade-in">
            <div className="font-bold mb-1 flex items-center">
              <span className="mr-2">✨</span> AI Summary
            </div>
            {summary}
          </div>
        )}

        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start typing your thoughts..."
          className="flex-1 bg-transparent resize-none text-gray-300 leading-relaxed text-lg outline-none border-none focus:ring-0 placeholder:text-gray-700"
        />
      </div>

      {/* AI Popover */}
      {showAiMenu && (
        <div className="absolute bottom-24 left-6 right-6 z-50 glass-surface glass-surface--fallback rounded-3xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-surface__content">
            <button onClick={handleSummarize} disabled={isSummarizing} className="w-full flex items-center space-x-4 p-4 hover:bg-white/5 rounded-2xl transition-colors">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                {isSummarizing ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Summarize</div>
                <div className="text-xs text-gray-500">Generate a 3-sentence summary</div>
              </div>
            </button>
            <button onClick={handleSuggestTags} disabled={isSuggesting} className="w-full flex items-center space-x-4 p-4 hover:bg-white/5 rounded-2xl transition-colors mt-1">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                {isSuggesting ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Categorize</div>
                <div className="text-xs text-gray-500">Suggest AI powered tags</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* FIXED BOTTOM TOOLBAR (Thin Band) */}
      <div className="absolute bottom-6 left-6 right-6 h-16 glass-surface glass-surface--fallback rounded-full flex items-center justify-around px-4 z-40 border border-white/10">
        <button 
          onClick={() => setShowAiMenu(!showAiMenu)}
          className={`p-3 rounded-full transition-all active:scale-90 ${showAiMenu ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-blue-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
          </svg>
        </button>
        <button onClick={toggleChecklist} className="p-3 text-gray-500 hover:text-white active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="p-3 text-gray-500 hover:text-white active:scale-90 transition-all">
          <span className="font-serif text-lg font-bold">Aa</span>
        </button>
        <button className="p-3 text-gray-500 hover:text-white active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button className="p-3 text-gray-500 hover:text-white active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
