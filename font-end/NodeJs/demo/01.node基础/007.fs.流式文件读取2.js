var fs = require('fs');
// 创建一个可读流
var rs = fs.createReadStream('hello.txt');
// 创建一个可写流
var ws = fs.createWriteStream('a.txt');

rs.once('open', function () {
    console.log('可读流打开了');
});
rs.once('close', function () {
    console.log('可读流关闭了');
});
ws.once('close', function () {
    console.log('可写流关闭了');
});
// pipe可以将可读流中的内容直接输入到可写流中
rs.pipe(ws);