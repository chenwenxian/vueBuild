/**
 * $Revision: 0001 $
 * $Date: 2017-12-17 14:19:02 +0800 $
 * $Author: chenwenxian $
 */

var Apm = function(opts){
    //默认参数
    var _ts = this,
        defOpts = {
        };
    this.opts = Object.assign(defOpts, opts);

    this.config = {
        //platform: "",
        platform: (navigator.userAgent.toLowerCase()).match(/iphone|ipod|ipad/ig) ? 'ios' : 'android',
        app: {
            isInApp: _ts.app.isInApp || false, // aipai/Android/paidashi/paidashi/v(857)  or false
            //is: registerApm.app.is,               //true or false
            o : _ts.app.os || null,       //系统
            s : _ts.app.set || null,      //产品线
            p : _ts.app.product || null,  //app名
            v: _ts.app.version  || null   //版本号
        }
    };
    this.tools = {
        getUrlName: function (name) {  
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
            var r = window.location.search.substr(1).match(reg);  
            if (r !== null) return unescape(r[2]);  
            return null;  
        },
        loadJS: function(url, success){
            var domScript = document.createElement('script');
                domScript.src = url;
                success = success || function(){};
            if(navigator.userAgent.indexOf("MSIE")>0){
                domScript.onreadystatechange = function(){
                    if('loaded' === this.readyState || 'complete' === this.readyState){
                        success();
                        this.onload = this.onreadystatechange = null;
                        this.parentNode.removeChild(this);
                    }
                }
            }else{
                domScript.onload = function(){
                    success();
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                }
            }
            document.getElementsByTagName('head')[0].appendChild(domScript);
        },
        //输出数据，过滤key不存在导致报错问题
        returnData: function (data, keyArr) {
            /*
                data 表示对象
                keyArr 表示数组，['key1', 'key2']
                ==> 表示需要返回 data['key1']['key2'] 的值，其中有某个key不存在就返回: ""（空）
            */
            if (typeof keyArr === "object") {
                try {
                    return eval("data" + "." + keyArr.join("."));
                } catch (e) {
                    return "";
                }
            } else {
                try {
                    return data;
                } catch (e) {
                    return "";
                }
            }
        }
        /*function loadScript(src, callback) {
            var script = document.createElement('script'),
                head = document.getElementsByTagName('head')[0];
            script.type = 'text/javascript';
            script.charset = 'UTF-8';
            script.src = src;
            if (script.addEventListener) {
                script.addEventListener('load', function () {
                    callback();
                }, false);
            } else if (script.attachEvent) {
                script.attachEvent('onreadystatechange', function () {
                    var target = window.event.srcElement;
                    if (target.readyState == 'loaded') {
                        callback();
                    }
                });
            }
            head.appendChild(script);
        }

        loadScript('http://m.aipai.com/aipai_platform/mobile/common/dist/weixin/1.0.0/jweixin.js',function(){
            console.log('wenxian', wx);
        });*/
    };
    this.init();
};

Apm.prototype.install = function(Vue){
    Vue.prototype.$apm = this;
    Vue.apm = this;
};

//初始化
Apm.prototype.init = function(){
    var _ts = this,
        fEWxShareVueDone = _ts.tools.getUrlName("fEWxShareVueDone");

    //备注php不能使用这个参数fEWxShareVueDone
    if(fEWxShareVueDone){//处理微信分享处理的地址fEWxShareVueDone
        //location.href = location.href.split('#')[0]+"#"+fEWxShareVueDone;
        location.href = ((location.href.split('#')[0]).replace(new RegExp("fEWxShareVueDone="+fEWxShareVueDone, 'g'), ""))+"#"+fEWxShareVueDone;
        // http://m.lieyou.com/about.html?fEWxShareVueDone=issue#test 修改成 http://m.lieyou.com/about.html?＃issue
    }

};

