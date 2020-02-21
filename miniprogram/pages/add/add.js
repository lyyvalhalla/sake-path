const app = getApp();
Page({
  data: {
    content: '',
    money: '',
    people: '',
    imglist: [],
    videolist: [],
    cover: '',
    lasttimeopen: false,
    sending: false,
    location: ''
  },
  chooselocation () {
    let that= this
    wx.chooseLocation({
      success (res) {
        that.setData({
          location: res.name,
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  textinput (e) {
    let name = e.currentTarget.dataset.name
    let value = e.detail.value
    let json = {}
    json[name] = value
    this.setData(json)
  },
  typechange (e) {
    this.setData({
      lasttimeopen: e.detail.value
    })
  },
  showimage (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: that.data.imglist,
      current: that.data.imglist[index]
    })
  },
  clearvideo (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    wx.showModal({
      content: '确定删除此视频?',
      success (res) {
        if(res.confirm) {
          that.data.videolist.splice(index, 1)
          that.setData({
            videolist: that.data.videolist
          })
        }
      }
    })
  },
  clearimg (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    wx.showModal({
      content: '确定删除此图片?',
      success (res) {
        if(res.confirm) {
          that.data.imglist.splice(index, 1)
          that.setData({
            imglist: that.data.imglist
          })
        }
      }
    })
  },
  add () {
    let that = this
    if (that.data.imglist.length == 0 && that.data.videolist.length == 0) {
      wx.showActionSheet({
        itemList: ['照片', '视频'],
        success(res) {
          if(res.tapIndex == 0) {
            that.addimg()
          } else {
            that.addvideo()
          }
        }
      })
    } else {
      that.addimg()
    }
  },
  addvideo () {
    let that = this
    wx.chooseVideo({
      sizeType: ['compressed'],
      maxDuration: 15,
      success (res) {
        console.log(res)
        let filePath = res.tempFilePath
        wx.showLoading({
          title: '上传中'
        })
        // 上传视频
        const cloudPath = 'image-'+app.globalData.openid +  new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: resp => {
            that.setData({
              videolist: [resp.fileID]
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
        if (res.thumbTempFilePath) {
          let coverPath = 'image-'+app.globalData.openid +  new Date().getTime() + res.thumbTempFilePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath: coverPath,
          filePath: res.thumbTempFilePath,
          success: resp => {
            that.setData({
              cover: resp.fileID
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
      }
    })
  },
  addimg () {
    let that = this
    wx.chooseImage({
      count: 9 - that.data.imglist.length,
      sizeType: ['compressed'],
      success (res) {
        let tem = res.tempFilePaths
        wx.showLoading({
          title: '上传中'
        })
        for(var i=0;i< tem.length; i++) {
          let filePath = tem[i]
        
        // 上传图片
        const cloudPath = 'image-'+app.globalData.openid+ i +  new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: resp => {
            console.log(resp.fileID)
            let imglist = that.data.imglist
            imglist.push(resp.fileID)
            console.log(imglist)
            that.setData({
             imglist: imglist
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
      }
    })
  },
  release () {
    let that = this
    if(!that.data.content && that.data.imglist.length==0 && that.data.videolist.length==0) {
      wx.showModal({
        content: '请输入动态内容，图片，视频',
        showCancel: false
      })
      return
    }
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    that.setData({
      sending: true
    })
    const db = wx.cloud.database()
    db.collection('moments').add({
      data: {
        imglist: that.data.imglist,
        cover: that.data.cover,
        video: that.data.videolist,
        content: that.data.content,
        location: that.data.location,
        createTime: new Date().getTime(),
        myid: app.globalData.myid
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
          duration: 2000
        })
        setTimeout(
          function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '失败'
        })
      }
    })
    
  }
})