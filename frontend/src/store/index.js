import habits from './modules/habits';
import stacks from './modules/stacks';
import user from './modules/user';
import { createStore } from 'vuex';

export default createStore({
  state: {
    errors: [],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: { habits, stacks, user },
});