//apm.app
Apm.prototype.app = (function() {
    var ua = navigator.userAgent,
        opt = {};
    var reg = ua.match(/aipai\/(.*)\/(.*)\/(.*)\/v\((.*)\)/);
    if(reg){
        opt.isInApp = reg[0];
        opt.os = reg[1];
        opt.set = reg[2];
        opt.product = reg[3];
        opt.version = reg[4];
    }else{
        opt.isInApp = false;
    }

    opt.is = function (arg){
        if(reg){
            return (typeof arg.o !== 'undefined' ? (arg.o === opt.os) : true) &&  (typeof arg.p !=='undefined' ? (arg.p === opt.product) : true) && (typeof arg.s !== 'undefined' ? (arg.s === opt.set) : true) && (typeof arg.v !== 'undefined' ? (opt.version >= arg.v) : true);
        }else{
            return false;
        }
    };
    return opt;
})();


/*
注册：this.$apm.globalEvent.addEventListener("wenxian", function(tips){alert(tips); })
触发：(function(){var evt = new window.Event('wenxian'); evt.param ={}; evt.cbparam ={}; window.document.dispatchEvent(evt);})();
*/
//全局事件 
Apm.prototype.globalEvent = {
    //track varies kinds of events and listeners.
    handlerTraker: {},
    /**
    * addEventListener
    * NOTE: one callback can only be bound to the same event once. Bind a callback twice doesn't
    *  mean it will be called twice when the event fired once.
    * @param {string} evt - the event name to add a listener on.
    */
    add: function (evt, callback) {
        var _ts = this;
        if (!callback) {
            {
                console.error("[vue-render] missing callback arg in globalEvent.addEventListener.");
            }
            return
        }
        var handlers = _ts.handlerTraker[evt];
        if (!handlers) {
            handlers = _ts.handlerTraker[evt] = [];
        }
        var len = handlers.length;
        for (var i = 0; i < len; i++) {
            if (handlers[i] === callback) {
                // this callback is already bound. no need to bind it again.
                return
            }
        }
        handlers.push(callback);
        document.addEventListener(evt, callback);
    },

    /**
    * removeEventListener
    * NOTE: remove all the event handlers for the specified event type.
    * @param {string} evt - the event name to remove a listener from.
    */
    remove: function(evt) {
        var _ts = this,
            handlers = _ts.handlerTraker[evt];
        if (!handlers) {
          // evt handlers has been already removed.
          return
        }
        handlers.forEach(function (cb) { return document.removeEventListener(evt, cb); });
        delete _ts.handlerTraker[evt];
    }
};

//app接口
Apm.prototype.appBridge = function(type, _data){
    var data = _data || null,
        iframe = document.createElement('IFRAME');
    iframe.setAttribute('src', 'xxx-vw://'+type+'/'+encodeURIComponent(JSON.stringify(data)));
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
};


Apm.prototype.pageData = (()=>{
    let pageData = {};
    let paramArr = window.location.search.substr(1).split('&');
    for(let i=0; i<paramArr.length; i++){
        if(paramArr[i].match(/(.+?)=(.+?)/ig)){
            let curArr = paramArr[i].split('=');
            pageData[curArr[0]] = decodeURIComponent(curArr[1]);
        }
    }
    return pageData;
})()


//启动app某个页面协议
Apm.prototype.appStart = function(data){
    /**
        data = {'action' : 'videoPlayer', 'videoId' : 415748};
    **/

    //android:    xxxxx://?bid=4051458
    //ios:        xxxxxx://?action=personalspace&bid=4051458
    var iframe = document.createElement('IFRAME'),
        _data = '';
    for(var key in data){
        _data += '&'+key+'='+ encodeURIComponent(data[key]);
    }
    _data = 'xxx://?'+_data.substring(1);
    iframe.setAttribute('src', _data);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
};

