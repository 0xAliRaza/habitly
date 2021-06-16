import habits from './modules/habits';
import stacks from '@/api/stacks';
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {},
    stacks: [],
    errors: [],
  },
  getters: {
    stackIndex: (state) => (id) => {
      return state.stacks.findIndex((stack) => stack.id === id);
    },
  },
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
    addStacks(state, payload) {
      state.stacks.push(...payload.stacks);
      console.log('stacks added', state.stacks);
    },
    removeStack(state, payload) {
      if (payload.pk > -1) {
        state.stacks.splice(payload.pk, 1);
      }
    },
  },
  actions: {
    async getStacks({ commit, state }) {
      const _stacks = (await stacks.index()).data;
      commit('addStacks', { stacks: _stacks });
      return _stacks;
    },
    async createStack({ commit, state }, payload) {
      const _stack = (await stacks.create(payload.formData)).data;
      commit('addStacks', { stacks: [_stack] });
      return _stack;
    },
    async deleteStack({ commit, getters }, payload) {
      const i = getters.stackIndex(payload.pk);
      await stacks.delete(payload.pk);
      commit('removeStack', { pk: i });
      return i;
    },
  },
  modules: { habits },
});
