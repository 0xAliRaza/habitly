import instance from './base';
export default {
  index(params = {}) {
    return instance.get(`repetitions/`, { params });
  },
  create(formData) {
    return instance.post(`repetitions/`, formData);
  },
  delete(pk) {
    return instance.delete(`repetitions/${pk}/`);
  },
};
