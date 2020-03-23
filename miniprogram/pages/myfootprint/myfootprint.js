// pages/myfootprint/myfootprint.js
var app = getApp();
Page({


  data: {
    flag: '新闻',//用于标记浏览的是新闻收藏页还是视频收藏页
    myfootprintNewsList: [],
    myfootprintVideoList: [],
    fontsize: 1,//全局字体大小
    titleFontSize: 16,
    selectFontSize: 14,
    normalFontSize: 14,
    videoDetails: [],
    details: [],
    scrollHeight: 0,

    //暗黑模式及主题色
    theme: '',
    dark: '',

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


    //颜色以及夜间模式
    if (app.globalData.darkmode) {
      that.setData({
        dark: 'dark'
      })
    }
    if (app.globalData.themecolor) {
      that.setData({
        theme: app.globalData.themecolor
      })
    }
    this.setNavigationBarColor(this.data.theme);



    //获得窗口的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    this.footprintInit();//初始化浏览记录列表
  },

  
//设置导航栏颜色
setNavigationBarColor: function (theme) {
  var color = '';
  switch (theme) {
    case '':
      color = '#00B26A'
      break;
    case 'red':
      color = '#D22222'
      break;
    case 'blue':
      color = '#0077ED'
      break;
    case 'purple':
      color = '#673BB7'
      break;

    default:

      break;
  }
  if (app.globalData.darkmode) {
    color = '#000000'
  }
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: color,
    animation: {
      duration: 0,
      timingFunc: 'linear'
    },
    success: (result) => {
      console.log('set navbar color succee');

    },
    fail: () => { },
    complete: () => { }
  });
},




  /* ********************************************
          改变所选类别（视频、新闻）
  **********************************************/
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


  /* ********************************************
                  打开某条收藏新闻  
  **********************************************/
  navigate: function (params) { //获取参数
    var that = this
    that.setData({
      //获取从视图层传过来的object
      details: params.currentTarget.dataset.key.news
    });
    wx.navigateTo({
      url: '/pages/details/details?data=' + encodeURIComponent(JSON.stringify(this.data.details)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
      success: (result) => {
        console.log(this.data.details)
      },
      fail: () => {
        console.log('失败')
      },
    });
  },

  /* ********************************************
              打开某个收藏视频 
  **********************************************/
  videoDetails: function (params) {//获取参数
    var that = this
    console.log(params);

    // content=params.newsItem
    that.setData({
      //获取从视图层传过来的object
      videoDetails: params.currentTarget.dataset.key.news
    });

    wx.navigateTo({
      url: '/pages/videoplay/videoplay?data=' + encodeURIComponent(JSON.stringify(this.data.videoDetails)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
      success: (result) => {
        // console.log('d')
        console.log(this.data.videoDetails)
      },
      fail: () => {
        console.log('失败')
      },
      complete: () => { }
    });
  },

  //收藏列表初始化
  footprintInit: function () {
    var that = this;
    const db = wx.cloud.database()
    // // 1. 获取数据库引用
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    // console.log('11');

    //调用云函数，查询我的新闻及视频浏览记录
    wx.cloud.callFunction({
      name: 'selectNewsFootprint',
      data: {
        _openid: app.globalData._openid,

      },
      success: res => {
        console.log('调用云数据库成功')
        console.log(res);
        that.setData({
          myfootprintNewsList: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: 'selectVideoFootprint',
      data: {
        _openid: app.globalData._openid,

      },
      success: res => {
        console.log('调用云数据库成功')
        console.log(res);
        that.setData({
          myfootprintVideoList: res.result.data
        })
      }
    })




    // db.collection('footprint_news').where({

    // }).orderBy('createTime','desc').get({
    //   success: function (res) {
    //     console.log('dd');

    //     console.log(res)
    //     that.setData({
    //       myfootprintNewsList: res.data
    //     })
    //   }
    // })

    //   db.collection('footprint_video').where({

    //   }).orderBy('createTime', 'desc').get({
    //     success: function (res) {

    //       console.log(res)
    //       that.setData({
    //         myfootprintVideoList: res.data
    //       })
    //     }
    //   })
  },

  /* ***************************************************
                清空新闻浏览历史 
  *****************************************************/

  deleteNewsHistory: function () {

    wx.showModal({
      title: '温馨提示',
      content: '是否要清空新闻浏览记录',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {

        //先获取获取用户openid
        wx.cloud.callFunction({
          name: 'getOpenid',
          complete: res => {
            var _openid = res.result.OPENID
            // console.log(_openid);


            /* ******************************************
            删除多条记录需要调用云函数
            ******************************************/
            if (result.confirm) {
              wx.cloud.callFunction({
                name: 'deleteNewsHistory',
                data: {
                  _openid: _openid
                },
                success: res => {
                  this.footprintInit();
                  console.log('删除成功')
                  console.log(res.data);
                  console.log(res);
                  wx.showToast({
                    title: '删除浏览记录成功',
                    icon: 'success',//打钩
                    image: '',
                    duration: 800,
                    mask: false,
                    success: (result) => {
                    },
                    fail: () => { },
                    complete: () => { }
                  });
                }
              })

            }
          },
        });
        // console.log('delete history');
        // console.log('callFunction test result: ', res)
      }
    })

  },


  /* ********************************************
                 清空视频浏览历史
  **********************************************/
  deleteVideoHistory: function () {
    wx.showModal({
      title: '温馨提示',
      content: '是否要清空视频浏览记录',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        //先获取获取用户openid
        wx.cloud.callFunction({
          name: 'getOpenid',
          complete: res => {
            var _openid = res.result.OPENID
            // console.log(_openid);


            /* ******************************************
            删除多条记录需要调用云函数
            ******************************************/
            if (result.confirm) {
              wx.cloud.callFunction({
                name: 'deleteVideoHistory',
                data: {
                  _openid: _openid
                },
                success: res => {
                  this.footprintInit();
                  console.log('删除成功')
                  console.log(res.data);
                  console.log(res);
                  wx.showToast({
                    title: '删除浏览记录成功',
                    icon: 'success',//打钩
                    image: '',
                    duration: 800,
                    mask: false,
                    success: (result) => {
                    },
                    fail: () => { },
                    complete: () => { }
                  });
                }
              })

            }
          },
        });
        // console.log('delete history');
        // console.log('callFunction test result: ', res)



      },
      fail: () => { },
      complete: () => { }
    });
    console.log('delete history');

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
    this.footprintInit()
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

  /* ********************************************
                设置正文及标题的大小
  **********************************************/
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