
var utils = require('./utils');
var webpack = require('webpack');
var config = require('./config');
var merge = require('webpack-merge');

var baseWebpackConfig = require('./webpack.base.conf');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
//var HtmlWebpackPlugin = require('html-webpack-plugin');


// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build_v2/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        //已经在dev-server.js生成html文件了，不需要在这里生成html
        /*new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'build_v2/index.html',
            //inject: true
            inject: false
        }),*/

        new FriendlyErrorsPlugin()
    ]
});
