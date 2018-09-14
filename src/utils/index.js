import {Base64} from 'js-base64'
import md5 from 'md5'
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

const domian = 'http://www.huoxing24.vip'
// const domian = 'https://ssl.huoxing24.com'
// const domian = 'https://www.huoxing24.vip'
export const getNonceStr = () => {
  let nonceArr = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ1234567890'
  let nonce = ''
  for (let i = 0; i < 6; i++) {
    let j = Math.round(Math.random() * nonceArr.length - 1)
    nonce += nonceArr[j]
  }
  return nonce
}
export const getSigObj = () => {
  return {
    'platform': 'pc',
    'nonce': getNonceStr(),
    'timestamp': new Date().getTime()
  }
}
export const getSig = (obj) => {
  let appSecret = 'Fbz]OdjAyhpqOIKA'
  let sig = ''
  if (!obj) {
    obj = getSigObj()
    sig = md5('platform=' + obj.platform + '&timestamp=' + obj.timestamp + '&nonce=' + obj.nonce + '&' + appSecret)
  } else {
    // 获取验证码用到
    let str = ''
    for (let value of Object.values(obj)) {
      // str += `${key}=${value}&`
      str += `${value}`
      appSecret = '%q3fuYGykeiBJgim'
    }
    str += appSecret
    sig = md5(str)
  }
  return {
    sig: sig,
    obj: obj
  }
}
export const base64Sig = (sinObj, sig) => {
  return Base64.encode(JSON.stringify({
    ...sinObj,
    'sig': sig
  }))
}

export const ajax = (arg) => {
  const {type, url, params, contentType, fn} = arg
  let sig = getSig()
  let opt = {
    method: type,
    url: `${domian}${url}`,
    data: params,
    headers: {'Sign-Param': base64Sig(sig.obj, sig.sig)}
  }

  if (contentType) {
    opt.headers = {
      ...opt.headers,
      'Content-Type': contentType
    }
  }
  async function request () {
    const data = await new Promise((resolve) => {
      wx.request({
        ...opt,
        header: opt.headers,
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })

    return data
  }
  request().then(function (response) {
    const data = response.data
    if (fn) {
      fn.call(this, data, this)
    }
  }).catch(function (error) {
    console.log(error)
  })
}
const zero = (m) => {
  return m < 10 ? '0' + m : m
}

const formatDate = (date, str) => {
  str = !str ? '-' : str
  let time = new Date(date)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  return `${y}${str}${zero(m)}${str}${d}`
}

export const getTimeContent = (publishTime, requestTime) => {
  requestTime = !requestTime ? new Date().getTime() : requestTime
  let limit = parseInt((requestTime - publishTime)) / 1000
  let content = ''
  if (limit < 60) {
    content = '刚刚'
  } else if (limit >= 60 && limit < 3600) {
    content = Math.floor(limit / 60) + '分钟前'
  } else if (limit >= 3600 && limit < 86400) {
    content = Math.floor(limit / 3600) + '小时前'
  } else {
    content = formatDate(publishTime)
  }
  return content
}
export const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/

export default {
  formatNumber,
  formatTime,
  ajax,
  getTimeContent
}
