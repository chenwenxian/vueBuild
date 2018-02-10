require('./check-versions')();
var program = require('./program.js'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob');

var webpackConfig = process.env.NODE_ENV === 'testing'
    ? require('./webpack.prod.conf')
    : require('./webpack.dev.conf');

//生成html文件
buildHtml = require('./buildHtml.js');
buildHtml(webpackConfig);

var config = require('./config');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require('opn');
var express = require('express');
var webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

app.use(require('connect-history-api-fallback')());
app.use(devMiddleware);
app.use(hotMiddleware);
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
//app.use(staticPath, express.static('./static'));

app.use('/mobile/vue_test/static', express.static('./static'));

//检测端口号是否被占用
var net = require('net');
function probe(port, callback) {
    var server = net.createServer().listen(port);
    var calledOnce = false;
    var timeoutRef = setTimeout(function () {
        calledOnce = true;
        callback(false,port);
    }, 2000);
    timeoutRef.unref();
    var connected = false;
    server.on('listening', function() {
        clearTimeout(timeoutRef);
        if(server)
            server.close();
        if(!calledOnce) {
            calledOnce = true;
            callback(true,port);
        }
    });
    server.on('error', function(err) {
        clearTimeout(timeoutRef)
        var result = true;
        if (err.code === 'EADDRINUSE')
            result = false;
        if (!calledOnce) {
            calledOnce = true;
            callback(result,port);
        }
    });
}
// 被占用时获取新的端口号
var server = null;
function serverfun(_port){
    var pt = _port || __port;
    probe(pt,function(bl,_pt){
        // 端口被占用 bl 返回false
        // _pt：传入的端口号
        if(bl === true){
            openBrowser();
            server = app.listen(port);
        }else{
            port +=1; 
            serverfun(port);
            // console.log("失败")
        }
    });
}
serverfun(port);

var _resolve;
var readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

function openBrowser(){
    var uri = 'http://localhost:' + port;
    console.log('> Starting dev server...');
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        if(autoOpenBrowser && process.env.NODE_ENV !== 'testing'){
            opn(uri);
        }
        _resolve();
    });
}

process.on('SIGINT', function(){
    server.close();
    process.exit(0);  
});
process.on('exit', function () { 
    //var delfile = ((program.m).split("/"))[0]
    //console.log("\n 小的，告辞！！！!"); 
});

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
    }
};



