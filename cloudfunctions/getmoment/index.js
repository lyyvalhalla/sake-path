// 获取朋友圈列表
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.openid) {
    let getmymoments = db.collection('moments').where({
      _openid: event.openid
    }).orderBy('createTime', 'desc').get()
    let mymoments = await getmymoments
    for(var i=0; i< mymoments.data.length; i++) {
      let getmyinfo = await (db.collection('myuser').doc(mymoments.data[i].myid).field({
        avatar: true,
        nickname: true,
        _id: true
      }).get())
      mymoments.data[i].user =  getmyinfo.data
      if(mymoments.data[i].like && mymoments.data[i].like.length>0) {
        for(var j = 0 ; j< mymoments.data[i].like.length; j++) {
          let getmyinfolike = await (db.collection('myuser').doc(mymoments.data[i].like[j].userid).field({
            avatar: true,
            nickname: true,
            _id: true
          }).get())
          mymoments.data[i].like[j].user = getmyinfolike.data
        }
      }
      if(mymoments.data[i].rate && mymoments.data[i].rate.length>0) {
        for(var k = 0 ; k< mymoments.data[i].rate.length; k++) {
          let getmyinforate = await (db.collection('myuser').doc(mymoments.data[i].rate[k].userid).field({
            avatar: true,
            nickname: true,
            _id: true
          }).get())
          mymoments.data[i].rate[k].user = getmyinforate.data
        }
      }
    }
    return mymoments
  } else {
    let getmyfriend = await db.collection('myuser').where({
      _openid: wxContext.OPENID
    }).get()
    let myfriendsinfo = getmyfriend.data[0].friends || []
    let sql = []
    myfriendsinfo.forEach(item => {
         let itemsql = {}
         itemsql._id = _.eq(item)
         sql.push(itemsql)
       })
       let getmyfriendsopenids
    if(sql.length) {
      getmyfriendsopenids = await (db.collection('myuser').where(_.or(sql)).get())
    } else {
      getmyfriendsopenids = {
        data: []
      }
    }
    let opensql = []
    getmyfriendsopenids.data.forEach(item => {
      let itemsql = {}
         itemsql._openid = _.eq(item._openid)
         opensql.push(itemsql)
    })
    opensql.push({
      _openid: _.eq(wxContext.OPENID)
    })
    let myallmoments = db.collection('moments').where(_.or(opensql)).orderBy('createTime', 'desc').get({
      success (res) {
         return res.data
      }
    })
    let allmoments = await myallmoments
    for(var i=0; i< allmoments.data.length; i++) {
      let getmyinfo = await (db.collection('myuser').doc(allmoments.data[i].myid).field({
        avatar: true,
        nickname: true,
        _id: true
      }).get())
      allmoments.data[i].user =  getmyinfo.data
      if(allmoments.data[i].like && allmoments.data[i].like.length>0) {
        for(var j = 0 ; j< allmoments.data[i].like.length; j++) {
          let getmyinfolike = await (db.collection('myuser').doc(allmoments.data[i].like[j].userid).field({
            avatar: true,
            nickname: true,
            _id: true
          }).get())
          allmoments.data[i].like[j].user = getmyinfolike.data
        }
      }
      if(allmoments.data[i].rate && allmoments.data[i].rate.length>0) {
        for(var k = 0 ; k< allmoments.data[i].rate.length; k++) {
          let getmyinforate = await (db.collection('myuser').doc(allmoments.data[i].rate[k].userid).field({
            avatar: true,
            nickname: true,
            _id: true
          }).get())
          allmoments.data[i].rate[k].user = getmyinforate.data
        }
      }
    }
    return allmoments
  }
  
}
