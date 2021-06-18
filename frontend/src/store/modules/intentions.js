import intentions from '@/api/intentions';

export default {
  namespaced: true,

  state: {
    models: [],
    errors: [],
  },
  getters: {
    getIndex: (state) => (id) => {
      return state.models.findIndex((model) => model.id === id);
    },
  },
  mutations: {
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
  },
  actions: {
    async refresh({ commit, state }) {
      const models = (await intentions.index()).data;
      commit('add', { models: models });
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
      commit('update', { index: i, model: model });
      return model;
    },
    async delete({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      await intentions.delete(payload.pk);
      commit('remove', { index: i });
      return i;
    },
  },
};
