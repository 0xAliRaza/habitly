import store from '@/store/index.js';
import axios from 'axios';
import api_config from '../../api_config.json';
const instance = axios.create({
  baseURL: api_config.api_uri,
  headers: {
    Accept: 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  if (store.getters['user/isAuthenticated']) {
    config.headers.Authorization = `Bearer ${store.state.user.access_token}`;
  }
  return config;
});

export default instance;
