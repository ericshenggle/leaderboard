import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: false, // user is authenticated or not
      user: {
        userId: 1,
        username: 'user1',
      }, // user info
    };
  },
  mutations: {
    login(state, user) {
      state.isAuthenticated = true;
      state.user = user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  actions: {
    // write your actions here
  },
});
