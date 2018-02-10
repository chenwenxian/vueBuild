<!--
[configStart]
    {
        "pageInfo": {
            "title": "猎游有奖征集",
            "keywords": "猎游APP内测，BUG/建议有奖征集",
            "description": "猎游、陪玩、王者荣耀、意见征集、BUG征集、美女陪玩 "
        }
    }
[configEnd]
--> 
<template>
    <div class="wrapper">
        <div class="mod_banner">
            <img :src="picPath.banner" alt="" />
        </div>
        <div class="mod_tab">
            <div class="tab_nav">
                <img class="bg" ref="navBg" :src="picPath['tab'+tabCur]" alt="" />
                <img class="bg" style="display: none;" :src="picPath.tab2" alt="" />
                <span class="tab1" @click="setTabNum(1)"></span>
                <span class="tab2"  @click="setTabNum(2)"></span>
            </div>
            <div class="tab">
                <div class="tab_con" :style="{display: tabCur == 1 ? 'block': 'none'}">
                    <div class="item">
                        <h3>问题描述<span class="tips">（请勿提交无意义或重复的信息哦）</span></h3>
                        <div class="divTxt">
                            <textarea ref="content1" rows="3" cols="20" placeholder="请在此描述遇到的BUG（5字以上）"></textarea>
                        </div>
                    </div>
                    <div class="item">
                        <h3>机型</h3>
                        <div class="divTxt">
                            <input ref="phoneModel1" type="text" placeholder="例：华为P8" />
                        </div>
                    </div>
                    <div class="item">
                        <h3>系统版本</h3>
                        <div class="divTxt">
                            <input ref="operationSys1" type="text" placeholder="例：安卓7.0" />
                        </div>
                    </div>
                </div>
                <div class="tab_con" :style="{display: tabCur == 2 ? 'block': 'none'}">
                    <div class="item">
                        <h3>问题描述<span class="tips">（请勿提交无意义或重复的信息哦）</span></h3>
                        
                        <div class="divTxt">
                            <textarea ref="content2" rows="3" cols="20" placeholder="请在此提出产品相关建议（5字以上）"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mod_btn">
            <span class="btn" @click="btnSubmit">
                <img :src="picPath.btn" alt="" />
            </span>
            <p>获奖信息只会通过猎游客服通知您哦</p>
        </div>
        <div class="mod_popSuc" @click="popDone('suc', false);" :style="{backgroundImage: picPath.popSuc}" v-if="popIs.suc"></div>
        <div class="mod_toast" v-if="isToast">
            <div class="toast_cont">
                <span>{{txtToast}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name : 'test',
        data : function(){
            return {
                listDone: false,
                liShowNum: 3,
                modH: "205", 
                
                lock: false,

                isToast: false,
                timeToast: null,
                txtToast: "",
                loading: false,
                isSend: true,
                popIs: {
                    suc: false
                },
                tabCur: 1,
                picPath: {
                    banner: WinResourcesDirectory+require('../assets/img/banner02.png'),
                    tab1: WinResourcesDirectory+require('../assets/img/tab1.png'),
                    tab2: WinResourcesDirectory+require('../assets/img/tab2.png'),
                    btn: require('../assets/img/btn01.png'),
                    popSuc: 'url('+WinResourcesDirectory+require('../assets/img/pop01.png')+')',
                }
            }
        },
        components: {

        },
        created: function(){
            let _ts = this;
            
            if(this.$apm.app.is({s: 'lieyou'})){
                this.$apm.appBridge("hideMenu");
            }
            
        },
        computed:{
        },
        methods:{
           
            setTabNum(index){
                this.tabCur = index;
            },
            popDone(type, done){
                this.popIs[type] = done;
            },
            btnSubmit(){
                //this.popDone('suc', true);

                if(this.loading){ this.showToast("数据正在提交中！"); return false;}

                let _ts = this,
                    tabCur = this.tabCur,
                    type = tabCur,
                    content = this.$refs["content"+type].value || "",
                    phoneModel = "",
                    operationSys = "";
                    
                if(tabCur == 1){
                    phoneModel = this.$refs["phoneModel"+type].value || "",
                    operationSys = this.$refs["operationSys"+type].value || "";
                    if(content.length <= 5){
                        this.showToast("请描述遇到的BUG（5字以上）");
                        return false;
                    }
                    if(phoneModel.length <= 0){
                        this.showToast("请填写手机型号");  
                        return false;
                    }
                    if(operationSys.length <= 0){
                        this.showToast("请填写系统版本号");
                        return false;
                    }
                }

                if(tabCur == 2){
                    /*phoneModel = "";
                    operationSys = "";*/
                    if(content.length <= 5){
                        this.showToast("请提出产品相关建议（5字以上）");
                        return false;
                    }
                }

                if(!this.isSend){
                    this.showToast("5秒后才能再次提交数据！");
                    return false;
                }

                this.loading = true;
                this.$apm.fetch({
                    url: 'http://xxx.com/api/feedback/add',
                    method: 'POST',
                    type: "json",
                    cookies: true,
                    param: {
                        type: type,
                        content: content,
                        phoneModel: phoneModel,
                        operationSys: operationSys
                    }
                }).then(ret=>{
                    this.loading = false;
                    //访问超时or资源地址出错
                    if(typeof ret.error !== 'undefined' && ret.error){
                        this.showToast("网络错误");
                        return false;
                    }
                    if(ret.code === 0){
                        this.popDone('suc', true);
                        this.isSend = false;
                        setTimeout(()=>{
                            this.isSend = true;
                        }, 5000);
                        return false;
                    }else{
                        // 其它异常情况 "数据异常，请刷新重试"
                        this.showToast(ret.msg);
                        return false;
                    }
                });
            },
            showToast(txt, _time){
                let _ts = this,
                    time = _time || 800;
                _ts.txtToast = txt;
                _ts.isToast = true;
                clearTimeout(_ts.timeToast);
                _ts.timeToast = setTimeout(function(){
                    _ts.txtToast = "";
                    _ts.isToast = false;
                }, time);
            },
            aHover(){
                this.$apm.appBridge('enablePullToRefresh', 1);
            },
            rHover(){
                setTimeout(function(){
                    this.$apm.appBridge('enablePullToRefresh', 0);
                }, 300);
                
            }
        }
    }
