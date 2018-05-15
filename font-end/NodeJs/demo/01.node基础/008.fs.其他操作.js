var fs = require('fs');
// 判断文件是否存在，推荐使用同步方式
var isExists = fs.existsSync('package.json');
console.log(isExists);
// 获取文件的状态,返回一个对象，该对象包含文件对象的状态信息
fs.stat('package.json', function (err,stat) {
    // 文件不存在，则是undefined
    console.log(stat);
    console.log(stat.isFile());// 是否是一个文件
    console.log(stat.isDirectory()); // 是否是一个文件夹
    console.log(stat.size);// 文件的大小
});

// 删除文件 如果文件不存在则报错
//fs.unlinkSync('hello.txt');

// readdir reddirSync
// -files 是一个字符串数组，每个字符串是文件的名称或者文件夹的名称
fs.readdir('.', function (err,files) {
    if(!err){
        console.log(files);
    }
});

// 截断文件 将文件修改为指定的大小 如果文件不存在则报错
//  truncateSync(path,len) truncate(path,len,callback);
//fs.truncateSync('hello.txt',10);

// 创建一个文件夹 如果存在则报错
// mkdir(path[,mode],callback) mkdirSync(path[,mode]);

fs.mkdirSync('./hello');

// 删除一个目录  如果不存在则报错
//fs.rmdirSync('./hello');

// 重命名(移动) 也可以达到剪切的效果 rename(oldPath,newPath,callback) renameSync(oldPath,newPath)
fs.rename('./hello','d:\hello2', function (err) {
    if(!err){
        console.log('修改成功');
    }
});

// watchFile(fileName[,options],listener)
// - 监视文件的修改 当文件发生变化时，回调函数触发
// options 内含扫描时间间隔配置，默认5s
fs.watchFile('hello.txt',{interval:1000}, function (curr,prev) {
    console.log('文件发生了变化');
    // curr 当前文件的状态 都是stat对象
    console.log(curr.atimeMs);
    // prev 修改文件前的状态
    console.log(prev.size);
})