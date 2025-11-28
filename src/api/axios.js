import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.URL_API,
  timeout: 10000,
  headers: {'Content-Type': 'application/json'}
});

export default api;