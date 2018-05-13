/**
 * Created by Administrator on 2018/5/13.
 */

// 通过npm下载的包都放在node_modules 文件夹中，通过npm下载的包，直接引入包名引用即可
    // node 在使用模块的时候，先从当前目录下的node_modules中寻找是否含有该模块，然后再在上一级目录中的node_modules中寻找，一直递归查找，直到找到为止，如果没有找到根路径为止
// 安装math模块后进行使用

var math = require('math');

console.log(math.add(444,333));