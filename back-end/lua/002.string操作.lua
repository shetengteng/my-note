print("------进行字符串的替换操作----")
a = "one string"
b = string.gsub(a,"one","another")
print(a)
print(b)

print("----lua 在字符串操作使用算术操作符时，string和number之间会类型转换---")
print("10"+1) -- 11
print("10 + 1") -- 字符串
-- print("hh"+1) -- 此处报错
print(11 .. 2) -- 112 由于有拼接字符串的操作，将number转换为了string类型

s,e=string.find( "lua users","lua");-- 查找lua在字符串中的起始位置
print(s .. ":" .. e) -- 下标从1开始[s,e]