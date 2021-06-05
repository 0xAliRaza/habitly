<template>
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
      @click="logout()"
    >
      Log Out
    </button>
    {{ message }}
  </div>
</template>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
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
