<template>
  <div class="container">
    <custom-navigation :showBack="true"></custom-navigation>
    <div class="view-main">
      <scroll-view class='scroll-view' scroll-y="true">
        <web-view :src="url"></web-view>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import customNavigation from '@/components/custom-navigation'
  export default {
    data () {
      return {
        url: ''
      }
    },
    components: {
      customNavigation
    },
    onLoad (options) {
      const {view} = options
      this.url = decodeURIComponent(view)
    }
  }
</script>

<style scoped lang="scss">
  .container {
    .view-main {
      flex: 1;
    }
  }
</style>
