import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || '',
    role: localStorage.getItem('user-role') || ''
  },
  mutations: {
    auth_success(state){
      state.token = localStorage.getItem('user-token');
      state.role = localStorage.getItem('user-role')
    },
    logout(state){
      state.token = '';
      state.role = ''
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
    isAuthentificated: state => !!state.token,
    isAdmin: state => state.role === 'ADMIN'
  }
})
