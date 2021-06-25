import store from '@/store';
export const guard = async function (to, from, next) {
  if (store.getters['user/isAuthenticated']) {
    return next(); // allow to enter route
  } else {
    return next({ name: 'Login', query: { redirectTo: to.fullPath } });
  }
};
