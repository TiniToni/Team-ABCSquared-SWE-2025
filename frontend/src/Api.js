import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const registerUser = (data) =>
  axios.post(`${API_URL}/api/user/register/`, data);

export const login = (data) =>
  axios.post(`${API_URL}/api/token/`, data);