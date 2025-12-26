
import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ notes, isOpen, onClose, onSelectNote, onNewNote }) => {
  return (
    <>
      {/* Background Dimmer */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <div className={`fixed left-0 top-0 h-full w-72 z-[101] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="drawer-rect glass-surface glass-surface--fallback overflow-hidden flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Notebooks</h2>
              <button onClick={onClose} className="p-1 hover:text-white text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => { onNewNote(); onClose(); }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>New Notebook</span>
                </div>
                <span className="text-blue-400 text-xs font-bold group-hover:underline">New</span>
              </button>

              <div className="mt-8 mb-4 px-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">My Collections</div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-yellow-500/50"></div>
                    <span className="text-sm text-gray-300">Quick notes</span>
                  </div>
                  <span className="text-xs text-gray-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-blue-500/50"></div>
                    <span className="text-sm text-gray-300">Default</span>
                  </div>
                  <span className="text-xs text-gray-600">44</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-red-500/50"></div>
                    <span className="text-sm text-gray-300">Recently deleted</span>
                  </div>
                  <span className="text-xs text-gray-600">0</span>
                </div>
              </div>
            </nav>
          </div>
          
          <div className="mt-auto p-6 bg-white/5">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
