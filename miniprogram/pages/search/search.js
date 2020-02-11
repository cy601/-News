var app = getApp()
Page({



  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: true, // 搜索框状态
    viewShowed: false,  //显示结果view的状态
    inputVal: "",  // 搜索框值
    topicwordList: [],
    scrollHeight: 0,
    searchResult: false,//是否显示搜索结果 默认不显示
    word: '',//接收前台传回来或输入的关键词
    newslist: [],//获取api返回结果
    fontsize: 1,//默认字体为正常
    titleFontSize: 16,
    listFontSize: 19,
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
    // var url=""
    that.setFontSize(this.data.fontsize);//设置本页面的字体大小值
    var url = 'http://api.tianapi.com/txapi/nethot/index?key=5a34f94c61ecb00817ee7248b096681d'
    let request = wx.request({
      url: url,
      data: {},
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        that.setData({
          topicwordList: result.data.newslist
        })
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
  onShow: function () {
    this.onLoad()//重新加载，
  },

  //显示输入的文字，点击取消后消失
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  // 隐藏搜索框样式 取消
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      searchResult: false
    });
  },
  // 清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 键盘抬起事件
  inputTyping: function (e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value == '') {
      return;
    }
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });
  },
  //input搜索栏回车事件
  enter: function (e) {
    var that = this;
    that.setData({
      searchResult: true,
      word: e.detail.value
    }),
      console.log('enter');

    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 10000,
      mask: false,
    });
    // 网络请求，向网络请求关键词结果
    var url = 'https://api.jisuapi.com/news/search?keyword=' + this.data.word + '&appkey=eaf12d04bd78cc9c';
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        that.setData({
          newslist: res.data.result.list,
        });
        wx.hideToast();
      }, fail: () => {
        wx.hideToast();
        wx.showToast({
          title: '网络阻塞',
          icon: 'none',
          // image:'warn',
          duration: 1500,
          mask: false,
          success: (result) => {
          },
          complete: () => { }
        });

      },
    })
  },

  // 点击热点列表的某个热点词
  topicword: function (params) {
    var that = this
    that.setData({
      searchResult: true,//显示搜索详情页
      word: params.currentTarget.dataset.key.keyword,
      inputVal: params.currentTarget.dataset.key.keyword
    })
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 10000,
      mask: false,
    })
    // 网络请求  
    var url = 'https://api.jisuapi.com/news/search?keyword=' + this.data.word + '&appkey=eaf12d04bd78cc9c';
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        that.setData({
          newslist: res.data.result.list,

        });
        wx.hideToast();
      }, fail: () => {
        wx.hideToast();
        wx.showToast({
          title: '网络阻塞',
          icon: 'none',
          // image:'warn',
          duration: 1500,
          mask: false,
          success: (result) => {
          },
          complete: () => { }
        });

      },
    })
  },


  //点击搜索结果的某条新闻
  navigate: function (params) { //获取参数
    var that = this
    that.setData({
      //获取从视图层传过来的object
      details: params.currentTarget.dataset.key
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
  //设置正文及标题的大小
  setFontSize: function (e) {
    let that = this;
    console.log('setFontSize');
    console.log(e);

    switch (e) {
      case '0':
        that.setData({
          titleFontSize: 14,
          listFontSize: 15,

        })
        break;
      case '1':
        that.setData({
          titleFontSize: 16,
          listFontSize: 19,

        })
        break;
      case '2': that.setData({
        titleFontSize: 20,
        listFontSize: 21,

      })

        break;
      case '3': that.setData({
        titleFontSize: 24,
        listFontSize: 23,

      })

        break;
      default:
        break;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})