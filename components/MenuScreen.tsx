
import React, { useState } from 'react';
import { Note } from '../types';

interface MenuScreenProps {
  notes: Note[];
  onSelectNote: (id: string, rect: DOMRect) => void;
  onNewNote: () => void;
  onOpenSidebar: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ notes, onSelectNote, onNewNote, onOpenSidebar }) => {
  const [activeTag, setActiveTag] = useState('All notes');
  
  // Aggregate unique tags from all notes
  const tags = ['All notes', 'Quick note', 'Favourites', 'Handwritten', ...Array.from(new Set(notes.flatMap(n => n.tags)))];

  const filteredNotes = activeTag === 'All notes' 
    ? notes 
    : notes.filter(n => n.tags.includes(activeTag) || (activeTag === 'Quick note' && n.content.length < 50));

  const handleNoteClick = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSelectNote(id, rect);
  };

  return (
    <div className="flex flex-col h-full p-5 md:p-8 animate-in fade-in duration-500">
      {/* Header Page 1 */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
             <button onClick={onOpenSidebar} className="p-2 glass-surface glass-surface--fallback rounded-xl text-white active:scale-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
             <div className="text-[12px] font-medium tracking-widest text-gray-400 uppercase">GlassNote</div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight ml-1">All notes</h1>
      </header>

      {/* Category Horizontal Bar */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {tags.map(tag => (
          <button 
            key={tag} 
            onClick={() => setActiveTag(tag)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTag === tag ? 'bg-white/20 text-white shadow-lg border border-white/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-px">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <p>No notes in {activeTag}</p>
          </div>
        ) : (
          filteredNotes.sort((a, b) => b.updatedAt - a.updatedAt).map(note => (
            <div 
              key={note.id}
              onClick={(e) => handleNoteClick(e, note.id)}
              className="group py-4 px-2 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
                  {note.title || 'Untitled'}
                </h3>
                {note.tags.length > 0 && (
                  <div className="text-[10px] text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {note.tags[0]}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <span className="text-gray-700">|</span>
                <span className="truncate flex-1">{note.content.substring(0, 60)}...</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onNewNote}
        className="fixed bottom-10 right-10 w-16 h-16 glass-surface glass-surface--fallback rounded-full flex items-center justify-center text-blue-400 shadow-2xl active:scale-90 transition-transform z-50 hover:bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};
