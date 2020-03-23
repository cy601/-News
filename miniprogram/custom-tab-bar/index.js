Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    background: "white",
    "list": [
      {
        "pagePath": "/pages/home/home",
        "text": "首页",
        "iconPath": "/icons/home.png",
        "selectedIconPath": "/icons/home_sel.png"
      },
      {
        "pagePath": "/pages/video/video",
        "text": "视频榜",
        "iconPath": "/icons/video.png",
        "selectedIconPath": "/icons/video_sel.png"
      },
      {
        "pagePath": "/pages/me/me",
        "text": "我的",
        "iconPath": "/icons/me.png",
        "selectedIconPath": "/icons/me_sel.png"
      }
    ]
  },
  attached() {
    var that = this
    let darkmode = wx.getStorageSync('darkmode');
    let theme = wx.getStorageSync('theme');
    // var flag = wx.getStorageSync('homeFlag');
    if (darkmode) {
      that.setData({
        background: 'black'
      })
    }
    switch (theme) {
      case '1':
        // console.log(this.data.list[0].text);

        that.setData({
          'list[0].iconPath': "/icons/red/home.png",
          'list[0].selectedIconPath': "/icons/red/home_sel.png",
          'list[1].iconPath': "/icons/red/video.png",
          'list[1].selectedIconPath': "/icons/red/video_sel.png",
          'list[2].iconPath': "/icons/red/me.png",
          'list[2].selectedIconPath': "/icons/red/me_sel.png",
          selectedColor:'#D22222',
          // "selectedIconPath": "/icons/home_sel.png"

        });
        // console.log(this.data.list[0]);


        break;
      case '2':
        // console.log(this.data.list[0].text);

        that.setData({
          'list[0].iconPath': "/icons/blue/home.png",
          'list[0].selectedIconPath': "/icons/blue/home_sel.png",
          'list[1].iconPath': "/icons/blue/video.png",
          'list[1].selectedIconPath': "/icons/blue/video_sel.png",
          'list[2].iconPath': "/icons/blue/me.png",
          'list[2].selectedIconPath': "/icons/blue/me_sel.png",
          selectedColor:'#0077ED'

        });


        break;
      case '3':
        // console.log(this.data.list[0].text);

        that.setData({
          'list[0].iconPath': "/icons/purple/home.png",
          'list[0].selectedIconPath': "/icons/purple/home_sel.png",
          'list[1].iconPath': "/icons/purple/video.png",
          'list[1].selectedIconPath': "/icons/purple/video_sel.png",
          'list[2].iconPath': "/icons/purple/me.png",
          'list[2].selectedIconPath': "/icons/purple/me_sel.png",
          selectedColor:'#selectedColor'
          // "selectedIconPath": "/icons/home_sel.png"

        });
        // console.log(this.data.list[0]);


        break;

      default:
        break;
    }

    console.log(this.data.background);

    // console.log(storageInfo);
    console.log('1111');



  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})