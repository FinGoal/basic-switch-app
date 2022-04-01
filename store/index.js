export const state = () => ({
  user: null,
  plaidMeta: null
});

export const mutations = {
  setUser(state, user) {
    state.user = user;

    if (window) {
      console.log(window.localStorage);
      localStorage.setItem("fin-switch-user", JSON.stringify(user));
    } else {
      console.log("NO window")
    }
  },
  setPlaidMeta(state, data) {
    state.plaidMeta = data;
    if (window) {
      console.log(window.localStorage);
      localStorage.setItem("fin-plaid-meta", JSON.stringify(data));
    } else {
      console.log("NO window")
    }
  },
  setUserFromStorage(state) {
    if (window) {
      const user = window.localStorage.getItem("fin-switch-user");
      if (user) {
        state.user = JSON.parse(user);
      }
    } else {
      throw new Error("Window not found.");
    }
  },
  setPlaidMetaFromStorage(state) {
    if (window) {
      const meta = window.localStorage.getItem("fin-plaid-meta");
      if (meta) {
        state.plaidMeta = JSON.parse(meta);
      }
    } else {
      throw new Error("Window not found.");
    }
  }
}