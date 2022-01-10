import { createApp } from 'vue';
import authConfig from '../auth_config.json';
import App from './App.vue';
import router from './router';
import store from './store';
import VueAuth0Plugin from 'vue-auth0-plugin';

// Popper is required for bootstrap tooltips
import '@popperjs/core/dist/esm/popper';

const app = createApp(App).use(store).use(router).use(VueAuth0Plugin, {
  ...authConfig
});
app.mount('#app');
