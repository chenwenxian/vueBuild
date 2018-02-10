# build_vue

vue构架，系统环境
    node v6.4.0   其他的没有测试
    npm 3.10.3
> 备注：执行命令环境：在根目录下。

## Build Setup

``` bash
# 开发指令说明
npm install   安装依赖

## 开发模式 目录为同级目录下的文件夹  例：testfile/vue_dome、testfile   可以多层级
npm run dev  -- 目录      例如：npm run dev  -- testfile/vue_dome

## 生产模式 
npm run build  -- 目录    例如：npm run build  -- testfile/vue_dome


在项目目录下生成
1、生成build js入口文件
2、生成dist发布文件
```

## pages->.vue 文件配置说明
```javascript
<!--
[configStart]
    {
        "pageInfo": {
            "title": "页面标题",
            "keywords": "页面keywords",
            "description": "页面description",
            "pluginJs": ["头部插入js路径1", "头部插入js路径2"],
            "pluginFooterJs": ["底部插入js路径1", "底部插入js路径2"],
            "mlog": {
            		"pageType": "统计页面类型"
            }
        },
        "roxter": "index",
        "store": "index"
    }
[configEnd]
--> 
```