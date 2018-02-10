<template>
    <div id="index">

        <div class="main">
            <div class="mod_list">
                <ul>
                    <li ref="li0" @touchstart="addHover(0)" @touchend="removeHover(0)">
                        <span class="li_con">
                            <router-link to="/protocol">
                            <h3>1.vue</h3>
                            <span class="tips"></span>
                            </router-link>
                        </span>
                    </li>
                    <li ref="li1" @touchstart="addHover(1)" @touchend="removeHover(1)">
                        <span class="li_con">
                            <router-link to="/hunter">
                            <h3>2.vue</h3>
                            <span class="tips"></span>
                            </router-link>
                        </span>
                    </li>
                    <li ref="li2" @touchstart="addHover(2)" @touchend="removeHover(2)">
                        <span class="li_con">
                            <router-link to="/issue">
                            <h3>3.vue</h3>
                            <span class="tips"></span>
                            </router-link>
                        </span>
                    </li>
                    <li ref="li3" @touchstart="addHover(3)" @touchend="removeHover(3)">
                        <span class="li_con">
                            <router-link to="/contact">
                            <h3>4.vue</h3>
                            <span class="tips"></span>
                            </router-link>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script>

    window.appWinFun = window.appWinFun || {};


    export default{
        name : 'index',
        data : function(){
            return {
                picPath: WinResourcesDirectory+'static/img/',
                pageType: "index",
                forApp: "",
                appVersion: "",//1.0.0
                IsShowScore: (this.$apm.config.platform == "ios") ? false : true,
                wenTest: "test"
            }
        },
        created: function(){
            let _ts = this;
            document.title = 'vue';
        },
        computed:{
            
        },
        methods:{
            clickStoreScore(){
                this.$apm.appBridge("storeScore");
            },
            addHover(index){
                this.$refs['li'+index].classList.add('hover');
            },
            removeHover(index){
                this.$refs['li'+index].classList.remove('hover');
            }
        }
    }
</script>
<style lang="less">
    @import '../assets/css/reset.less';
    
    body{
        max-width: 480px!important;
        margin: 0 auto!important;
        font-family: "\5FAE\8F6F\96C5\9ED1";
        background-color: #f5f5f5;

    }
    .border_bottom(){
        position: relative;
        &:after{
            content: '';
            position: absolute;
            z-index:5;
            bottom: 0px;
            left: 0;
            line-height:0;
            height: 1px;
            width: 100%;
            overflow:hidden;
            background-image: -webkit-linear-gradient(270deg,#efefef,#efefef 50%,transparent 50%);
            background-image: -moz-linear-gradient(270deg,#efefef,#efefef 50%,transparent 50%);
            background-image: -o-linear-gradient(270deg,#efefef,#efefef 50%,transparent 50%);
            background-image: linear-gradient(180deg,#efefef,#efefef 50%,transparent 50%);
            background-size: 100% 1px;
            background-position: bottom;
            background-repeat: no-repeat;
        }
    }
    .main{
        background-color: #fff;
    }
    
    .mod_list{
        ul{
            
        }
        li{
            padding: 0px 10px;
            height: 47px;
            &.hover{
                background-color: #f5f5f5;
            }
            .li_con{
                position: relative;
                display: block;
                width: 100%;
                height: 47px;
                line-height: 47px;
                //border-bottom: 1px solid #efefef;
                .border_bottom();
            }
            h3{
                height: 47px;
                line-height: 47px;
                font-size: 16px;
                color: #333;
            }
            .tips{
                position: absolute;
                right: 0px;
                top: 17px;
                display: block;
                width: 14px;
                height: 14px;
                background: url('../assets/img/icon_link@2x.png') no-repeat 3px 0px;
                background-size: auto 100%;
                

            }
        }
        li:last-child .li_con{
            &:after{
                display: none;
            }
        }
    }
    


    @-webkit-keyframes rotateAntiClockWise {
      0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg); }

      50% {
        -webkit-transform: rotate(180deg);
                transform: rotate(180deg); }

      100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg); } 
    }

    @keyframes rotateAntiClockWise {
      0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg); }

      50% {
        -webkit-transform: rotate(180deg);
                transform: rotate(180deg); }

      100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg); }
    }
    // 写个媒体查询
    @media screen and (max-width: 360px){
        .main .hd_title{
            letter-spacing: 1px;
        }
        .main .hd_title h3{
            font-size: 22px;
        }
        .main .hd_title .l_tail,
        .main .hd_title .r_tail{
            width: 80px;
        }
        .main .hd_title .l_tail .line, 
        .main .hd_title .r_tail .line{
            width: 70px;
        }
    }
    @media screen and (max-width: 320px){
        .main .hd_title{
            letter-spacing: 1px;
        }
        .main .hd_title h3{
            max-width: 168px;
            font-size: 20px;
        }
        .main .hd_title .l_tail,
        .main .hd_title .r_tail{
            width: 70px;
        }
        .main .hd_title .l_tail .line, 
        .main .hd_title .r_tail .line{
            width: 55px;
        }
    }
</style>
