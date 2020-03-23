// pages/setup/setup.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stroageinfo: '0KB',
    fontsize: ['小', '正常', '大', '超大'],
    index: 1,//用于标记所选的字体大小，默认为正常,
    autodark: false,//自动夜间模式
    darkmode: false,//夜间模式
    theme: 0,//默认主题为绿色
    themelist: ['微信绿', '网易红', '知乎蓝', '葡萄紫'],
    deviceFlag: true,//评论时允许使用设备信息，默认为允许
    positionFlag: true,//评论时允许使用位置信息，默认为允许

    //暗黑模式及主题色
    theme: '',
    dark: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var index = wx.getStorageSync('fontsize');
      var autodark = wx.getStorageSync('autodark');
      var darkmode = wx.getStorageSync('darkmode');
      var theme = wx.getStorageSync('theme');
      var positionFlag = wx.getStorageSync('positionFlag');
      var deviceFlag = wx.getStorageSync('deviceFlag');
      if (index) {
        that.setData({
          index: index
        })
      }
      if (autodark) {
        that.setData({
          autodark: autodark
        })
      }
      if (darkmode) {
        that.setData({
          darkmode: darkmode
        })
      }
      if (theme) {
        that.setData({
          theme: theme
        })
      }
      if (!deviceFlag) {
        that.setData({
          deviceFlag: deviceFlag
        })
      }
      if (!positionFlag) {
        that.setData({
          positionFlag: positionFlag
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);

      },
      fail: () => { },
      complete: () => { }
    });


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
      console.log(this.data.theme);
      
    }
    this.setNavigationBarColor(this.data.theme);


    // that.setData({
    //   // index: wx.getStorageSync('fontsize'), //获取已设置的字体大小，
    //   autodark: wx.getStorageSync('autodark'),
    //   darkmode: wx.getStorageSync('darkmode'),
    //   theme: wx.getStorageSync('theme')
    // })

    wx.getStorageInfo({
      success: (result) => {
        console.log(result);

        that.setData({
          stroageinfo: result.currentSize + 'KB'
        })
      },
      fail: () => { },
      complete: () => { }
    });

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


  //改变字体大小
  bindPickerFontChange: function (e) {
    console.log('字体大小改变为', e.detail.value)


    //存储更新后的字体大小
    wx.setStorage({
      key: "fontsize",
      data: e.detail.value
    })
    this.setData({
      index: e.detail.value
    })
    // wx.showModal({
    //   title: '温馨提示',
    //   content: '部分页面需要重启小程序生效，点击确定立即重启',
    //   showCancel: true,
    //   cancelText: '忽略',
    //   cancelColor: '#000000',
    //   confirmText: '重启',
    //   confirmColor: '#00B26A',
    //   success: (result) => {
    //     if (result.confirm) {
    //       // this.UpdateManager.applyUpdate();
    //       wx.reLaunch();
    //     } else {
    //       console.log('不重启');
    //     }
    //   },
    //   fail: () => {
    //   },
    // })
  },


  //夜间模式
  setdarkmode: function (e) {
    let that = this
    console.log('夜间模式', e.detail.value)
    wx.showToast({
      title: '设置成功，部分界面重启后生效',
      icon: 'none',
      image: '',
      duration: 800,
      mask: false,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

    //存储更新后的夜间模式设置
    wx.setStorage({
      key: "darkmode",
      data: e.detail.value
    })
    that.setData({
      darkmode: e.detail.value
    })
  },
  //自动夜间模式
  setautodark: function (e) {
    let that = this
    //存储更新后的自动夜间模式设置
    wx.setStorage({
      key: "autodark",
      data: e.detail.value
    })
    console.log('自动夜间模式', e.detail.value)
    that.setData({
      autodark: e.detail.value
    })
  },

  //使用位置信息
  positionMode: function (e) {
    let that = this
    //存储更新后的自动夜间模式设置
    wx.setStorage({
      key: "positionFlag",
      data: e.detail.value
    })
    console.log('使用位置信息', e.detail.value)
    that.setData({
      positionFlag: e.detail.value
    })
  },

  //使用设备信息
  deviceMode: function (e) {
    let that = this
    //存储更新后的自动夜间模式设置
    wx.setStorage({
      key: "deviceFlag",
      data: e.detail.value
    })
    console.log('使用设备信息', e.detail.value)
    that.setData({
      deviceFlag: e.detail.value
    })
  },
  //清除所有本地缓存
  clearstorage: function (options) {
    let that = this;
    wx.clearStorage()
    console.log('clearstorage');
    wx.showToast({
      title: '清除中…',
      icon: 'loading',
      image: '',
      duration: 1500,
      mask: false,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
    setTimeout(() => {
      wx.showToast({
        title: '成功清除',
        icon: 'succee',
        image: '',
        duration: 1000,
        mask: false,
        success: (result) => {
          that.setData({
            stroageinfo: '0KB'
          })

        },
        fail: () => { },
        complete: () => { }
      });
    }, 1500);


  },
  //改变主题颜色
  bindPickerThemeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    wx.showToast({
      title: '设置成功，部分界面重启后生效',
      icon: 'none',
      image: '',
      duration: 800,
      mask: false,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    //存储更新后的字体大小
    wx.setStorage({
      key: "theme",
      data: e.detail.value
    })
    this.setData({
      theme: e.detail.value
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