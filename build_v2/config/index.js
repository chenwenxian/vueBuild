// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var program = require('../program.js');

// urlPathStr = window.urlPathStr;
// var urlPath = urlPathStr  == "urlPathStr" ? 'http://m.aipai.com/' : urlPathStr;
var fileFolder = program.m;
var projectRoot = path.resolve(__dirname, '../../');

if(!fileFolder){
    console.log('\x1b[40m \x1b[31m 小主: 您忘记输入目录咯！ \x1b[0m');
    console.log("正确命令1：npm run dev --m xxxx");
    console.log("正确命令2：npm run build --m xxxx");
    process.exit();
    return false;
}else if(!fs.existsSync(path.resolve(projectRoot, fileFolder))){//fs.exists已经废除了
    console.log('\x1b[40m \x1b[31m 小哥，我很无奈，目录找不到！！！ \x1b[0m');
    process.exit();
    return false;
}
var projectDirname = path.resolve(projectRoot, fileFolder);

var entry = {};

function getEntryFileContent (entryPath, vueFilePath, vueConfig) {

    var buildProjectPath = path.join(entryPath, '../../../');
    const relativePath = (path.relative(path.join(entryPath, '../../'), vueFilePath)).replace(/\\/g, '/');
    const rPathBuildFile = (path.join(relativePath, '../../')).replace(/\\/g, '/');
    var basename =path.basename(relativePath);

    if(!fse.existsSync(buildProjectPath)){
        fse.mkdir(buildProjectPath);
    }

    var appJsCode = '',
        params = '',
        _routerPush = '';
    appJsCode+= 'import \'es6-promise/auto\';\n';
    appJsCode+= 'import Vue from \'vue\';\n';
    appJsCode+= 'import App from \'../pages/'+basename+'\';\n';
    appJsCode+= 'import apm from \'apm_v2\';\n';
    
    appJsCode+= 'Vue.config.productionTip = false;\n';

    if(vueConfig !== ''){
        vueConfig = JSON.parse(vueConfig);
    
        if(vueConfig.store !== undefined){
            appJsCode+= 'import store from \'../store/'+vueConfig.store+'\';\n';
            params += 'store,';
        }
        if(vueConfig.roxter !== undefined){
            appJsCode+= 'import router from \'../router/'+vueConfig.roxter+'\';\n';
            params += 'router,';
            // _routerPush = '//刷新页面跳转到当前页面\n router.push(router.currentRoute.fullPath)\n';
        }
        /* 以下是vue依赖插件 */
        if(vueConfig.lazyload !== undefined){
            appJsCode+= 'import VueLazyload from \'vue-lazyload\';\n';
            var lazyloadParam = '';
            if(typeof vueConfig.lazyload === 'object'){
                lazyloadParam= ','+JSON.stringify(vueConfig.lazyload);
            }
            appJsCode+= 'Vue.use(VueLazyload'+lazyloadParam+');\n';
        }
        if(vueConfig.cookie !== undefined){
            appJsCode+= 'import VueCookie from \'vue-cookie\';\n';
            appJsCode+= 'Vue.use(VueCookie);\n';
        }
    }

    appJsCode+= 'Vue.use(apm);\n';
    appJsCode+= 'window.winVue = new Vue({el: \'#root\', '+params+'template: \'<App/>\',components: { App } });\n'
    //appJsCode+= '//刷新页面跳转到当前页面\n';
    appJsCode+= _routerPush;
    return appJsCode;
}
function walk(dir) {
    dir = dir || '.';
    var directory = path.join(projectDirname, './pages/', dir);
    var entryDirectory = path.join(projectDirname, dir);
    fse.readdirSync(directory).forEach(function(file) {
        var fullpath = path.join(directory, file);
        //数据
        var stat = fse.statSync(fullpath);
        //.vue
        var extname = path.extname(fullpath);
        if (stat.isFile()) {
            if(extname === '.vue'){
                var vueContent = fse.readFileSync(fullpath, {encoding: 'utf8'});
                var vueConfig = '';
                // vueContent.replace(/\[configStart\](.+?)\[configEnd\]/g, function() { 
                //   vueConfig = String(arguments[1]);
                // });
                vueContent.replace(/\[configStart\][\d\D]*\[configEnd\]/g, function() { 
                    vueConfig = String(arguments[0].replace(/\n/g,'').replace(/ /g,'').replace(/\[configStart\]/,'').replace(/\[configEnd\]/,''));
                });

                var entryFile = path.join(projectDirname, './build/'+path.basename(file, extname) + '.js');
                var basename = './'+fileFolder+'/build/'+path.basename(entryFile);
               
                fse.outputFileSync(entryFile, getEntryFileContent(entryFile, fullpath, vueConfig));
                
                var relativePath = './'+fileFolder+'/build/'+path.basename(entryFile);
                entry[path.basename(file, extname)] = relativePath;
            }
        }else if(stat.isDirectory() && file === 'pages') {
            var subdir = path.join(dir, file);
            walk(subdir);
        }
    });
}
walk();
//入口   { 'mobile/vue_wen/index': './mobile/vue_wen/index.js' }

module.exports = {
    entry: entry,
    argv: {
        m: fileFolder,
        projectRoot: projectRoot,
        projectDirname: projectDirname
    },
    build: {
        env: require('./prod.env'),
        //index: path.resolve(__dirname, '../../dist/'+fileFolder+'/index.html'),
        index: path.resolve(projectDirname, './static/index.html'),
        //assetsRoot: path.resolve(__dirname, '../../dist/'+fileFolder),
        assetsRoot: path.resolve(projectDirname, './static/'),
        assetsSubDirectory: 'static',//fileFolder+'/static/',
        // assetsPublicPath: 'http://m.aipai.com/'+'aipai_platform/mobile/m_ticket/index/dist'+fileFolder+'/',
        assetsPublicPath: './',    
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8081,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
};
