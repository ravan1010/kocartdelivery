import axios from "axios";

const api = axios.create({
      // baseURL: 'https://api.kocart.online/',
  baseURL: 'http://localhost:5001',
  withCredentials: true,
});

export default api;
