import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; 

export const registerUser = (data) => {
  return axios.post(`${API_URL}/api/user/register/`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/api/token/`, data);
};

export const refreshToken = (refresh) => {
  return axios.post(`${API_URL}/api/token/refresh/`, { refresh });
};

export const getQuizForLesson = (lessonId) => {
  return axios.get(`${API_URL}/api/quizzes/${lessonId}/`);
};

export const submitQuiz = (lessonId, payload) => {
  return axios.post(`${API_URL}/api/quizzes/${lessonId}/submit/`, payload);
};