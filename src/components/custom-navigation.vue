<!-- 展示模板 -->
<template>
  <div class="custom-navigation" :style="{paddingTop: setTopHeight}">
    <div class="main">
      <div class="left" :style="{display: !showBack ? 'none' : 'flex'}">
        <div class="icon-box" @click="goBack">
          <img src="../img/icon-back.png" />
        </div>
        <div class="line"></div>
        <div class="icon-box" @click="goHome">
          <img src="../img/icon-top-home.png" />
        </div>
      </div>
      <div class="center-title">
        <h1>{{setTitle}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import systerStore from '../store/syster'
  export default {
    props: ['title', 'showBack'],
    computed: {
      setTitle () {
        return !this.title ? '火星精选' : this.title
      },
      setTopHeight () {
        return `${systerStore.state.statusBarHeight}px`
      }
    },
    methods: {
      goBack () {
        wx.navigateBack({
          delta: 1
        })
      },
      goHome () {
        let page = `/pages/index/main`
        wx.navigateTo({ url: page })
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .custom-navigation {
    padding-top: 48rpx;
    // box-sizing: border-box;
    width: 100%;
    position: relative;
    z-index: 1000;
    background: #fff;

    .main {
      height: 80rpx;
      position: relative;
      margin-bottom: 20rpx;
    }

    .left {
      position: absolute;
      left: 20rpx;
      top: 5rpx;
      width: 180rpx;
      height: 70rpx;
      box-sizing: border-box;
      z-index: 9;
      border: 1px solid #f6f6f6;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .line {
        width: 2rpx;
        height: 34rpx;
        background-color: #d2d2d2;
      }

      img {
        width: 34rpx;
        height: 34rpx;
      }
      .icon-box {
        width: 87rpx;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .center-title {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;

      h1 {
        color: #222;
        font-size: 36rpx;
      }
    }

  }
</style>
