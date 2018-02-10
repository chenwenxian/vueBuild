<!--
[configStart]
    {
        "pageInfo": {
            "title": "",
            "keywords": "",
            "description": "",
            "pluginJs": [
                "http://m.aipai.com/aipai_platform/mobile/common/dist/weixin/1.0.0/jweixin.js"
            ]
        },
        "roxter": "index"
    }
[configEnd]
--> 
<template>
    <div class="wrapper">
        <router-view name="view"></router-view>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data: function(){
            return {}
        },
        created: function(){
            // if(!navigator.userAgent.match(/iphone|ipod|Android/ig)){
            //     var to_href = "http://www.lieyou.com/about.html" 
            //     location.href = to_href;
            // }
        },

        methods: {

        }
    }
</script>

