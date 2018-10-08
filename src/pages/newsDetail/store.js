import Vue from 'vue'
import Vuex from 'vuex'
import {ajax} from '../../utils/index'

Vue.use(Vuex)
const GET_INFO = 'GET_VIDEO_INFO'
const GET_REPLY = 'GET_VIDEO_REPLY'
const GET_RELATE_NEWS = 'GET_RELATE_NEWS'

const store = new Vuex.Store({
  state: {
    info: null,
    list: [],
    RelatedNews: [],
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
        ...obj.current
      }
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
    },
    [GET_RELATE_NEWS]: (state, list) => {
      state.RelatedNews = list
    }
  },
  actions: {
    getNewsInfo ({commit}, obj) {
      return new Promise((resolve, reject) => {
        ajax({
          type: 'get',
          url: '/info/news/getbyid',
          // url: '/info/video/getvideolist',
          formData: false,
          params: {
            ...obj
          },
          fn: function (res) {
            console.log(res)
            resolve(res.obj)
            if (res.code === 1) {
              commit(GET_INFO, {...res.obj})
            }
          }
        })
      })
    },
    getNewsReply ({commit, state}, obj) {
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
    },
    getRelatedNews ({commit}, obj) {
      let sendData = {
        tags: '',
        newsCount: 6,
        id: '',
        ...obj
      }
      ajax({
        type: 'get',
        url: '/info/news/relatednews',
        formData: false,
        params: {
          ...sendData
        },
        fn: function (res) {
          console.log(res)
          if (res.code === 1) {
            let list = !res.obj.inforList || !res.obj.inforList.length ? [] : res.obj.inforList
            commit(GET_RELATE_NEWS, list)
          }
        }
      })
    }
  }
})

export default store
