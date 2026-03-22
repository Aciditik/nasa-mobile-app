import AsyncStorage from '@react-native-async-storage/async-storage';
import { APOD } from './api.service';

const STORAGE_KEYS = {
  FAVORITES: '@nasa_app_favorites',
  USER: '@nasa_app_user',
  AUTH_TOKEN: '@nasa_app_auth_token',
  NOTES: '@nasa_app_notes',
};

export interface Note {
  id: string;
  apodDate: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const storageService = {
  saveFavorites: async (favorites: APOD[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw error;
    }
  },

  getFavorites: async (): Promise<APOD[]> => {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addFavorite: async (apod: APOD): Promise<void> => {
    try {
      const favorites = await storageService.getFavorites();
      const exists = favorites.find((fav) => fav.date === apod.date);
      if (!exists) {
        favorites.push({ ...apod, isFavorite: true });
        await storageService.saveFavorites(favorites);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  removeFavorite: async (date: string): Promise<void> => {
    try {
      const favorites = await storageService.getFavorites();
      const filtered = favorites.filter((fav) => fav.date !== date);
      await storageService.saveFavorites(filtered);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  isFavorite: async (date: string): Promise<boolean> => {
    try {
      const favorites = await storageService.getFavorites();
      return favorites.some((fav) => fav.date === date);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  saveAuthToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  },

  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  removeAuthToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  },

  saveUser: async (user: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  getUser: async (): Promise<any | null> => {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  saveNotes: async (notes: Note[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  },

  getNotes: async (): Promise<Note[]> => {
    try {
      const notes = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  addNote: async (note: Note): Promise<void> => {
    try {
      const notes = await storageService.getNotes();
      notes.push(note);
      await storageService.saveNotes(notes);
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  updateNote: async (id: string, content: string): Promise<void> => {
    try {
      const notes = await storageService.getNotes();
      const index = notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes[index].content = content;
        notes[index].updatedAt = new Date().toISOString();
        await storageService.saveNotes(notes);
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    try {
      const notes = await storageService.getNotes();
      const filtered = notes.filter((note) => note.id !== id);
      await storageService.saveNotes(filtered);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.NOTES,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
