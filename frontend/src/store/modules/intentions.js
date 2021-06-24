import intentions from '@/api/intentions';

export default {
  namespaced: true,

  state: {
    completedRefreshed: false,
    models: [],
    completedModels: [],
    errors: [],
  },
  getters: {
    getIndex: (state) => (id) => {
      return state.models.findIndex((model) => model.id === id);
    },
    getCompletedIndex: (state) => (id) => {
      return state.completedModels.findIndex((model) => model.id === id);
    },
  },
  mutations: {
    reset(state) {
      state.models = [];
    },
    resetCompleted(state) {
      state.completedModels = [];
    },
    completedModelsRefreshed(state) {
      state.completedRefreshed = true;
    },
    addCompleted(state, payload) {
      state.completedModels.push(...payload.models);
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
    removeCompleted(state, payload) {
      if (payload.index >= 0) {
        state.completedModels.splice(payload.index, 1);
      }
    },
  },
  actions: {
    async refresh({ commit, state }) {
      commit('reset');
      const models = (await intentions.index()).data;
      commit('add', { models: models });
      return models;
    },
    async refreshCompleted({ commit, state }) {
      commit('resetCompleted');
      const models = (await intentions.indexCompleted()).data;
      commit('addCompleted', { models: models });
      commit('completedModelsRefreshed');

      return models;
    },
    async create({ commit, getters }, payload) {
      const model = (await intentions.create(payload.formData)).data;
      commit('add', { models: [model] });
      return model;
    },
    async update({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      const model = (await intentions.update(payload.pk, payload.formData))
        .data;
      if (!model.done) {
        commit('update', { index: i, model: model });
      } else {
        commit('remove', { index: i });
        commit('addCompleted', { models: [model] });
      }
      return model;
    },
    async delete({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      await intentions.delete(payload.pk);
      commit('remove', { index: i });
      return i;
    },
    async deleteCompleted({ commit, getters }, payload) {
      const i = getters.getCompletedIndex(payload.pk);
      await intentions.deleteCompleted(payload.pk);
      commit('removeCompleted', { index: i });
      return i;
    },
  },
};
