<template>
  <div id="content" v-if="!loading && authenticated && APIDataInit">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container">
      <router-link @click="hideNavbar" class="navbar-brand" to="/" >Habitly</router-link>
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
            <router-link
              @click="hideNavbar"
              class="nav-link"
              active-class="active"
              to="/"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              active-class="active"
              to="/habits"
              custom
              v-slot="{ navigate, isActive }"
              ><a
                style="cursor: pointer"
                class="nav-link"
                @click="
                  hideNavbar();
                  navigate();
                "
                :class="{
                  active: isActive || currentRouteName == 'HabitDetail',
                }"
                >Habits
              </a></router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              @click="hideNavbar"
              class="nav-link"
              active-class="active"
              to="/stacks"
              >Stacks</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              @click="hideNavbar"
              class="nav-link"
              active-class="active"
              to="/intentions"
              >Intentions</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav ms-auto" v-if="!loading && authenticated">
          <li class="nav-item">
            <div class="navbar-text">
              <span class="text-light">{{ user.nickname }}</span>
              <button class="btn btn-link btn-sm ms-1" @click.prevent="logout">Logout</button>
            </div>
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
      <div class="text-center text-light">
        Coded with<span class="text-danger mx-1"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            /></svg></span
        >by <a href="https://0xali.com" class="text-decoration-none">Ali Raza</a>.
      </div>
    </div>
    </footer>
  </div>
  <div id="loading" v-else>
    <div class="d-flex flex-column justify-content-center align-items-center" style="height: 100vh">
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">{{ loadingMessage ? loadingMessage : "Loading..." }}</span>
      </div>
      <div class="mt-1"><span role="alert" class="text-dark">{{ loadingMessage ? loadingMessage : "Loading..." }}</span></div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watchEffect, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import 'bootstrap/js/dist/collapse';
import Collapse from 'bootstrap/js/dist/collapse';
export default {
  name: 'app',
  setup() {
    const store = useStore();
    const route = useRoute();
    const auth = inject('auth');

    const APIDataInit = ref(false);

    const loadingMessage = ref(null);

    /* Navbar inner div ref to make it collapsable */
    const navbarMenu = ref(null);

    /* Bootstrap Collapse instance */
    const bsCollapse = ref(null);
    const toggleNavbar = () => {
      bsCollapse.value.toggle();
    };
    const hideNavbar = () => {
      bsCollapse.value.hide();
    };

    const logout = () => {
      auth.logout();
      }
    /* Load API Data */
    watchEffect(async () => {
      if (!auth.loading && auth.authenticated) {
        loadingMessage.value = "Loading existing data from server...";
        try {
          await store.dispatch('habits/refresh');
          await store.dispatch('stacks/refresh');
          await store.dispatch('intentions/refresh');
        } catch (error) {
          if (error.toJSON().message === 'Network Error') {
            alert(
              'Network error, please check your internet or habitly API server status.'
            );
          }
          console.error(error);
        }
        finally {
          APIDataInit.value = true;
          loadingMessage.value = null;
        }
      }
    });

    /* Set bootstrap collapse */
    watchEffect(async () => {
      if (APIDataInit.value) {
        // Wait for conditional elements to be rendered
        await nextTick();
        /* Make navbar collapsable using bootstrap's `Collapse` */
        bsCollapse.value = new Collapse(navbarMenu.value, { toggle: false });
      }
    });

    return {
      navbarMenu,
      toggleNavbar,
      hideNavbar,
      APIDataInit,
      loadingMessage,
      loading: computed(() => auth.loading),
      authenticated: computed(() => auth.authenticated),
      currentRouteName: computed(() => route.name),
      user: computed(() => auth.user),
      logout: logout
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
#app, #content {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  background-color: $color-body-bg;
}

#app, #content {
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