</script>

<style lang="less">
    @import '../assets/css/reset.less';
    html{
        height: 100%;
    }
    body{
        max-width: 480px!important;
        height: 100%;
        margin: 0 auto!important;
        font-family: "\5FAE\8F6F\96C5\9ED1";
        background-color: #5840ae;
    }
    .wrapper{
        position: relative;
        width: 100%;
        min-height: 100%;
        background-position: 0px 0px;
        background-size: 100% 100%;
        background-color: #5840ae;
    }
    .mod_banner{
        width: 100%;
        min-height: 300px;
        img{
            display: block;
            width: 100%;
            height: auto;
            margin: 0px auto;
        }
    }
    .mod_tab{
        padding: 0px 15px;
        .tab_nav{
            position: relative;
            padding: 22px 0px;
            .bg{
                display: block;
                width: 100%;
                height: auto;
            }
            span{
                position: absolute;
                top: 0;
                display: block;
                width: 49%;
                height: 100%;
                &:first-child{
                    left: 0;
                }
                &:last-child{
                    right: 0;
                }
            }
        }
        .tab{
            padding: 0px 3px;
            .tab_con{
                .item{
                    padding-bottom: 24px;
                    h3{
                        height: 20px;
                        line-height: 20px;
                        padding-bottom: 10px;
                        font-size: 17px;
                        color: #e1d8ff;
                        padding-left: 23px;
                        background: url(../assets/img/icon01.png) no-repeat 0px 2px;
                        background-size: 16px auto;
                    }
                    .tips{
                        color: rgba(255, 255, 255, 0.2);
                        font-size: 12px;
                    }
                }
                .divTxt{
                    border-radius: 5px;
                    background-color: #412c8e;
                    padding: 8px 10px;
                    textarea{
                        display: block;
                        width: 100%;
                        height: 100px;
                        line-height: 24px;
                        overflow: hidden;
                        resize: none;
                        outline: none;
                        background: none;
                        border: none;
                        caret-color: #e1d8ff;
                        color: #fff;
                        font-size: 14px;
                        &::-webkit-input-placeholder{
                            color: #e1d8ff;
                        }
                        &::-moz-placeholder{
                            color: #e1d8ff;
                        }
                        &::-ms-input-placeholder{
                            color: #e1d8ff;
                        }
                    }
                    input{
                        display: block;
                        width: 100%;
                        height: 20px;
                        line-height: 20px;
                        overflow: hidden;
                        resize: none;
                        outline: none;
                        background: none;
                        border: none;
                        caret-color: #e1d8ff;
                        color: #fff;
                        font-size: 14px;
                        &::-webkit-input-placeholder{
                            color: #e1d8ff;
                        }
                        &::-moz-placeholder{
                            color: #e1d8ff;
                        }
                        &::-ms-input-placeholder{
                            color: #e1d8ff;
                        }
                    }
                }
            }
        }
    }
    .mod_btn{
        padding: 10px 55px 40px 55px;
        .btn{
            display: block;
            position: relative;
            width: 100%;
            
            img{
                display: block;
                width: 100%;
                height: auto;
                overflow: hidden;
            }
        }
        p{
            padding-top: 6px;
            line-height: 18px;
            color: rgba(255, 255, 255, 0.2);
            font-size: 12px;
            text-align: center;
        }
    }
    .mod_popSuc{
        position: fixed;
        left: 50%;
        top: 50%;
        margin: -140px 0 0 -132px;
        width: 265px;
        height: 280px;
        background-repeat: no-repeat;
        background-size: 100% auto;
    }
    .mod_toast {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        .toast_cont {
            padding: 10px 16px;
            background-color: rgba(0,0,0,.8);
            line-height: 32px;
            font-size: 14px;
            color: #fff;
            border-radius: 5px;
        }
    }
    

    
    // 写个媒体查询
    @media screen and (min-width: 350px){//三星&&华为
        .mod_bann{
            //background-color: #000;
            padding-top: 63%;
        }
    }
    // 写个媒体查询
    @media screen and (min-width: 360px) and (min-height: 550px){//三星
        .mod_bann{
            //background-color: #fff;
            padding-top: 69%;
        }
    }
    @media only screen and (-webkit-device-pixel-ratio:.75){/*低分辨率小尺寸的图片样式*/
        .mod_bann{
            background-color: red;
            padding-top: 68%;
        }
    }
    @media only screen and (-webkit-device-pixel-ratio:1){/*普通分辨率普通尺寸的图片样式*/
        .mod_bann{
            background-color: red;
            padding-top: 68%;
        }
    }
    @media only screen and (-webkit-device-pixel-ratio:1.5){/*高分辨率大尺寸的图片样式*/
        .mod_bann{
            background-color: red;
            padding-top: 68%;
        }
    }

    @media (device-height:480px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone4/4s */
    
    }
    @media (device-height:568px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone5 */
        .mod_bann{
            padding-top: 68%;
        }
    }
    @media (device-height:667px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone6 */
        .mod_bann{
            padding-top: 72%;
        }
    }
    @media (device-height:736px) and (-webkit-min-device-pixel-ratio:2){/* 兼容iphone6 Plus */
        .mod_bann{
            padding-top: 72%;
        }
    }
   
</style>


