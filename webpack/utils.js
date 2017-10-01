/**
 * @file utils
 * @author yuanhuihui  2017/9/30
 */
const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// repoInfo.json
let repoInfo = require(process.cwd() + '/repo-info.json');
let group = repoInfo.group.toLowerCase();
let projectName = repoInfo.name.toLowerCase();
let version = repoInfo.version.toLowerCase();

// branchName
// const branchNameWithBuffer = execSync('git rev-parse --abbrev-ref HEAD');
// const branchName = String(branchNameWithBuffer).replace('\n', '');
const branchName="qa";
// env
let APP_ENV = process.env.APP_ENV || 'qa';
let NODE_ENV = process.env.NODE_ENV || 'development';

switch (branchName) {
    case 'develop':
        APP_ENV = 'production';
        break;
        break;
    case 'qa':
        APP_ENV = 'qa';
        break;
    default:
        APP_ENV = 'qa';
};

// public path
let publicPath = `//www.quanquan.net/${group}/${projectName}/`;

function cssLoaders(options) {
    options = options || {};

    let cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: NODE_ENV === 'prod',
            sourceMap: options.sourceMap
        }
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        let loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders);
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
    }
}

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders(options) {
    let output = [];
    let loaders = cssLoaders(options);
    for (let extension in loaders) {
        let loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
}

// get multipart pages entry
function getMultiEntry(globPath) {
    let entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry)).replace('.entry', '');
        tmp = entry.split('/').slice(2);
        tmp = tmp.slice(0, tmp.length - 1).join('/');

        pathname = tmp ? tmp + '/' + basename : (basename + '');
        entries[pathname] = entry;
    });

    return entries;
}

function addHappyLoader(name) {
    return 'happypack/loader?id=' + name.split('-')[0];
}

module.exports = {
    APP_ENV,
    NODE_ENV,
    FE_VERSION: version,
    publicPath,
    cssLoaders,
    styleLoaders,
    getMultiEntry,
    addHappyLoader
};
