<template>
    <div :class="'loopNum'+imgData.cards.length">
        <div class="hd_title"><div class="l_tail"><span class="box"></span><span class="line"></span></div><h3>{{imgData.showTitle}}</h3><div class="r_tail"><span class="box"></span><span class="line"></span></div></div>
        <p style="display:none;">{{indexCur}}</p>
        <div class="loopPic" @touchstart="picStart" @touchmove="picMove" @touchend="picEnd">
            <div v-for="(item,index) in imgData.cards" @click="clickfun(loopClass[index].loopWrap, item.cardUrl.mobile, item.card.id)" :class="['loopWrap', 'loopWrap'+(loopClass[index].loopWrap)]">
                <img :src="item.cardThumb.size800Fix" alt="" />
                <span class="play" :style="{backgroundImage: 'url(' +sprite + ')'}"></span>
                <span class="shade"></span>
            </div>
        </div>
    </div>
</template>
<script>
    import apm from '@common/plugin/apm';
    export default {
        data(){
            return {
                loopClass:[],
                indexCur: 1,
                indexCurLoop: 1,
                sprite : require("../../assets/img/ico_play.png"),
                picScroll: {
                    start: {},
                    delta: {},
                    isScrolling: undefined,
                }
            }
        },
        props: ['imgData'],
        created(){
            for(var i=0;i<this.imgData.cards.length;i++){
                this.loopClass[i] = {loopWrap:(i+1)}
            }
        },
        computed:{
            showitem(){
                return this.imgData.cards.length
            }
        },
        mounted(){
        },
        methods: {
            clickfun(index, url, vid){
                if(index === 1){
                    // 如果1，跳转
                    const param = {
                        type: 'video',
                        url: url,
                        vid: vid
                    };

                    if(apm.app.isInApp){
                        apm.appBridge(param.type, param.vid);
                        return false;
                    }else{
                        window.location.href = param.url;
                    }
                }else{
                    var disparity = 0

                    if(index>Math.ceil(this.showitem/2)){
                        disparity = index-this.indexCurLoop-this.showitem;
                        disparity = (-disparity >= Math.ceil(this.showitem/2)) ? disparity + this.showitem :disparity;
                    }else{
                        disparity = index-this.indexCurLoop;
                        disparity = (-disparity >= Math.ceil(this.showitem/2)) ? disparity + this.showitem :disparity;
                    }
                    var _ts = this;
                    // console.log(disparity);
                    animatefun(disparity);
                    function animatefun(disparity){
                        var newDisparity = disparity;
                        var setTimeoutfun = setTimeout(function(){
                            if(newDisparity>0){
                                _ts.swipeleft();
                                newDisparity -= 1;
                                clearTimeout(setTimeoutfun);
                                animatefun(newDisparity);
                            }
                            if(newDisparity<0){
                                _ts.swiperight();
                                newDisparity += 1;
                                clearTimeout(setTimeoutfun);                            
                                animatefun(newDisparity);
                            }
                        },100)
                    }
                }
            },
            swipeleft(){
                var _ts= this,
                    nowItem = null;
                for(var i = 0;i < _ts.loopClass.length;i++){
                    nowItem = _ts.loopClass[i].loopWrap;

                    var _ii = parseInt(_ts.loopClass[i].loopWrap)-1;
                    _ts.loopClass[i].loopWrap = (_ii<=0) ? (_ii+_ts.imgData.cards.length) : _ii;
                }
                _ts.indexCur = _ts.indexCur+1 > _ts.imgData.cards.length ? 1:_ts.indexCur+1;
            },
            swiperight(){
                var _ts= this,
                nowItem = null;
                for(var i = 0;i < _ts.loopClass.length;i++){
                    nowItem = _ts.loopClass[i].loopWrap;

                    var _rr = parseInt(_ts.loopClass[i].loopWrap)+1;
                    _ts.loopClass[i].loopWrap = (_rr>_ts.imgData.cards.length) ? (_rr-_ts.imgData.cards.length) : _rr;
                }
                _ts.indexCur = _ts.indexCur-1 <= 0 ? _ts.imgData.cards.length:_ts.indexCur-1;
            },
            picStart(event){
                var _ts = this.picScroll;
                var touches = event.touches[0];

                // 获取初始的触摸变量值
                _ts.start = {
                    // 获取初始的触摸坐标
                    x : touches.pageX,
                    y : touches.pageY,
                    // 用来确定触摸持续时间
                    time : +new Date()
                };

                // 用于检测第一次move事件
                _ts.isScrolling = undefined;
            },
            picMove(event){
                var _ts = this.picScroll;
                // 确保单点触摸滑动
                if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

                var touches = event.touches[0];

                // 获取滑动触摸在X、Y轴的变化值
                _ts.delta = {
                    x : touches.pageX - _ts.start.x,
                    y : touches.pageY - _ts.start.y
                };

                // 检测是否是垂直滚动
                if (typeof _ts.isScrolling == 'undefined') {
                    _ts.isScrolling = !!(_ts.isScrolling || Math.abs(_ts.delta.x) < Math.abs(_ts.delta.y));
                }

                // 如果不是垂直滚动
                if (!_ts.isScrolling) {
                    // 阻止默认滚动
                    event.preventDefault();
                }
            },
            picEnd(event){
                var _ts = this.picScroll;

                if (typeof _ts.isScrolling == 'undefined') return;

                // 获取幻灯片触摸持续时间
                var duration = +new Date() - _ts.start.time;
                // 确定是否触发上一个或下一个幻灯片
                // 如果幻灯片触摸持续时间小于250ms 
                // 并且在X轴方向触摸滑动距离大于20px 
                // 或者如果在X轴方向触摸滑动距离大于幻灯片宽度的一半
                var isValidSlide = Number(duration) < 250  && Math.abs(_ts.delta.x) > 20  || Math.abs(_ts.delta.x) > document.body.clientWidth / 2;
                

                if (!_ts.isScrolling) {
                    if (isValidSlide) {
                        // 检测swipe滑动方向(true : 向左, false : 向右)
                        if(_ts.delta.x < 0){
                            // 向左
                            this.swipeleft();
                        }else{
                            // 向右
                            this.swiperight();
                        }
                    }
                }
            }
        },
    }
