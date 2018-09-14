<!-- 展示模板 -->
<template>
  <div class="news-item" @click="goToDetail(item.id, $event)">
    <span>{{index + 1}}</span>
    <div class="news-item-main">
      <div class="news-title">{{item.title}}</div>
      <span class="hot">热度：{{item.hotCounts}}</span>
    </div>
    <div class="news-img">
      <img :src="newsImg"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['item', 'index'],
    computed: {
      newsImg () {
        return !this.item.coverPic ? '' : JSON.parse(this.item.coverPic).wap_small
      }
    },
    methods: {
      goToDetail (id, ev) {
        // console.log(id)
        let page = `/pages/newsDetail/main?id=${id}`
        wx.navigateTo({ url: page })
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .news-item {
    display: flex;
    padding: 30rpx;
    border-bottom: 1rpx solid #d3d3d3;
    color: #222;
    // height: 246rpx;
    box-sizing: border-box;

    &>span {
      width: 50rpx;
      font-size: 36rpx;
      color: #ccc;
      padding-top: 5rpx;
    }

    .news-item-main {
      width: 405rpx;
      margin-right: 20rpx;
      // height: 185rpx;

      .news-title {
        // height: 155rpx;
        font-size: 34rpx;
        line-height: 48rpx;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin-bottom: 12rpx;
      }

      .hot {
        display: block;
        font-size: 26rpx;
        color: #999;
      }
    }

    .news-img {
      width: 208rpx;
      height: 140rpx;
    }

    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3) {
      & > span {
        color: #1981f2;
      }
    }

    &:nth-of-type(2) {
      & > span {
        opacity: 0.8;
      }
    }

    &:nth-of-type(3) {
      & > span {
        opacity: 0.6;;
      }
    }

    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
</style>
