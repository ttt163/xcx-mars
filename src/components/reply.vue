<!-- 展示模板 -->
<template>
  <div class="reply-box">
    <h2>精彩评论</h2>
    <div class="reply-list">
      <reply-item v-for="(item, index) in list" :key="index" :item="item.comment"></reply-item>
    </div>
    <div class="no-reply" :class="isShow">
      <img src="../img/icon-no-reply.png"/>
      <div>还没有评论，<a href="/pages/index/main">去首页</a>看看热门内容</div>
    </div>
  </div>
</template>

<script>
  import replyItem from '@/components/reply-item'
  export default {
    props: ['list', 'hasMore'],
    computed: {
      isShow () {
        return !this.list.length ? '' : 'hide'
      }
    },
    components: {
      replyItem
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .reply-box {
    h2 {
      color: #222;
      font-size: 28rpx;
      line-height: 66rpx;
      padding-left: 30rpx;
    }

    .reply-list {
      background-color: #fff;
    }

    .no-reply {
      height: 340rpx;
      font-size: 26rpx;
      color: #999;
      line-height: 40rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fff;

      img {
        width: 127rpx;
        height: 112rpx;
      }

      div {
        display: flex;
        margin-top: 25rpx;
        a {
          color: #0c7ff2;
          margin-right: 10rpx;
        }
      }

      &.hide {
        display: none;
      }
    }
  }
</style>
