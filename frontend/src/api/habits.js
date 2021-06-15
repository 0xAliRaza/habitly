import instance from './base';
export default {
  index() {
    return instance.get('habits/');
  },
  create(data) {
    return instance.post('habits/', data);
  },
  update(data, pk) {
    return instance.put(`habits/${pk}/`, data);
  },
  delete(pk) {
    return instance.delete(`habits/${pk}/`);
  },
};
