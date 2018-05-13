/*不同于简单文件写入（一次性的写入到内存中）
流式文件写入是读取文件流的方式写入到文件中，防止内存溢出
同步，异步，简单文件写入都不适合大文件的写入
*/
var fs = require('fs');
var ws = fs.createWriteStream('hello.txt');
// 通过监听open 和 close 事件来判断流的打开和关闭
ws.once('open', function () {
   // 只会触发一次，没有必要用on 使用once 绑定第一次执行
    console.log('流打开了');
});
ws.once('close', function () {
    console.log('流关闭了');
});
// 通过ws 向文件中输出内容 分多次将数据写入到文件中
ws.write('向文件中写入数据');
ws.write('向文件中写入数据2');
ws.write('向文件中写入数据3');
//ws.close(); 不能使用close方法，否则会有数据丢失 使用end则是写完之后进行关闭
ws.end();