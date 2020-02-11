// pages/weather/weather.js
let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: [],//传过来的天气
    position: [],
    scrollHeight: 0, // 滚动区域的高度
    iconImageHeight: 0,
    location: '正在加载…',//当前所处区域
    weatherUpdateTime: '',//天气更新时间
    latitude: 0,
    longitude: 0,
    currentTemperature: 'N/A ',
    currentWea: 'N/A',
    weatherIcon: '/icons/weather/weather_icon_29.svg',
    tips: '',//穿衣建议
    weatherArray: [],
    listArray: [],
    navH: 0,
    statusBarHeight: 0,
    quality: '空气',
    humidity: '湿度 ',
    winddirection: '风速 ',
    windspeed: '风向',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calcScrollHeight();
    //设置状态栏，获取经纬度,天气
    this.setData({
      navH: app.globalData.navHeight,
      statusBarHeight: app.globalData.statusBar,

      // weatherData: app.globalData.weather
    })
    //获取位置,保存为全局变量
    let that = this;
    setTimeout(() => {
      that.setData(
        {
          weather: app.globalData.weather,
          position: app.globalData.position
        })
    }, 1000),
      setTimeout(() => {
        if (this.data.weather.data[0].index[1].desc) {
          that.setData({
            tips: this.data.weather.data[0].air_tips,
            location: this.data.position.newslist[0].district + ' ' + this.data.position.newslist[0].town,

            currentTemperature: this.data.weather.data[0].tem.replace(/[^0-9]/ig, ""),//去掉温度的单位
            weatherArray: that.remapData(this.data.weather.data),
            weatherIcon: that.getWeatherIcon(this.data.weather.data[0].wea),//当前天气icon
            weatherUpdateTime: /(\d{2}:\d{2}):\d{2}/g.exec((this.data.weather.update_time)), //正则表达式
            quality: " 空气" + this.data.weather.data[0].air_level + ' ' + this.data.weather.data[0].air,
            currentWea: this.data.weather.data[0].wea,
            humidity: " 湿度 " + this.data.weather.data[0].humidity + '%',
            windspeed: " 风速" + '  ' + this.data.weather.data[0].win_speed,
            winddirection: this.data.weather.data[0].win
          })

          // console.log('aa');

        }
        // console.log(this.data.listArray);
      }, 1000);
    // that.data.weatherUpdateTime[1] = weatherUpdateTime[1] + "更新"

  },

  home: function () {
    wx.navigateBack({
      delta: 1
    });

  },
  // 计算滚动区域的高度
  calcScrollHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.select('.top').boundingClientRect(function (res) {
      let topHeight = res.height;
      let screenHeight = wx.getSystemInfoSync().windowHeight;
      let scrollHeight = screenHeight - topHeight - 70; // 屏幕的高度 - 头部蓝色区域高 - 标题栏

      that.setData({
        scrollHeight: scrollHeight,
        iconImageHeight: topHeight / 2.6 //设置图标宽度
      })
    }).exec();
  },


  remapData(data) {
    let listData = [];
    for (let i = 0; i < data.length; i++) {
      data[i].weekday = this.getWeekday(data[i].date);
      data[i].icon = this.getWeatherIcon(data[i].wea);
      if (i != 0) {//删去今天的内容
        listData.push(data[i])
      }
    }
    this.setData({
      listArray: listData,
    });


    return data;
  },

  getWeekday(date) {
    var mydate = new Date(date);
    var myddy = mydate.getDay();
    var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekday[myddy];
  },
  getWeatherIcon(weather) {
    switch (weather) {
      case "晴":
        return "/icons/weather/weather_icon_4.svg";
      case "多云转中雨":
        return "/icons/weather/weather_icon_17.svg";
      case "多云转晴":
        return "/icons/weather/weather_icon_3.svg";
      case "中雨转多云":
        return "/icons/weather/weather_icon_8.svg";
      case "晴转多云":
        return "/icons/weather/weather_icon_3.svg";
      case "多云":
        return "/icons/weather/weather_icon_2.svg";
      case "雷阵雨转多云":
        return "/icons/weather/weather_icon_24.svg";
      case "多云转阵雨":
        return "/icons/weather/weather_icon_14.svg";
      case "阵雨转多云":
        return "/icons/weather/weather_icon_14.svg";
      case "阵雨":
        return "/icons/weather/weather_icon_33.svg";
      case "中雨":
        return "/icons/weather/weather_icon_32.svg";
      case "大雨":
        return "/icons/weather/weather_icon_6.svg";
      case "阴":
        return "/icons/weather/weather_icon_1.svg";
      case "小雨":
        return "/icons/weather/weather_icon_13.svg";
      case "多云转阴":
        // return "/icons/weather/weather_icon_13.svg";
        
        break;
    }
  },


  //刷新天气
  refresh: function () {
    var that = this;
    console.log("refresh");


    app.getweater();
    //模拟加载
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      image: '',
      mask: false,
      success: (result) => {
        setTimeout(function () {

          that.onLoad();
          // wx.stopPullDownRefresh() //停止下拉刷新
          wx.hideToast();

        }, 1500);
        setTimeout(() => {
          wx.showToast({
            title: '刷新成功',
            icon: 'succee',
            image: '',
            duration: 500,
            mask: false,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });
        }, 1000);


      },
      fail: () => {
        wx.showToast({
          title: '刷新失败，请重试',
          image: 'fail',
          duration: 1500,
          mask: false,
          success: (result) => {

          },
          fail: () => { },
          complete: () => { }
        });
      },
      complete: () => { }
    });



  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {
  //   var that = this;
  //   wx.showNavigationBarLoading() //在标题栏中显示加载
  //   app.getweater();
  //   //模拟加载

  //   setTimeout(function () {

  //     // complete

  //     wx.hideNavigationBarLoading() //完成停止加载
  //     that.onLoad();
  //     wx.stopPullDownRefresh() //停止下拉刷新

  //   }, 1500);
  // },

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


});


