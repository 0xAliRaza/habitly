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
    <router-view></router-view>
  </main>

  <footer class="bg-dark mt-auto py-3">
    <div class="container">
      <span class="text-light">Coded by Ali Raza.</span>
    </div>
  </footer>

  <!-- <div>
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
  </div> -->
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
@import 'bootstrap/scss/bootstrap.scss';
body {
  background-color: $color-body-bg;
}
</style>
