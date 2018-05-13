/**
 * Created by Administrator on 2018/5/13.
 */
// 异步文件写入

var fs = require('fs');
// 1 打开文件 含有一个回调函数，callback必须要传入
// 如果该文件不存在则创建一个 在 w 模式下
// 异步方法没有返回值，fd在回调函数中返回
// 回调函数返回2个参数：
// 第一个err 如果没有错误，则为null node的设计思想，错误优先
// 第二个fd 文件描述符
fs.open('hello2.txt','w', function (err,fd) {
    console.log(arguments); //{ '0': null, '1': 3 }
    if(!err){
        console.log(fd);
        // 异步写入文件
        // 返回信息没有fd
        fs.write(fd,'hello node', function (err) {
            if(!err){
                fs.close(fd, function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('文件已关闭');
                    }
                });
            }
        })
    }else{
        console.log(err);
    }
});

