import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || ''
  },
  mutations: {
    auth_success(state){
      state.token = localStorage.getItem('user-token')
    },
    logout(state){
      state.token = ''
    }
  },
  actions: {
    login({commit}){
      commit('auth_success')
    },
    logout({commit}){
      commit('logout')
    }
  },
  getters: {
    isAuthentificated: state => !!state.token
  }
})
