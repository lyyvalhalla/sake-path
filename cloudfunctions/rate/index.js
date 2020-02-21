// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
     if(event.type == 'emoji') {
      let emoji = db.collection('moments').doc(event.id).update({
        data: {
          like: _.push({
            userid: event.myid,
            index: event.index
          })
        }
      })
       return await emoji
     } else {
      let text =db.collection('moments').doc(event.id).update({
        data: {
          rate: _.push({
            userid: event.myid,
            createTime: event.createTime,
            content: event.content
          })
        }
      })
       return await text
     }
}
