/**
 * @file index https://github.com/webpack/docs/wiki/how-to-write-a-plugin
 * @author yuanhuihui  2017/10/22
 */
// var _ = require('lodash');
function YUANHHPlugin(options){
    // options是配置文件，你可以在这里进行一些与options相关的工作
}

// 每个plugin都必须定义一个apply方法，webpack会自动调用这个方法
YUANHHPlugin.prototype.apply = function(compiler){
    // apply方法中会传入Compiler的实例compiler
    // 'emit'是该插件监听的事件，插件工作的逻辑在回调函数中
    compiler.plugin('emit', function(compilation, callback){
        // 回掉函数有两个参数
        // compilation和下一个回调函数，callback可以不传
        // 同步事件不传callback
        compilation.chunks.forEach(function(chunk){
            console.log('\nchunk.name', chunk.name);
            console.log('=====================================');
            console.log('chunk.modules', chunk.modules.length);
            // console.log('chunk.modules', chunk.getNumberOfModules());

            // Explore each module within the chunk (built inputs):
            chunk.forEachModule(function(module) {
                console.log('================module', module.resource);
                // Explore each source file path that was included into the module:
                if (Array.isArray(module.fileDependencies)) {
                    module.fileDependencies.forEach(function(filepath){
                        console.log('========fileDependencies', filepath);
                    });
                }
            });
            if (chunk && Array.isArray(chunk.files)) {
                chunk.files.forEach(function(filename){
                    // let source = compilation.assets[filename].source();
                    console.log('file', filename);
                })
            }
            let filelist = '';

            // Loop through all compiled assets,
            // adding a new line item for each filename.
            // 最终要输出的文件
            for (let filename in compilation.assets) {
                filelist += ('- ' + filename + '\n');
            }
            // Insert this list into the Webpack build as a new file asset:
            // 在build目录插入一个新的文件，指定内容
            compilation.assets['filelist.md'] = {
                source: function() {
                    return filelist;
                },
                size: function() {
                    return filelist.length;
                }
            };

        });
        callback && callback();
    });
};

module.exports = YUANHHPlugin;
