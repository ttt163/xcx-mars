<template>
  <div class="container">
    <custom-navigation :showBack="true"></custom-navigation>
    <div class="bind-warp">
      <scroll-view class='scroll-view' scroll-y="true">
        <div class="bind-phone">
          <h1>绑定手机号</h1>
          <div class="tip">只需绑定一次，下次自动登录</div>
          <div class="form-contain">
            <div class="form-item">
              <div class="icon-img"><img class="icon-img-phone" src="../../img/icon-phone.png"/></div>
              <input placeholder="输入手机号" v-model="phone" @change="changePhone"/>
            </div>
            <div class="form-item code-item">
              <div class="icon-img"><img class="icon-img-phone-msg" src="../../img/icon-phone-msg.png"/></div>
              <div class="item-right">
                <input placeholder="输入验证码" v-model="code"/>
                <div class="btn-code" :class="!hasGetCode ? '': 'disabled'" @click="clickCodeBtn">{{codeBtnText}}</div>
              </div>
            </div>
            <div class="form-tip" :style="{display: !error.hasError ? 'none' : 'flex'}">
              <img src="../../img/icon-warn.png"/>
              <div>{{error.msg}}</div>
            </div>
            <div class="btn-submit" @click="clickBindBtn">绑定</div>
          </div>
          <div class="bottom-fixe">登录注册即视为同意
            <div>《火星财经用户服务协议》</div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import {phoneReg, ajax, getSigObj, getSig} from '../../utils/index'
  import loginStore from '../../store/login'
  import customNavigation from '@/components/custom-navigation'

  export default {
    data () {
      return {
        phone: '',
        code: '',
        hasGetCode: false,
        codeBtnText: '获取验证码',
        resType: 1, // 1: 未注册，3: 已注册
        error: {
          hasError: false,
          msg: ''
        }
      }
    },

    components: {
      customNavigation
    },

    methods: {
      // 校验手机
      changePhone () {
        if (!phoneReg.test(this.phone)) {
          this.error = {
            hasError: true,
            msg: '请输入正确的手机号码'
          }
        } else {
          this.error = {
            hasError: false,
            msg: ''
          }
        }
      },
      // 获取验证码
      clickCodeBtn () {
        if (!this.hasGetCode) {
          this.changePhone()
          if (this.error.hasError) {
            return
          }
          this.isRegister().then((res) => {
            // console.log('是否注册过1')
            // console.log(res)
            if (res.code === 1) {
              // 已注册
              this.resType = 3
            } else if (res.code === -1) {
              // 未注册
              this.resType = 1
            }
            this.getCode().then((res) => {
              // console.log('发送验证码')
              // console.log(res)
              if (res.code === 1) {
                this.hasGetCode = true
                this.codeBtnText = 60
                let cid = setInterval(() => {
                  if (this.codeBtnText > 0) {
                    this.codeBtnText--
                  } else {
                    clearInterval(cid)
                    this.hasGetCode = false
                    this.codeBtnText = '获取验证码'
                  }
                }, 1000)
              } else {
                this.hasGetCode = false
                this.codeBtnText = '获取验证码'
              }
            })
          })
        }
      },
      getCode () {
        // countrycode + nonce phonenum timestamp verifcategory
        return new Promise((resolve) => {
          let params = getSigObj()
          let sendData = {
            'phonenum': this.phone,
            'countrycode': '86',
            'verifcategory': this.resType,
            'verifySource': 1,
            'nonce': params.nonce,
            'timestamp': params.timestamp
          }
          let sigObj = {
            countrycode: sendData.countrycode,
            nonce: sendData.nonce,
            phonenum: sendData.phonenum,
            timestamp: sendData.timestamp,
            verifcategory: sendData.verifcategory
          }
          ajax({
            type: 'post',
            url: '/passport/account/getappverifcode',
            contentType: 'application/x-www-form-urlencoded',
            params: {
              ...sendData,
              'sig': getSig(sigObj).sig
            },
            fn: function (res) {
              resolve(res)
              console.log('/passport/account/getappverifcode', res)
            }
          })
        })
      },
      // 手机号码是否注册过
      isRegister () {
        let self = this
        let url = `/passport/account/ifregister`
        return new Promise((resolve) => {
          ajax({
            type: 'post',
            url: url,
            formData: false,
            params: {phonenum: self.phone},
            contentType: 'application/x-www-form-urlencoded',
            fn: function (res) {
              console.log(url, res)
              resolve(res)
            }
          })
        })
      },
      // 校验
      validateData () {
        if (!phoneReg.test(this.phone)) {
          this.error = {
            hasError: true,
            msg: '请输入正确的手机号码'
          }
        } else {
          if (!this.code) {
            this.error = {
              hasError: true,
              msg: '请输入手机验证码'
            }
          } else {
            this.error = {
              hasError: false,
              msg: ''
            }
          }
        }
      },
      // 绑定
      clickBindBtn () {
        this.validateData()
        if (!this.error.hasError) {
          this.bindPhone().then((res) => {
            // console.log('绑定手机登录')
            if (res.code === 1) {
              loginStore.dispatch('setLoginInfo', res.obj)
              loginStore.dispatch('setStateData', {login: true})
              wx.showToast({
                title: '绑定手机成功',
                icon: 'none',
                duration: 2000
              })
              let cid = setTimeout(() => {
                clearTimeout(cid)
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              if (res.code === -9) {
                loginStore.dispatch('setLoginInfo', res.obj)
                loginStore.dispatch('setStateData', {login: true})
                wx.navigateBack({
                  delta: 1
                })
              } else {
                // loginStore.dispatch('setLoginInfo', res.obj)
                loginStore.dispatch('setStateData', {login: false, loginInfo: null})
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      },
      // 绑定手机
      bindPhone () {
        const {phone, code, resType} = this
        const {unionid, wxInfo} = loginStore.state
        // console.log(loginStore)
        if (!this.resType) {
          return
        }
        let lastUrl = ''
        let sendData = {
          phonenum: phone,
          unionid: unionid
        }
        if (resType === 1) {
          // 未注册
          lastUrl = '/weixinbindnew'
          sendData = {
            ...sendData,
            verifcategory: resType,
            verifcode: code,
            iconUrl: wxInfo.avatarUrl,
            nickName: wxInfo.nickName
          }
        } else {
          // 已注册
          lastUrl = '/weixinbindold'
          sendData = {
            ...sendData,
            verifycategory: resType,
            verifycode: code,
            weixinName: wxInfo.nickName
          }
        }
        return new Promise((resolve) => {
          let url = `/passport/account${lastUrl}`
          ajax({
            type: 'post',
            url: url,
            params: sendData,
            contentType: 'application/x-www-form-urlencoded',
            fn: function (res) {
              console.log(url, sendData, res)
              resolve(res)
            }
          })
        })
      },
      onShow () {
        /* const {unionid} = loginStore.state
        if (!unionid) {
          loginStore.dispatch('getUnionid')
        } */
      }
    }
  }
</script>

<style scoped lang="scss">
  .bind-warp {
    padding: 0 75rpx;
    flex: 1;
  }

  .bind-phone {
    h1 {
      font-size: 40rpx;
      color: #222;
      padding-top: 40rpx;
      // border-top: 1rpx solid #f8f8f8;
    }

    .tip {
      font-size: 26rpx;
      color: #999;
      margin-top: 38rpx;
    }

    .form-contain {
      margin-top: 40rpx;

      .form-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        align-items: center;
        padding: 15rpx 0;
        height: 70rpx;

        .icon-img {
          width: 40rpx;
          margin-right: 35rpx;
        }

        img {
          &.icon-img-phone {
            width: 23rpx;
            height: 40rpx;
          }
          &.icon-img-phone-msg {
            width: 36rpx;
            height: 40rpx;
          }
        }

        input {
          width: 525rpx;
          font-size: 26rpx;
          height: 100%;
        }

        .item-right {
          width: 525rpx;
          display: flex;
          justify-content: space-between;
          height: 100%;

          input {
            width: 360rpx;
          }
        }

        .btn-code {
          height: 70rpx;
          width: 150rpx;
          font-size: 24rpx;
          text-align: center;
          // background-color: #ffd100;
          border-radius: 5rpx;
          line-height: 70rpx;
          color: #1881ef;

          &.disabled {
            // background-color: #eee;
            // color: #666;
          }
        }
      }

      .form-tip {
        display: flex;
        font-size: 26rpx;
        color: #d30000;
        align-items: center;
        margin-top: 35rpx;

        img {
          width: 26rpx;
          height: 26rpx;
          margin-right: 10rpx;
        }
      }
    }

    .btn-submit {
      margin-top: 35rpx;
      height: 80rpx;
      width: 100%;
      font-size: 30rpx;
      text-align: center;
      background-color: #1881ef;
      border-radius: 5rpx;
      line-height: 80rpx;
      color: #fff;
      // box-shadow:0px -3rpx 3px 0px red;
    }

    .bottom-fixe {
      color: #999;
      font-size: 26rpx;
      position: fixed;
      bottom: 75rpx;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      display: flex;

      div {
        color: #739bec;
      }
    }
  }
</style>
