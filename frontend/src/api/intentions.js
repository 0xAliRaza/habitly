import instance from './base';
export default {
  index(params = {}) {
    return instance.get('intentions/', { params });
  },
  create(data) {
    return instance.post('intentions/', data);
  },
  update(pk, data) {
    return instance.put(`intentions/${pk}/`, data);
  },
  delete(pk) {
    return instance.delete(`intentions/${pk}/`);
  },
  deleteCompleted(pk) {
    return instance.delete(`intentions/${pk}/?completed=1`);
  },
};
