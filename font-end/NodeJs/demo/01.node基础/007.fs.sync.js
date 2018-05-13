var fs = require('fs');
/* 1.打开文件 这里示例是同步操作
 fs.openSync(path,flags[,mode])
        - path 要打开的文件路径
        - flags 打开文件要做的操作类型
          - r 只读的
          - w 可写的
          - mode 可选的参数，设置文件的操作权限，一般不传，在linux有效果
        - 返回值
          - 该方法返回一个文件的描述符作为结果，可以通过该描述符对文件进行各种操作
*/
var fd = fs.openSync('hello.txt','w');
console.log(fd); // 返回的是3
/*
2. 向文件中写入数据
fs.writeSync(fd,string[,position[,encoding]]);
    - fd 文件的描述
    - string 要写入的内容
    - position 写入的起始位置
    - encoding 写入的编码格式，默认是utf-8
 */
fs.writeSync(fd,'ceshi',10);
/*
3.保存，并关闭,释放资源
*/
fs.closeSync(fd);