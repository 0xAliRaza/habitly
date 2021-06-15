import instance from './base';
export default {
  index() {
    return instance.get('stacks/');
  },
  create(data) {
    return instance.post('stacks/', data);
  },
  delete(pk) {
    return instance.delete(`stacks/${pk}/`);
  },
};
