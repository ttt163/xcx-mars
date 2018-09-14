<!-- 展示模板 -->
<template>
  <div class="reply-item">
    <img :src="item.userIcon">
    <div class="reply-info">
      <div class="reply-top">
        <div class="nikeName">{{item.userNickName}}</div>
        <div class="reply-time">{{fomatDate}}</div>
      </div>
      <div class="reply-content">{{item.content}}</div>
    </div>
  </div>
</template>

<script>
  import {getTimeContent} from '../utils/index'
  export default {
    props: ['item'],
    computed: {
      fomatDate () {
        return getTimeContent(this.item.createTime)
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .reply-item {
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid #d3d3d3;
    display: flex;

    &:nth-last-of-type(1) {
      border: 0;
    }

    .reply-info {
      margin-left: 18rpx;
      flex: 1;

      .reply-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;

        .nikeName {
          font-size: 30rpx;
          color: #222;
        }

        .reply-time {
          font-size: 24rpx;
          color: #666;
        }
      }

      .reply-content {
        color: #424242;
        font-size: 30rpx;
        line-height: 45rpx;
      }
    }

    img {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
    }
  }
</style>
