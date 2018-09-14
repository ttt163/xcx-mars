import Vue from 'vue'
import Vuex from 'vuex'
import {ajax} from '../../utils/index'

Vue.use(Vuex)
const GET_LIST = 'GET_VIDEO_LIST'

const store = new Vuex.Store({
  state: {
    newsList: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 6,
      refreshTime: '',
      currentTime: new Date().getTime(),
      pageCount: 0,
      recordCount: 0
    }
  },
  mutations: {
    [GET_LIST]: (state, obj) => {
      // console.log(state)
      let list = !obj.inforList || !obj.inforList ? [] : obj.inforList
      const {pageCount, recordCount, currentTime, currentPage} = obj
      if (currentPage === 1) {
        state.newsList = list
      } else {
        state.newsList = [
          ...state.newsList,
          ...list
        ]
      }
      state.pageInfo = {
        ...state.pageInfo,
        currentPage: currentPage + 1,
        currentTime: currentTime,
        pageCount: pageCount,
        recordCount: recordCount,
        refreshTime: list.length > 1 ? list[list.length - 1].publishTime : ''
      }
    }
  },
  actions: {
    getList ({commit, state}, obj) {
      const {currentPage, pageSize, refreshTime} = state.pageInfo
      let sendData = {
        currentPage: currentPage,
        pageSize: pageSize,
        ...obj
      }
      if (sendData.currentPage > 1) {
        sendData = {
          ...sendData,
          refreshTime: refreshTime
        }
      }
      return new Promise((resolve, reject) => {
        ajax({
          type: 'get',
          url: '/info/video/miniappvideo/list',
          // url: '/info/video/getvideolist',
          formData: false,
          params: {
            ...sendData
          },
          fn: function (res) {
            console.log(res)
            resolve(res)
            if (res.code === 1) {
              commit(GET_LIST, {...res.obj, currentPage: sendData.currentPage})
            }
          }
        })
      })
    }
  }
})

export default store
