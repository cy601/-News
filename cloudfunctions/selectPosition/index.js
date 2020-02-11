// // 查询数据中"我的评论"
// // 云函数入口文件
// const cloud = require('wx-server-sdk');
// const rq = require('request-promise');


// // cloud.init()
// cloud.init({
//   env: 'fingerflash-ayfug'
// })
// // const db = cloud.database();
// // const _ = db.command
// // url: 'http://api.tianapi.com/txapi/geoconvert/index?key=5a34f94c61ecb00817ee7248b096681d&lng=' + this.globalData.longitude + '&lat=' + this.globalData.latitude,

// // 云函数入口函数
// exports.main = async (event, context) => {
//   url: 'http://api.tianapi.com/txapi/geoconvert/index?key=5a34f94c61ecb00817ee7248b096681d&lng=' + event.longitude + '&lat=' + event.latitude;

//   return await rp(url)
//     .then(function (res) {
//       return res
//     })
//     .catch(function (err) {
//       return '失败'
//     });

// }

// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // let url = 'https://www.baidu.com';
  let url= 'http://api.tianapi.com/txapi/geoconvert/index?key=5a34f94c61ecb00817ee7248b096681d&lng=' + event.longitude + '&lat=' + event.latitude;

  return await rp(url)
    .then(function (res) {
      console.log(res)
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}

