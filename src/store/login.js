import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {ajax} from '../utils/index'

Vue.use(Vuex)
const SET_LOGIN_INFO = 'SET_LOGIN_INFO'
const SET_WX_USER_INFO = 'SET_WX_USER_INFO'
const SET_STATE_DATA = 'SET_STATE_DATA'

const store = new Vuex.Store({
  state: {
    login: false, // 是否登录
    hasAuth: false, // 是否授权
    loginInfo: null,
    wxInfo: null,
    code: '',
    encryptedData: '',
    iv: '',
    unionid: ''
  },
  mutations: {
    [SET_LOGIN_INFO]: (state, obj) => {
      state.loginInfo = {
        ...obj
      }
    },
    [SET_WX_USER_INFO]: (state, obj) => {
      state.wxInfo = {
        ...obj
      }
    },
    [SET_STATE_DATA]: (state, obj) => {
      for (let [key, value] of Object.entries(obj)) {
        state[key] = value
      }
    }
  },
  actions: {
    setLoginInfo ({commit}, obj) {
      commit('SET_LOGIN_INFO', obj)
    },
    setUserInfo ({commit}, obj) {
      commit('SET_WX_USER_INFO', obj)
    },
    setStateData ({commit}, obj) {
      commit('SET_STATE_DATA', obj)
    },
    clearLoginInfo ({commit}, obj) {
      obj = {
        login: false, // 是否登录
        hasAuth: false, // 是否授权
        loginInfo: null,
        wxInfo: null,
        unionid: '',
        code: '',
        encryptedData: '',
        iv: '',
        ...obj
      }
      commit('SET_STATE_DATA', obj)
    },
    // 解密unionid
    getUnionid ({commit, dispatch}, obj) {
      return new Promise((resolve, reject) => {
        ajax({
          type: 'post',
          url: '/passport/account/decodeUserInfo',
          params: obj,
          contentType: 'application/x-www-form-urlencoded',
          fn: function (res) {
            console.log('/passport/account/decodeUserInfo', obj, res)
            resolve(res)
            if (res.code === 1) {
              /* if (!res.obj.userInfo || !res.obj.userInfo.unionId) {
                return
              } */
              const {unionId, openId} = res.obj.userInfo
              commit(SET_STATE_DATA, {unionid: unionId, openid: openId})
              dispatch('hasBindWeChart', {unionid: unionId}).then((res) => {
                if (res.code !== 1) {
                  let page = `/pages/bindPhone/main`
                  wx.navigateTo({ url: page })
                }
              })
            }
          }
        })
      })
    },
    hasBindWeChart ({commit}, obj) {
      return new Promise((resolve, reject) => {
        ajax({
          type: 'post',
          url: '/passport/account/ifUntieweixin1',
          params: obj,
          contentType: 'application/x-www-form-urlencoded',
          fn: function (res) {
            console.log('/passport/account/ifUntieweixin1', obj, res)
            resolve(res)
            if (res.code === 1) {
              commit('SET_LOGIN_INFO', res.obj)
              commit('SET_STATE_DATA', {login: true})
            }
          }
        })
      })
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: () => {}
        // removeItem: () => wx.clearStorage()
      }
    })
  ]
})

export default store
