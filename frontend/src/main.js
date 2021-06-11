import { createApp } from 'vue';
import authConfig from '../auth_config';
import App from './App.vue';
import { setupAuth } from './auth';
import router from './router';

const app = createApp(App).use(router);

function callbackRedirect(appState) {
  router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
}

setupAuth(authConfig, callbackRedirect).then((auth) => {
  app.provide('auth', auth).mount('#app');
});
