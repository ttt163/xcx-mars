<template>
  <div class="container">
    <custom-navigation :showBack="true"></custom-navigation>
    <div class="video-warp">
      <video autoplay="autoplay" controls="controls" :src="videoInfo.videoUrl" :poster="videoInfo.videoImg"></video>
      <div class="video-mian">
        <div class="scroll-view-warp">
          <scroll-view class='scroll-view' scroll-y="true">
            <div class="video-contain">
              <h3 class="video-title">{{videoInfo.title}}</h3>
              <div class="video-info">
                <div class="left">
                  <div>{{videoInfo.nickName}}</div>
                  <div class="dot"></div>
                  <div>热度：{{videoInfo.hotCounts}}</div>
                </div>
                <button open-type="share" class="btn-share"><img src="../../img/icon-share2.png"/></button>
              </div>
            </div>
            <div class="video-other">
              <!--专辑列表-->
              <author-video :list="videoList" :currId="id" @toVideoDetail="toVideoDetail"></author-video>
              <!--精彩评论-->
              <reply :list="replyList" :hasMore="false"></reply>
            </div>
            <!--打开app-->
            <button :style="{display: !openAppFlag ? 'none' : 'block'}" class="open-app" open-type="launchApp" app-parameter="wechat" @error="launchAppError">打开APP</button>
          </scroll-view>
        </div>
      </div>
    </div>
    <!--回复-->
    <reply-flex type="video" :id="this.id" @callBack="getVideoReply"></reply-flex>
  </div>
</template>

<script>
  import replyFlex from '@/components/reply-flex'
  import reply from '@/components/reply'
  import authorVideo from '@/components/author-video'
  import customNavigation from '@/components/custom-navigation'
  import store from './store'

  export default {
    data () {
      return {
        id: '',
        time: ''
      }
    },

    computed: {
      videoInfo () {
        return {
          videoUrl: '',
          videoImg: '',
          title: '',
          nickName: '',
          hotCounts: '',
          ...store.state.info
        }
      },
      videoList () {
        return store.state.list
      },
      replyList () {
        return store.state.reply.list
      },
      pageInfo () {
        return store.state.reply.pageInfo
      },
      hasMoreReply () {
        let {pageCount, currentPage} = store.state.reply.pageInfo
        if (pageCount > currentPage) {
          return true
        } else {
          return false
        }
      }
    },

    components: {
      replyFlex,
      reply,
      authorVideo,
      customNavigation
    },

    methods: {
      getVideoInfo (obj, fn) {
        // store.commit('increment')
        store.dispatch('getVideoInfo', obj).then((obj) => {
          if (fn) {
            fn(obj)
          }
        })
      },
      getAuthorVideo (obj) {
        // store.commit('increment')
        store.dispatch('getAuthorVideo', obj)
      },
      getVideoReply (obj) {
        // store.commit('increment')
        obj = {
          id: this.id,
          currentPage: 1,
          ...obj
        }
        store.dispatch('getVideoReply', obj)
      },
      toVideoDetail (id, time) {
        this.id = id
        this.time = time
        this.getVideoInfo({id: id, publishTime: time})
        this.getVideoReply({id: id})
      },
      // 打开App错误
      launchAppError (e) {
        console.log(e)
        console.log(e.mp.detail.errMsg)
      },
      // 是否有打开app的能力
      openApp (scene) {
        // let {openAppFlag} = this.scene
        if (scene === 1069) {
          this.openAppFlag = true
        } else {
          if (scene === 1036) {
            this.openAppFlag = true
          } else {
            if (scene === 1089 || scene === 1090 || scene === 1038) {
            } else {
              this.openAppFlag = false
            }
          }
        }
      }
    },
    onLoad (options) {
      // Do some initialize when page load.
      let {id, time} = options
      // 20180716204020041622 1531744838000
      // let id = '20180720183009974843'
      // let time = '1532082657000'
      // let id = '20180716204020041622'
      // let time = '1531744838000'
      console.log(options, 'onLoad')
      this.id = id
      this.getVideoInfo({id: id, publishTime: time}, (obj) => {
        this.getAuthorVideo({id: this.id, author: obj.author})
      })
      this.getVideoReply({id: id})
    },
    onShow () {
      let appInfo = getApp()
      console.log(appInfo.globalData.appOptions)
      let scene = appInfo.globalData.appOptions.scene
      this.scene = scene
      this.openApp(scene)
    },
    // 转发分享
    onShareAppMessage: function (res) {
      let currItem = this.videoInfo
      let obj = {
        title: currItem.title,
        path: `pages/videoDetail/main?id=${this.id}&time=${this.time}`,
        imageUrl: !currItem.coverPic ? '' : JSON.parse(currItem.coverPic).video_m
      }
      return obj
    }
    // 上拉加载，拉到底部触发
    /* onReachBottom () {
      if (this.hasMoreReply) {
        let {currentPage} = store.state.reply.pageInfo
        this.getVideoReply({id: this.id, currentPage: currentPage + 1})
      }
    } */
  }
</script>

<style scoped lang="scss">
  .container {
    // padding-bottom: 110rpx;
    // height: auto;
    height: 100%;
  }
  .video-warp {
    width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;

    video {
      width: 100%;
      height: 420rpx;
      // position: fixed;
      z-index: 999;
    }

    .video-mian {
      flex: 1;
      overflow:auto;
      box-sizing: border-box;
      padding-bottom: 110rpx;

      .scroll-view-warp {
        height: 100%;
      }

      .scroll-view {
        height: 100%;
      }
    }

    .video-contain {
      // margin-top: 420rpx;
      padding: 0 30rpx;

      h3 {
        color: #212121;
        font-size: 32rpx;
        line-height: 48rpx;
        height: 138rpx;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 25rpx;
      }

      .video-info {
        height: 85rpx;
        border-top: 1rpx solid #d3d3d3;
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #757575;
        justify-content: space-between;

        .dot {
          width: 4rpx;
          height: 4rpx;
          border-radius: 50%;
          background-color: #a1a1a1;
          margin: 0 20rpx;
        }

        .left {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .btn-share {
          width: 85rpx;
          height: 100%;
          margin-right: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          img {
            width: 31rpx;
            height: 32rpx;
          }
        }
      }
    }
    .open-app {
      background: url("../../img/app-btn.png") no-repeat;
      background-size: contain;
      width: 150rpx;
      height: 50rpx;
      text-align: center;
      line-height: 50rpx;
      font-size: 25rpx;
      color: #fff;
      position: fixed;
      bottom: 230rpx;
      right: 0;
    }

    .video-other {
      background-color: #f5f5f5;
    }
  }
</style>
