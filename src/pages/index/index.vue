<template>
  <div class="container">
    <custom-navigation :showBack="false"></custom-navigation>
    <div class="flex-contain">
      <div class="flex-top">
        <index-tab :curr="indexTab" @selectTab="choseTab"></index-tab>
      </div>
      <div class="index-warp flex-main">
        <!--<swiper class="cont" v-bind:style="{ height: swiperHei[indexTab] }" @change="switchItem($event)" :current="currentTab" duration="300" skip-hidden-item-layout="true">-->
        <swiper class="cont" @change="switchItem($event)" :current="currentTab" duration="300" skip-hidden-item-layout="true">
          <swiper-item>
            <scroll-view class='scroll-view' scroll-y="true" @scrolltolower="getMore">
              <div class="news-list">
                <news-item v-for="(item, index) in newsList" :key="index" :item="item" :index="index"></news-item>
              </div>
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view class='scroll-view' scroll-y="true" @scrolltolower="getMore" >
              <div class="video-list">
                <video-item v-for="(item, index) in videoList" :key="index" :item="item" :index="index"></video-item>
              </div>
            </scroll-view>
          </swiper-item>
        </swiper>
      </div>
      <div class="flex-bottom">
        <tab-bar curr="home"></tab-bar>
      </div>
    </div>
    <auth-modal :isShow="showModal" @okClick="closeModal" @getInfo="setUserInfo"></auth-modal>
  </div>
</template>

<script>
  import tabBar from '@/components/tabBar'
  import indexTab from '@/components/index-tab'
  import newsItem from '@/components/news-item'
  import videoItem from '@/components/video-item'
  import authModal from '@/components/auth-modal'
  import customNavigation from '@/components/custom-navigation'
  import videoStore from './videoStore'
  import store from './store'
  import loginStore from '../../store/login'

  export default {
    data () {
      return {
        tab: ['news', 'video'],
        indexTab: 'news',
        showModal: false,
        wxUserInfo: null
      }
    },

    computed: {
      newsList () {
        return store.state.newsList
      },
      videoList () {
        return videoStore.state.newsList
      },
      currentTab () {
        return this.tab.indexOf(this.indexTab)
      },
      swiperHei () {
        return {
          news: `${this.newsList.length * 246}rpx`,
          video: `${this.videoList.length * 525}rpx`
        }
      }
    },

    components: {
      tabBar,
      indexTab,
      newsItem,
      videoItem,
      authModal,
      customNavigation
    },

    methods: {
      // 新闻列表
      getNewsList (obj, fn) {
        // store.commit('increment')
        store.dispatch('getNewsList', obj).then((res) => {
          if (fn) {
            fn()
          }
        })
      },
      // 视频列表
      getVideoList (obj, fn) {
        // store.commit('increment')
        videoStore.dispatch('getList', obj).then((res) => {
          if (fn) {
            fn()
          }
        })
      },
      // 点击切换
      choseTab (type) {
        /* wx.pageScrollTo({
          scrollTop: 300,
          duration: 0
        }) */
        this.indexTab = type
        if (type === 'news') {
          this.getNewsList({currentPage: 1})
        } else {
          this.getVideoList({currentPage: 1})
        }
      },
      // 滑动切换
      switchItem: function (res) {
        let oIndex = res.mp.detail.current
        this.indexTab = this.tab[oIndex]
        if (this.tab[oIndex] === 'news') {
          this.getNewsList({currentPage: 1})
        } else {
          this.getVideoList({currentPage: 1})
        }
      },
      // 加载更多
      getMore () {
        if (this.indexTab === 'news') {
          const {currentPage, pageCount} = store.state.pageInfo
          if (currentPage <= pageCount) {
            this.getNewsList({currentPage: currentPage})
          }
        } else {
          const {currentPage, pageCount} = videoStore.state.pageInfo
          if (currentPage > pageCount) {
            return
          }
          this.getVideoList({currentPage: currentPage})
        }
      },
      // 关闭弹窗
      closeModal () {
        this.showModal = false
      },
      setUserInfo (res) {
        loginStore.dispatch('setUserInfo', res.userInfo)
        loginStore.dispatch('setStateData', {encryptedData: res.encryptedData, iv: res.iv, hasAuth: true})
        this.wxUserInfo = {
          ...this.wxUserInfo,
          ...res
        }
        this.wxLogin()
      },
      // 微信登录
      wxLogin () {
        // 根据登录状态，是否调用登录接口
        wx.login({
          success: (res) => {
            this.wxUserInfo.code = res.code
            // console.log(res)
            loginStore.dispatch('setStateData', {code: res.code})
            // 获取unionid
            this.getUnionid()
          }
        })
      },
      getUnionid () {
        // const {code, encryptedData, iv} = this.wxUserInfo
        const {code, encryptedData, iv} = loginStore.state
        let obj = {
          code: !code ? loginStore.state.this.wxUserInfo.code : code,
          encryptedData: !encryptedData ? loginStore.state.encryptedData : encryptedData,
          iv: !iv ? loginStore.state.iv : iv
        }
        loginStore.dispatch('getUnionid', obj)
      },
      // 判断是否授权
      getSetting () {
        let self = this
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 用户已经授权过
              // console.log('用户已经授权过')
              if (!loginStore.state.hasAuth || !loginStore.state.unionid) {
                console.log('授权但没有授权数据')
                self.showModal = true
                return
              }
              if (!loginStore.state.login) {
                wx.showToast({
                  title: '你还没有绑定手机号码',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              // console.log('用户还未授权过')
              // 弹窗
              self.showModal = true
            }
          }
        })
      }
    },
    onShow () {
      // wx.clearStorage()
      this.getNewsList({currentPage: 1})
      this.getVideoList({currentPage: 1})
      // 调用应用实例的方法获取全局数据
      this.getSetting()
    },

    // 分享
    onShareAppMessage: function (res) {
      let obj = {
        title: '火星精选',
        path: 'pages/index/main',
        imageUrl: ''
      }
      if (res.from === 'button') {
        // 来自页面内转发按钮
        // console.log(res.target)
        let currItem = this.videoList[res.target.id]
        obj = {
          title: currItem.title,
          path: `pages/videoDetail/main?id=${currItem.id}&time=${currItem.publishTime}`,
          imageUrl: !currItem.coverPic ? '' : JSON.parse(currItem.coverPic).video_m
        }
      }
      return obj
    }

    // 下拉刷新
    /* async onPullDownRefresh () {
      if (this.indexTab === 'news') {
        this.getNewsList({currentPage: 1}, () => {
          // 停止下拉刷新
          wx.stopPullDownRefresh()
        })
      } else {
        this.getVideoList({currentPage: 1}, () => {
          // 停止下拉刷新
          wx.stopPullDownRefresh()
        })
      }
    }, */

    // 上拉加载，拉到底部触发
    /* onReachBottom () {
      if (this.indexTab === 'news') {
        const {currentPage, pageCount} = store.state.pageInfo
        if (currentPage <= pageCount) {
          this.getNewsList({currentPage: currentPage})
        }
      } else {
        const {currentPage, pageCount} = videoStore.state.pageInfo
        if (currentPage > pageCount) {
          return
        }
        this.getVideoList({currentPage: currentPage})
      }
    }, */
  }
</script>

<style scoped lang="scss">
  .index-warp {
    width: 100%;

    .news-list {
      background-color: #fff;
    }

    .video-list {
      background-color: #eaeaea;
    }

    .scroll-view {
      height: 100%;
    }
  }
</style>
