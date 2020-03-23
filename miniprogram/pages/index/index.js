const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
var innerAudioContext = wx.createInnerAudioContext()
Page({


  onLoad() {
    var that = this
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
    }),
      this.tts()

    console.log(['111']);

  },
  /**
   * 页面的初始数据
   */
  data: {
    content: '',//内容
    src: '', //
    token: '',
    IMEI: '',
    filePath: ''
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
          token: res.data.access_token
        }),
          that.cancel()

      }

    })

  },

  // 合成

  cancel: function (e) {
    // var msg = "您好,欢发热纷纷额愤愤愤愤士大夫士大夫但是 覅大家覅十九分附件是的肌肤的说法是大家ijijiojijij ijij哦ii哦就发士大夫非法手段大赛分为额二分谔谔温热二万人二万人额热舞额外额外额外热舞人二万人二万人我额外发都是当时出大事从迎光临";
    var msg = '尽管HTCG1的登场并没有iPhone那样耀眼，但如今看来它却奠定了很多安卓手机的基本设计。2005年，当塞班系统和WindowsMobile双雄争霸，诺基亚、摩托罗拉如日中天之时，手机系统的秘密战争已经悄然打响。一边是苹果正在秘密研发自己的初代iPhone，另一边搜索巨头谷歌则收购了安卓公司，两大巨头一个向左一个向右，为一场旷日持久的手机系统争霸埋下了伏笔，而其中的关键角色之一，就是这台HTCG1。发布于2008年9月的HTCG1是谷歌打磨三年，由HTC代工的运营商定制机。虽然相比初代iPhone上市晚一年，不过靠代工厂起家的HTC显然在手机上有自己的独特见解，这款机器的外观并没有iPhone那样破旧立新的意味，却很能代表之后几年安卓智能机的设计规范，即便今天看起来，它也是一款独具特色的产品。翘下巴的全键盘手机很多人并不是初见HTCG1就会感觉惊喜，尽管这台机器在如今看来说是HTC最重要的产品也不为过，但在发布时却并没有立刻吸引人们的目光。iPhone的光环过于耀眼，让这台手机的外观看起来多少显得平淡，但它依然有很多影响深远的设计。HTCG1正面设计了六个独特按键，除了通话、主页、返回、挂机键和上方居中的菜单键外，最特别的莫过于中间的触控轨迹球。如果你曾经是黑莓用户，那对这颗轨迹球应该不会陌生，它在早期安卓系统上可以方便地左右操控以及点选确认，这个设计在如今看来似乎有点繁琐，但作为第一台安卓手机，它的功能还是很实用的，而其它按键的设计则影响了之后的「三大金刚」键。如同你看到的，HTCG1的厚度达到17.1毫米，似乎笨拙无比，但是158克的重量以及翘起的下巴却带来了良好的握持手感，这个独特的下巴也让用户在通话时有更舒服的体验，于是乎类似这样的设计被继承在了后续的HTC机型上面，我们之前介绍过的HTCDesire就是这样。相机部分也比较特殊，手机侧面有一个独立的拍照按键，背后的摄像头只有310万像素，但在当时也已经具备了拍照和拍摄视频的功能，同时机器也支持T-Flash存储卡，相比iPhone来说扩展性更好，也是一个能吸引用户的功能点。作为第一台安卓手机，HTCG1在硬件配置上没有iPhone那样优秀，3.2英寸320*480分辨率的电容式LCD触摸屏让它在画面上表现平平，192M+528M的存储组合以及高通MSM7201A处理器也并不强，而且它甚至没有3.5毫米耳机接口。但这些依然不影响它的独特气质，因为当你尝试从侧面滑动它，你就会发现惊喜。没错，H'
    // var text = JSON.parse(msg).msg;
    var that = this;
    // var tex = encodeURI(text);//转换编码url_encode UTF8编码
    var tex = msg;
    var tok = this.data.token;

    var cuid = this.data.IMEI;

    var ctp = 1;

    var lan = "zh";    // zh表示中文

    // 字符编码
    var per = 5;
    var spd = 5;  // 表示朗读的语速，9代表最快，1是最慢（撩妹请用2，绕口令请用9）

    var url = "https://tsn.baidu.com/text2audio?tex=" + tex + "&lan=" + lan + "&cuid=" + cuid + "&ctp=" + ctp + "&tok=" + tok + "&spd=" + spd+'&per='+per

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
    // innerAudioContext.pause();

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



  // // 手动输入内容
  // conInput: function (e) {
  //   this.setData({
  //     content: e.detail.value,
  //   })
  // },
  // // 文字转语音
  // wordYun: function (e) {
  //   var that = this;
  //   var content = this.data.content;
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

  // 结束语音
  end: function (e) {
    this.innerAudioContext.pause();//暂停音频
  },

})
