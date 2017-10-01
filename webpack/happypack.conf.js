/**
 * @file happypack.conf
 * @author yuanhuihui  2017/9/30
 */
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const vueLoaderConfig = require('./vue-loader-conf');
// 设置happyPack冗长的打印日志是否显示
const verbose = false;
let happyPlugins = [
    // eslint-loader：定义之后webpack以id的形式获取loader
    new HappyPack({
        id: 'eslint',
        verbose: verbose,
        loaders: [{
            path: 'eslint-loader',
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        }],
        threadPool: happyThreadPool
    }),
    // vue-loader
    new HappyPack({
        id: 'vue',
        verbose: verbose,
        loaders: [{
            path: 'vue-loader',
            query: {
                options: vueLoaderConfig
            }
        }],
        threadPool: happyThreadPool
    }),

    // babel-loader
    new HappyPack({
        id: 'babel',
        verbose: verbose,
        loaders: ['babel-loader'],
        threadPool: happyThreadPool
    })
];


module.exports = {
    happyPlugins: happyPlugins
};
