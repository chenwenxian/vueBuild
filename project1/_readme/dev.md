# 开发文档
> 备注：<br />
> 1、apm不能直接引入进来使用，必须基于vue扩展的$apm来使用；vue默认已经扩展了$apm； <br />
> 2、业务数据请求不能使用外部的API（比如：fetchJsonp、axios） ，需要使用可以基于this.$apm.fetch； <br />


## $apm.fetch使用
> 强制所有接口请求使用stream.fetch，并且得基于this.$apm.fetch

```javascript
/*
opt 说明
{	 
	 url: ""
	 method: "GET", //默认GET; GET OR POST
    type: "json", //默认json; json OR jsonp
    cookies: true, //默认true; true OR false
    param: {}     //默认{versionCode: (number int), os: (number int)}; 不能传versionCode、os
}
*/
this.$apm.fetch({
    url: 'http://api.lieyou.com/api/home/inex_page',
    method: 'GET',
    type: "json",
    param: {
        bid: 10000000534,
        realName: 'abc',
        idCardNumber: '44454534534',
        idCardFront: '12312321',
        idCardBack: '12312313'
    }
}).then(ret=>{
	//访问超时or资源地址出错
	if(typeof ret.error !== 'undefined' && ret.error){
        let msg = '网络错误';
        commit('SET_INDEXDATA_ERROR', {pageType, msg});
        return false;
    }
    if(ret.code === 0){
        let items = ret.data;
        commit('SET_INDEXDATA', {items, pageType});
    }else{
        // 其它异常情况
        let msg = '数据异常，请刷新重试';
        commit('SET_INDEXDATA_ERROR', {pageType, msg});
        return false;
    }
});

```
## 微信自定义分享
>
>
```javascript
var wxShareData = {
    title: "标题", //分享标题，默认页面标题（document.title）
    desc: "描述", //分享描述，默认空""
    imgUrl: "图片路径", //分享图片，默认猎游logo
    sucShare: fun, //分享成功callback，默认null
    cancel: fun, //关闭分享callback，默认null
    debug: false //debug模式，如果true微信会alert信息，默认false
};
this.$apm.wxShare(wxShareData);
```


## 协议
> 备注：定协议规范：xxx-vw://{type}/{data} => this.$apm.appBridge({type}, {data});<br />
> 其中data在appBridge方法里默认已经encodeURIComponent、JSON.stringify。在业务是不用对data进行encodeURIComponent、JSON.stringify等操作。

### 复制
```javascript
	this.$apm.appBridge("xxxCopy",{ 
		text: '我是要复制的内容'
	});
```
