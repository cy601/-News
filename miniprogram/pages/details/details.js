/*
新闻详情页
*/
var util = require("../../utils/util.js");
var app = getApp();
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getFontSize();//重新获取保存的字体大小

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
          content: '双击任意区域收藏文章',
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

})


