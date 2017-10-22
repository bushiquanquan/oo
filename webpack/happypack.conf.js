/**
 * @file happypack.conf
 * @author yuanhuihui  2017/9/30
 */
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const utils = require('./utils');
let isProduction = utils.NODE_ENV === 'prod';

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
                options: {
                    loaders: utils.cssLoaders({
                        sourceMap: !isProduction,
                        extract: isProduction
                    }),
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            }
        }, {
            path: 'vue-html-template-loader',  // 自定义的loader
            query: {
                options: {
                }
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
