const app = getApp();
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    list: [],
     activearr: ['active', ''],
     showRate: false,
     showemojibox: false,
     showvideo: false
  },
  initbox () {
    this.setData({
      showRate: false,
     showemojibox: false
    })
  },
  showvideo (e) {
    let that = this
    let url = e.currentTarget.dataset.url
    that.setData({
      currentUrl: url,
      showvideo: true
    })
  },
  hidevideo(){
    this.setData({
      showvideo: false
    })
  },
  nothing() {
    return
  },
  emojirate (e) {
    let index = e.currentTarget.dataset.index
    let avatar = app.globalData.userInfo.avatar
    let that = this
    let list = that.data.list
    list[that.data.currentindex].like = that.data.list[that.data.currentindex].like ? that.data.list[that.data.currentindex].like : []
    list[that.data.currentindex].like.push({
      user: {
        avatar
      },
      index
    })
    that.setData({
      list,
      showemojibox: false
    })
    wx.cloud.callFunction({
      name: 'rate',
      data: {
        id: that.data.list[that.data.currentindex]._id,
        type: 'emoji',
        myid: app.globalData.myid,
        index
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
      },
      fail: err => {
        
      }
    })
  },
  sendrate (e) {
    let that = this
    let avatar = app.globalData.userInfo.avatar
    let nickname = app.globalData.userInfo.nickname
    let createTime = new Date().getTime()
    let list = that.data.list
    list[that.data.currentindex].rate = that.data.list[that.data.currentindex].rate ? that.data.list[that.data.currentindex].rate : []
    list[that.data.currentindex].rate.push({
      user: {
        avatar,
        nickname
      },
      createTime: app.formatMsgTime(createTime),
      content: e.detail.value
    })
    that.setData({
      list,
      showRate: false
    })
    wx.cloud.callFunction({
      name: 'rate',
      data: {
        id: that.data.list[that.data.currentindex]._id,
        type: 'text',
        myid: app.globalData.myid,
        createTime,
        content: e.detail.value
      },
      success: res => {
        wx.hideLoading()
      },
      fail: err => {
        
      }
    })
  },
  showimage (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let inner = e.currentTarget.dataset.inner
    wx.previewImage({
      urls: that.data.list[index].imglist,
      current: that.data.list[index].imglist[inner]
    })
  },
  rateshow () {
    this.setData({
      showRate: true,
      showemojibox: false
    })
  },
  emojiboxshow (e) {
    let currentindex = e.currentTarget.dataset.index
    this.setData({
      currentindex,
      showemojibox: true
    })
  },
  switchtab(e) {
    let index = e.currentTarget.dataset.index
    let activearr = ['', '']
    activearr[index] = 'active'
    this.setData({
      activearr
    })
    this.getList(index+1)
  },
  getList (index) {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      list: []
    })
    if(index == 1) {
      wx.cloud.callFunction({
        name: 'getmoment',
        data: {},
        success: res => {
          
          that.setData({
            list: res.result.data.map(x=>{
              x.createTime = app.formatMsgTime(x.createTime)
              if(x.rate) {
                x.rate.forEach(item => {
                  item.createTime = app.formatMsgTime(item.createTime)
                })
              }
              return x
            })
          })
          wx.hideLoading()
        },
        fail: err => {
          
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'getmoment',
        data: {
          openid: app.globalData.openid
        },
        success: res => {
          console.log(res)
          that.setData({
            list: res.result.data.map(x=>{
              x.createTime = app.formatMsgTime(x.createTime)
              if(x.rate) {
                x.rate.forEach(item => {
                  item.createTime = app.formatMsgTime(item.createTime)
                })
              }
              return x
            })
          })
          wx.hideLoading()
        },
        fail: err => {
          
        }
      })
    }
    
  },
  onShow () {
    let index = this.data.activearr.indexOf('active')
    this.getList(index+1)
  },
  addfriend (id) {
   wx.cloud.callFunction({
    name: 'addfriend',
    data: {
      id,
      myid: wx.getStorageSync('myid')
    },
    success: res => {
    },
    fail: err => {
      
    }
  })
  },
  onLoad (options) {
    if(options.id){
       this.addfriend(options.id)
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '来来来，一壶浊酒喜相逢',
      imageUrl: '/images/share-cover.png'
    }
  }
})