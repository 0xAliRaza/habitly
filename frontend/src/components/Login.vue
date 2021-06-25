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
    const auth = inject('auth');

    watchEffect(() => {
      if (!store.getters['user/isAuthenticated']) {
        auth.loginWithRedirect({
          appState: { targetUrl: route.query.redirectTo },
        });
      }
    });
  },
};
</script>

<style scoped lang="scss"></style>
