<!-- 展示模板 -->
<template>
  <div class="video-list-box">
    <h2>专辑列表</h2>
    <scroll-view class='scroll-view' scroll-x="true">
      <div class="video-list">
        <author-video-item v-for="(item, index) in list" :key="index" :item="item" :currId="currId" @goToDetail="toDetail"></author-video-item>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import authorVideoItem from '@/components/author-video-item'
  export default {
    props: ['list', 'currId'],
    computed: {},
    components: {
      authorVideoItem
    },
    methods: {
      toDetail (id, time) {
        this.$emit('toVideoDetail', id, time)
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .video-list-box {
    h2 {
      color: #888;
      font-size: 28rpx;
      line-height: 66rpx;
      padding-left: 30rpx;
    }

    .scroll-view {
      -webkit-overflow-scrolling: touch;
      /*height: 298rpx;*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
    }

    .video-list {
      height: 100%;
      background-color: #fff;
      box-sizing: border-box;
      display: flex;
      flex-wrap: nowrap;
      padding-left: 30rpx;
    }
  }
</style>
