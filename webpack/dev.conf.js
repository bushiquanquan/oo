/**
 * @file dev.conf
 * @author yuanhuihui  2017/10/1
 */
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const utils = require('./utils');
let baseConfig = require('./base.conf');

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
        title: '圈圈',
        env: {
            APP_ENV: utils.APP_ENV
        }
    };
    htmlPlugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = function () {
    return webpackMerge(baseConfig, {
        module: {
            rules: utils.styleLoaders({ sourceMap: true })
        },
        // cheap-module-eval-source-map is faster for development
        devtool: '#cheap-module-eval-source-map',
        output: {
            publicPath: '/',
            filename: '[name].[hash].js',
            chunkFilename: '[id].[hash].js'
        },
        devServer: {
            port: 8880,
            host: '0.0.0.0',
            historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
            noInfo: false,
            stats: 'minimal',
            inline: true, // 设置为true，当源文件改变时会自动刷新页面
            publicPath: '/',
            disableHostCheck: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin()
        ].concat(htmlPlugins)
    });
};
