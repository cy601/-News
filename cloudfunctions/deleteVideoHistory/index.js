// 使用了 async await 语法
// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: 'fingerflash-ayfug'
})
const db = cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('footprint_video').where({
      _openid: event._openid,
      explore: true
    })
      .remove({
        success: function (res) {
          console.log(res.data)
          console.log('成功删除浏览记录');

        }
      })
  } catch (e) {
    console.error(e)
  }
}