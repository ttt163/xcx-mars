<!-- 展示模板 -->
<template>
  <div class="reply-flex-warp">
    <div class="reply-flex">
      <input v-model="content" @click="hasLogin"  cursor-spacing="10" placeholder="写个评论"/>
      <div class="btn-send" @click="sendReply">发布</div>
    </div>
    <auth-modal :isShow="showModal" @okClick="closeModal" @getInfo="setUserInfo"></auth-modal>
  </div>
</template>

<script>
  import {ajax} from '../utils/index'
  import loginStore from '../store/login'
  import authModal from '@/components/auth-modal'
  export default {
    data () {
      return {
        content: '',
        showModal: false,
        wxUserInfo: null
      }
    },
    props: ['type', 'id'],
    components: {
      authModal
    },
    methods: {
      // 关闭弹窗
      closeModal () {
        this.showModal = false
      },
      setUserInfo (res) {
        loginStore.dispatch('setUserInfo', res.userInfo)
        loginStore.dispatch('setStateData', {encryptedData: res.encryptedData, iv: res.iv, hasAuth: true})
        this.wxUserInfo = {
          ...this.wxUserInfo,
          ...res
        }
        this.wxLogin()
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
      },
      // 是否登录
      hasLogin () {
        const {hasAuth, login, unionid} = loginStore.state
        if (!hasAuth || !unionid) {
          // 没有授权或者没有解密成功
          this.showModal = true
          return false
        }
        if (!login) {
          // 已经授权，没有绑定手机
          let page = `/pages/bindPhone/main`
          wx.navigateTo({ url: page })
          return false
        }
        return true
      },
      // 发送评论
      sendReply () {
        const {nickName, token, passportId} = loginStore.state.loginInfo
        if (!this.hasLogin()) {
          return
        }
        if (!this.content) {
          wx.showToast({
            title: '请输入评论内容',
            icon: 'none',
            duration: 2000
          })
          return
        }
        let self = this
        let sendData = {
          targetId: this.id,
          content: this.content,
          token: token,
          userNickName: nickName,
          userId: passportId,
          type: !this.type ? 'news' : this.type
        }
        ajax({
          type: 'get',
          url: '/info/comment/add',
          formData: false,
          params: sendData,
          fn: function (res) {
            // console.log(res)
            if (res.code === 1) {
              self.content = ''
              wx.showToast({
                title: '评论成功',
                icon: 'none',
                duration: 2000
              })
              // 成功回调
              self.$emit('callBack')
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              self.$emit('callBack')
            }
          }
        })
      }
    }
  }
</script>
<!-- 样式代码 -->
<style scoped lang="scss">
  .reply-flex-warp {
    width: 100%;
  }
  .reply-flex {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    border-top: 1px solid #ededed;
    height: 110rpx;
    justify-content: space-between;

    input {
      width: 610rpx;
      height: 70rpx;
      background-color: #f5f5f5;
      font-size: 30rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      border-radius: 5rpx;
    }

    .btn-send {
      font-size: 30rpx;
      color: #0c7ff2;
    }
  }
</style>
