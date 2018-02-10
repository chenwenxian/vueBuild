<template>
    <header class="vheader">
        <div class="hd_back">
            <a href="javascript:history.back();" @touchstart="addCur" @touchend="removeCur"></a>
        </div>
        <h1 class="head_title">{{title}}</h1>
        <div class="hd_btns">
            <div class="hd_share">
                <span @click="apShare" @touchstart="addCur" @touchend="removeCur">分享</span>
            </div>
        </div>
        <ap-share
            :url="shareData.url"
            :title="shareData.title"
            :pic="shareData.pic"
            :summary="shareData.summary"
            :value.sync="apShareVisiable"
          />
    </header>
</template>

<script>
    import apm from '@common/plugin/apm';
    import Share from '@/components/vue-apc/share';
    // import Share from '@common/module/vue-apc/share';
    export default {
        name: 'header',
        data () {
            return {
                apShareVisiable: false //分享弹框显示
            }
        },
        props: ['title', 'shareData'],
        components: {
            'ap-share': Share
        },
        created: function(){
            if(apm.app.is({p:'aipai'})){
                var setInitShare = {
                    title : this.shareData.title,
                    content : this.shareData.summary,
                    imageUrl : this.shareData.pic,
                    targetUrl : this.shareData.url
                };
                apm.appBridge('setTitle', encodeURIComponent(this.title));
                apm.appBridge('setInitShare', encodeURIComponent(JSON.stringify(setInitShare)));
            }
            
        },
        methods: {
            apShare(){
                this.apShareVisiable = true;
            },
            addCur($event){
                $event.target.classList.add('cur');
            },
            removeCur($event){
                $event.target.classList.remove('cur');
            }
        }
    }
</script>

<style lang="less" scoped>
    .textc(){
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vheader {
        position: relative;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        min-height: 44px;
        background: rgb(255,178,1);
        .hd_back {
            width: 32px;
            height: 44px;
            overflow: hidden;
            float: left;
            a {
                display: block;
                width: 32px;
                height: 44px;
                background: url("../../assets/img/hd_back.png") center no-repeat;
                background-size: 12px auto;
            }
        }
        .hd_btns{
            float: right;
            // width: 72px;
            position: relative;
            z-index: 100;
            .hd_share{
                float: right;
                margin-right: 4px;
                width: 36px;
                height: 44px;
                overflow: hidden;
                span{
                    display: block;
                    width: 100%;
                    height: 44px;
                    text-indent: -999px;
                    padding-top: 0px;
                    background: url("../../assets/img/hd_share.png") no-repeat center center;
                    background-size: 22px auto;
                }
            }
        }
        .hd_back a, .hd_share span{
            &.cur{
                background-color: #de7d08;
            }
        }
        .head_title {
            position: absolute;
            left: 15%;
            top: 0;
            width: 70%;
            height: 44px;
            line-height: 46px;
            padding-left: 0;
            margin: 0px;
            font-size: 18px;
            color: #f8f7ea;
            text-align: center;
            overflow: hidden;
            background: none;
            letter-spacing: 0;
            .textc();
        }
        .hd_set {
            font-size: 16px;
            height: 22px;
            margin: 12px 10px;
            overflow: hidden;
            float: right;
            a {
                color: white;
            }
        }
    }
</style>
