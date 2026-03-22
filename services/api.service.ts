import axios from 'axios';

const NASA_API_KEY = 'e7nSseioMhSlSXqS9d8heEwRstERuW3K2ALxwhrs';
const NASA_BASE_URL = 'https://api.nasa.gov';

const apiClient = axios.create({
  baseURL: NASA_BASE_URL,
  timeout: 10000,
});

export interface APOD {
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

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export const nasaApiService = {
  getAPOD: async (date?: string): Promise<APOD> => {
    try {
      const params: any = { api_key: NASA_API_KEY };
      if (date) {
        params.date = date;
      }
      const response = await apiClient.get('/planetary/apod', { params });
      return { ...response.data, id: response.data.date };
    } catch (error) {
      console.error('Error fetching APOD:', error);
      throw error;
    }
  },

  getAPODRange: async (startDate: string, endDate: string): Promise<APOD[]> => {
    try {
      const response = await apiClient.get('/planetary/apod', {
        params: {
          api_key: NASA_API_KEY,
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data.map((item: any) => ({ ...item, id: item.date }));
    } catch (error) {
      console.error('Error fetching APOD range:', error);
      throw error;
    }
  },

  getNearEarthObjects: async (startDate: string, endDate: string): Promise<NearEarthObject[]> => {
    try {
      const response = await apiClient.get('/neo/rest/v1/feed', {
        params: {
          api_key: NASA_API_KEY,
          start_date: startDate,
          end_date: endDate,
        },
      });
      
      const neos: NearEarthObject[] = [];
      const nearEarthObjects = response.data.near_earth_objects;
      
      Object.keys(nearEarthObjects).forEach((date) => {
        neos.push(...nearEarthObjects[date]);
      });
      
      return neos;
    } catch (error) {
      console.error('Error fetching Near Earth Objects:', error);
      throw error;
    }
  },

  getMarsRoverPhotos: async (sol: number = 1000, rover: string = 'curiosity'): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: {
          api_key: NASA_API_KEY,
          sol: sol,
        },
      });
      return response.data.photos;
    } catch (error) {
      console.error('Error fetching Mars Rover photos:', error);
      throw error;
    }
  },
};
