const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

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
      showemojibox: false,
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
  removeitem(e) { //删除帖子
    console.log("hiahiahiahiahiahiahiahiahiahiahiahia")
    let that = this
    let index = e.currentTarget.dataset.index
    let posts = that.data.list;
    let postid = '';
    posts.forEach(function(data, i) {
      if (i === index) {
        postid = data._id;
      }
    })
    db.collection("moments").doc(postid).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
          duration: 2000,     
        })
        wx.startPullDownRefresh()
       
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

  },
  // onPullDownRefresh() {
  //   wx.stopPullDownRefresh()
  // },

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
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log("授权位置成功")
            }
          })
        }
      }
    })
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
              // console.log("让我康康");
              // console.log(app.globalData.userInfo.nickname)
              // console.log(this.currentUser);
              // console.log(x);
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
  addfriend(id) {
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
  onShow () {
    let index = this.data.activearr.indexOf('active')
    this.getList(index+1)
  },
  onLoad (options) {
    //判断是否获取到动态设置的globalData
    if (app.globalData.currentUser && app.globalData.currentUser != '') {
      this.setData({
        currentUser: app.globalData.currentUser
      });
    } else {
      // 声明回调函数获取app.js onLaunch中接口调用成功后设置的globalData数据
      app.currentUserCallback = currentUser => {
        if (currentUser != '') {
          this.setData({
            currentUser: app.globalData.currentUser
          });
        }
      }
    }

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