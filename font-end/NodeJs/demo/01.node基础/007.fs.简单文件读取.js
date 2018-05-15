
var fs = require('fs');

fs.readFile('hello.txt', function (err,data) {
    if(!err){
        // 读取到的数据，返回的是一个buffer，需要转换成一个字符串
        // 返回的是二进制字节的原因，可能读取的文件是图片等二进制文件，故不直接返回字符串数据
        console.log(data.toString());
    }
})