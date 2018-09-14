<!-- 展示模板 -->
<template>
  <div class="reply-box">
    <h2>精彩评论</h2>
    <div class="reply-list">
      <reply-item v-for="(item, index) in list" :key="index" :item="item.comment"></reply-item>
    </div>
    <div class="no-reply" :class="isShow">
      <p>暂无回复内容</p>
      <p>你来写一个吧~</p>
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
      color: #888;
      font-size: 28rpx;
      line-height: 66rpx;
      padding-left: 30rpx;
    }

    .reply-list {
      background-color: #fff;
    }

    .no-reply {
      height: 180rpx;
      font-size: 26rpx;
      color: #666;
      line-height: 40rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &.hide {
        display: none;
      }
    }
  }
</style>
