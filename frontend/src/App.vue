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
        <li class="nav-item">
          <a class="nav-link" href="#">Test</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Profile</a>
        </li>
      </ul>
    </div>
  </nav>

  <main class="my-5">
    <div>
      <button
        class="btn btn-primary btn-margin"
        v-if="!authenticated"
        @click="login()"
      >
        Log In
      </button>

      <button class="btn btn-primary btn-margin" @click="publicMessage()">
        Call Public
      </button>
      <button
        class="btn btn-primary btn-margin"
        v-if="authenticated"
        @click="privateMessage()"
      >
        Call Private
      </button>
      <button
        class="btn btn-primary btn-margin"
        v-if="authenticated"
        @click="habits()"
      >
        Habits
      </button>

      <button
        class="btn btn-primary btn-margin"
        v-if="authenticated"
        @click="logout()"
      >
        Log Out
      </button>
      {{ message }}
    </div>
    <router-view></router-view>
  </main>

  <footer class="bg-dark mt-auto py-3">
    <div class="container">
      <span class="text-light">Coded by Ali Raza.</span>
    </div>
  </footer>
</template>

<script>
import AuthService from './auth/AuthService';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const auth = new AuthService();

export default {
  name: 'app',
  data() {
    this.handleAuthentication();
    this.authenticated = false;

    auth.authNotifier.on('authChange', (authState) => {
      this.authenticated = authState.authenticated;
    });

    return {
      authenticated: false,
      message: '',
    };
  },
  methods: {
    // this method calls the AuthService login() method
    login() {
      auth.login();
    },
    handleAuthentication() {
      auth.handleAuthentication();
    },
    logout() {
      auth.logout();
    },
    privateMessage() {
      const url = `${API_URL}/api/private/`;
      return axios
        .get(url, {
          headers: { Authorization: `Bearer ${auth.getAuthToken()}` },
        })
        .then((response) => {
          console.log(response.data);
          this.message = response.data || '';
        });
    },
    habits() {
      const url = `${API_URL}/api/habits/`;
      return axios
        .get(url, {
          headers: { Authorization: `Bearer ${auth.getAuthToken()}` },
        })
        .then((response) => {
          console.log(response.data);
          this.message = response.data || '';
        });
    },
    publicMessage() {
      const url = `${API_URL}/api/public/`;
      return axios.get(url).then((response) => {
        console.log(response.data);
        this.message = response.data || '';
      });
    },
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
  scrollbar-width: thin;
  scrollbar-color: $gray-500 $gray-200;
}

/* Works on Chrome/Edge/Safari */
*::-webkit-scrollbar {
  width: pxToRem(10);
  height: pxToRem(10);
}
*::-webkit-scrollbar-track {
  background: $gray-200;
}
*::-webkit-scrollbar-thumb {
  background-color: $gray-500;
  border-radius: pxToRem(6);
}
</style>
