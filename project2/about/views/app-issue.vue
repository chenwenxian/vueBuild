<template>
    <div class="page_desc">
        <h3>三、vue：</h3>
        <p class="pbef2">基于node、webpack配置一套成熟编译打包；</p>
    </div>
</template>

<script>
    export default{
        name : 'index',
        data : function(){
            return {
                wenTest: ""
            }
        },
        components : {
            
        },
        created: function(){
            document.title = "用户协议";
            
        },
        computed: {
            
        },
        methods:{

           
        },
        /*beforeRouteLeave: function(to, from, next){
            alert(to.path);
            alert(from.path);
            // window.location.reload();
        }*/
    }
</script>
<style lang="less">
    @import '../assets/css/reset.less';
    html,body{
        height: 100%!important;
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
    .page_desc{
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
    }
    
</style>
