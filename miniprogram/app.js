var utils = require('/utils/util.js')

App({
  formatMsgTime(time){
    return utils.formatMsgTime(time)
  },
  onLaunch: function (e) {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'dev-42b7f4',
        traceUser: true,
      })
    }
    let that = this
        wx.getSetting({
          success: res => {
            if (!res.authSetting['scope.userInfo']) {
              wx.reLaunch({
                url: `/pages/auth/auth?page=${e.path}&query=${JSON.stringify(e.query)}`
              })
            } else {
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  wx.cloud.callFunction({
                    name: 'login',
                    data: {},
                    success: resp => {
                      that.globalData.openid = resp.result.openid
                      that.login({
                        nickname: res.userInfo.nickName,
                        avatar: res.userInfo.avatarUrl
                      })
                    },
                    fail: err => {
                      
                    }
                  })
    
                }
              })
              
            }
          }
    })
},
login (userInfo) {
  let that = this
  const db = wx.cloud.database({
    env: 'dev-42b7f4'
  })
  db.collection('myuser').where({
    _openid: that.globalData.openid
  }).get({
    success (res) {
      console.log(res)
      if (res.data.length == 0) {
        db.collection('myuser').add({
          data: {
            avatar: userInfo.avatar,
            nickname: userInfo.nickname
          }
        }).then(res => {
          that.globalData.myid = res._id
          wx.setStorageSync('myid', res._id)
        })
      } else {
        that.globalData.userInfo = res.data[0]
        that.globalData.myid = res.data[0]._id
        wx.setStorageSync('myid', res.data[0]._id)
      }
    }
  })
},
  globalData: {
    openid: '',
    myid: '',
    userInfo: ''
  }
})
