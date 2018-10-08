<!-- 展示模板 -->
<template>
  <div class="news-item" @click="goToDetail(item.id, $event)">
    <div class="news-item-main">
      <div class="news-title">{{item.title}}</div>
      <div class="item-bottom">
        <div>{{item.nickName}}</div>
        <div class="dot"></div>
        <div>{{fomatDate}}</div>
      </div>
    </div>
    <div class="news-img">
      <img :src="newsImg"/>
    </div>
  </div>
</template>

<script>
  import {getTimeContent} from '../utils/index'
  export default {
    props: ['item', 'index'],
    computed: {
      newsImg () {
        return !this.item.coverPic ? '' : JSON.parse(this.item.coverPic).wap_small
      },
      fomatDate () {
        return getTimeContent(this.item.publishTime)
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
    justify-content: space-between;

    .dot {
      width: 4rpx;
      height: 4rpx;
      border-radius: 50%;
      background-color: #a1a1a1;
      margin: 0 20rpx;
    }

    .item-bottom {
      flex: 1;
      display: flex;
      align-items: center;
      color: #999;
      font-size: 26rpx;
    }

    .news-item-main {
      width: 460rpx;
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

    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
</style>
