import Vue from 'vue'
import Vuex from 'vuex'
import {ajax} from '../../utils/index'

Vue.use(Vuex)
const GET_INFO = 'GET_VIDEO_INFO'
const GET_LIST = 'GET_AUTHOR_VIDEO'
const GET_REPLY = 'GET_VIDEO_REPLY'

const store = new Vuex.Store({
  state: {
    info: null,
    list: [],
    reply: {
      pageInfo: {
        currentPage: 1,
        pageSize: 5,
        pageCount: 0,
        currentTime: new Date().getTime()
      },
      list: []
    }
  },
  mutations: {
    [GET_INFO]: (state, obj) => {
      state.info = {
        ...obj.current,
        videoUrl: !obj.current.url ? '' : JSON.parse(obj.current.url)[0].fileUrl,
        videoImg: !obj.current.coverPic ? '' : JSON.parse(obj.current.coverPic).video_m
      }
    },
    [GET_LIST]: (state, list) => {
      state.list = list
    },
    [GET_REPLY]: (state, obj) => {
      let list = !obj.inforList || !obj.inforList.length ? [] : obj.inforList
      state.reply.pageInfo = {
        ...state.reply.pageInfo,
        currentPage: obj.currentPage,
        pageCount: obj.pageCount,
        currentTime: obj.currentTime
      }
      if (obj.currentPage === 1) {
        state.reply.list = list
      } else {
        state.reply.list = [
          ...state.reply.list,
          ...list
        ]
      }
    }
  },
  actions: {
    getVideoInfo ({commit}, obj) {
      return new Promise((resolve, reject) => {
        ajax({
          type: 'get',
          url: '/info/video/getvideocontext',
          // url: '/info/video/getvideolist',
          formData: false,
          params: {
            ...obj
          },
          fn: function (res) {
            console.log('/info/video/getvideocontext', obj, res)
            resolve(res.obj.current)
            if (res.code === 1) {
              commit(GET_INFO, {...res.obj})
            }
          }
        })
      })
    },
    getAuthorVideo ({commit, state}, obj) {
      let sendData = {
        id: '',
        author: '',
        recordCount: 20,
        ...obj
      }
      ajax({
        type: 'get',
        url: '/info/video/miniappvideo//getuservideolist',
        // url: '/info/video/getvideolist',
        formData: false,
        params: {
          ...sendData
        },
        fn: function (res) {
          console.log(res)
          if (res.code === 1) {
            // let list = !res.obj.inforList || !res.obj.inforList.length ? [] : res.obj.inforList
            let list = res.obj
            list = [
              state.info,
              ...list
            ]
            commit(GET_LIST, list)
          }
        }
      })
    },
    getVideoReply ({commit, state}, obj) {
      const {currentPage, pageSize} = state.reply.pageInfo
      let sendData = {
        currentPage: currentPage,
        pageSize: pageSize,
        ...obj
      }
      ajax({
        type: 'get',
        url: '/info/comment/getbyarticle',
        formData: false,
        params: {
          ...sendData
        },
        fn: function (res) {
          console.log(res)
          if (res.code === 1) {
            commit(GET_REPLY, {...res.obj, currentPage: sendData.currentPage})
          }
        }
      })
    }
  }
})

export default store
