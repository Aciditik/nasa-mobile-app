import axios from "axios";
import { storageService } from "./storage.service";

const API_URL = "http://192.168.1.146:3000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Favorite {
  id?: string;
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: string;
  hdurl?: string;
  copyright?: string;
  isFavorite?: boolean;
}

export interface Note {
  id: string;
  apodDate: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const backendService = {
  auth: {
    register: async (
      email: string,
      password: string,
      name: string,
    ): Promise<AuthResponse> => {
      try {
        const response = await apiClient.post("/auth/register", {
          email,
          password,
          name,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Registration failed");
      }
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await apiClient.post("/auth/login", {
          email,
          password,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Login failed");
      }
    },

    logout: async (): Promise<void> => {
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },

  favorites: {
    getAll: async (): Promise<Favorite[]> => {
      try {
        const response = await apiClient.get("/favorites");
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch favorites",
        );
      }
    },

    add: async (favorite: Favorite): Promise<Favorite> => {
      try {
        const response = await apiClient.post("/favorites", {
          date: favorite.date,
          title: favorite.title,
          explanation: favorite.explanation,
          url: favorite.url,
          media_type: favorite.media_type,
          hdurl: favorite.hdurl,
          copyright: favorite.copyright,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.error || "Failed to add favorite",
        );
      }
    },

    remove: async (date: string): Promise<void> => {
      try {
        await apiClient.delete(`/favorites/${date}`);
      } catch (error: any) {
        throw new Error(
          error.response?.data?.error || "Failed to remove favorite",
        );
      }
    },

    check: async (date: string): Promise<boolean> => {
      try {
        const response = await apiClient.get(`/favorites/check/${date}`);
        return response.data.isFavorite;
      } catch (error) {
        console.error("Check favorite error:", error);
        return false;
      }
    },
  },

  notes: {
    getAll: async (apodDate?: string): Promise<Note[]> => {
      try {
        const params = apodDate ? { apod_date: apodDate } : {};
        const response = await apiClient.get("/notes", { params });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to fetch notes");
      }
    },

    add: async (apodDate: string, content: string): Promise<Note> => {
      try {
        const response = await apiClient.post("/notes", { apodDate, content });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to add note");
      }
    },

    update: async (id: string, content: string): Promise<Note> => {
      try {
        const response = await apiClient.put(`/notes/${id}`, { content });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to update note");
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        await apiClient.delete(`/notes/${id}`);
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to delete note");
      }
    },
  },
};
