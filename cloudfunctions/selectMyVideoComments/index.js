// 查询数据中"我的评论"
// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: 'fingerflash-ayfug'
})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("self_video_comments").where({
      // data: {
        _openid: event._openid
      // }
    }).orderBy('createTime','desc').get({//实现倒序排列，比较符合实际操作
      success: function (res) {
      
        console.log(res.data)
        
      }
    })
  } catch (e) {
    console.error(e)
  }



}



