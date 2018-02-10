
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');

const config = require('./config');
const fileFolder = config.argv.m;
const projectRoot = config.argv.projectRoot;
const projectDirname = config.argv.projectDirname;

module.exports = function (webpackConfig){
	/*var glob = require('glob'),
        config = require('./config'),
    	path = require('path'),
		HtmlWebpackPlugin = require('html-webpack-plugin');

    var fileFolder = config.argv.m;
    var projectRoot = config.argv.projectRoot;
    var projectDirname = config.argv.projectDirname;*/

	//生成HTML模板
    var pages = Object.keys(getEntry('./'+fileFolder+'/build/*.js'));

    pages.forEach(function(pathname) {

        pathname = (pathname.toString()).replace(/\\/g, '/');
        var basename = path.basename(pathname);
        var itemName  = pathname.split('/');
        var filename = fileFolder+'/build/'+basename;

        var fullpath = projectDirname+'/pages/'+basename+'.vue';
        var vueContent = fse.readFileSync(fullpath, {encoding: 'utf8'});
        var vueConfig = '';
        var pageInfo = {};
        vueContent.replace(/\[configStart\][\d\D]*\[configEnd\]/g, function() { 
            vueConfig = String(arguments[0].replace(/\n/g,'').replace(/ /g,'').replace(/\[configStart\]/,'').replace(/\[configEnd\]/,''));
        });
        if(vueConfig !== ''){
            vueConfig = JSON.parse(vueConfig);
            pageInfo = vueConfig.pageInfo || {};
        }
        pageInfo = Object.assign({
            "title": "",
            "keywords": "",
            "description": "",
            "pluginJs": {},
            "pluginFooterJs": {},
            "mlog": {}
        }, pageInfo);

        //key WinResourcesDomain 不能修改，页面上已经使用
        //页面已经使用了全局WinResourcesDirectory变量
        var phptalVarData = {
            WinResourcesDomain: '${WinResourcesDomain}',
            WinPageData: '${structure WinPageData}'
            /*did: '${did}',
            bid: '${bid}',
            title: '${title}',
            keywords: '${keywords}',
            description: '${description}'*/
        };
        var conf = {
            phptalVarData: phptalVarData,
            pageInfo: pageInfo,
            directory: fileFolder,//目录比如：mobile/video_activity
            filename: basename + '.html', //生成的html存放路径,相对于path
            template: 'build_v2/index.html', //html模板路径
            inject: false,
            chunks: ["manifest", "vendor", basename]
            //生成文件static的js路径比如：'static/js/index'
            //如果入口文件{'static/js/index': './mobile/vue_wen/build/index.js'} =>chunks: ["manifest", "vendor", config.build.assetsSubDirectory+'/js/'+basename]  其中assetsSubDirectory表示static
            //如果入口文件{'index': './mobile/vue_wen/build/index.js'} => chunks: ["manifest", "vendor", basename] 其中basename表示index
        };
        webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
    });
    //按文件名来获取入口文件(即需要生成的模板文件数量)
    function getEntry(globPath) {
        var files = glob.sync(globPath);
        var entries = {},
          entry, dirname, basename, pathname, extname;
        for (var i = 0; i < files.length; i++) {
            entry = files[i];
            dirname = path.dirname(entry);
            extname = path.extname(entry);
            basename = path.basename(entry, extname);
            pathname = path.join(dirname, basename);
            entries[pathname] = './' + entry;
        }
        return entries;
    }
}
