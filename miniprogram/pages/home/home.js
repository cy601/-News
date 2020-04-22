// // pages/home/home.js
var app = getApp();

//最初加载页面时的url
var url = 'https://api.jisuapi.com/news/get?channel=头条&start=0&num=10&appkey=eaf12d04bd78cc9c';
Page({
  data: {
    //天气
    city: '指尖快讯News',
    weather: '',
    quality: '',//空气质量
    temperature: '',
    //状态栏
    statusBarHeight: 0,
    navH: 0,

    // position: [],//当前所在位置，API返回
    newslist: [],
    page: 0,//起始页面
    scrollHeight: 0,
    hidden: true,
    flag: "头条",
    new: [],
    details: [],
    type: "头条",
    homeFlag: '',
    // weatherData: []

    fontsize: 1,//全局字体大小

    titleFontSize: 16,
    selectFontSize: 14,
    normalFontSize: 14,

    themecolor: null,
    darkmode: null,
  },

  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    var that = this;
    app.getFontSize();//重新获取保存的字体大小
    //设置状态栏，获取经纬度,天气
    this.setData({
      fontsize: app.globalData.fontsize,//获取全局字体大小
      navH: app.globalData.navHeight,
      statusBarHeight: app.globalData.statusBar,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      position: app.globalData.position,


      theme: '',
      dark: '',

      // weatherData: app.globalData.weather
    })

    //颜色以及夜间模式
    if (app.globalData.darkmode) {
      that.setData({
        dark:'dark'
      })
    }
    if (app.globalData.themecolor) {
      that.setData({
        theme: app.globalData.themecolor
      })
    }


    that.setFontSize(this.data.fontsize);
    //获得窗口的高度，在划到页面最底部时加载更多要用
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    setTimeout(function () {
      that.setData({
        city: ' 欢迎您 ',
        // position: app.globalData.position,
        // weatherData: app.globalData.weather 
      })
    }, 2000);
    //设置左上角天气
    setTimeout(function () {
      that.setData({

        city: app.globalData.position.newslist[0].district,
        weather: app.globalData.weather.data[0].wea,
        temperature: app.globalData.weather.data[0].tem + '°',

        // quality: '空气质量：' + that.data.weatherData.result.aqi.quality,//
      })
    }, 4000);


    // // 首次打开小程序提醒用户
    var flag = wx.getStorageSync('homeFlag');
    try {
      if (flag !== 1) {
        wx.showModal({
          title: '温馨提示',
          content: '感谢您使用指尖快讯News小程序\n点击左上角查看天气预报\n点击右上角🔍可以进行新闻搜索',
          showCancel: true,
          cancelText: '忽略',
          cancelColor: '#000000',
          confirmText: '不再提醒',
          confirmColor: '#00B26A',
          success: (result) => {
            if (result.confirm) {
              console.log('fav succee');
              wx.setStorage({
                key: "homeFlag",
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


    // 打开小程序进行网络请求，获取新闻列表
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        // console.log(res.data);
        that.setData({
          newslist: res.data.result.list,
        });
      }
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



  //左上角，查看天气预报
  weatherReport: function (params) {
    // console.log('weather');

    wx.navigateTo({
      url: '/pages/weatherReport/weatherReport',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },

  //右上角，打开搜索页面
  search: function (params) {
    wx.navigateTo({
      url: '/pages/search/search',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  //点击某类新闻类别
  browsing: function (event) {
    var that = this
    this.setData({
      page: 0,
      type: event.target.id
    })

    //改变选中类型
    if (this.data.flag == this.data.type) {
      return false;
    } else {
      that.setData({ flag: this.data.type });
    }
    var newstype = event.currentTarget.id;
    //请求点击类型的新闻
    url = 'https://api.jisuapi.com/news/get?channel=' + this.data.type + '&start=' + this.data.page * 10 + '&num=10&appkey=eaf12d04bd78cc9c'
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        this.setData({
          newslist: res.data.result.list,
          // hidden: true
        });
      }
    });
  },



  onPullDownRefresh: function () {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('下拉刷新')
    //模拟加载

    setTimeout(function () {

      // complete

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);

  },
  onShow: function () {
    var that = this
    console.log('onShow');
    app.getFontSize();//重新获取保存的字体大小

    that.setData({
      fontsize: app.globalData.fontsize,//获取全局字体大小
    })
    that.setFontSize(this.data.fontsize);
    // this.onLoad();//重新加载，以便字体、主题改变生效

    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 0
    })
  }
  },



  // 下拉或上拉加载更多
  loadmore: function (event) {
    var that = this;
    this.setData({
      hidden: false,
      page: this.data.page + 1//加载下一页
    });
    https://api.jisuapi.com/news/get?channel=头条&start=0&num=10&appkey=eaf12d04bd78cc9c 
    url = 'https://api.jisuapi.com/news/get?channel=' + this.data.type + '&start=' + this.data.page * 10 + '&num=10&appkey=eaf12d04bd78cc9c'
    wx.request({
      url: url,
      method: 'GET',


      success: (res) => {
        this.setData({
          // newslist: newslres.data.result.list,
          // newslist: new.concat(this.newslist),
          newslist: that.data.newslist.concat(res.data.result.list),
          hidden: true
        })

      }
    })
  },


  //浏览某条具体新闻
  navigate: function (params) {//获取参数
    var that = this
    // console.log(params);

    // content=params.newsItem
    that.setData({
      //获取从视图层传过来的object
      details: params.currentTarget.dataset.key
    });

    wx.navigateTo({
      url: '/pages/details/details?data=' + encodeURIComponent(JSON.stringify(this.data.details)),//先将对象转换为字符串，再encodeURIComponent函数处理，encodeURIComponent() 函数可把字符串作为 URI 组件进行编码，防止url出现特殊字符数据截取。在目标页面接收时用decodeURIComponent转回字符串
      success: (result) => {
        // console.log('d')
        // console.log(this.data.details)
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
    // console.log('setFontSize');
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
  },

}

)
