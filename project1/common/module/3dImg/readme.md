# vue3D轮播图组件
> 数量限制 3-5

调用方法
- 引入：import moduleComment from '@common/module/comment/comment.vue'
- 在components中注册组件  moduleComment
- `<module-comment :cmtParam="cmtParam"></module-comment>`
- 传参  cmtParam
	cmtParam: {
	    cid: 23,                                                  //活动id
	    class: -1,                                                //默认-1
	    type: 9,                                                  //评论类型，后端输出
	    getCmtUrl: 'http://m.aipai.com/api/aipaiApp.php',         //获取评论的接口，默认`http://shouyou.aipai.com/api/aipaiApp.php`
	    sendCmtUrl: 'http://m.aipai.com/bus/comment/proxy.php',   //发评论的接口，默认`http://shouyou.aipai.com/bus/comment/insert.php`
	    isCmtTit: false,                                          //默认true，是否有讨论圈标题，带热评总数那个
	    isCmtTopPost: false,                                      //默认true，是否有“听说评论可以涨粉哦~”那一条东西
	    isCmtFoot: true,                                          //默认false，是否有底部的评论输入框
	    totalCallback: function(total){                           //获取评论成功的回调
	        console.log('totalCallback', total);
	    },
	    sendSucCallback: function(total){                         //发送评论成功的回调
	        console.log('sendSucCallback', total);
	    }
	},


调用可参考文件：
- `templates/aipai_platform/vue/mobile/video_activity/views/app-index.vue`
