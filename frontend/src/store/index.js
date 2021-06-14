import habits from '@/api/habits';
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {},
    habits: [],
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
      console.log(
        '%cindex.js line:44 i',
        'color: white; background-color: #26bfa5;',
        payload.pk
      );
      if (payload.pk > -1) {
        state.habits.splice(payload.pk, 1);
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
  },
  modules: {},
});
