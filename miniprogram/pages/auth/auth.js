// pages/demo/demo.js
let app =getApp()
const db = wx.cloud.database()
Page({
  data: {
  },
  bindGetUserInfo: function (e) {
    let that = this
    if (e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'login',
        data: {
          nickname: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl
        },
        success: resp => {
          app.globalData.openid = resp.result.openid
          app.login({
            nickname: e.detail.userInfo.nickName,
            avatar: e.detail.userInfo.avatarUrl
          })
          wx.reLaunch({
            url: '/'+that.data.page+'?'+that.data.querystring
          })
        },
        fail: err => {
          
        }
      })
    }
  },
  onLoad (options) {
    let page = options.page
    let query = JSON.parse(options.query)
    let querystring = ''
    for(var key in query) {
       querystring+= '&'+key+'='+query[key]
    }
    querystring = querystring.substr(1)
    this.setData({
      page,
      querystring
    })

  }
})