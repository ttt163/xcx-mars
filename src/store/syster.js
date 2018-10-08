import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const SET_SYSTER_INFO = 'SET_SYSTER_INFO'

const store = new Vuex.Store({
  state: {},
  mutations: {
    [SET_SYSTER_INFO]: (state, obj) => {
      for (let [key, value] of Object.entries(obj)) {
        state[key] = value
      }
    }
  },
  actions: {
    setSysterInfo ({commit}) {
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          commit('SET_SYSTER_INFO', res)
        }
      })
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        // removeItem: () => {}
        removeItem: () => wx.clearStorage()
      }
    })
  ]
})

export default store
