
import { Note } from '../types';

const STORAGE_KEY = 'glassnote_data_v1';

export const storageService = {
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse notes from storage', e);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  createNote: (title: string = 'Untitled Note'): Note => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content: '',
      updatedAt: Date.now(),
      tags: []
    };
  }
};
