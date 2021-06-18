import instance from './base';
export default {
  index() {
    return instance.get('intentions/');
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
};
