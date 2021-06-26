import habits from '@/api/habits';
import repetitions from '@/api/repetitions';
import { DateTime } from 'luxon';

export default {
  namespaced: true,

  state: {
    refreshed: false,
    topRepeatedRefreshed: false,
    topStreakedRefreshed: false,
    models: [],
    topRepeated: [],
    topStreaked: [],
    errors: [],
  },
  getters: {
    good(state) {
      return state.models.filter((model) => model.type === 'G');
    },
    bad(state) {
      return state.models.filter((model) => model.type === 'B');
    },
    getIndex: (state) => (id) => {
      return state.models.findIndex((model) => model.id == id);
    },
    get: (state, getters) => (id) => {
      const i = getters.getIndex(id);
      if (i >= 0) {
        return state.models[i];
      }
      return null;
    },
  },
  mutations: {
    markAsRefreshed(state) {
      state.refreshed = true;
    },
    reset(state, payload) {
      state.models = [];
    },
    add(state, payload) {
      state.models.push(...payload.models);
    },
    update(state, payload) {
      if (payload.index >= 0 && payload.model) {
        state.models[payload.index] = payload.model;
      }
    },
    remove(state, payload) {
      if (payload.index >= 0) {
        state.models.splice(payload.index, 1);
      }
    },
    incrementRepetitions(state, payload) {
      if (payload.index >= 0) {
        state.models[payload.index].repetitions++;
      }
    },
    decrementRepetitions(state, payload) {
      if (payload.index >= 0) {
        state.models[payload.index].repetitions--;
      }
    },
    updateTodaysRepetition(state, payload) {
      if (payload.index >= 0) {
        state.models[payload.index].todays_repetition = payload.repetition;
        if (payload.repetition) {
          state.models[payload.index].repetitions++;
        } else {
          state.models[payload.index].repetitions--;
        }
      }
    },
    setTopRepeated(state, payload) {
      state.topRepeated = payload.models;
      state.topRepeatedRefreshed = true;
    },
    setTopStreaked(state, payload) {
      state.topStreaked = payload.models;
      state.topRepeatedRefreshed = true;
    },
  },
  actions: {
    async refresh({ commit, state }) {
      commit('reset');
      const models = (await habits.index()).data;
      commit('add', { models: models });
      commit('markAsRefreshed');
      return models;
    },
    async refreshTopRepeated({ state, commit }) {
      const models = state.models;
      let sorted = models.sort((a, b) => b.repetitions - a.repetitions);
      sorted = sorted.slice(0, 5);
      commit('setTopRepeated', { models: sorted });
    },
    async refreshTopStreaked({ state, commit }) {
      const models = state.models;
      let sorted = models.sort((a, b) => b.streak - a.streak);
      sorted = sorted.slice(0, 5);
      commit('setTopStreaked', { models: sorted });
    },
    async create({ commit, getters }, payload) {
      const model = (await habits.create(payload.formData)).data;
      commit('add', { models: [model] });
      return model;
    },
    async update({ commit, getters, dispatch }, payload) {
      const i = getters.getIndex(payload.pk);
      const model = (await habits.update(payload.pk, payload.formData)).data;
      commit('update', { index: i, model: model });
      await dispatch('intentions/refresh', null, { root: true });
      await dispatch('stacks/refresh', null, { root: true });
      return model;
    },
    async delete({ commit, getters, dispatch }, payload) {
      const i = getters.getIndex(payload.pk);
      await habits.delete(payload.pk);
      commit('remove', { index: i });
      await dispatch('intentions/refresh', null, { root: true });
      await dispatch('stacks/refresh', null, { root: true });
      return i;
    },
    async createRepetition({ commit, getters }, payload) {
      const repetition = (await repetitions.create(payload.repetition)).data;
      const index = getters.getIndex(payload.habit);

      if (
        DateTime.fromJSDate(new Date(payload.repetition.date)).toISODate() ===
        DateTime.now().toISODate()
      ) {
        commit('updateTodaysRepetition', {
          repetition: repetition,
          index: index,
        });
      } else {
        commit('incrementRepetitions', { index });
      }
    },
    async deleteRepetition({ commit, getters }, payload) {
      await repetitions.delete(payload.pk);
      const index = getters.getIndex(payload.habit);
      if (
        payload.repetition &&
        DateTime.fromJSDate(new Date(payload.repetition.date)).toISODate() ===
          DateTime.now().toISODate()
      ) {
        commit('updateTodaysRepetition', { repetition: null, index: index });
      } else {
        commit('decrementRepetitions', { index });
      }
    },
  },
};
