/**
 * Created by Administrator on 2018/5/13.
 */

var str = 'hello node.js';

// 使用buffer不需要引用模块
// 将一个字符串保存到buffer中 2进制保存，16进制显示
var buf = Buffer.from(str);

console.log(buf);
console.log(buf.length);

// 不推荐使用构造器创建Buffer对象
var buf2 = Buffer.alloc(10);
console.log(buf2.length);
// 通过索引操作buffer对象的数据
buf2[0]=88;
buf2[1]=254;
buf2[3]=0xaa; // 16进制
buf2[4]=556;// 实际上是0x44 将556转换为2进制，然后从尾部取8位转换为16进制显示，对该数值进行了截取操作
buf2[10]=1;// buffer的大小一旦确定，则不能改变大小，如果超过该大小赋值，则无效，也不报错
// buffer是对内存的直接操作

// 输出的是10进制进行使用
console.log(buf2[2]);
// 转换为16进制字符串进行显示
console.log(buf2[2].toString(16));

// 创建10个空间的buffer区域 但是有默认值，该默认值是原来空间储存的，没有删除
// 与alloc的区别在于，alloc分配空间后清除默认值而allocUnsafe不做处理
// 但是allocUnsave性能好
var buf3 = Buffer.allocUnsafe(10);
console.log(buf3);


