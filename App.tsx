
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from './types';
import { storageService } from './services/storage';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { MenuScreen } from './components/MenuScreen';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<'editor' | 'browser'>('browser');
  
  // History for Undo/Redo
  const [history, setHistory] = useState<Note[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // State for shared element expansion
  const [isExpanding, setIsExpanding] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const savedNotes = storageService.getNotes();
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    storageService.saveNotes(notes);
  }, [notes]);

  const triggerExpansion = (newView: 'editor' | 'browser', rect: DOMRect | null = null) => {
    if (newView === 'editor' && rect) {
      setOriginRect(rect);
      setIsExpanding(true);
      setView('editor');
      setTimeout(() => {
        setIsExpanding(false);
        setSidebarOpen(false); 
      }, 600);
    } else {
      setView(newView);
      setSidebarOpen(false);
    }
  };

  const handleNewNote = () => {
    const newNote = storageService.createNote();
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setSidebarOpen(false);
    setView('editor');
    setHistory([newNote]);
    setHistoryIndex(0);
  };

  const handleUpdateNote = useCallback((updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, updatedNote].slice(-50);
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevNote = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setNotes(prev => prev.map(n => n.id === prevNote.id ? prevNote : n));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextNote = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setNotes(prev => prev.map(n => n.id === nextNote.id ? nextNote : n));
    }
  };

  const handleSelectFromMenu = (id: string, rect: DOMRect) => {
    const note = notes.find(n => n.id === id);
    setActiveNoteId(id);
    if (note) {
      setHistory([note]);
      setHistoryIndex(0);
    }
    triggerExpansion('editor', rect);
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="relative flex h-screen w-full bg-[#0c0c0c] overflow-hidden">
      {/* Page 1: All Notes Browser */}
      <div 
        className={`fixed inset-0 z-10 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
          view === 'browser' ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-110'
        }`}
      >
        <MenuScreen 
          notes={notes} 
          onSelectNote={handleSelectFromMenu} 
          onNewNote={handleNewNote}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>

      {/* Editor View */}
      <div 
        className={`fixed inset-0 z-20 transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1) ${
          view === 'editor' && !isExpanding ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-20'
        }`}
      >
        {activeNote && (
          <Editor 
            note={activeNote} 
            onUpdate={handleUpdateNote} 
            onDone={() => setView('browser')}
            history={{
              undo,
              redo,
              canUndo: historyIndex > 0,
              canRedo: historyIndex < history.length - 1
            }}
          />
        )}
      </div>

      {/* Shared Element Expansion Overlay */}
      {isExpanding && originRect && (
        <div 
          className="fixed expansion-active glass-surface glass-surface--fallback"
          style={{
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            animation: 'expandFullscreen 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="p-10 opacity-0 animate-in fade-in duration-500 delay-100">
             <div className="text-3xl font-bold text-white mb-4">{activeNote?.title}</div>
             <div className="text-lg text-gray-500">{activeNote?.content?.substring(0, 100)}...</div>
          </div>
        </div>
      )}

      {/* Rounded Sidebar Drawer */}
      <Sidebar 
        notes={notes}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectNote={(id) => { setActiveNoteId(id); setView('editor'); setSidebarOpen(false); }}
        onNewNote={handleNewNote}
      />
    </div>
  );
};

export default App;
