<template>
  <div>
    <p class="alert alert-warning">
      You are being redirected to trusted resource for authorzation...
    </p>
  </div>
</template>

<script>
import { inject, watchEffect } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const auth = inject('auth');
    watchEffect(() => {
      if (!store.getters['user/isAuthenticated']) {
        auth.loginWithRedirect({
          appState: { targetUrl: route.query.redirectTo },
        });
      } else {
        if (route.query && route.query.redirectTo) {
          router.push(route.query.redirectTo);
        } else {
          router.push({ name: 'Home' });
        }
      }
    });
  },
};
</script>

<style scoped lang="scss"></style>
