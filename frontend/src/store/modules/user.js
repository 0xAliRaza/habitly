export default {
  namespaced: true,
  state: {
    loading: false,
    authenticated: false,
    access_token: '',
    model: {},
    errors: [],
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticated && !state.loading;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.model = payload.user;
    },
    setAuthentication(state, payload) {
      state.authenticated = payload.authenticated;
    },
    setAccessToken(state, payload) {
      state.access_token = payload.access_token;
      console.log(
        '%cuser.js line:19 payload.access_token',
        'color: #007acc;',
        payload.access_token
      );
    },
    setLoading(state, payload) {
      state.loading = payload.loading;
    },
    setErrors(state, payload) {
      state.errors.push(...payload.errors);
    },
    clearErrors(state) {
      state.errors = [];
    },
    resetAuthentication(state) {
      state.model = {};
      state.access_token = '';
      state.authenticated = false;
    },
  },
  actions: {},
};
