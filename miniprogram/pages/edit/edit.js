const  db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },
  onLoad (options) {
    this.setData({
      name: options.name
    })
  },
  nameinput (e) {
    this.setData({
      name: e.detail.value
    })
  },
  save () {
    let that = this
    db.collection('myuser').doc(app.globalData.myid).update({
      data: {
        nickname: that.data.name
      }
    }).then(res => {
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })
      setTimeout(()=> {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    })

  }
    
})