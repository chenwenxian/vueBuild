var path = require('path');
var fse = require('fs-extra');

var utils = require('./utils');

var config = require('./config');
var fileFolder = config.argv.m;
var fileFolders = fileFolder.split('/');
var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;

var vueLoaderConfig = require('./vue-loader.conf');
var program = require('./program.js');

//var webSrcDirectory = path.join(__dirname, '../../'+fileFolder+'/');
var entry ={};

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

config.entry["app"] = "babel-polyfill";
// console.log(entry)

if (!global._babelPolyfill) {
    delete config.entry.app;
}
// console.log(entry)
var entryAppArr = [ "babel-polyfill",'./'+fileFolder+'/index.js'];
if (!global._babelPolyfill) {
    entryAppArr = [ './'+fileFolder+'/index.js'];
}

var svgoConfig= JSON.stringify({
    plugins: [
        { removeTitle: true },
        { convertColors: { shorthex: true } },
        { convertPathData: true },
        { cleanupAttrs: true },
        { removeComments: true },
        { removeDesc: true },
        { removeUselessDefs: true },
        { removeEmptyAttrs: true },
        { removeHiddenElems: true },
        { removeEmptyText: true }
    ]
});

module.exports = {
    // entry: {
    //   app: entryAppArr
    // },
    entry : config.entry,
    output: {
        //path: config.build.assetsRoot,
        path: path.resolve(projectDirname, 'dist'),
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': projectDirname,
            '@common': resolve(((program.m).split("/"))[0]+'/common/'),
            'apm_v2': path.join(projectRoot, fileFolders[0]+'/common/plugin/apm_v2.js') //注意：只能用在入口js文件扩展vue：$apm
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve(fileFolder), resolve('test'), resolve(((program.m).split("/"))[0]+'/common/plugin/apm_v2.js')]
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[ext]?[hash:7]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]?[hash:7]')
                }
            },
            {
                test: /.*\.svg$/,
                loaders: [
                    'svg-sprite-loader',
                    'svgo-loader?'+svgoConfig
                ]
            }
        ]
    }
};
