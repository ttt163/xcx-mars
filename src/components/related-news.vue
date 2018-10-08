<!-- 展示模板 -->
<template>
  <div class="related-box" :class="isShow">
  <!--<div class="related-box">-->
    <h2>为你推荐</h2>
    <div class="news-list">
      <related-item v-for="(item, index) in list" :key="index" :item="item" :index="index"></related-item>
    </div>
  </div>
</template>

<script>
  import relatedItem from '@/components/related-item'
  export default {
    props: ['list'],
    computed: {
      isShow () {
        return !this.list.length ? 'hide' : ''
      }
    },
    components: {
      relatedItem
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .related-box {
    &.hide {
      display: none;
    }

    h2 {
      color: #222;
      font-size: 28rpx;
      line-height: 66rpx;
      padding-left: 30rpx;
    }

    .news-list {
      background-color: #fff;
    }
  }
</style>
