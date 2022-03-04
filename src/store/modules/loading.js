const state = {
  loading: 0
}

const mutations = {
  SHOW_LOADING: state => {
    state.loading++
  },
  HIDE_LOADING: state => {
    if (state.loading === 0) {
      return
    }
    state.loading--
  },
  CLEAN_LOADING: state => {
    state.loading = 0
  }
}

const actions = {
  show({ commit }) {
    commit('SHOW_LOADING')
  },
  hide({ commit }) {
    commit('HIDE_LOADING')
  },
  clean({ commit }) {
    commit('CLEAN_LOADING')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
