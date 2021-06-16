import store from '@/store';
export const guard = async function (to, from, next) {
  if (store.getters['user/isAuthenticated']) {
    next(); // allow to enter route
  } else {
    next({ name: 'Login', query: { redirectTo: to.fullPath } });
  }
};
