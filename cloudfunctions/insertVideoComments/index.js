// // 使用了 async await 语法
// const cloud = require('wx-server-sdk')
// const db = cloud.database()
// const _ = db.command

// exports.main = async (event, context) => {
//   try {
//     return await db.collection('newscomments').where({
//       done: true
//     }).remove()
//   } catch(e) {
//     console.error(e)
//   }
// }
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
    return await db.collection("video_comments").add({
      data: {
        video: event.video,
        commentsFlag: true,
        comments: new Array(
          [
            event.userInfo,
            event.date,
            event.word,
            event.position,
            0,//赞成
            0,//反对
            event.deviceFlag,//是否有设备信息
            event.model,//设备信息
           
          ]
        ),
        createTime: db.serverDate() //添加该字段
      }
    })
  } catch (e) {
    console.error(e)
  }
  // db.collection('newscomments').add({
  // try {
  //   return await db.collection("footprint_video").add({
  //     data: {
  //       comments: _.push(new Array(
  //         [
  //           event.userInfo,
  //           event.data,
  //           event.word,
  //           event.like
  //           // util.formatTime(new Date()),
  //           // this.data.word,
  //           // 0
  //         ]
  //       ))
  //     }
  //   })
  // } catch (e) {
  //   console.error(e)
  // }




}



// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()
// const db = cloud.database();

// // 云函数入口函数
// exports.main = async (event, context) => {
//   try{
//     return await db.collection("image").doc(event._id).update({
//       data:{
//         praise: event.dianza
//       }
//     })
//   }catch(e){
//     console.error(e)
//   }
// }