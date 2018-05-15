/**
 * Created by Administrator on 2018/5/15.
 * 适用于大文件，分多次进行读取
 */

var fs = require('fs');
// 创建一个可读流
var rs = fs.createReadStream('hello.txt');
// 创建一个可写流
var ws = fs.createWriteStream('a.txt');

// 监听流的开启和关闭
rs.once('open', function () {
    console.log('可读流打开了');
});
rs.once('close', function () {
    console.log('可读流关闭了');
    ws.end();
});
// 如果要读取一个可读流的数据，必须要给可读流绑定一个data事件
rs.on('data', function (data) {
    console.log(data.length); // 每次最多读取65536字节
    console.log(data);
    ws.write(data);
});
// 注意读取完毕了，会自动关闭流