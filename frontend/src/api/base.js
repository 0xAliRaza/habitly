import { AuthenticationState } from 'vue-auth0-plugin';
import { AuthenticationProperties as auth0 } from 'vue-auth0-plugin';
import axios from 'axios';
import api_config from '../../api_config.json';
const instance = axios.create({
  baseURL: api_config.api_uri,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor to append jwt token from store on every request
instance.interceptors.request.use(async function (config) {
  if (AuthenticationState.authenticated) {
    
    config.headers.Authorization = `Bearer ${await auth0.getTokenSilently()}`;
  }
  return config;
});

export default instance;