</script>
<style lang="less" scoped>
    .loopPic{
        width:100%;
        height:160px;
        position:relative;
    }
    .loopNum5{
        @media only screen and (min-width : 320px) {
            .loopPic{
                height: 120px;
            }
            .loopWrap{
                .loopWrap(@width:200px,@height:112px)
            }
        }
        @media only screen and (min-width : 360px) {
            .loopPic{
                height: 140px;
            }
            .loopWrap{
                .loopWrap(@width:240px,@height:135px)
            }
        }
        @media only screen and (min-width : 375px) {
            .loopWrap{
                .loopWrap(@width:257px,@height:145px)
            }
        }
        .loopWrap(@width:257px,@height:145px){
            @time : 0.5s;
            width:@width*0.5;
            height:@height*0.5;
            z-index:1;
            position:absolute;
            top: (@height*0.5)-(@height*0.5*0.5)+@border;
            left: 50%;
            transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            transform-origin: center;
            -webkit-transform-origin: center;
            img{
                width:100%;
                height:100%;
            }
            &.loopWrap3,&.loopWrap4{
                @time : 0.2s;
                transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
                -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            }
            &.loopWrap2,&.loopWrap5{
                @time : 0.4s;
                transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
                -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            }
            .play{
                display: block;
                position: absolute;
                z-index: 12;
                width: 36px;
                height: 36px;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 36px 36px;
                left: 50%;
                top: 50%;
                margin: -18px 0 0 -18px;
            }
            .shade{
                position:absolute; 
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,.65);
                transition: background .5s ease;
                 -webkit-transition: background .5s ease;       
            }
            @border:2px;
            &.loopWrap1{
                width:@width;
                height:@height;
                left: 50%;
                margin-left:-@width/2-3;
                top:@border;
                z-index:10;
                border:@border solid #bf9c4f;
                border-radius:3px;
                .shade{
                    background:rgba(0,0,0,.3)
                }
            }
            &.loopWrap2{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 55%;
                margin-left:-(@width*0.18);
                z-index:5;
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
            &.loopWrap3{
                width:@width*0.5;
                height:@height*0.5;
                top: (@height*0.5)-(@height*0.5*0.5)+@border;
                left: 60%;
                margin-left:(@width*0.08);
                z-index:3;
            }
            &.loopWrap4{
                width:@width*0.5;
                height:@height*0.5;
                top:(@height*0.5)-(@height*0.5*0.5)+@border;
                left: 40%;
                margin-left:-(@width*0.58);
                z-index:3;
            }
            &.loopWrap5{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 45%;
                margin-left:-(@width*0.55);
                z-index:5;
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
        }
    }
    .loopNum4{
        @media only screen and (min-width : 320px) {
            .loopPic{
                height: 120px;
            }
            .loopWrap{
                .loopWrap(@width:200px,@height:112px)
            }
        }
        @media only screen and (min-width : 360px) {
            .loopPic{
                height: 140px;
            }
            .loopWrap{
                .loopWrap(@width:257px,@height:145px)
            }
        }
        @media only screen and (min-width : 375px) {
            .loopWrap{
                .loopWrap(@width:257px,@height:145px)
            }
        }
        .loopWrap(@width:257px,@height:145px){
            @time : 0.5s;
            width:@width*0.5;
            height:@height*0.5;
            z-index:1;
            position:absolute;
            top: (@height*0.5)-(@height*0.5*0.5)+@border;
            left: 50%;
            transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            transform-origin: center;
            -webkit-transform-origin: center;
            img{
                width:100%;
                height:100%;
            }
            &.loopWrap2,&.loopWrap3,&.loopWrap4{
                @time : 0.2s;
                transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
                -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            }
            .play{
                display: block;
                position: absolute;
                z-index: 12;
                width: 36px;
                height: 36px;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 36px 36px;
                left: 50%;
                top: 50%;
                margin: -18px 0 0 -18px;
            }
            .shade{
                position:absolute; 
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,.65);
                transition: background .5s ease;
                 -webkit-transition: background .5s ease;       
            }
            @border:2px;
            &.loopWrap1{
                width:@width;
                height:@height;
                left: 50%;
                margin-left:-@width/2-3;
                top:@border;
                z-index:10;
                border:@border solid #bf9c4f;
                border-radius:3px;
                .shade{
                    background:rgba(0,0,0,.3)
                }
            }
            &.loopWrap2{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 55%;
                margin-left:-(@width*0.18);
                z-index:5;
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
            &.loopWrap3,&.loopWrap4{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 45%;
                margin-left:-(@width*0.55);
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
            &.loopWrap3{
                z-index: 3;
            }
            &.loopWrap4{
                z-index: 5;
            }
        }
    }
    .loopNum3{
        @media only screen and (min-width : 320px) {
            .loopPic{
                height: 120px;
            }
            .loopWrap{
                .loopWrap(@width:200px,@height:112px)
            }
        }
        @media only screen and (min-width : 360px) {
            .loopPic{
                height: 140px;
            }
            .loopWrap{
                .loopWrap(@width:257px,@height:145px)
            }
        }
        @media only screen and (min-width : 375px) {
            .loopWrap{
                .loopWrap(@width:257px,@height:145px)
            }
        }
        .loopWrap(@width:257px,@height:145px){
            @time : 0.5s;
            width:@width*0.5;
            height:@height*0.5;
            z-index:1;
            position:absolute;
            top: (@height*0.5)-(@height*0.5*0.5)+@border;
            left: 50%;
            transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            transform-origin: center;
            -webkit-transform-origin: center;
            img{
                width:100%;
                height:100%;
            }
            &.loopWrap2,&.loopWrap3{
                @time : 0.2s;
                transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
                -webkit-transition: left @time ease,top @time ease,width @time ease,height @time ease,margin @time ease;
            }
            .play{
                display: block;
                position: absolute;
                z-index: 12;
                width: 36px;
                height: 36px;
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 36px 36px;
                left: 50%;
                top: 50%;
                margin: -18px 0 0 -18px;
            }
            .shade{
                position:absolute; 
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,.65);
                transition: background .5s ease;
                 -webkit-transition: background .5s ease;       
            }
            @border:2px;
            &.loopWrap1{
                width:@width;
                height:@height;
                left: 50%;
                margin-left:-@width/2-3;
                top:@border;
                z-index:10;
                border:@border solid #bf9c4f;
                border-radius:3px;
                .shade{
                    background:rgba(0,0,0,.3)
                }
            }
            &.loopWrap2{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 55%;
                margin-left:-(@width*0.18);
                z-index:5;
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
            &.loopWrap3{
                width:@width*0.73;
                height:@height*0.73;
                top:@height*0.73*0.25;
                left: 45%;
                margin-left:-(@width*0.55);
                z-index:5;
                .shade{
                    background:rgba(0,0,0,.45)
                }
            }
        }
    }
</style>