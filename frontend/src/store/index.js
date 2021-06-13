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
      return state.habits.filter((habit) => habit.id);
    },
    badHabits(state) {
      return state.habits.filter((habit) => habit.id);
    },
  },
  mutations: {
    addHabits(state, habits) {
      state.habits.push(...habits);
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
  },
  actions: {
    async getHabits({ commit, state }) {
      const _habits = (await habits.index()).data;
      commit('addHabits', _habits);
      return _habits;
    },
    async createHabit({ commit, state }, data) {
      const _habit = (await habits.create(data)).data;
      commit('addHabits', [_habit]);
      return _habit;
    },
  },
  modules: {},
});
