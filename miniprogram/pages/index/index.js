// //index.js
// //获取应用实例
const app = getApp()

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
//Page Object
Page({
  data: {
    delete: '',
  },
  //options(Object)
  onLoad: function () {

    let request = wx.request({
      url: 'http://top.baidu.com/buzz?b=1&fr=topindex',
      data: {

      },
      header: {
        //'content-type': 'application/json' // 默认值 
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值 
        'content-type':'application/x-www-form-urlencoded;charset=utf-8',
      //  ' Content-Type': "text/html;"
      },
      method: 'POST',
      // dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result
          );

      },
      fail: () => { },
      complete: () => { }
    });




    wx.getUserInfo({
      success: function (res) {
        console.log(res);

        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })

    // var that = this;
    // const db = wx.cloud.database()


    // //获取用户openid
    // wx.cloud.callFunction({
    //   name: 'test',
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //   }
    // })

    // wx.cloud.callFunction({
    //   name: 'sum',
    //   data: {
    //     a: 1,
    //     b: 2,
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //   },
    // })

    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'sum',
    //   // 传给云函数的参数
    //   data: {
    //     a: 1,
    //     b: 2,
    //   },
    //   success: function (res) {
    //     console.log(res.result.sum) // 3
    //   },
    //   fail: console.error
    // })

    // 使用了 async await 语法
    // const cloud = require('wx-server-sdk')
    // const db = cloud.database()


    // const _ = db.command

    // exports.main = async (event, context) => {
    //   try {
    //     return await db.collection('fav').where({

    //     }).remove()
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }


    // // 1. 获取数据库引用
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据

    // db.collection('fav').where({

    // }).get({
    //   success: function (res) {
    //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
    //     // console.log(res.data[0]._id)
    //     that.setData({
    //       delete: res.data[0]._id,
    //     })
    //   }
    // })



    // // setTimeout(() => {
    // //       console.log(this.data.delete);
    // // }, 2000);


    // setTimeout(() => {
    //   //以ID删除
    //   db.collection('fav').doc(this.data.delete).remove({
    //     success: function (res) {
    //       console.log(res.data)
    //       console.log('delete succee');

    //     }
    //   })
    // }, 3000);




    // //往云数据库增添东西
    // db.collection('fav').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了

    //     "title": "受疫情影响地区意甲或空场6-7轮 国家德比受牵连",
    //     "time": "2020-02-24 14:38:00",
    //     "src": "国际足球综合",
    //     "category": "sports",
    //     "pic": "https://n.sinaimg.cn/sports/crawl/260/w640h420/20200224/9c55-ipvnszf4362991.jpg",
    //     "content": "<p class=\"art_p\">直播吧2月24日讯 由于新冠肺炎疫情的影响，意甲本轮有4场比赛延期，其中包括国米主场对阵桑普多利亚。</p>\n<p class=\"art_p\">据《米兰体育报》报道，原定于北京时间3月2日凌晨3：45进行的尤文与国米之间的意大利国家德比可能被推迟，也可能空场进行。除非尤文方面提出要求，否则本场比赛非常可能空场进行。</p>\n<div sax-type=\"proxy\" class=\"j_native_uvw200224 box\" style=\"margin:20px 0\"></div><p class=\"art_p\">意大利政府官员以及体育部长斯帕达弗拉正在制定一项相关法令，法令预计将在今日生效。该法令规定了意大利国内继续进行体育赛事的可能性，但是受到新冠肺炎疫情影响的地区（包括都灵所在的皮埃蒙特大区）将采用空场的形式进行比赛。</p>\n<p class=\"art_p\">目前，相关部门仍在讨论该项法令的持续时间，据悉，该法令可能持续6-7轮比赛。一旦法令实施，尤文主场与国米的意大利国家德比就将空场进行。</p>",
    //     "url": "https://sports.sina.cn/seriea/inter/2020-02-24/detail-iimxxstf3971557.d.html?vt=4&pos=108",
    //     "weburl": "https://sports.sina.com.cn/g/seriea/2020-02-24/doc-iimxxstf3971557.shtml"

    //   },
    //   success: function (res) {
    //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //     console.log(res)
    //   }
    // })

    // var that =this
    // // 获取集合的引用
    // const articles = app.globalData.db.collection('fav')
    // // 获取文章列表集合数据
    // articles.get({
    //   success(res) {
    //     // res.data 包含该记录的数据
    //     console.log(res.data)
    //     that.setData({
    //       articles: res.data
    //     })
    //   }
    // })
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});