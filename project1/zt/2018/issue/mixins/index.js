

export default {
     
    methods: {
        setDocumentFontSize(){
            document.documentElement.style.fontSize=document.documentElement.clientWidth*20/375 + 'px';
            let docEl = document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                let clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                    if(clientWidth>480){
                        clientWidth=480;
                    }
                    docEl.style.fontSize = clientWidth*20/375 + 'px';
                };
            if (!document.addEventListener) return;
            window.addEventListener(resizeEvt, recalc, false);
            document.addEventListener('DOMContentLoaded', recalc, false);
        },
        //去下载
        go(){
            let ua = navigator.userAgent.toLowerCase();
            //ios 未上架，做提示
            if(/iphone|ipad|ipod/.test(ua)) {
                //来人，加上一把锁
                if(!this.lock){
                    this.lock = true;
                    this.showToast = true;
                    //2秒隐藏toast
                    setTimeout(() => {
                        this.lock = false;
                        this.showToast = false;
                    },2000);
                }
            }else {
                location.href = encodeURI(this.downloadUrl);
            }
        }
    }
}
  