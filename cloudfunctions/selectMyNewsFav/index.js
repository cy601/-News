/* 
查询数据中"我的新闻收藏" 
*/
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
  // console.log(event._openid)
  try {
    return await db.collection("fav").where({
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



