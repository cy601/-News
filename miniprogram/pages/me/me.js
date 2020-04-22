// pages/me/me.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    //暗黑模式及主题色
    theme: '',
    dark: '',

    // onShareAppMessage: function (options) {

    //   let thas = this;

    //   if (options.from === 'button') {

    //     // 来自页面内转发按钮

    //     shareObj = {
    //       title: "页面分享",
    //       path: "/pages/index/index",
    //       desc: "我在观运算命，你也来试试吧",
    //       imageUrl: '/images/img_honorbook_masterdata.png',
    //       success: function (res) {
    //       }

    //     }
    //     return shareObj;
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    ;
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


  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  myfav: function () {
    wx.navigateTo({
      url: '/pages/myfav/myfav',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },
  mycomments: function () {
    wx.navigateTo({
      url: '/pages/mycomments/mycomments',
    })
  },
  myfootprint: function () {
    wx.navigateTo({
      url: '/pages/myfootprint/myfootprint',
    })
  },
  setup: function () {
    wx.navigateTo({
      url: '/pages/setup/setup',
    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '/pages/setup/feedback',
    })
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




  // share: function () {
  //   console.log("分享button")

  //   wx.onMenuShareAppMessage({
  //     title: '计划书', // 分享标题
  //     desc: '保险让生活更美好！', // 分享描述
  //     link: '${fenxurl}', // 分享链接
  //     imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png',                          // 分享图标
  //     type: 'link', // 分享类型,music、video或link，不填默认为link
  //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
  //     success: function () {
  //       // 用户确认分享后执行的回调函数
  //       alert("您已分享");
  //     },
  //     cancel: function () {
  //       // 用户取消分享后执行的回调函数
  //       alert('您已取消分享');
  //     }
  //   })


  // }
  // ,



  log: function () {
    wx.navigateTo({
      url: '/pages/logs/logs',
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
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 2
    })
  }
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function (options ) {
  //   title:'aaa'
  //   imgUrl:'/icons/fire.png'                 // 分享图标
  // }


  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "指尖快讯News",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/home/home',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '/icons/fire.png',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      // complete: fucntion(){
      //   // 转发结束之后的回调（转发成不成功都会执行）
      // }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset;
      console.log(eData.name);     // shareBtn
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    }
    // 返回shareObj
    return shareObj;
  }



})