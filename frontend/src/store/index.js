import habits from './modules/habits';
import stacks from './modules/stacks';
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {},
    errors: [],
  },
  getters: {},
  mutations: {
    setUser(state, user) {
      state.user = user;
      console.log(
        '%cindex.js line:24 user.access_token',
        'color: white; background-color: #26bfa5;',
        user.access_token
      );
    },
    removeUser(state) {
      state.user = {};
    },
  },
  actions: {},
  modules: { habits, stacks },
});
