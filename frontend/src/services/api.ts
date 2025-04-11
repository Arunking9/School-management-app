import axios, { AxiosError } from 'axios';
import { Subject, Chapter } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { google_id } = JSON.parse(userData);
      config.headers.Authorization = `Bearer ${google_id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getSubjects = async (gradeLevel: string): Promise<Subject[]> => {
  try {
    const response = await api.get(`/content/subjects?grade_level=${gradeLevel}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subjects');
  }
};

export const getChapters = async (subjectId: number): Promise<Chapter[]> => {
  try {
    const response = await api.get(`/content/student-view/${subjectId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch chapters');
  }
};

export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await api.post('/auth/save-user', userData);
  } catch (error) {
    throw new Error('Failed to save user data');
  }
}; 