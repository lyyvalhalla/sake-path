const  db = wx.cloud.database()
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myUser:[],
    userImg:"",
    uid: 1801345,
    nickname:'',
    upload:false
  },
  onShow () {
    let that = this
    db.collection('myuser').where({
      _openid: app.globalData.openid
    }).get({
      success (res) {
        that.setData({
          userInfo: res.data[0]
        })
      }
    })
  },
  upload_type () {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success (res) {
        let filePath = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中'
        })
        const cloudPath = 'image-'+app.globalData.openid +  new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: resp => {
            let userInfo = that.data.userInfo
            userInfo.avatar=resp.fileID
            that.setData({
              userInfo
            })
            db.collection('myuser').doc(app.globalData.myid).update({
              data: {
                avatar: resp.fileID
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  },
  edit_nickname (e) {
    wx.navigateTo({
      url: '../edit/edit?name='+e.currentTarget.dataset.name
    })
  }
    
})