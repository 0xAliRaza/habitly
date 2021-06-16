import habits from '@/api/habits';

export default {
  namespaced: true,

  state: {
    models: [],
    errors: [],
  },
  getters: {
    good(state) {
      return state.models.filter((habit) => habit.type === 'G');
    },
    bad(state) {
      return state.models.filter((habit) => habit.type === 'B');
    },
    getIndex: (state) => (id) => {
      return state.models.findIndex((habit) => habit.id === id);
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
      const models = (await habits.index()).data;
      commit('add', { models: models });
      return models;
    },
    async create({ commit, getters }, payload) {
      const model = (await habits.create(payload.formData)).data;
      commit('add', { models: [model] });
      return model;
    },
    async update({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      const model = (await habits.update(payload.pk, payload.formData)).data;
      commit('update', { index: i, model: model });
      return model;
    },
    async delete({ commit, getters }, payload) {
      const i = getters.getIndex(payload.pk);
      await habits.delete(payload.pk);
      commit('remove', { index: i });
      return i;
    },
  },
};
