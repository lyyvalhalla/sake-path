// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command
// {
//   id: blur.id,
//   openid: blur.openid,
//   _openid: addEventListener.openid
// }
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let addfriend = db.collection('myuser').doc(event.id).update({
    data: {
      friends: _.push(event.myid)
    }
  }).then(res => {
    return db.collection('myuser').doc(event.myid).update({
      data: {
        friends: _.push(event.id)
      }
    })
  }).then(res => {
    return db.collection('myuser').doc(event.id).get()
  })
  return await addfriend
}
