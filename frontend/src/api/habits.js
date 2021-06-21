import instance from './base';
export default {
  get(pk) {
    return instance.get(`habits/${pk}/`);
  },
  index() {
    return instance.get('habits/');
  },
  create(data) {
    return instance.post('habits/', data);
  },
  update(pk, data) {
    return instance.put(`habits/${pk}/`, data);
  },
  delete(pk) {
    return instance.delete(`habits/${pk}/`);
  },
};
