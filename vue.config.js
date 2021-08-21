const path = require('path'); //引入path模块
function resolve(dir) {
    return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}
module.exports = {
    chainWebpack: config => {
        // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('components', resolve('./src/components'))
            .set('views', resolve('./src/views'))
            .set('assets', resolve('./src/assets'))
            .set('common', resolve('./src/common'))
            .set('network', resolve('./src/network'))



    },
}