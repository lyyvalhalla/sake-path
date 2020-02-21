//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    list: [],
    newlist: [],
    name: '',
    nomore : false
  },
  excharge (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let data = JSON.stringify(that.data.list[index])
    wx.navigateTo({
      url: '../excharge/excharge?data='+data
    })
  },
  nosearch () {
    this.setData({
      newlist: [],
      name: ''
    })
  },
  searchname (e) {
    var name = e.detail.value
    let that = this
    that.setData({
      name
    })
    if(name == '') {
      that.setData({
        newlist: []
      })
      return
    }
    that.searchFriends(name)
  },
  clear (e) {
    let that = this
    let id = that.data.list[e.currentTarget.dataset.index]._id
    let index = e.currentTarget.dataset.index
    console.log(id, app.globalData.myid)
    wx.showModal({
      content: '确定删除?',
      success (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'clearfriend',
            data: {
              id,
              myid: app.globalData.myid
            },
            success: res => {
              wx.hideLoading()
              let newlist = that.data.list
              newlist.splice(index, 1)
              that.setData({
                list: newlist
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            },
            fail: err => {
              
            }
          })
        }
    }
    })
  },
  searchFriends(name) {
     let that = this
     wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'searchuser',
      data: {
        nickname: name
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          newlist: res.result.data
        })
      },
      fail: err => {
        
      }
    })
  },
  getList() {
    let that = this
    wx.showLoading({
     title: '加载中'
   })
   wx.cloud.callFunction({
     name: 'getmyfriends',
     data: {
     },
     success: res => {
       wx.hideLoading()
       that.setData({
         list: res.result||[]
       })
     },
     fail: err => {
       
     }
   })
 },
 addfriend (e) {
   let that = this
   let id = that.data.newlist[e.currentTarget.dataset.index]._id
   let openid = that.data.newlist[e.currentTarget.dataset.index]._openid
   wx.cloud.callFunction({
    name: 'addfriend',
    data: {
      id,
      myid: app.globalData.myid
    },
    success: res => {
      wx.hideLoading()
      console.log(res.result)
      let list = that.data.list
      list.push(res.result.data)
      let newlist = that.data.newlist
      newlist[e.currentTarget.dataset.index].status = 1
      that.setData({
        list,
        newlist
      })
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })
    },
    fail: err => {
      
    }
  })
 },
 onShareAppMessage(res) {
  return {
    title: '来来来,一壶浊酒喜相逢',
    imageUrl: '/images/share-cover.png'
    //path: '/pages/index/index?id='+app.globalData.myid
  }
},
  // onPullDownRefresh: function(){
  //   let that = this
  //   page = 1
  //   onPage = 1
  //   that.setData({
  //     nomore: false
  //   })
  //   that.getList()
  //   wx.stopPullDownRefresh()
  // },
  // onReachBottom () {
  //   if(onPage == page && that.data.nomore) {
  //     return
  //   } else {
  //     this.getList()
  //   }
  // },
  onLoad () {
    let that = this
    that.getList()
  }
})