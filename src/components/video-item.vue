<!-- 展示模板 -->
<template>
  <div class="item">
    <div class="item-main" @click="goToDetail(item.id, item.publishTime, $event)">
      <div class="item-content">
        <img :src="videoImg"/>
        <div class="mask"></div>
        <h3 class="item-title">{{item.title}}</h3>
        <div class="btn-play"></div>
        <span class="item-nickName">{{item.nickName}}</span>
        <div class="item-hot">热度：{{item.hotCounts}}</div>
      </div>
      <!--<video controls="controls" :src="videoSrc"></video>-->
    </div>
    <div class="item-bottom">
      <div class="item-bottom-left">
        <div class="btn-reply" @click="goToDetail(item.id, item.publishTime, $event)">写个评论</div>
        <div class="reply-count">
          <img src="../img/icon-msg.png"/>
          <span>{{item.commentCounts}}</span>
        </div>
      </div>
      <button open-type="share" class="btn-share" :id="index"><img src="../img/icon-share.png"/></button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['item', 'index'],
    data () {
      return {
        currItem: this.item
      }
    },
    computed: {
      videoImg () {
        return !this.item.coverPic ? '' : JSON.parse(this.item.coverPic).video_m
      },
      videoSrc () {
        return !this.item.url ? '' : JSON.parse(this.item.url)[0].fileUrl
      }
    },
    methods: {
      goToDetail (id, time, ev) {
        let page = `/pages/videoDetail/main?id=${id}&time=${time}`
        wx.navigateTo({ url: page })
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .item {
    margin-bottom: 20rpx;
    background-color: #fff;

    .item-main {
      width: 100%;
      height: 420rpx;
      position: relative;

      .item-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 88;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        font-size: 26rpx;

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background: rgba(0, 0, 0, 0.3);
        }

        .item-title {
          position: absolute;
          left: 0;
          top: 30rpx;
          padding: 0 30rpx;
          line-height: 45rpx;
          font-size: 34rpx;
          z-index: 2;
          font-weight: bold;
        }

        .btn-play {
          background: url("../img/btn-play.png") no-repeat;
          background-size: contain;
          width: 100rpx;
          height: 100rpx;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -50rpx;
          margin-top: -50rpx;
          z-index: 2;
        }

        .item-nickName {
          position: absolute;
          left: 30rpx;
          bottom: 20rpx;
          z-index: 2;
        }

        .item-hot {
          position: absolute;
          right: 30rpx;
          bottom: 20rpx;
          z-index: 2;
        }
      }

      video {
        width: 100%;
        height: 100%;
        display: none;
      }
    }

    .item-bottom {
      width: 100%;
      height: 85rpx;
      display: flex;
      box-sizing: border-box;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item-bottom-left {
        display: flex;

        .btn-reply{
          font-size: 26rpx;
          color: #888;
          text-align: center;
          width: 160rpx;
          height: 52rpx;
          line-height: 52rpx;
          border: 1px solid #eaeaea;
          border-radius: 26rpx;
          box-sizing: border-box;
          margin-right: 18rpx;
        }

        .reply-count {
          display: flex;
          color: #757575;
          font-size: 26rpx;
          align-items: center;

          img {
            width: 22rpx;
            height: 20rpx;
            margin-right: 8rpx;
          }
        }
      }

      .item-bottom-right {
        width: 60rpx;
      }

      .btn-share {
        // background: url("../img/icon-share.png") no-repeat;
        // background-size: contain;
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
</style>
