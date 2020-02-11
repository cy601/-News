// pages/myfav/myfav.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: '新闻',//用于标记浏览的是新闻收藏页还是视频收藏页
    myFavList: [],

    myVideoFavList: [],
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
    this.favlistinit();

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
  //浏览搜藏新闻具体页面
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
  //浏览某个视频
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
  favlistinit: function () {
    var that = this;
    const db = wx.cloud.database()

    wx.cloud.callFunction({
      name: 'selectMyNewsFav',
      data: {
        _openid: app.globalData._openid,

      },
      success: res => {
        console.log('调用云数据库成功')
        console.log(res);
        that.setData({
          myFavList: res.result.data
        })
      }
    })
 
    //调用云函数，查询我的收藏记录
    wx.cloud.callFunction({
      name: 'selectMyVideoFav',
      data: {
        _openid: app.globalData._openid,

      },
      success: res => {
        console.log('调用云数据库成功')
        console.log(res);
        that.setData({
          myVideoFavList: res.result.data
        })
      }
    })

    // db.collection('fav_video').where({

    // }).orderBy('createTime', 'desc').get({
    //   success: function (res) {
    //     // console.log('dd');

    //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
    //     console.log(res)
    //     that.setData({
    //       myVideoFavList: res.data
    //     })
    //   }
    // })
  },
  //长按删除收藏
  deleteNews: function (params) {
    console.log(params);
    var that = this;
    console.log('long tap to delete');
    wx.showModal({
      title: '温馨提示',
      content: '是否取消收藏？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#00B26A',
      success: (result) => {
        if (result.confirm) {
          console.log('cancel favorite');
          console.log(params.currentTarget.dataset.key._id);
          const db = wx.cloud.database()
          db.collection('fav').doc(params.currentTarget.dataset.key._id).remove({
            success: function (res) {
              that.favlistinit();//更新数据
              wx.showToast({
                title: '成功取消收藏',
                icon: 'none',
                image: '',
                duration: 500,
                mask: false,
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
              });
              ;

            }
          })

        } else {
          console.log('cancel operate');
        }
      },
      fail: () => {
      },
    })
  },

  //长按删除收藏
  deleteVideo: function (params) {
    console.log(params);
    var that = this;
    console.log('long tap to delete');
    wx.showModal({
      title: '温馨提示',
      content: '是否取消收藏？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#00B26A',
      success: (result) => {
        if (result.confirm) {
          console.log('cancel favorite');
          console.log(params.currentTarget.dataset.key._id);
          const db = wx.cloud.database()
          db.collection('fav_video').doc(params.currentTarget.dataset.key._id).remove({
            success: function (res) {
              that.favlistinit();//更新数据
              wx.showToast({
                title: '成功取消收藏',
                icon: 'none',
                image: '',
                duration: 500,
                mask: false,
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
              });
              ;

            }
          })

        } else {
          console.log('cancel operate');
        }
      },
      fail: () => {
      },
    })
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
    this.favlistinit();
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