
// // 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
	env: 'fingerflash-ayfug'
})
//定义得在init之后
const db = cloud.database();
const _ = db.command


exports.main = async (event, context) => {
	try {
		console.log(event);
		console.log(context);


		return await db.collection('newscomments').where({
			// _openid: event._openid,
			// explore: true
			// url: event.url
			    news: {
        url: event.url
      }
		})
			.get({
				success: function (res) {
					console.log(res.data)
					console.log('[数据库] [查询记录] 成功: ', res)
					//   console.log('成功删除浏览记录');

				}
			})
	} catch (e) {
		console.error(e)
	}
}


// db.collection('newscomments').where({

// 	// news: this.data.details
// 	news: {
// 		url: url
// 	}
// }).get({
// 	success: res => {
// 		that.setData({
// 			commentFlag: res.data[0].commentFlag,
// 			_id: res.data[0]._id,
// 			commentsList: res.data[0].comments
// 			// queryResult: JSON.stringify(res.data, null, 2)
// 		})
// 		console.log('[数据库] [查询记录] 成功: ', res)
// 	},
// 	fail: err => {
// 		// wx.showToast({
// 		//   icon: 'none',
// 		//   title: '查询记录失败'
// 		// })
// 		console.error('[数据库] [查询记录] 失败：', err)
// 	}
// })
