/*
    简单文件写入 不需要关闭 对同步和异步操作进行了封装操作
        fs.writeFile(file,data[,options],callback);
        fs.writeFileSync(file,data[,option]);
            - file 文件的路径
            - data 要写入的数据
            - options 选项 一个对象
                - encoding 默认 utf-8
                - mode 权限默认 0o666
                - flag 默认 w 默认是直接从头开始覆盖
                    - w 不存在则创建，存在则全部覆盖，写入
                    - a 不存在则创建，存在则追加
                    - r+ 读写文件，如果文件不存在则抛出异常
                    - w+ 比w多了个读操作
            - callback 回调函数 只返回err
 */

var fs = require('fs');
fs.writeFile('hello3.txt','hello node js',{flag:'a'}, function (err) {
    console.log(arguments);
    if(err){
        console.log(err);
    }
});

// 写绝对路径下的文件 注意，需要转义 \\ 或者 /
fs.writeFile('d:/hello3.txt','hello node js',{flag:'w+'}, function (err) {
    console.log(arguments);
    if(err){
        console.log(err);
    }
});