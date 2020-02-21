// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let getalluser = db.collection('myuser').where({
    nickname: db.RegExp({
      regexp: event.nickname||'',
      options: 'i',
    })
  }).get()
  let getmyinfo = db.collection('myuser').where({
    _openid: wxContext.OPENID
  }).get()
  let alluser = await getalluser
  let myinfo = await getmyinfo
  alluser.data.forEach(item => {
    item.status = 0
    myinfo.data[0].friends && myinfo.data[0].friends.forEach(inner => {
      if(inner+'' == item._id+'') {
        item.status = 1
      }
    })
  })
  return alluser
}
