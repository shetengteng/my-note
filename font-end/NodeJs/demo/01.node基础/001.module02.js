/**
 * Created by Administrator on 2018/5/2.
 */

// 使用一个变量进行接收,使用的路径就是模块标识
var m =  require("./001.module01.js");
var fs = require('fs'); // 调用node的核心模块



console.log(m.x);
console.log(m.y);
m.fn();