//还没有调通，需要明天开微信公众号
Apm.prototype.wxShare = function (opt) {

    if(!((navigator.userAgent.toLowerCase()).match(/MicroMessenger/i) == "micromessenger")){
        return false;
    }
    var _ts = this,
        title = opt.title || window.document.title,
        desc = opt.desc || "",
        imgUrl = opt.imgUrl || ((WinResourcesDomain.match(/weplay.cn/ig)) ? WinResourcesDomain : "http://res28-lieyou.weplay.cn/") +  "aipai_platform/vue/lieyou/common/assets/img/logo_200x200.png",
        link = opt.link || location.href,
        linkSp = link.split('#'),
        debug = opt.debug || false,
        sucShare = (typeof opt.sucShare === 'function') ? opt.sucShare : null,
        cancel =(typeof opt.cancel === 'function') ? opt.cancel : null;
        //oscUrl = location.href.split('#')[0];


    link = linkSp[0];
    if(linkSp[1]){//link地址有“#”号
        link = link+((link.match(/\?/ig)) ? "&" : "?")+"fEWxShareVueDone="+linkSp[1]
        // http://m.lieyou.com/about.html#issue 修改成 http://m.lieyou.com/about.html?fEWxShareVueDone=issue
    }

    //微信分享问题验证 http://www.thinkphp.cn/code/1568.html

    _ts.tools.loadJS("//res.wx.qq.com/open/js/jweixin-1.0.0.js", function(){
        //var wx = window.wx;
        _ts.fetch({
            url: 'http://xxx.com/api/wx/auth',
            method: 'GET',
            type: "jsonp",
            param: {
                url: link //encodeURIComponent()
            }
        }).then(function(ret){
            if(typeof ret === "object" && typeof ret.signPackage === "object"){

                var signPackage = ret.signPackage,
                    appId = signPackage.appId,
                    timestamp = signPackage.timestamp,
                    nonceStr = signPackage.nonceStr,
                    signature = signPackage.signature;

                //微信分享
                wx.config({
                    debug: debug,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
                });
                wx.ready(function(){
                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: title,
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            try {
                                sucShare();
                            }catch (e) {}
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            try {
                                cancel();
                            }catch (e) {}
                        }
                    });

                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            try {
                                sucShare();
                            }catch (e) {}
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            try {
                                cancel();
                            }catch (e) {}
                        }
                    });

                    //分享到QQ
                    wx.onMenuShareQQ({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: link, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            try {
                                sucShare();
                            }catch (e) {}
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            try {
                                cancel();
                            }catch (e) {}
                        }
                    });
                });
            }
        });
    });
};

// 回到顶部
Apm.prototype.initScrollTop = function(){
    var st = null,
        _scTop = document.createElement('span');
    _scTop.setAttribute('class','g_scrollTop hidden');
    _scTop.setAttribute('id','g_scrollTop');

    document.body.appendChild(_scTop);
    var _el = document.getElementById('g_scrollTop');
    window.addEventListener('scroll', function(event){
        clearTimeout(st);
        st = setTimeout(function(){
            if(document.body.scrollTop > window.innerHeight){
                _el.style.display = 'block';
                _el.addEventListener('click', function(event) {
                    _el.style.display = 'none';
                    event.preventDefault();
                    window.scrollTo(0,0);
                });
            }else{
                _el.style.display = 'none';
            }
        },50);
    });
    _el.addEventListener('touchstart', function(event){
        _el.classList.add('cur');
    });
    _el.addEventListener('touchend', function(event){
        _el.classList.remove('cur');
    });
};

