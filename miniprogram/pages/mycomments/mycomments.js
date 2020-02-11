// pages/mycomments/mycomments.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: '新闻',//用于标记浏览的是新闻收藏页还是视频收藏页

    myNewsCommentsList: [],
    myVideoCommentsList: [],
    fontsize: 1,//全局字体大小
    titleFontSize: 16,
    selectFontSize: 14,
    normalFontSize: 14,
    videoDetails: [],
    details: [],
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getFontSize();
    that.setData({
      fontsize: app.globalData.fontsize,
    })
    that.setFontSize(this.data.fontsize);

    //获得窗口的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.commentsListInit();//初始化评论列表

  },
  changeType: function (event) {
    var that = this;
    //改变选中类型
    if (this.data.flag == this.data.type) {
      return false;
    } else {
      that.setData({
        flag: event.target.id
      });
    }

  },




  //评论列表初始化
  commentsListInit: function () {
    var that = this;
    const db = wx.cloud.database()
    // // 1. 获取数据库引用
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    // console.log('11');

    // db.collection('self_news_comments').where({

    // }).get({
    //   success: function (res) {
    //     // console.log('dd');

    //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
    //     console.log(res.data)
    //     that.setData({
    //       myNewsCommentsList: res.data
    //     })
    //     // console.log(myNewsCommentsList);

    //   }
    // })


    wx.cloud.callFunction({
      name: 'selectMyNewsComments',
      data: {
        _openid: app.globalData._openid,
      },
      success: res => {
        console.log('[数据库] [查询我的新闻评论记录] 成功: ', res)
        console.log(res);
        that.setData({
          myNewsCommentsList: res.result.data
        })

        // this.initComments();
        // that.setData({
        //   inputVal: ''
        // })
        // console.log(res.data);
        // console.log(res);
        // wx.showToast({
        //   title: '评论成功',
        //   icon: 'success',//打钩
        //   image: '',
        //   duration: 800,
        //   mask: false,
        //   success: (result) => {
        //   },
        //   fail: () => { },
        //   complete: () => { }
        // });
      }


    }),

      wx.cloud.callFunction({
        name: 'selectMyVideoComments',
        data: {
          _openid: app.globalData._openid,
        },
        success: res => {
          console.log('[数据库] [查询我的新闻评论记录] 成功: ', res)
          console.log(res);
          that.setData({
            myVideoCommentsList: res.result.data
          })
        }
      })



      // db.collection('self_video_comments').where({

      // }).get({
      //   success: function (res) {
      //     // console.log('dd');

      //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
      //     console.log(res)
      //     that.setData({
      //       myVideoCommentsList: res.data
      //     })
      //   }
      // })
  },
  //点开新闻查看评论
  navigate: function (params) {//获取参数
    var that = this
    console.log(params);

    // content=params.newsItem
    // that.setData({
    //获取从视图层传过来的object
    var url = params.currentTarget.dataset.key.news.url
    // });
    console.log(url);
    var details = params.currentTarget.dataset.key.news
    wx.navigateTo({
      url: '/pages/details/details?data=' + encodeURIComponent(JSON.stringify(details)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
      success: (result) => {
        console.log('d')
        // console.log(this.data.details)
      },
      fail: () => {
        console.log('失败')
      },
      complete: () => { }
    });


    // const db = wx.cloud.database()
    // var that = this
    // db.collection('newscomments').where({

    //   // news: this.data.details
    //   news: {
    //     url: url
    //   }
    // }).get({
    //   success: res => {
    //     that.setData({
    //       commentFlag: res.data[0].commentFlag,
    //       _id: res.data[0]._id,
    //       commentsList: res.data[0].comments
    //       // queryResult: JSON.stringify(res.data, null, 2)
    //     })
    //     console.log('[数据库] [查询记录] 成功: ', res)
    //   },
    //   fail: err => {
    //     // wx.showToast({
    //     //   icon: 'none',
    //     //   title: '查询记录失败'
    //     // })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
    // wx.cloud.callFunction({
    //   name: 'selectOriginalText',
    //   data: {
    //     // id: this.data._id,
    //     // userInfo: this.data.userInfo,
    //     // date: util.formatTime(new Date()),
    //     // word: this.data.inputVal,
    //     // position: this.data.position.newslist[0].province + this.data.position.newslist[0].city,
    //     // like: 0,
    //     url: url,
    //   },
    //   success: res => {
    //     console.log('调用云数据库成功')
    //     console.log(res);


    //     // this.initComments();
    //     // that.setData({
    //     //   inputVal: ''
    //     // })
    //     // console.log(res.data);
    //     // console.log(res);
    //     // wx.showToast({
    //     //   title: '评论成功',
    //     //   icon: 'success',//打钩
    //     //   image: '',
    //     //   duration: 800,
    //     //   mask: false,
    //     //   success: (result) => {
    //     //   },
    //     //   fail: () => { },
    //     //   complete: () => { }
    //     // });
    //   }


    // })

  },

  navigatetoVideo:function(params){
    var that = this
    console.log(params);

    // content=params.newsItem
    // that.setData({
    //获取从视图层传过来的object
    // var url = params.currentTarget.dataset.key.news.url
    // });
    // console.log(url);
    var details = params.currentTarget.dataset.key.video
    wx.navigateTo({
      url: '/pages/videoplay/videoplay?data=' + encodeURIComponent(JSON.stringify(details)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
      success: (result) => {
        // console.log('d')
        console.log(this.data.details)
      },
      fail: () => {
        console.log('失败')
      },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.commentsListInit();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //设置正文及标题的大小
  setFontSize: function (e) {
    let that = this;
    console.log('setFontSize');
    console.log(e);

    switch (e) {
      case '0':
        that.setData({
          titleFontSize: 14,
          normalFontSize: 12,
          selectFontSize: 12
        })
        break;
      case '1':
        that.setData({
          titleFontSize: 16,
          normalFontSize: 14,
          selectFontSize: 14
        })
        break;
      case '2': that.setData({
        titleFontSize: 20,
        normalFontSize: 17,
        selectFontSize: 17
      })

        break;
      case '3': that.setData({
        titleFontSize: 24,
        normalFontSize: 20,
        selectFontSize: 20,
      })

        break;
      default:
        break;
    }
  }
})