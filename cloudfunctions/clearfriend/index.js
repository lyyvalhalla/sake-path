// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command
// {
//   id: user.id,
//   myid: my.id
// }
exports.main = async (event, context) => {
  let gethisinfo = await db.collection('myuser').doc(event.id).get()
  let hisinfo = gethisinfo.data
  let hisnewfriends = []
  if (hisinfo.friends && hisinfo.friends.length) {
    hisinfo.friends.forEach(item => {
      if((item != event.myid) && item  && hisnewfriends.indexOf(item) < 0){
        hisnewfriends.push(item)
      }
    })
  }
  await db.collection('myuser').doc(event.id).update({
    data: {
      friends: hisnewfriends
    }
  })
  let getmyinfo = await db.collection('myuser').doc(event.myid).get()
  let myinfo = getmyinfo.data
  let mynewfriends = []
  if (myinfo.friends && myinfo.friends.length) {
    myinfo.friends.forEach(item => {
      if((item != event.id) && item  && mynewfriends.indexOf(item) < 0){
        mynewfriends.push(item)
      }
    })
  }
  await db.collection('myuser').doc(event.myid).update({
    data: {
      friends: mynewfriends
    }
  })
  // let clearfriendonce = db.collection('myuser').doc(event.id).get().then(res => {
  //   let newfriends = []
  //   res.data.friends && res.data.friends.forEach(item => {
  //     if(item != event.myid){
  //       newfriends.push(item)
  //     }
  //    })
  //    db.collection('myuser').doc(event.id).update({
  //      data: {
  //        friends: newfriends
  //      }
  //    })
  // }).then(res => {
  //   db.collection('myuser').doc(event.myid).get().then(res => {
  //     let newfriends = []
  //     res.data.friends && res.data.friends.forEach(item => {
  //       if(item != event.id){
  //         newfriends.push(item)
  //       }
  //      })
  //      db.collection('myuser').doc(event.myid).update({
  //        data: {
  //          friends: newfriends
  //        }
  //      })
  //   })
  // })
  return 'ok'
}
