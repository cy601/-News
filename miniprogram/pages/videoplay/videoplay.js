// pages/videoplay/videoplay.js
var util = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    url: '',
    title: '',
    author: '',
    hotindex: '',
    videoFlag: '',
    // star: false,//标记是否搜藏，默认为否
    // explore: false,//标记是否在数据库中有浏览记录，默认为否




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
    position: [],
    fontsize: 1,
    position: '',
    model: '',//用户设备型号
    deviceFlag: false,//标记此新闻的用户是否允许被获取设备信息
    order: true,//评论正序/逆序

    //暗黑模式及主题色
    theme: '',
    dark: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options);
    that.setData({
      details: JSON.parse(decodeURIComponent(options.data)),
      fontsize: app.globalData.fontsize,//获取全局字体大小
      position: app.globalData.position,
    }),
      that.setData({
        url: this.data.details.playaddr,
        title: this.data.details.title,
        author: this.data.details.author,
        hotindex: "热度：" + this.data.details.hotindex
      })



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
      // console.log(this.data.model);
    }
    else {
      that.setData({
        model: null
      })
    }



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

    //查询数据库中是否已经收藏此新闻
    db.collection('fav_video').where({
      // news: this.data.details

      news: {
        playaddr: this.data.details.playaddr
      }

      //   news: db.RegExp({
      //     regexp:e,
      //     option:'i'
      // })
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          star: res.data[0].flag,

          // queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询收藏记录] 成功: ', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询收藏记录] 失败：', err)
      }
    }),


      //查询数据库中是否有此视频的浏览记录

      db.collection('footprint_video').where({
        // news: this.data.details

        news: {
          playaddr: this.data.details.playaddr
        }

        //   news: db.RegExp({
        //     regexp:e,
        //     option:'i'
        // })
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
          db.collection('footprint_video').add({
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              news: this.data.details,
              explore: true,
            },
            success: function (res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              that.setData({
                explore: true//已经添加浏览记录
              }),
                // wx.showToast({
                //   title: '成功收藏',
                //   icon: 'none',
                //   // image: '',
                //   duration: 500,
                //   // mask: false,
                //   success: (result) => {

                //   },
                //   fail: () => { },
                //   complete: () => { }
                // });

                console.log(res);
            }
          })
        }
      }, 1500);

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


  //点击星星收藏或取消收藏
  tostar: function () {
    var that = this;
    const db = wx.cloud.database()
    if (!this.data.star) {

      //向云数据库添加收藏
      db.collection('fav_video').add({
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          news: this.data.details,
          flag: true,
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

      db.collection('fav_video').where({
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

  /************************ 
       底下评论栏
 ********************/

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
    db.collection('video_comments').where({

      // news: this.data.details
      video: {
        playaddr: this.data.details.playaddr
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
        console.log('[数据库] [查询视频评论记录] 成功: ', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询视频评论记录] 失败：', err)
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
        name: 'insertVideoComments',
        data: {
          video: this.data.details,
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

    }
    //数据库中存在此新闻评论，插入评论

    else {
      console.log('update comments');
      // const _ = db.command
      if (this.data.position) {
        var position = this.data.position.newslist[0].province + this.data.position.newslist[0].city
      }
      else {
        var position = ''
      }
      wx.cloud.callFunction({
        name: 'updateVideoComments',
        data: {
          id: this.data._id,
          userInfo: this.data.userInfo,
          date: util.formatTime(new Date()),
          word: this.data.inputVal,
          position: position,
          deviceFlag: this.data.deviceFlag,
          model: this.data.model,
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
    //向云数据库添加收藏
    db.collection('self_video_comments').add({
      data: {
        video: this.data.details,
        myConmmentsFlag: true,
        comments: [
          this.data.userInfo,//用户信息
          util.formatTime(new Date()),//评论时间
          this.data.inputVal,//评论内容
          // this.data.position.newslist[0].province + this.data.position.newslist[0].city,
          this.data.position.newslist[0].province + this.data.position.newslist[0].city,

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



})