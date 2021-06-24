import habits from '@/api/habits';
import repetitions from '@/api/repetitions';
import { DateTime } from 'luxon';

export default {
  namespaced: true,

  state: {
    models: [],
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
  },
  actions: {
    async refresh({ commit, state }) {
      commit('reset');
      const models = (await habits.index()).data;
      commit('add', { models: models });
      return models;
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
