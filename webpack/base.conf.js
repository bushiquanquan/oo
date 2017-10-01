/**
 * @file base.conf https://webpack.js.org/configuration/dev-server/
 * @author yuanhuihui  2017/9/30
 */
require('./check-versions')();
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const utils = require('./utils');
const happy = require('./happypack.conf');

let pageJs = utils.getMultiEntry('./src/**/index.entry.js');
let commonjs = Object.keys(pageJs).map(function (item) {
    let arr = item.split('/');
    arr[arr.length - 1] = 'vendor';
    return new webpack.optimize.CommonsChunkPlugin({
        name: [arr.join('/')],
        chunks: [item],
        minChunks: function (module) {
            // 所有node_modules里的文件引用打包到一个单独的js文件里
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    });
});

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: pageJs,
    output: {
        path: resolve('build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            statics: resolve('statics')
        }
    },
    module: {
        rules: [
            {
                // 未知在第一个，否则已经被下面的loader处理了；
                test: /\.(js|vue)$/,
                loader: utils.addHappyLoader('eslint-loader'),
                enforce: 'pre', // 确保检查的是源文件
                include: [resolve('src')]
            },
            {
                test: /\.vue$/,
                loader: utils.addHappyLoader('vue-loader')
            },
            // https://stackoverflow.com/questions/43222249/webpack-2-3-3-typeerror-export-is-not-a-function
            {
                test: /\.js$/,
                loader: utils.addHappyLoader('babel-loader'),
                include: [resolve('src')]
            },
            {
                test: /\.(pug|jade)$/,
                loader: 'pug-loader',
                include: [resolve('src')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CopyWebpackPlugin([{
            from: resolve('statics'),
            to: resolve('build/statics')
        }]),
        new webpack.DefinePlugin({
            'APP_ENV': JSON.stringify(utils.APP_ENV),
            'NODE_ENV': JSON.stringify(utils.NODE_ENV),
            'FE_VERSION': JSON.stringify(utils.FE_VERSION)
        })
    ].concat(commonjs, happy.happyPlugins)
};
