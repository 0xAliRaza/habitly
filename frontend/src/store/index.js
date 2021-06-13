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
      console.log('inside addHabits', habits);
      state.habits.push(...habits);
    },
    setUser(state, user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = {};
    },
  },
  actions: {
    getHabits({ commit, state }) {
      habits
        .index()
        .then((res) => {
          console.log(res.data);
          commit('addHabits', res.data);
        })
        .catch((err) => {
          state.errors.push(err);
        });
    },
  },
  modules: {},
});
