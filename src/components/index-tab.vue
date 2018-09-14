<!-- 展示模板 -->
<template>
  <div class="tab-wap">
    <a class="item" :class="isCurr.news" @click="clickTab('news')">精选</a>
    <a class="item" :class="isCurr.video" @click="clickTab('video')">视频</a>
  </div>
</template>

<script>
  export default {
    props: ['curr'],
    computed: {
      isCurr () {
        return {
          news: this.curr === 'news' ? 'curr' : '',
          video: this.curr !== 'news' ? 'curr' : ''
        }
      }
    },
    methods: {
      clickTab (type) {
        if (this.curr === type) {
          return
        }
        this.$emit('selectTab', type)
      }
    }
  }
</script>
<!-- 样式代码 -->
<style lang="scss" scoped>
  .tab-wap {
    display: flex;
    justify-content:center;

    .item {
      display: block;
      font-size: 32rpx;
      color: #888;
      width: 70rpx;
      height: 70rpx;
      line-height: 70rpx;
      position: relative;
      text-align: center;

      &:nth-of-type(1) {
        margin-right: 76rpx;
      }

      &:nth-of-type(2) {
        margin-left: 76rpx;
      }

      &.curr {
        color: #222;

        &:after {
          content: '';
          display: block;
          width: 70rpx;
          height: 6rpx;
          background-color: #1981f2;
          position: absolute;
          border-radius: 3rpx;
          bottom: 0;
          left: 0;
          overflow: hidden;
        }
      }
    }
  }
</style>
