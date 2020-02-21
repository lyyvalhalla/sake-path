// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   let getfriends = db.collection('myuser').where({
     _openid: wxContext.OPENID
   }).get().then(res => {
     if(res.data[0].friends && res.data[0].friends.length>0) {
       let sql = []
       res.data[0].friends.forEach(item => {
         let itemsql = {}
         itemsql._id = _.eq(item)
         sql.push(itemsql)
       })
       return db.collection('myuser').where(_.or(sql)).get()
     }else {
       return []
     }
   }).then(res => {
     return res.data
   })
  let friends = await getfriends
  return friends
}
