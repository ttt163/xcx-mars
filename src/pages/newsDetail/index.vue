<template>
  <div class="container">
    <custom-navigation :showBack="true"></custom-navigation>
    <div class="news-warp">
      <scroll-view class='scroll-view' scroll-y="true">
        <div class="news-contain">
          <h3 class="news-title">{{newsInfo.title}}</h3>
          <div class="news-info">
            <div>{{newsInfo.nickName}}</div>
            <div class="dot"></div>
            <div>{{fomatDate}}</div>
            <div class="dot"></div>
            <div>热度：{{newsInfo.hotCounts}}</div>
          </div>
          <div class="news-synopsis">
            <img src="../../img/fh.png">
            <p>{{newsInfo.synopsis}}</p>
          </div>
          <div class="news-content "><wxParse :content="newsContent" @preview="preview" @navigate="navigate"/></div>
          <button open-type="share" class="share">
            <div class="share-box">
              <div class="btn-share"></div>
              <div>分享</div>
            </div>
          </button>
        </div>
        <div class="news-other">
          <!--精彩评论-->
          <reply :list="replyList" :hasMore="false"></reply>
          <!--相关新闻-->
          <related-news :list="RelatedNews"></related-news>
        </div>
        <!--打开app-->
        <button :style="{display: !openAppFlag ? 'none' : 'block'}" class="open-app" open-type="launchApp" app-parameter="wechat" @error="launchAppError">打开APP</button>
      </scroll-view>
    </div>
    <!--回复-->
    <reply-flex type="news" :id="this.id" @callBack="getNewsReply"></reply-flex>
  </div>
</template>

<script>
  import replyFlex from '@/components/reply-flex'
  import reply from '@/components/reply'
  import relatedNews from '@/components/related-news'
  import store from './store'
  import wxParse from 'mpvue-wxparse'
  import {getTimeContent} from '../../utils/index'
  import customNavigation from '@/components/custom-navigation'

  export default {
    data () {
      return {
        id: '',
        webUrl: '',
        scene: '',
        openAppFlag: false
      }
    },

    computed: {
      fomatDate () {
        return !store.state.info || !store.state.info.publishTime ? '' : getTimeContent(store.state.info.publishTime)
      },
      webViewUrl () {
        return this.webUrl
      },
      newsContent () {
        let cont = !store.state.info || !store.state.info.content ? '' : store.state.info.content
        cont = cont.replace(/class=>/g, 'class="">')
        return cont
      },
      newsInfo () {
        return {
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
      RelatedNews () {
        console.log(store.state.RelatedNews)
        return store.state.RelatedNews
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
      wxParse,
      customNavigation,
      relatedNews
    },

    methods: {
      getNewsInfo (obj) {
        // store.commit('increment')
        obj = {
          id: this.id,
          currentPage: 1,
          ...obj
        }
        store.dispatch('getNewsInfo', obj).then((res) => {
          let obj = res.current
          let sendData = {
            tags: obj.tags,
            id: obj.id,
            publishTime: obj.publishTime
          }
          store.dispatch('getRelatedNews', sendData)
        })
      },
      getNewsReply (obj) {
        // store.commit('increment')
        obj = {
          id: this.id,
          currentPage: 1,
          ...obj
        }
        store.dispatch('getNewsReply', obj)
      },
      preview (src, e) {
        // do something
      },
      navigate (href, e) {
        // do something
        console.log(href)
        wx.navigateTo({ url: `/pages/otherView/main?view=${encodeURIComponent(href)}` })
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
              console.log(this.openAppFlag)
            } else {
              this.openAppFlag = false
            }
          }
        }
      }
    },
    onLoad (options) {
      let {id} = options
      // let id = '20180904180718926536'
      this.id = id
      this.getNewsInfo({id: id})
      this.getNewsReply({id: id})
    },
    onShow () {
      let appInfo = getApp()
      let scene = appInfo.globalData.appOptions.scene
      this.scene = scene
      this.openApp(scene)
    },
    // 转发分享
    onShareAppMessage: function (res) {
      let currItem = this.newsInfo
      let obj = {
        title: currItem.title,
        path: `pages/newsDetail/main?id=${currItem.id}`,
        imageUrl: !currItem.coverPic ? '' : JSON.parse(currItem.coverPic).wap_small
      }
      return obj
    }
    // 上拉加载，拉到底部触发
    /* onReachBottom () {
      if (this.hasMoreReply) {
        let {currentPage} = store.state.reply.pageInfo
        this.getNewsReply({id: this.id, currentPage: currentPage + 1})
      }
    } */
  }
</script>

<style scoped lang="scss">
  @import url("~mpvue-wxparse/src/wxParse.css");
  .container {
    padding-bottom: 110rpx;
    height:100%;
    box-sizing: border-box;
  }
  .news-warp {
    width: 100%;
    flex: 1;
    overflow: auto;

    .scroll-view {
      height: 100%;
    }

    .news-contain {
      padding: 0 30rpx;

      .news-title {
        color: #222;
        font-size: 38rpx;
        font-weight: bold;
        line-height: 52rpx;
        height: 138rpx;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 25rpx;
      }

      .news-info {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #666;
        margin-top: 26rpx;

        .dot {
          width: 4rpx;
          height: 4rpx;
          border-radius: 50%;
          background-color: #a1a1a1;
          margin: 0 20rpx;
        }
      }

      .news-synopsis {
        position: relative;
        padding-top: 40rpx;
        img {
          width: 40rpx;
          height: 40rpx;
          position: absolute;
          top: 25rpx;
          left: 10rpx;

        }
        p {
          color: #a6a6a6;
          font-size: 32rpx;
          line-height: 48rpx;
          text-indent: 64rpx;
        }
      }
    }

    .news-other {
      background-color: #f5f5f5;
    }

    .share {
      margin: 45rpx auto;
      width: 260rpx;
      height: 75rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #666;
      color: #000;
      font-size: 30rpx;
      border-radius: 40rpx;
      .share-box {
        display: flex;
        align-items: center;
      }
      .btn-share {
        background: url("../../img/icon-share2.png") no-repeat;
        width: 31rpx;
        height: 32rpx;
        background-size: contain;
        margin-right: 10rpx;
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
  }
</style>
