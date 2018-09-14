<template>
  <div class="container">
    <custom-navigation :showBack="true"></custom-navigation>
    <div class="flex-contain">
      <div class="flex-main">
        <scroll-view class='scroll-view' scroll-y="true">
          <div class="user-warp">
            <div class="user-mian">
              <div class="user-info">
                <img src="../../img/user-default.png" :style="{display: !hasLogin ? 'block' : 'none'}">
                <img :src="userIcon" :style="{display: !hasLogin ? 'none' : 'block'}">
                <h3>{{userName}}</h3>
              </div>
              <div class="user-activity">
                <div :style="{display: !hasLogin ? 'block' : 'none'}">
                  <button class="btn" :style="{display: !hasAuth ? 'block' : 'none'}" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">授权登录</button>
                  <div class="btn" :style="{display: !hasAuth ? 'none' : 'block'}"  @click="getUserInfo1">授权登录</div>
                </div>
                <div class="no-data" :style="{display: !hasLogin ? 'none' : 'block'}">
                  <img src="../../img/icon-no-data.png">
                  <div>精彩活动正在路上</div>
                </div>
              </div>
            </div>
            <div class="mars-box">
              <h1>火星精选</h1>
              <p>火星精选介绍,最多显示多少个字符!火星精选介绍,最多显示多少个字符!最多显示多少个字符！</p>
            </div>
          </div>
        </scroll-view>
      </div>
      <div class="flex-bottom">
        <tab-bar curr="user"></tab-bar>
      </div>
    </div>
  </div>
</template>

<script>
  import tabBar from '@/components/tabBar'
  import loginStore from '../../store/login'
  import customNavigation from '@/components/custom-navigation'
  export default {
    data () {
      return {
        wxUserInfo: null
      }
    },

    computed: {
      userIcon () {
        return !loginStore.state.loginInfo || !loginStore.state.loginInfo.iconUrl ? '' : loginStore.state.loginInfo.iconUrl
      },
      userName () {
        return !loginStore.state.loginInfo || !loginStore.state.loginInfo.nickName ? '' : loginStore.state.loginInfo.nickName
      },
      hasLogin () {
        return loginStore.state.login
      },
      hasAuth () {
        return loginStore.state.hasAuth
      }
    },

    components: {
      tabBar,
      customNavigation
    },

    methods: {
      getUserInfo1 () {
        // console.log('click事件首先触发')
        // console.log(loginStore.state)
        if (!this.hasAuth) {
          if (wx.canIUse('button.open-type.getUserInfo')) {
            // 用户版本可用
          } else {
            // console.log('请升级微信版本')
            wx.showToast({
              title: '请升级微信版本',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          if (!loginStore.state.unionid) {
            this.wxLogin()
          } else {
            let page = `/pages/bindPhone/main`
            wx.navigateTo({ url: page })
          }
        }
      },
      bindGetUserInfo (e) {
        // console.log(e.mp.detail)
        if (e.mp.detail.rawData) {
          // 用户按了允许授权按钮
          const {encryptedData, iv, userInfo} = e.mp.detail
          // console.log('用户按了允许授权按钮')
          loginStore.dispatch('setUserInfo', userInfo)
          loginStore.dispatch('setStateData', {encryptedData: encryptedData, iv: iv, hasAuth: true})
          this.wxUserInfo = {
            ...this.wxUserInfo,
            ...e.mp.detail
          }
          this.wxLogin()
          // 存储授权信息
        } else {
          // 用户按了拒绝按钮,清空strong缓存
          console.log('用户按了拒绝按钮')
          loginStore.dispatch('clearLoginInfo')
        }
      },
      // 微信登录
      wxLogin () {
        // 根据登录状态，是否调用登录接口
        wx.login({
          success: (res) => {
            this.wxUserInfo.code = res.code
            // console.log(res)
            loginStore.dispatch('setStateData', {code: res.code})
            // 获取unionid
            this.getUnionid()
          }
        })
      },
      getUnionid () {
        const {code, encryptedData, iv} = loginStore.state
        let obj = {
          code: !code ? loginStore.state.this.wxUserInfo.code : code,
          encryptedData: !encryptedData ? loginStore.state.encryptedData : encryptedData,
          iv: !iv ? loginStore.state.iv : iv
        }
        loginStore.dispatch('getUnionid', obj)
      }
    }
  }
</script>

<style scoped lang="scss">
  page {
    height: 100%;
  }
  .container {
    height: 100%;
  }
  .flex-contain {
    flex: 1;
    .flex-main {
      background-color: #f5f5f5;
    }

    .user-warp {
      .user-mian {
        background-color: #fff;
        margin: 20rpx 0;
        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 295rpx;
          border-bottom: 1px solid #d3d3d3;

          img {
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
          }

          h3 {
            font-size: 36rpx;
            color: #333;
            margin-top: 20rpx;
          }
        }

        .user-activity {
          height: 560rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .btn {
            font-size: 30rpx;
            color: #000;
            width: 260rpx;
            height: 76rpx;
            line-height: 76rpx;
            text-align: center;
            border: 1rpx solid #000;
            border-radius: 38rpx;
          }
          .no-data {
            font-size: 28rpx;
            color: #a7b1bc;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            img {
              width: 157rpx;
              height: 155rpx;
            }
          }
        }
      }
      .mars-box {
        background-color: #fff;
        text-align: center;
        padding: 40rpx;
        h1 {
          font-size: 32rpx;
          color: #222;
        }
        p {
          font-size: 26rpx;
          color: #666;
          line-height: 45rpx;
        }
      }
    }
  }
</style>
