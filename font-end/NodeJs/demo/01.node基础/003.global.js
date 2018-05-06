// 在node中有一个全局对象，global，作用与window类似，
// 在全局创建的变量都会作为global的属性进行保存
// 在全局创建的函数都会作为global的方法进行保存

var a = 1;
console.log(global.a); //  如果a存在，说明a是全局属性 此处是undefined

// 声明一个全局变量
b = 2;
console.log(global.b); // 次数是2

// arguments 伪对象 只存在于函数中，不存在全局
// arguments.callee 这个属性保存的是当前执行的函数对象
console.log(arguments);
console.log(arguments.callee + ''); // 把当前执行的函数打印出来

// 该示例为了证明当前的js是一个函数，定义的变量的作用域为函数内作用域
// 在node执行的时候，会在头部添加 function (exports, require, module, __filename, __dirname) {

console.log(exports);
console.log(module.exports);
console.log(module.exports == exports); // 2者相同

console.log(__filename); // 当前模块的完整路径