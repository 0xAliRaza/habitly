<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container">
      <router-link
        active-class="active"
        to="/habits"
        custom
        v-slot="{ href, navigate }"
      >
        <a class="navbar-brand" :href="href" @click="navigate">Habitly</a>
      </router-link>
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
              :class="{ active: isActive || currentRouteName == 'HabitDetail' }"
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
            class="btn btn-link"
            v-if="authenticated"
            @click="auth.logout"
          >
            Log out
          </button>
        </li>
      </ul>
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
import { computed, inject, provide, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
export default {
  name: 'app',
  setup() {
    const store = useStore();
    const auth = inject('auth');
    const route = useRoute();
    watchEffect(() => {
      if (store.getters['user/isAuthenticated']) {
        store
          .dispatch('habits/refresh')
          .catch((err) =>
            console.log(
              '%cerror App.vue (getHabits) line:71 ',
              'color: red; display: block; width: 100%;',
              err
            )
          );
        store
          .dispatch('stacks/refresh')
          .catch((err) =>
            console.log(
              '%cerror App.vue (getStacks) line:79 ',
              'color: red; display: block; width: 100%;',
              err
            )
          );
        store
          .dispatch('intentions/refresh')
          .catch((err) =>
            console.log(
              '%cerror App.vue (intentions) line:95 ',
              'color: red; display: block; width: 100%;',
              err
            )
          );
      }
    });
    return {
      auth,
      loading: computed(() => store.state.user.loading),
      authenticated: computed(() => store.getters['user/isAuthenticated']),
      currentRouteName: computed(() => route.name),
    };
  },
};
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');
@import 'bootstrap/scss/bootstrap.scss';

html,
body,
#app {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  // font-family: 'Open Sans', sans-serif;
  background-color: $color-body-bg;
}

#app {
  display: flex;
  flex-direction: column;
}

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
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
