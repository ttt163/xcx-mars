<!-- 展示模板 -->
<template>
  <div class="modal-warp" :style="{display: !isShow ? 'none' : 'block'}">
    <div class="mask"></div>
    <div class="modal-contain">
      <div class="modal-header">
        <h3>微信授权</h3>
      </div>
      <div class="modal-main">
        <img src="../img/icon-logo.jpg">
        <div class="info">
          <h4>火星精选&nbsp;申请获得以下权限</h4>
          <div class="info-item">
            <div class="yuan"></div>
            <p>获得你的公开信息（昵称、头像等）</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">允许</button>
      </div>
    </div>
  </div>
</template>

<script>
  import loginStore from '../store/login'
  export default {
    props: ['isShow'],
    methods: {
      getUserInfo1 () {
        // console.log('click事件首先触发')
        // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
        // console.log(wx.canIUse('button.open-type.getUserInfo'))
        if (wx.canIUse('button.open-type.getUserInfo')) {
          // 用户版本可用
          this.$emit('okClick')
        } else {
          // console.log('请升级微信版本')
          wx.showToast({
            title: '请升级微信版本',
            icon: 'none',
            duration: 2000
          })
        }
      },
      bindGetUserInfo (e) {
        if (e.mp.detail.rawData) {
          // 用户按了允许授权按钮
          console.log('用户按了允许授权按钮')
          this.$emit('getInfo', e.mp.detail)
        } else {
          // 用户按了拒绝按钮,清空strong缓存
          console.log('用户按了拒绝按钮')
          loginStore.dispatch('clearLoginInfo')
        }
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .modal-warp {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;

    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      position: absolute;
      top: 0;
      left: 0;
    }

    .modal-contain {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 235px;
      transform: translate(-150px, -117.5px);
      background-color: #fff;
      font-size: 18px;
      color: #323131;
      display: flex;
      flex-direction: column;
      flex: 1;
      border-radius: 3px;

      .modal-header {
        height: 52px;
        border-bottom: 1rpx solid #eaeaeb;
        box-sizing: border-box;
        text-align: center;
        line-height: 52px;
      }

      .modal-main {
        flex: 1;

        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin: 10px auto;
          display: block;
        }

        .info {
          padding: 0 24px;

          h4 {
            font-size: 14px;
            margin-bottom: 10px;
          }
          .info-item {
            font-size: 13px;
            color: #989494;
            display: flex;
            align-items: center;
            padding-top: 10px;
            border-top: 1rpx solid #eaeaeb;

            .yuan {
              width: 6px;
              height: 6px;
              background-color: #888;
              border-radius: 50%;
              margin: 0 5px;
            }
          }
        }
      }

      .modal-footer {
        height: 50px;
        border-top: 1rpx solid #eaeaeb;
        box-sizing: border-box;
        text-align: center;
        line-height: 50px;

        .btn {
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 18px;
          color: #0bb20c;
        }
      }

    }
  }
</style>
