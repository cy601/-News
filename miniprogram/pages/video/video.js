// pages/video/video.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://api.tianapi.com/txapi/dyvideohot/index?key=5a34f94c61ecb00817ee7248b096681d',
    videolist: '',
    scrollHeight: 0,
    duration: 0,
    details: [],
    fontsize: 1,//默认字体为正常
    listFontSize: 16
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getFontSize();//重新获取保存的字体大小

    that.setData({
      fontsize: app.globalData.fontsize,//获取全局字体大小
    })
    that.setFontSize(this.data.fontsize);//设置本页面的字体大小值

    var flag = wx.getStorageSync('videoFlag');
    try {
      if (flag !== 1) {
        wx.showModal({
          title: '温馨提示',
          content: '此榜单仅展示抖音视频热榜前20个\n如要浏览更多，请下载抖音APP',
          showCancel: true,
          cancelText: '忽略',
          cancelColor: '#000000',
          confirmText: '不再提醒',
          confirmColor: '#00B26A',
          success: (result) => {
            if (result.confirm) {
              console.log('fav succee');
              wx.setStorage({
                key: "videoFlag",
                data: 1
              })
            } else {
              console.log('fav failure');
            }
          },
          fail: () => {
          },
        })
      }
    } catch (e) {
      console.log('fail')
    }


    // let that = this;
    let request = wx.request({
      url: this.data.url,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        that.setData({
          videolist: result.data.newslist
        })

        console.log(result.data);


      },
      fail: () => { },
      complete: () => { }
    });

    //获得窗口的高度，在划到页面最底部时加载更多要用
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },



  //浏览某个视频
  details: function (params) {//获取参数
    var that = this
    console.log(params);

    // content=params.newsItem
    that.setData({
      //获取从视图层传过来的object
      details: params.currentTarget.dataset.key
    });

    wx.navigateTo({
      url: '/pages/videoplay/videoplay?data=' + encodeURIComponent(JSON.stringify(this.data.details)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
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


  //设置正文及标题的大小
  setFontSize: function (e) {
    let that = this;
    console.log('setFontSize');
    console.log(e);

    switch (e) {
      case '0':
        that.setData({
          listFontSize: 13,

        })
        break;
      case '1':
        that.setData({
          listFontSize: 16,

        })
        break;
      case '2': that.setData({
        listFontSize: 19,

      })

        break;
      case '3': that.setData({
        listFontSize: 24,

      })

        break;
      default:
        break;
    }
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
    console.log('onShow');
    app.getFontSize();//重新获取保存的字体大小
    this.onLoad();//重新加载，以便字体、主题改变生效
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

  }
})