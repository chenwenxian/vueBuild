<template>
    <div class="page_levelTxt">
        <h3>一、什么是vue?</h3>
        <p>vue是mvvm模式。。。</p>
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
                appVersion: ""//1.0.0
            }
        },
        created: function(){
            let _ts = this;
            document.title = "什么是vue";
          
            
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
    
    .page_levelTxt{
        padding: 10px 10px;
        h3{
            padding: 10px 0px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
        }
        p{
            padding-bottom: 10px;
            line-height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #666666;
            letter-spacing: 0;
        }
        .pbef2{
            text-indent: 2em;
        }
        .pbef3{
            padding-left: 2em;
        }
        .pic{
            width: 100%;
            padding-bottom: 10px;
            img{
                display: block;
                width: 100%;
                height: auto;
                overflow: hidden;
                padding-bottom: 10px;
            }
        }
        .mod_table{
            padding-top: 10px;
            table{
                width: 100%;
                display: table;
                border-collapse: separate;
                border-spacing: 1px;
                
                //border-color: #000;
                background: #ccc;
            }
            thead{
                width: 100%;
                
                th{
                    height: 30px;
                    line-height: 30px;
                    font-weight: 700;
                    font-family: PingFangSC-Semibold;
                }
            }
            tbody{
                width: 100%;
                display: table-row-group;
                vertical-align: middle;
                border-color: inherit;
                td{
                    line-height: 17px;
                    font-weight: normal;
                    padding: 5px 0px;
                }
            }
            tr{
                display: table-row;
                vertical-align: inherit;
                border-color: inherit;
                font-weight: normal;
            }
            td, th{
                display: table-cell;
                vertical-align: inherit;
                text-align: center;
                font-size: 12px;
                color: #666666;
                background: #f5f5f5;
                &.align_left{
                    text-align: left;
                }
                span{
                    display: block;
                    padding: 0px 10px;
                }
            }
        }
        .pat0{
            padding-top: 0px;
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