//apm.md5
Apm.prototype.md5 = function(value){
    var hex_chr = "0123456789abcdef",
        rhex = function(num) {
            var str = "";
            for(var j = 0; j <= 3; j++)
                str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                    hex_chr.charAt((num >> (j * 8)) & 0x0F);
            return str;
        },
        str2blks_MD5 = function(str) {
            var nblk = ((str.length + 8) >> 6) + 1;
            var blks = new Array(nblk * 16);
            for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
            for(var i = 0; i < str.length; i++)
                blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
            blks[i >> 2] |= 0x80 << ((i % 4) * 8);
            blks[nblk * 16 - 2] = str.length * 8;
            return blks;
        },
        add = function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },
        rol = function(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        },
        cmn = function(q, a, b, x, s, t) {
            return add(rol(add(add(a, q), add(x, t)), s), b);
        },
        ff = function(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
        gg = function(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },
        hh = function(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        },
        ii = function(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        },
        MD5 = function(str) {
            var x = str2blks_MD5(str);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;

            for(var i = 0; i < x.length; i += 16){
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
                d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
                c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
                b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
                a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
                d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
                c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
                b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
                a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
                d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
                c = ff(c, d, a, b, x[i+10], 17, -42063);
                b = ff(b, c, d, a, x[i+11], 22, -1990404162);
                a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
                d = ff(d, a, b, c, x[i+13], 12, -40341101);
                c = ff(c, d, a, b, x[i+14], 17, -1502002290);
                b = ff(b, c, d, a, x[i+15], 22,  1236535329);

                a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
                d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
                c = gg(c, d, a, b, x[i+11], 14,  643717713);
                b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
                a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
                d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
                c = gg(c, d, a, b, x[i+15], 14, -660478335);
                b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
                a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
                d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
                c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
                b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
                a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
                d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
                c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
                b = gg(b, c, d, a, x[i+12], 20, -1926607734);

                a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
                d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
                c = hh(c, d, a, b, x[i+11], 16,  1839030562);
                b = hh(b, c, d, a, x[i+14], 23, -35309556);
                a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
                d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
                c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
                b = hh(b, c, d, a, x[i+10], 23, -1094730640);
                a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
                d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
                c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
                b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
                a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
                d = hh(d, a, b, c, x[i+12], 11, -421815835);
                c = hh(c, d, a, b, x[i+15], 16,  530742520);
                b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

                a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
                d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
                c = ii(c, d, a, b, x[i+14], 15, -1416354905);
                b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
                a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
                d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
                c = ii(c, d, a, b, x[i+10], 15, -1051523);
                b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
                a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
                d = ii(d, a, b, c, x[i+15], 10, -30611744);
                c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
                b = ii(b, c, d, a, x[i+13], 21,  1309151649);
                a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
                d = ii(d, a, b, c, x[i+11], 10, -1120210379);
                c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
                b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

                a = add(a, olda);
                b = add(b, oldb);
                c = add(c, oldc);
                d = add(d, oldd);
            }
            return rhex(a) + rhex(b) + rhex(c) + rhex(d);
        };

    return MD5(value);
};

Apm.prototype.fetch = function(_opt){

    var _ts = this,
        param = "",
        //isCookies = opt.
        opt = Object.assign({
            method: "GET",
            type: "json",
            cookies: true, //Boolean
            timeout: 10000,
            param: null, //{id: 123}
            paramType: 0 // 0表示参数以字符串形式提交比如“wen=12&xx=333”; 1表示参数以对象形式提交比如“{wen:12, xx:33}”
        }, _opt);
    //默认补上
    opt.param = Object.assign({
        os: (_ts.config.platform === "ios") ? 2 : 1,
        versionCode: parseInt(_ts.config.app.v, 10) || 0
    }, opt.param);
    if(location.protocol === 'https:'){
        opt.url = (opt.url).replace(/^http:(\/\/[\w]+\.xxx\.com)/, "$1").replace(/^http:(\/\/[\w]+\.xxx\.com)/, "$1").replace(/^http:(\/\/[\w]+\.xxx\.cn)/, "$1");
    }
    if(opt.param !== null){
        for(var key in opt.param){
            if(typeof opt.param[key] !== 'function'){
                param += '&'+key+'='+ encodeURIComponent(opt.param[key]);
            }
        }
        param = param.substring(1);
    }
    
    if((opt.method).toLowerCase() === "get"){
        return fetchJsonp(opt.url+'?'+param, {
            timeout: opt.timeout,
            method: opt.method,
            credentials: opt.cookies ? 'include' : ''
        }).then(function(response){
            return response.json();
        }).then(function(json){
            return json;
        }).catch(function(ex){
            // 网络错误
            return {error: true, url: ex};
        });

    }else{
        return axios(_opt.url, {
            method: "post",
            timeout: opt.timeout,
            data: (opt.paramType == 0) ? param : opt.param,
            withCredentials: opt.cookies
        }).then(function(response){
            return response.data;
        }).catch(function(ex){
            return {error: true, url: ex};
        });;

        /*return axios.post(opt.url+'?'+param, {
            timeout: opt.timeout,
            withCredentials: opt.cookies //带上cookie
        }).then(function(response){
            return response.data;
        }).catch(function(ex){
            return {error: true, url: ex};
        });*/
    }
};

import VueCookie from 'vue-cookie';
import fetchJsonp from 'fetch-jsonp';
import axios from 'axios';

//exports
//module.exports = apm;
export default new Apm({cookies: VueCookie, fetchJsonp: fetchJsonp, axios: axios});






