 /**
 * Created by Administrator on 2018/5/2.
  * 模块调用示例 相当于一个自调用函数 内部变量不是全局变量
 */

 //(function(){
    function fn(){
         console.log("本模块被001.module02模块调用");
    }
     var x = 10;
     var y = 10;
 //})();

 // 使用exports暴露变量和函数
 exports.x = x;
 exports.y = y;
 exports.fn = fn;