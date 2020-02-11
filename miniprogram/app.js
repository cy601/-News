//app.js
App({
  globalData: {
    userInfo: null,
    navHeight: 0,//导航栏高度
    statusBar: 0,//状态栏高度
    latitude: 0,//经纬度
    longitude: 0,
    position: [],//当前位置
    weather: [],//天气数据
    fontsize: 1,//字体大小，默认为正常大小
    _openid: '',
    systemInfo: [],//设备信息
    //   db: wx.cloud.database({
    //     env: 'fingerflash-ayfug'
    //  })
  },
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'fingerflash-ayfug',
        traceUser: true,


      }, console.log('succee'))
    }

    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    that.getFontSize();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }),

      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              lang: 'zh_CN',   //获得简体中文信息
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                console.log(res.userInfo);

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    //设置自定义导航栏高度
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        //导航高度
        t.globalData.navHeight = res.statusBarHeight + 44;//44px是官方规定的导航栏高度
        t.globalData.statusBar = res.statusBarHeight;
      }
    });



    //先获取获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // var _openid = res.result.OPENID
        that.globalData._openid = res.result.OPENID
        // console.log('获取openid成功'),

        // console.log( that.globalData._openid);
      }
    })

    //获取当前经纬度,保存为全局变量
    // let that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      isHighAccuracy: true,//超高精度
      success: function (res) {
        that.globalData.longitude = res.longitude;
        that.globalData.latitude = res.latitude;
        // console.log(that.globalData.longitude);
        // console.log(that.globalData.latitude);
        // },
        that.getposition();//请求位置信息
      },
    })



    wx.getSystemInfo({
      success: (result) => {
        console.log(result);

        that.globalData.systemInfo = result;
      },
      fail: () => { },
      complete: () => { }
    });


  },



  // getSystemInfo: function () {//获取状态栏
  //   let t = this;
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       t.globalData.systemInfo = res;
  //       //导航高度
  //       t.globalData.navHeight = res.statusBarHeight + 46;//46px是官方规定的导航栏高度
  //       t.globalData.statusBar = res.statusBarHeight;
  //     }
  //   });
  // },

  getFontSize: function () {
    let that = this
    that.globalData.fontsize = wx.getStorageSync('fontsize');
    console.log('字体大小' + that.globalData.fontsize);
  },

  //获取当前位置信息
  getposition: function () {

    // wx.cloud.callFunction({
    //   name: 'selectPosition',
    //   data: {
    //     longitude: this.globalData.longitude,
    //     latitude: this.globalData.latitude,
    //   },
    //   success: res => {
    //     console.log(res.result);
    //     this.globalData.position = res.result;
    //     this.getweater();//请求天气
    //     console.log('获取位置成功');
    //     console.log( this.globalData.position);


    //   }
    // })

    let request = wx.request({
      url: 'http://api.tianapi.com/txapi/geoconvert/index?key=5a34f94c61ecb00817ee7248b096681d&lng=' + this.globalData.longitude + '&lat=' + this.globalData.latitude,

      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        this.globalData.position = result.data;
        console.log(result.data)

        this.getweater();//请求天气

      },
      fail: () => { },
      complete: () => { }
    });
  },

  //请求当前位置天气
  getweater: function () {
    let request = wx.request({
      url: 'https://tianqiapi.com/api?version=v1&appid=31815538&appsecret=WNrQsm9j&cityid=' + this.globalData.position.newslist[0].adcode,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data);
        this.globalData.weather = result.data

      },
      fail: () => { },
      complete: () => { }
    });
  }

})