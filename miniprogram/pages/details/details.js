/*
新闻详情页
*/
var util = require("../../utils/util.js");
var app = getApp();

var innerAudioContext = wx.createInnerAudioContext()

// const app = getApp();
//引入插件：微信同声传译
// const plugin = requirePlugin('WechatSI');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '',//标题
    sourceUrl: '',//原文链接
    source: '',//来源
    date: '',//日期
    body: '',//正文
    details: null,//用于接收上个页面传过来的参数
    fontsize: '',
    aritcalFontsize: 16,//正文字体大小
    commentsList: [],//数据库中评论列表

    /* ********************************************
              用于实现双击操作
    **********************************************/
    titleFontSize: 24,//标题字体大小
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    position: '',//用户当前所处位置

    show: "false",

    msg: '',

    favFlag: '',//默认为false，用于首次启动提醒用户双击添加收藏
    star: false,//标记是否收藏
    explore: false, //标记此新闻是否存在浏览历史数据库中
    inputShowed: true, // 搜索框状态
    viewShowed: false,  //显示结果view的状态
    inputVal: "",  // 搜索框值
    word: '',//评论内容
    commentsFlag: false,//标记此新闻是否已经存储在 收藏数据库中，若无，则新增，若有，则更新信息
    // myConmmentsFlag: false,//标记此用户是否已经评论此新闻，用于将此用户评论的内容集中在 我的-我的评论中，默认为false
    _id: '',//若此新闻在评论数据库中存在，获取_id，以便更新
    userInfo: [],//用户信息
    // userInfo: {},
    hasUserInfo: false, //是否已经获得用户信息，用于在评论中展示用户的头像、昵称、评论时间
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // position: '',
    model: '',//用户设备型号
    deviceFlag: false,//标记此新闻的用户是否允许被获取设备信息
    order: true,//评论正序/逆序
    src: '',


    token: '',
    IMEI: '',
    filePath: '',


    //播放暂停按钮显示/隐藏标志
    pauseFlag: false,
    playFlag: false,

    //暗黑模式及主题色
    theme: '',
    dark: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getFontSize();//重新获取保存的字体大小

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






    this.innerAudioContext = wx.createInnerAudioContext();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          IMEI: res.SDKVersion
        })
        // this.data.IMEI = res.SDKVersion

        console.log(that.data.IMEI)

      }
    });
    // this.data.IMEI = res.SDKVersion



    var that = this;

    that.setData({
      details: JSON.parse(decodeURIComponent(options.data)),

    })
    that.setData({
      title: this.data.details.title,
      body: this.data.details.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" '),
      fontsize: app.globalData.fontsize,//获取全局字体大小

      // body = this.data.details.content.replace(regex, `<img style="max-width:100%;height:auto;display:block;"`),

      // body: this.data.details.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"') ,
      sourceUrl: this.data.details.url,
      source: this.data.details.src,
      date: this.data.details.time,
    })

    //用户是否允许评论时加上当前位置信息
    var positionFlag = wx.getStorageSync('positionFlag');
    if (positionFlag) {
      that.setData({
        position: app.globalData.position
      })
    };

    //用户是否允许评论时加上自己的设备信息
    var deviceFlag = wx.getStorageSync('deviceFlag');
    if (deviceFlag) {
      that.setData({
        deviceFlag: deviceFlag
      })
    }
    if (this.data.deviceFlag) {
      that.setData({
        model: app.globalData.systemInfo.model
      })
      console.log(this.data.model);
    }
    else {
      that.setData({
        model: null
      })
    }

    that.setFontSize(this.data.fontsize); //设置字体大小
    // //获取用户信息
    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       userInfo: res.userInfo
    //     })


    //   }
    // })
    this.initComments();//初始化评论列表


    /************************************************ 
          获取用户信息，便于在评论中展现个人信息
    **************************************************/


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




    // // 1. 获取数据库引用
    const db = wx.cloud.database()




    /* ************************************************
                 查询数据库中是否已经收藏此新闻
     **********************************************/

    db.collection('fav').where({
      news: this.data.details
    }).get({
      success: res => {
        this.setData({
          star: res.data[0].flag,

          // queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    }),








      // /* ************************************************
      //              获取数据库中所有评论
      //  **********************************************/

      // db.collection('newscomments').where({
      //   news: this.data.details
      // }).get({
      //   success: res => {
      //     this.setData({
      //       star: res.data[0].flag,

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
      // }),


      /* ************************************************
                  查询个人评论数据库中是否有此新闻记录 
      **********************************************/
      db.collection('self_news_comments').where({

        // news: this.data.details
        news: {
          url: this.data.details.url
        }
      }).get({
        success: res => {
          that.setData({
            myConmmentsFlag: res.data[0].myConmmentsFlag,
            // _id: res.data[0]._id,
            // queryResult: JSON.stringify(res.data, null, 2)
          })
          console.log('[数据库] [个人评论数据库查询] 成功: ', res)
        },
        fail: err => {
          // wx.showToast({
          //   icon: 'none',
          //   title: '查询记录失败'
          // })
          console.error('[数据库] [个人评论数据库查询] 失败：', err)
        }
      })



    /* *******************************************
          查询数据库中是否有此新闻的浏览记录 
    *************************************************/

    db.collection('footprint_news').where({
      // news: this.data.details

      news: {
        url: this.data.details.url
      }
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          explore: res.data[0].explore,

          // queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询浏览记录] 成功: ', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        console.error('[数据库] [查询浏览记录] 失败：', err)
        // })

      }
    }),
      //设置延时，防止数据库查询操作未完成时再插入重复数据
      setTimeout(() => {
        console.log(!this.data.explore);
        if (!this.data.explore) {
          //向云数据库添加浏览记录
          db.collection('footprint_news').add({
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              news: this.data.details,
              explore: true,
              createTime: db.serverDate() //添加到数据库时间
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              that.setData({
                explore: true//已经添加浏览记录
              }),


                console.log(res);
            }
          })
        }
      }, 1500);



    /* ***************************************
          首次打开小程序提醒用户收藏功能 
   ***************************************** */
    var flag = wx.getStorageSync('favFlag');
    try {
      if (flag !== 1) {
        wx.showModal({
          title: '提示',
          content: '双击任意区域收藏文章\n长按文章语音朗读',
          showCancel: true,
          cancelText: '忽略',
          cancelColor: '#000000',
          confirmText: '不再提醒',
          confirmColor: '#00B26A',
          success: (result) => {
            if (result.confirm) {
              console.log('fav succee');
              wx.setStorage({
                key: "favFlag",
                data: 1
              })
            } else {
              console.log('fav failure');
            }
          },
          fail: () => {

          },
          complete: () => { }
        })
      }
    } catch (e) {
      console.log('fail')
      // Do something when catch error
    }




  },

  // onReady(e) {
  //   //创建内部 audio 上下文 InnerAudioContext 对象。
  //   this.innerAudioContext = wx.createInnerAudioContext();
  //   this.innerAudioContext.onError(function (res) {
  //     console.log(res);
  //     wx.showToast({
  //       title: '语音播放失败',
  //       icon: 'none',
  //     })
  //   }) 
  // },
  broadcast: function (e) {
    console.log(e)
    var that = this
    that.setData({
      msg: this.filterHTMLTag(e.currentTarget.dataset.key)
    })
    this.tts();
    // console.log(a);
    // this.wordYun(a)
  },


  filterHTMLTag: function (str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/ /ig, '');//去掉 
    return str;
  },

  // // 文字转语音
  // wordYun: function (e) {
  //   var that = this;
  //   var content = e;
  //   plugin.textToSpeech({
  //     lang: "zh_CN",
  //     tts: true,
  //     content: content,
  //     success: function (res) {
  //       console.log(res);
  //       console.log("succ tts", res.filename);
  //       that.setData({
  //         src: res.filename
  //       })
  //       that.yuyinPlay();

  //     },
  //     fail: function (res) {
  //       console.log("fail tts", res)
  //     }
  //   })
  // },

  // //播放语音
  // yuyinPlay: function (e) {
  //   if (this.data.src == '') {
  //     console.log(暂无语音);
  //     return;
  //   }
  //   this.innerAudioContext.src = this.data.src //设置音频地址
  //   this.innerAudioContext.play(); //播放音频
  // },

  // // 结束语音
  // end: function (e) {
  //   this.innerAudioContext.pause();//暂停音频
  // },


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




  //获取用户个人信息
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 点击右下角阅读原文，跳转到原文
  webview: function (web) {
    var that = this

    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(this.data.sourceUrl),
      success: (result) => {
        console.log(this.data.sourceUrl)
      },
      fail: () => {
        console.log('失败')
      },
      complete: () => { }
    });


  },
  // 按钮触摸开始触发的事件
  touchStart: function (e) {
    var that = this;
    that.setData({ touchStartTime: e.timeStamp })

    console.log('touch');

  },

  // 按钮触摸结束触发的事件
  touchEnd: function (e) {
    var that = this;
    that.setData({
      touchEndTime: e.timeStamp
    })

  },


  //改变评论顺序
  changeOrder: function () {
    var that = this;
    that.setData({
      order: !this.data.order
    })
    // if(!this.data.order){
    // this.data.commentsList.reverse();
    this.initComments();
    // }
  },
  /* ********************************************
                实现双击收藏操作
    **********************************************/
  doubleTap: function (e) {
    var that = this
    console.log(e);

    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (this.data.touchEndTime - this.data.touchStartTime < 350) {
      // 当前点击的时间
      console.log('small');

      var currentTime = e.timeStamp
      //存储上次点击时间
      var lastTapTime = this.data.lastTapTime
      // 更新最后一次点击时间
      that.setData({
        lastTapTime: currentTime
      })

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log(currentTime);

        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        if (!this.data.star) {
          // var that = this;
          const db = wx.cloud.database()
          console.log('store to DB');
          //向云数据库添加收藏
          db.collection('fav').add({
            // data 字段表示需新增的 JSON 数据
            // data: this.data.details,
            // flag:true,
            // date:this.data.flag,
            data: {
              news: this.data.details,
              flag: true,
              createTime: db.serverDate() //添加到数据库时间
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id

              console.log(res);
              wx.showToast({
                title: '已收藏',
                icon: 'success',//打钩
                image: '',
                duration: 500,
                mask: false,
                success: (result) => {
                },
                fail: () => { },
                complete: () => { }
              });
            }
          }),
            that.setData({
              star: true
            })
        }
        else {
          wx.showToast({
            title: '无需重复收藏',
            icon: '',//
            image: '/icons/fail.png',
            duration: 500,
            mask: false,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });
        }
      }
    }
  },


  /* ********************************************
                  点击星星收藏或取消收藏
  **********************************************/
  tostar: function () {
    var that = this;
    const db = wx.cloud.database()
    if (!this.data.star) {

      //向云数据库添加收藏
      db.collection('fav').add({
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          news: this.data.details,
          flag: true,
          createTime: db.serverDate() //添加到数据库时间
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          that.setData({
            star: true//收藏图标变黄色
          }),
            wx.showToast({
              title: '成功收藏',
              icon: 'none',
              // image: '',
              duration: 500,
              // mask: false,
              success: (result) => {

              },
              fail: () => { },
              complete: () => { }
            });

          console.log(res);
        }
      })

    }
    //取消收藏
    else {

      db.collection('fav').where({
        news: this.data.details
      }).remove({
        success: res => {
          this.setData({
            star: false
          })
          console.log('[数据库] [删除记录] 成功: ', res)
          wx.showToast({
            title: '成功取消收藏',
            icon: 'none',
            // image: '',
            duration: 500,
            // mask: false,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });

        },
        fail: err => {
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })

    }
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
          aritcalFontsize: 12,
          titleFontSize: 18
        })
        break;
      case '1':
        that.setData({
          aritcalFontsize: 16,
          titleFontSize: 24
        })
        break;
      case '2': that.setData({
        aritcalFontsize: 20,
        titleFontSize: 26
      })
        break;
      case '3': that.setData({
        aritcalFontsize: 26,
        titleFontSize: 32
      })

        break;
      default:
        break;
    }
  },



  /********************************************* 
                底下评论栏
 *********************************************/

  back: function () {
    wx.navigateBack({
      delta: 1
    });
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
    // if (e.detail.value == '') {
    //   return;
    // }
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });
  },


  //input搜索栏回车事件,发表评论
  enter: function (e) {
    console.log(e);
    if (e.detail.value !== '') {
      var that = this;
      that.setData({
        word: e.detail.value
      });

      if (this.data.hasUserInfo) {
        this.insertPublicComments();//插入公共评论数据库
        this.insertpPivateComments();//插入私有评论数据库
      }
      else {
        wx.showToast({
          title: '请先登录后评论',
          icon: 'none',
          image: '',
          duration: 800,
          mask: false,
          success: (result) => {

          },
          fail: () => { },
          complete: () => { }
        });
      }
    }
    else {
      console.log('输入不能为空');
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        image: '',
        duration: 800,
        mask: false,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });

    }
    //占位符，获取输入内容，增添到数据库
    //之后清空inputVal

    console.log('enter');


  },

  /* ************************************************
             初始化评论列表 
 **********************************************/
  initComments: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('newscomments').where({

      // news: this.data.details
      news: {
        url: this.data.details.url
      }
    }).get({
      success: res => {

        that.setData({
          commentsFlag: res.data[0].commentsFlag,
          _id: res.data[0]._id,
          commentsList: res.data[0].comments
          // queryResult: JSON.stringify(res.data, null, 2)
        })
        if (!this.data.order) {
          console.log('逆序');
          this.data.commentsList.reverse();
          that.setData({
            commentsList: this.data.commentsList
          })
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
  ,

  insertPublicComments: function () {
    var that = this;
    //评论数据库中没有此新闻，直接插入
    if (!this.data.commentsFlag) {
      if (this.data.position) {
        var position = this.data.position.newslist[0].province + this.data.position.newslist[0].city
      }
      else {
        var position = ''
      }
      wx.cloud.callFunction({
        name: 'insertNewsComments',
        data: {
          news: this.data.details,
          userInfo: this.data.userInfo,//用户信息
          date: util.formatTime(new Date()),//评论时间
          word: this.data.inputVal,//评论内容
          // position: this.data.position.newslist[0].province + this.data.position.newslist[0].city,
          position: position,
          deviceFlag: this.data.deviceFlag,
          model: this.data.model,


          // id: this.data._id,
          // userInfo: this.data.userInfo,
          // date: util.formatTime(new Date()),
          // word: this.data.inputVal,
          // position: this.data.position.newslist[0].province + this.data.position.newslist[0].city,
          // like: 0,
        },
        success: res => {
          // console.log('添加评论成功')
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


          that.setData({
            commentFlag: true,
            inputVal: '',
            _id: res._id

          })
          this.initComments();
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          // console.log(res);
          console.log("插入评论成功");
          wx.showToast({
            title: '评论成功',
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
      // const db = wx.cloud.database()
      // console.log('store to DB');
      // //向云数据库添加收藏
      // db.collection('newscomments').add({
      //   data: {
      //     news: this.data.details,
      //     commentFlag: true,
      //     comments: new Array([
      //       this.data.userInfo,//用户信息
      //       util.formatTime(new Date()),//评论时间
      //       this.data.inputVal,//评论内容
      //       this.data.position.newslist[0].province + this.data.position.newslist[0].city,
      //       0//点赞数为0
      //     ])
      //   },
      //   success: function (res) {
      //     that.setData({
      //       commentFlag: true,
      //       inputVal: '',
      //       _id: res._id

      //     })
      //     this.initComments();
      //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      //     // console.log(res);
      //     console.log("插入私有库成功");
      //     wx.showToast({
      //       title: '评论成功',
      //       icon: 'success',//打钩
      //       image: '',
      //       duration: 800,
      //       mask: false,
      //       success: (result) => {
      //       },
      //       fail: () => { },
      //       complete: () => { }
      //     });
      //   }
      // })
    }
    //数据库中存在此新闻，更新

    else {
      console.log('update comments');
      // const _ = db.command
      if (this.data.position) {
        var position = this.data.position.newslist[0].province + this.data.position.newslist[0].city + "网友"
      }
      else {
        var position = ''
      }
      wx.cloud.callFunction({
        name: 'updateNewsComments',
        data: {
          id: this.data._id,
          userInfo: this.data.userInfo,
          date: util.formatTime(new Date()),
          word: this.data.inputVal,
          // position: this.data.position.newslist[0].province + this.data.position.newslist[0].city,
          position: position,
          deviceFlag: this.data.deviceFlag,
          model: this.data.model,
          // like: 0,
          // dislike: 0
        },
        success: res => {
          console.log('更新数据成功')
          this.initComments();
          that.setData({
            inputVal: ''
          })
          console.log(res.data);
          console.log(res);
          wx.showToast({
            title: '评论成功',
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



  insertpPivateComments: function () {
    const db = wx.cloud.database()
    //评论数据库中没有此新闻，直接插入
    // if (!this.data.myConmmentsFlag) {

    console.log('store to DB');
    if (this.data.position) {
      var position = this.data.position.newslist[0].province + this.data.position.newslist[0].city
    }
    else {
      var position = ''
    }
    //向云数据库添加收藏
    db.collection('self_news_comments').add({
      data: {
        news: this.data.details,
        myConmmentsFlag: true,
        comments: [
          this.data.userInfo,//用户信息
          util.formatTime(new Date()),//评论时间
          this.data.inputVal,//评论内容
          // this.data.position.newslist[0].province + this.data.position.newslist[0].city,
          position,
          0,
          0//点赞数为0
        ],
        createTime: db.serverDate() //添加数据库时间
      },
      success: function (res) {
        // that.setData({
        //   commentFlag: true,
        //   inputVal: '',
        //   _id: res._id

        // })
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log("插入私有库成功");

      }
    })

  },


  tts: function (e) {
    var that = this;

    var grant_type = "client_credentials";

    var appKey = "fergKWkFhkOPT5GkCd7kiguo";

    var appSecret = "tUVUmPxxrYYHueQbwQ5hQgmTXyioX0Rw";

    //  var url = "https://openapi.baidu.com/oauth/2.0/token" + "grant_type=" + grant_type + "&client_id=" + appKey + "&client_secret=" + appSecret

    var url = "https://openapi.baidu.com/oauth/2.0/token"

    wx.request({

      url: url,

      data: {

        grant_type: grant_type,

        client_id: appKey,

        client_secret: appSecret

      },

      method: "GET",

      header: {

        'content-type': 'application/json' // 默认值

      },

      success: function (res) {

        console.log(res.data)

        // token = res.data.access_token
        that.setData({
          token: res.data.access_token,
          playFlag: true
        }),
          that.cancel()

      }

    })

  },

  // 合成

  cancel: function (e) {
    // var msg = "您好,欢发热纷纷额愤愤愤愤士大夫士大夫但是 覅大家覅十九分附件是的肌肤的说法是大家ijijiojijij ijij哦ii哦就发士大夫非法手段大赛分为额二分谔谔温热二万人二万人额热舞额外额外额外热舞人二万人二万人我额外发都是当时出大事从迎光临";
    // var msg = '尽管HTCG1的登场并没有iPhone那样耀眼，但如今看来它却奠定了很多安卓手机的基本设计。2005年，当塞班系统和WindowsMobile双雄争霸，诺基亚、摩托罗拉如日中天之时，手机系统的秘密战争已经悄然打响。一边是苹果正在秘密研发自己的初代iPhone，另一边搜索巨头谷歌则收购了安卓公司，两大巨头一个向左一个向右，为一场旷日持久的手机系统争霸埋下了伏笔，而其中的关键角色之一，就是这台HTCG1。发布于2008年9月的HTCG1是谷歌打磨三年，由HTC代工的运营商定制机。虽然相比初代iPhone上市晚一年，不过靠代工厂起家的HTC显然在手机上有自己的独特见解，这款机器的外观并没有iPhone那样破旧立新的意味，却很能代表之后几年安卓智能机的设计规范，即便今天看起来，它也是一款独具特色的产品。翘下巴的全键盘手机很多人并不是初见HTCG1就会感觉惊喜，尽管这台机器在如今看来说是HTC最重要的产品也不为过，但在发布时却并没有立刻吸引人们的目光。iPhone的光环过于耀眼，让这台手机的外观看起来多少显得平淡，但它依然有很多影响深远的设计。HTCG1正面设计了六个独特按键，除了通话、主页、返回、挂机键和上方居中的菜单键外，最特别的莫过于中间的触控轨迹球。如果你曾经是黑莓用户，那对这颗轨迹球应该不会陌生，它在早期安卓系统上可以方便地左右操控以及点选确认，这个设计在如今看来似乎有点繁琐，但作为第一台安卓手机，它的功能还是很实用的，而其它按键的设计则影响了之后的「三大金刚」键。如同你看到的，HTCG1的厚度达到17.1毫米，似乎笨拙无比，但是158克的重量以及翘起的下巴却带来了良好的握持手感，这个独特的下巴也让用户在通话时有更舒服的体验，于是乎类似这样的设计被继承在了后续的HTC机型上面，我们之前介绍过的HTCDesire就是这样。相机部分也比较特殊，手机侧面有一个独立的拍照按键，背后的摄像头只有310万像素，但在当时也已经具备了拍照和拍摄视频的功能，同时机器也支持T-Flash存储卡，相比iPhone来说扩展性更好，也是一个能吸引用户的功能点。作为第一台安卓手机，HTCG1在硬件配置上没有iPhone那样优秀，3.2英寸320*480分辨率的电容式LCD触摸屏让它在画面上表现平平，192M+528M的存储组合以及高通MSM7201A处理器也并不强，而且它甚至没有3.5毫米耳机接口。但这些依然不影响它的独特气质，因为当你尝试从侧面滑动它，你就会发现惊喜。没错，H'
    // var text = JSON.parse(msg).msg;
    var that = this;
    // var tex = encodeURI(text);//转换编码url_encode UTF8编码
    var tex = this.data.msg.substring(0, 1000);
    console.log(tex);

    var tok = this.data.token;

    var cuid = this.data.IMEI;

    var ctp = 1;

    var lan = "zh";    // zh表示中文

    // 字符编码
    var per = 5;
    var spd = 5;  // 表示朗读的语速，9代表最快，1是最慢（撩妹请用2，绕口令请用9）

    var url = "https://tsn.baidu.com/text2audio?tex=" + tex + "&lan=" + lan + "&cuid=" + cuid + "&ctp=" + ctp + "&tok=" + tok + "&spd=" + spd + '&per=' + per

    wx.downloadFile({

      url: url,

      success: function (res) {

        console.log(res)
        that.setData({
          filePath: res.tempFilePath
        })
        // this.data.filePath = res.tempFilePath;

        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

        if (res.statusCode === 200) {

          wx.playVoice({

            filePath: res.tempFilePath

          })

        }
        that.play();

      }

    })

  },

  //播放

  play: function (e) {
    var that = this;
    console.log('play');

    // var innerAudioContext = wx.createInnerAudioContext()

    this.innerAudioContext.autoplay = true

    // this.innerAudioContext.src = this.data.filePath

    this.innerAudioContext.src = this.data.filePath //设置音频地址
    this.innerAudioContext.play(); //播放音频


    // this.innerAudioContext.onPlay(() => {

    //   console.log('开始播放')

    // })

    innerAudioContext.onError((res) => {

      console.log(res.errMsg)

      console.log(res.errCode)

    })
    that.setData({
      playFlag: true,
      pauseFlag: false
    })

    // innerAudioContext.pause();

  },
  // 结束语音
  end: function (e) {
    this.innerAudioContext.pause();//暂停音频
    var that = this;
    that.setData({
      playFlag: false,
      pauseFlag: true
    })
  },


})


