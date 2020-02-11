// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// // 使用了 async await 语法
// const db = cloud.database()
// const _ = db.command
// cloud.init({
//   env: 'fingerflash-ayfug'
// })

// // 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: 'fingerflash-ayfug'
})
//定义得在init之后
const db = cloud.database();
const _ = db.command


exports.main = async (event, context) => {
  try {
    console.log(event);
    console.log(context);


    return await db.collection('footprint_news').where({
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