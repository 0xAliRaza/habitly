import store from '@/store/index.js';

import createAuth0Client from '@auth0/auth0-spa-js';
export const setupAuth = async function (options, callbackRedirect) {
  store.commit('user/setLoading', { loading: true });
  let client;
  try {
    /* Crate Auth0 client using provided config */
    client = await createAuth0Client({ ...options });
  } catch (e) {
    alert('Connection error occurred!');
  }
  try {
    // If the user is returning to the app after authentication
    if (
      window.location.search.includes('code=') &&
      window.location.search.includes('state=')
    ) {
      // handle the redirect and retrieve tokens
      const { appState } = await client.handleRedirectCallback();

      store.commit('user/clearErrors');

      // Notify subscribers that the redirect callback has happened, passing the appState
      // (useful for retrieving any pre-authentication state)
      callbackRedirect(appState);
    }
  } catch (e) {
    store.commit('user/setErrors', { errors: [e] });
  } finally {
    // Initialize our internal authentication state
    const authenticated = await client.isAuthenticated();

    // Mutate vuex store
    store.commit('user/setAuthentication', { authenticated: authenticated });
    if (authenticated === true) {
      const user = await client.getUser();
      store.commit('user/setUser', { user: user });
      const access_token = await client.getTokenSilently();
      store.commit('user/setAccessToken', { access_token: access_token });
    } else {
      // If user is not authenticated, reset all the store data related to the user
      store.commit('user/resetAuthentication');
    }
    store.commit('user/setLoading', { loading: false });
  }

  // Return auth0 spa-js client
  return client;
};
