import habits from '@/api/habits';
import stacks from '@/api/stacks';
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {},
    habits: [],
    stacks: [],
    errors: [],
  },
  getters: {
    goodHabits(state) {
      return state.habits.filter((habit) => habit.type === 'G');
    },
    badHabits(state) {
      return state.habits.filter((habit) => habit.type === 'B');
    },
    habitIndex: (state) => (id) => {
      return state.habits.findIndex((habit) => habit.id === id);
    },
    stackIndex: (state) => (id) => {
      return state.stacks.findIndex((stack) => stack.id === id);
    },
  },
  mutations: {
    addHabits(state, habits) {
      state.habits.push(...habits);
    },
    updateHabit(state, payload) {
      if (payload.index >= 0 && payload.habit) {
        state.habits[payload.index] = payload.habit;
      }
    },
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
    removeHabit(state, payload) {
      if (payload.pk > -1) {
        state.habits.splice(payload.pk, 1);
      }
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
    async getHabits({ commit, state }) {
      const _habits = (await habits.index()).data;
      commit('addHabits', _habits);
      return _habits;
    },
    async addHabit({ dispatch }, payload) {
      let _habit;
      if (payload.pk) {
        _habit = await dispatch('updateHabit', payload);
      } else {
        _habit = await dispatch('createHabit', payload);
      }
      return _habit;
    },
    async createHabit({ commit, getters }, payload) {
      const _habit = (await habits.create(payload.formData)).data;
      commit('addHabits', [_habit]);
      return _habit;
    },
    async updateHabit({ commit, getters }, payload) {
      const i = getters.habitIndex(payload.pk);
      const _habit = (await habits.update(payload.formData, payload.pk)).data;
      commit('updateHabit', { index: i, habit: _habit });
      return _habit;
    },
    async deleteHabit({ commit, getters }, payload) {
      const i = getters.habitIndex(payload.pk);
      await habits.delete(payload.pk);
      commit('removeHabit', { pk: i });
      return i;
    },
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
  modules: {},
});
