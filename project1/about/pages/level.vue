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
        "roxter": "level"
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
            // console.log(111888);
        },

        methods: {

        }
    }
</script>

