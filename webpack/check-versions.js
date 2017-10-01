/**
 * @file check-versions 检查npm 、node等版本是否符合
 * @author yuanhuihui  2017/10/1
 */
const chalk = require('chalk'); // 打印上色
const semver = require('semver'); // 版本相关
const shell = require('shelljs'); // 执行shell命令
const packageConfig = require('../package.json');
const proc = require('child_process'); // node的
function exec(cmd) {
    let result = proc.execSync(cmd).toString().trim();
    // console.log(chalk.green(cmd+ ' '+result));
    return result
}
let versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version), // 抽离版本号如：v7.7.4 ==》 7.7.4
        versionRequirement: packageConfig.engines.node
    }
];

if (shell.which('npm')) {  // npm 是否安装
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    })
}

module.exports = function () {
    let warnings = [];
    for (let i = 0; i < versionRequirements.length; i++) {
        let mod = versionRequirements[i];
        // 第一个版本是否符合后面版本的描述
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            let tmp = mod.name + ': ' + chalk.red(mod.currentVersion) + ' should be ' + chalk.green(mod.versionRequirement);
            warnings.push(tmp);
        }
    }

    if (warnings.length) {
        console.log('');
        console.log(chalk.yellow('To run this project, you must update following to modules: '));
        console.log('');
        for (let i=0; i<warnings.length; i++) {
            let warning = warnings[i];
            console.log('   ' + warning);
        }
        console.log('');
        process.exit(1);
    } else {
        console.log(chalk.green('node version is ' + process.version));
    }
};
