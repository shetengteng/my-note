print('helloworld');

-- lua 是大小写敏感的

-- 单行注释
--[[多行
注释]]

-- 默认全局变量赋值
a,b,c = 1,3,4;

-- 局部变量赋值
local e = 3;
print(e);

-- 拼接字符串 使用 .. 进行连接
print('this a '.. 'string');

-- ^ 乘方运算
print(2^3)

-- 比较运算符 > < >= <= == ~= 不等于
print(2>3)
print(2~=3)
a={1,2}
b = a
print(a == b) -- true

-- 逻辑运算 and or not 注意：在lua中 只有false和 nil是false ，其他都是true 包括0
-- and 和 or 也与传统意义上的与和或不同
-- a and b 如果a为false 返回a，否则返回b
-- a or b 如果a为true 则返回a，否则返回b
-- x ? a : b 等价于 (x and a) or b
print(true and 2)
print(false and 2)
print(4 and 3) --3
print(nil and 4) --nil

-- 关键字
-- and break do else elseif
-- end false for function if
-- in local nil not or
-- repeat return then true until　while

-- 条件判断
local tm = 1
if tm == 2 then 
    print("tm != 2")
elseif tm == 3 then
    print("tm != 3")
else
    print("tm != 2 or 3")
end

-- 类型 可以使用type(x)进行判断数值的类型
    -- nil 空值，没有使用过的变量都是nil 即是值也是变量
    -- boolean false和nil才被计算为false，而所有任何其它类型的值，都是true。比如0，空串等等，都是true
    -- string 
    -- number 相当于double类型 书写方式：4 0.4 4.57e-3 0.3e12 5e+20
    -- table
    -- function
    -- userdata 专门用来和Lua的宿主打交道的。宿主通常是用C和C++来编写的，在这种情况下，Userdata可以是宿主的任意数据类型，常用的有Struct和指针
    -- thread 非真正意义上的线程 将函数分成几个部分运行
    print(type(true))
    print(type(3))
--[[
转义字符
\a bell
\b back space
\f form feed
\n newline
\r carriage return
\t horizontal tab
\v vertical tab
\\ backslash
\" double quote
\' single quote
\[ left square bracket
\] right square bracket
]]

-- 一般使用[[]]将需要转义的框起来
page = [[<html>a text between double brackets</html>]]
print(page)

-- table 类型 类似数组，可以作为数组使用，也类似map 属于map和数组的混合 每个元素使用,隔开 索引从1开始
local t = {
    10,
    type="person",
    person={age=11,name="stt"},
    20, -- 等价于 [2]=20
    [20]=33
}

print(t[1])
print(t.type)
print(t.person.name)
print(t[20])
print(t[2])

x = {}
x.a = 10
x.b = 11
-- 等价于
x = {a=10,b=11}

-- function 

function add(a,b)
    return a+b
end

print("---------------------")
print(add(1,3))

-- 可以传入可变参数 貌似有问题 5.2版本支持
function sum(a,...)
    -- 接收的参数都在arg中 
    -- for i=1,#arg do -- #table表示获取该table的长度大小
    --     print(arg[i])
    -- end 
    for i,v in ipairs(arg) do
        print(v)
    end
    print(arg)
end

print("---------可以返回多个值------------")
function returnM()
    return 1,2,3,4
end
print(returnM())

-- 面向对象思路实现 不过没有继承和多态
obj = {
    age = 21,
    add = function(self,n)
        self.age = self.age + n
    end,
    name = 'ss'
}

obj.add(obj,10)
print(obj.age)
-- 可以使用:进行简写 处理
obj:add(10)
print(obj.age)

