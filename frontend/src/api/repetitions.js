import instance from './base';
export default {
  index(params) {
    return instance.get(`repetitions/`, { params });
  },
  delete(pk) {
    return instance.delete(`repetitions/${pk}/`);
  },
};
