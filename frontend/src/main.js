import { createApp } from 'vue';
import authConfig from '../auth_config.json';
import App from './App.vue';
import { setupAuth } from './auth';
import router from './router';
import store from './store';

import '@popperjs/core/dist/esm/popper';

const app = createApp(App).use(store).use(router);

function callbackRedirect(appState) {
  router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
}

setupAuth(authConfig, callbackRedirect).then((auth) => {
  app.provide('auth', auth).mount('#app');
});
