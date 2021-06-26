<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container">
      <router-link
        active-class="active"
        to="/habits"
        custom
        v-slot="{ href, navigate }"
      >
        <a class="navbar-brand" :href="href" @click="navigate">Habitly</a>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        @click.prevent="toggleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" ref="navbarMenu">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              active-class="active"
              to="/habits"
              custom
              v-slot="{ href, navigate, isActive }"
              ><a
                class="nav-link"
                :href="href"
                @click="navigate"
                :class="{
                  active: isActive || currentRouteName == 'HabitDetail',
                }"
                >Habits
              </a></router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/stacks"
              >Stacks</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/intentions"
              >Intentions</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav ms-auto" v-if="!loading">
          <li class="nav-item">
            <button
              class="btn btn-primary"
              v-if="!authenticated"
              @click="auth.loginWithRedirect"
            >
              Log in
            </button>
          </li>
          <li class="nav-item">
            <button
              class="btn btn-outline-primary"
              v-if="authenticated"
              @click="auth.logout"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="my-5">
    <router-view></router-view>
  </main>

  <footer class="bg-dark mt-auto py-3">
    <div class="container">
      <span class="text-light">Coded by Ali Raza.</span>
    </div>
  </footer>
</template>

<script>
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import 'bootstrap/js/dist/collapse';
import Collapse from 'bootstrap/js/dist/collapse';
export default {
  name: 'app',
  setup() {
    const store = useStore();
    const auth = inject('auth');
    const route = useRoute();
    const navbarMenu = ref(null);
    const bsCollapse = ref(null);
    const toggleNavbar = () => {
      bsCollapse.value.toggle();
    };
    watchEffect(() => {
      if (store.getters['user/isAuthenticated']) {
        store.dispatch('habits/refresh').catch((err) => console.log(err));
        store.dispatch('stacks/refresh').catch((err) => console.log(err));
        store.dispatch('intentions/refresh').catch((err) => console.log(err));
      }
    });

    onMounted(() => {
      bsCollapse.value = new Collapse(navbarMenu.value, { toggle: false });
    });
    return {
      auth,
      navbarMenu,
      toggleNavbar,
      loading: computed(() => store.state.user.loading),
      authenticated: computed(() => store.getters['user/isAuthenticated']),
      currentRouteName: computed(() => route.name),
    };
  },
};
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');

/* Import Bootstrap */

// Configuration
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';
@import '~bootstrap/scss/utilities';

// Layout & components
@import '~bootstrap/scss/root';
@import '~bootstrap/scss/reboot';
@import '~bootstrap/scss/containers';
@import '~bootstrap/scss/grid';
@import '~bootstrap/scss/tables';
@import '~bootstrap/scss/forms';
@import '~bootstrap/scss/buttons';
@import '~bootstrap/scss/nav';
@import '~bootstrap/scss/navbar';
@import '~bootstrap/scss/transitions';
@import '~bootstrap/scss/badge';
@import '~bootstrap/scss/alert';
@import '~bootstrap/scss/list-group';
@import '~bootstrap/scss/close';
@import '~bootstrap/scss/tooltip';
@import '~bootstrap/scss/spinners';

// Helpers
@import '~bootstrap/scss/helpers';

// Utilities
@import '~bootstrap/scss/utilities/api';

html,
body,
#app {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  background-color: $color-body-bg;
}

#app {
  display: flex;
  flex-direction: column;
}

/* Customize Scrollbar */

/* The emerging W3C standard
   that is currently Firefox-only */
* {
  scrollbar-color: $gray-500 $gray-200;
}

/* Works on Chrome/Edge/Safari */
*::-webkit-scrollbar {
  width: pxToRem(8);
  height: pxToRem(8);
}
*::-webkit-scrollbar-track {
  background: $gray-200;
}
*::-webkit-scrollbar-thumb {
  background-color: $gray-500;
  border-radius: pxToRem(6);
}

/* Vue transitions */
.slide-in-enter-active,
.slide-in-leave-active {
  // transition: all 0.2s cubic-bezier(0.83, 0, 0.17, 1);
  transition: all 0.1s ease-in-out;
}
.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(pxToRem(-50px));
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
