import store from '@/store/index.js';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    Accept: 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const state = store.state;
  if (state.user && state.user.access_token) {
    config.headers.Authorization = `Bearer ${state.user.access_token}`;
  }
  return config;
});

export default instance;
