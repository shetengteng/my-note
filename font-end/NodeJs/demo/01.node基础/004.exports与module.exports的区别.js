/**
 * Created by Administrator on 2018/5/4.
 */

// 被其他模块调用，可以获取
//module.exports = {
//    name:'stt',
//    age:21,
//    sayName: function () {
//        console.log(this.name);
//    }
//}

// 如果使用exports ，该方式则不可
exports = {
    name:'stt',
    age:21,
    sayName: function () {
        console.log(this.name);
    }
}

// 原因：obj 表示module obj.a 表示module.exports 而 a 表示 exports
var obj = {};
obj.a = {};
var a = obj.a;
console.log(a == obj.a); // true

a.name = 'stt';
a = {};
console.log(obj.a.name);
console.log(a.name); // undefined