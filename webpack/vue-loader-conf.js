const utils = require('./utils');
let isProduction = utils.NODE_ENV === 'prod';

module.exports = {
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
};
