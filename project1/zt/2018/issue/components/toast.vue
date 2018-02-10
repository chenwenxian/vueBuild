<template>
    <div class="toast_mod">
        <div class="toast_cont">
            <span>猎游APP还未上架IOS版，请耐心等待!</span>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: 'topTips',
        data () {
            return {
                
            }
        },
        computed: {
            
        },
        //props: ['topTips'],
        components: {
            
        },
        created: function(){
            
        },
        mounted: function(){
            this.$nextTick = function(){
               
            }
        },
        methods: {
            
        }
    }
</script>

<style lang="less">
    .toast_mod {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .toast_cont {
        padding: 10px 16px;
        background-color: rgba(0,0,0,.8);
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        border-radius: 5px;
    }
</style>
