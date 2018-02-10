require('./check-versions')();

process.env.NODE_ENV = 'production';

var ora = require('ora'),
    rm = require('rimraf'),
    path = require('path'),
    chalk = require('chalk'),
    webpack = require('webpack'),
    config = require('./config'),
    program = require('./program.js'),
    fs = require('fs'),
    webpackConfig = require('./webpack.prod.conf');

var projectRoot = config.argv.projectRoot;
var projectDirname = config.argv.projectDirname;

buildHtml = require('./buildHtml.js');
buildHtml(webpackConfig);

var spinner = ora('building for production...');
spinner.start();
rm(projectDirname+'/dist', err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });
});
