<!-- 展示模板 -->
<template>
  <div id="tabBar">
    <a class="item home" :class="isCurr.home" @click="goHome">
      <div class="icon icon-home">
        <img src="../img/icon-home.png"/>
        <img src="../img/icon-home-active.png" class="curr-img"/>
      </div>
      <span>首页</span>
    </a>
    <a class="item activity" :class="isCurr.user" @click="goUser">
      <div class="icon icon-activity">
        <img src="../img/icon-activity.png"/>
        <img src="../img/icon-activity-active.png" class="curr-img"/>
      </div>
      <span>活动</span>
    </a>
  </div>
</template>

<script>
  export default {
    props: ['curr'],
    computed: {
      isCurr () {
        return {
          home: this.curr === 'home' ? 'curr' : '',
          user: this.curr !== 'home' ? 'curr' : ''
        }
      }
    },
    methods: {
      goHome () {
        if (this.curr === 'home') {
          return
        }
        let page = `/pages/index/main`
        wx.navigateTo({ url: page })
      },
      goUser () {
        if (this.curr === 'user') {
          return
        }
        let page = `/pages/user/main`
        wx.navigateTo({ url: page })
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  #tabBar {
    height: 100rpx;
    border-top: 1px solid #d3d3d3;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .item {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.curr {
        .icon {
          img {
            display: none;
            &.curr-img {
              display: block;
            }
          }
        }
      }

      .icon {
        position: relative;
        margin-right: 12rpx;
        width: 38rpx;
        height: 38rpx;

        img {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;

          &.curr-img {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            display: none;
          }
        }
      }
    }
  }
</style>
