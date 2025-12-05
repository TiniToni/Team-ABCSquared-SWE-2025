// Api.js - Updated to work with your Django backend
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth functions
export const registerUser = (data) => {
  return axios.post(`${API_URL}/api/user/register/`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/api/token/`, data);
};

export const refreshToken = (refresh) => {
  return axios.post(`${API_URL}/api/token/refresh/`, { refresh });
};

// Quiz functions - Updated to match your URLs
export const getQuizForLesson = (lessonId) => {
  return api.get(`${API_URL}/api/quizzes/${lessonId}/`);
};

export const submitQuiz = (lessonId, answers) => {
  return api.post(`${API_URL}/api/quizzes/${lessonId}/submit/`, { answers });
};

export const getQuizProgress = () => {
  return api.get(`${API_URL}/api/quizzes/progress/`);
};

export const markLessonComplete = (lessonId) => {
  return api.post(`${API_URL}/api/quizzes/mark-complete/`, { lesson_id: lessonId });
};

export const getUserSubmissions = () => {
  return api.get(`${API_URL}/api/submissions/`);
};

export default api;