<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">Navbar</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="/habits"
            >Habits</router-link
          >
        </li>
        <div v-if="!auth.loading.value">
          <li class="nav-item">
            <button
              class="btn btn-primary"
              v-if="!auth.isAuthenticated.value"
              @click="auth.loginWithRedirect"
            >
              Log in
            </button>
          </li>
          <li class="nav-item">
            <button
              class="btn btn-primary"
              v-if="auth.isAuthenticated.value"
              @click="auth.logout"
            >
              Log out
            </button>
          </li>
        </div>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Profile</a>
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
import { inject, provide, watchEffect } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'app',
  setup() {
    const store = useStore();
    const auth = inject('auth');
    watchEffect(() => {
      if (auth.isAuthenticated.value === true && auth.loading.value === false) {
        store
          .dispatch('getHabits')
          .then((res) =>
            console.log('%cApp.vue line:66 res', 'color: #26bfa5;', res)
          )
          .catch((err) =>
            console.log(
              '%cerror App.vue line:71 ',
              'color: red; display: block; width: 100%;',
              err
            )
          );
      }
    });
    return {
      auth,
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
</style>
