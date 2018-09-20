-- for 循环
 for i = 1,10,2 do -- 1 start 10 end step 2 step默认是1
    print(i)
end

for i = 10,1,-1 do
    print(i)
end

print("--------")

days = {"Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"}
revDays = {}
for i,v in ipairs(days) do -- 获取key和value
    print(i)
    print(v)
    revDays[v] = i -- 构建反向表
end

for k in pairs(revDays) do -- 获取所有的key
    print(k)
    print(revDays[k])
end