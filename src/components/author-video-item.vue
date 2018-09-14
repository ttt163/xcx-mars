<!-- 展示模板 -->
<template>
  <div class="video-item" @click="goToDetail(item.id, item.publishTime, $event)">
    <div class="video-img">
      <div class="video-status" :style="{display: item.id === currId ? 'block' : 'none'}">
        <div class="pangu-widget__music js-pangu-widget-music pangu-widget__music--playing">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
      <div class="mask" :style="{display: item.id === currId ? 'block' : 'none'}"></div>
      <img :src="videoImg">
    </div>
    <h3 class="item-title">{{item.title}}</h3>
  </div>
</template>

<script>
  export default {
    props: ['item', 'currId'],
    computed: {
      videoImg () {
        return !this.item.coverPic ? '' : JSON.parse(this.item.coverPic).video_m
      }
    },
    methods: {
      goToDetail (id, time, ev) {
        /* let page = `/pages/videoDetail/main?id=${id}&time=${time}`
        wx.navigateTo({ url: page }) */
        if (this.currId === id) {
          return
        }
        this.$emit('goToDetail', id, time)
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .video-item {
    width: 280rpx;
    min-width: 280rpx;
    max-width: 280rpx;
    flex: 1;
    padding: 28rpx 20rpx 28rpx 0;
    background-color: #fff;

    .video-img {
      width: 100%;
      height: 157rpx;
      position: relative;
      border-radius: 10rpx;
      overflow: hidden;

      img {
        border-radius: 10rpx;
      }

      .video-status {
        position: absolute;
        top: 5rpx;
        right: 10rpx;
        font-size: 42rpx;
        z-index: 2;
      }

      .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        border-radius: 10rpx;
      }
    }

    .item-title {
      color: #222;
      font-size: 28rpx;
      line-height: 35rpx;
      // height: 138rpx;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      box-sizing: border-box;
      padding-top: 15rpx;
    }
  }
  .pangu-widget__music {
    width: 32rpx;
    height: 37rpx
  }

  .pangu-widget__music--playing i {
    animation: pangu-widget-music 1s linear infinite
  }

  .pangu-widget__music i {
    display: inline-block;
    width: 0;
    border-left: 5rpx solid;
    border-color: #fff;
    height: 100%;
    margin-right: 4rpx;
    transition: all .2s ease-out;
    transform-origin: 50% 100%;
  }

  .pangu-widget__music i:first-child {
    transform: scaleY(.6);
    animation-delay: 0;
  }

  .pangu-widget__music i:nth-child(2) {
    transform: scaleY(.9);
    animation-delay: -.5s;
  }

  .pangu-widget__music i:nth-child(3) {
    transform: scaleY(.5);
    animation-delay: -.3s;
  }

  .pangu-widget__music i:nth-child(4) {
    transform: scaleY(.7);
    animation-delay: -.7s;
  }

  @keyframes pangu-widget-music {
    0%, to {
      transform: scale(1)
    }
    20% {
      transform: scaleY(.5)
    }
    40% {
      transform: scaleY(.7)
    }
    60% {
      transform: scaleY(.3)
    }
    80% {
      transform: scaleY(.6)
    }
  }
</style>
