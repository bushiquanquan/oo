/**
 * @file prod.conf
 * @author yuanhuihui  2017/10/2
 */
const webpack = require('webpack');
const os = require('os');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./base.conf');
const utils = require('./utils');
const rm = require('rimraf')
// remove dist folder in web app mode
console.log(rm);
rm.sync('build/*');
let htmlPlugins = [],
    pages = utils.getMultiEntry('./src/**/index.entry.html');

for (let pathname in pages) {
    // 配置生成的 html 文件， 定义路径等
    let arr = pathname.split('/');
    arr[arr.length - 1] = 'vendor';
    let conf = {
        filename: pathname + '.html',
        template: pages[pathname], // 模版路径
        chunks: [pathname, arr.join('/')], // 每个 html 引用的 js 模块
        inject: 'true',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            preserveLineBreaks: true,
            collapseInlineTagWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            caseSensitive: true,
            minifyJS: true,
            minifyCSS: true,
            quoteCharacter: '"'
        },
        env: {
            APP_ENV: utils.APP_ENV
        }
    };

    htmlPlugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackMerge(baseConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: false,
            extract: true
        })
    },
    // devtool: '#source-map',
    output: {
        publicPath: utils.publicPath,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[id].[chunkhash].js'
    },
    plugins: [
        new UglifyJSPlugin({
            parallel: {
                cache: true,
                workers: os.cpus().length
            }
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css'
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ].concat(htmlPlugins)
});

