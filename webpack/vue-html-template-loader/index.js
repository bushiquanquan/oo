/**
 * @file index 自己写个loader https://doc.webpack-china.org/api/loaders
 * 使用方式：将本目录放到node_modeuls,并在配置中加入此loader
 * 第一个 loader 的传入参数只有一个：资源文件(resource file)的内容。compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string），代表了模块的 JavaScript 源码。另外还可以传递一个可选的 SourceMap 结果（格式为 JSON 对象）。
 * @author yuanhuihui  2017/10/22
 */
var _ = require('lodash');
// var fileCount = 0;
module.exports = function(source, other){
    // 让 Loader 缓存
    this.cacheable();
    // var template = _.template(source + 'loader has worked!');
    // console.log(++fileCount);
    //  return 返回，是因为是同步类的 Loader 且返回的内容唯一，如果你希望将处理后的结果（不止一个）返回给下一个 Loader，那么就需要调用 Webpack 所提供的 API。
    // return 'module.exports = ' + template;
    // 当一个 Loader 无依赖，可异步的时候我想都应该让它不再阻塞地去异步
    var callback = this.async();
    console.log('=====loader begin====');
    console.log(source.substring(0, 40));
    console.log('=====loader end====');
    callback(null, source, other);
};
