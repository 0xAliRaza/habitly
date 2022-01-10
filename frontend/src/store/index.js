import habits from './modules/habits';
import stacks from './modules/stacks';
import intentions from './modules/intentions';
import { createStore } from 'vuex';

export default createStore({
  state: {
    errors: [],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: { habits, stacks, intentions },
});
