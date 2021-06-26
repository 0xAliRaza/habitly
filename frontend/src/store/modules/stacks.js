import stacks from '@/api/stacks';

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
    reset(state) {
      state.models = [];
    },
    add(state, payload) {
      state.models.push(...payload.models);
    },
    remove(state, payload) {
      if (payload.index >= 0) {
        state.models.splice(payload.index, 1);
      }
    },
  },
  actions: {
    async refresh({ commit, state }) {
      commit('reset');
      const models = (await stacks.index()).data;
      commit('add', { models: models });
      return models;
    },
    async create({ commit, getters }, payload) {
      const model = (await stacks.create(payload.formData)).data;
      commit('add', { models: [model] });
      return model;
    },
    async delete({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      await stacks.delete(payload.pk);
      commit('remove', { index: i });
      return i;
    },
  },
};
