<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>

  <div>
    <button
      class="btn btn-primary btn-margin"
      v-if="!authenticated"
      @click="login()"
    >
      Log In
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
      @click="logout()"
    >
      Log Out
    </button>
    {{ message }}
    <br />
  </div>
  <hr />

  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

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
  },
};
</script>
