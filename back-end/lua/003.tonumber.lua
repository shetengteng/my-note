do
    print(10 == "10") -- string 和 number在逻辑判断中不会相互转换
    print("---使用tonumber将string类型转换为number类型---")
    -- 如果转换失败则返回nil
    line = io.read() -- 读取一行
    n = tonumber(line)
    if  n == nil then
        error(line .. "不是一个数字")
    else
        print(n*2)
    end

    -- 可以使用tostring转换为字符串类型
    print(tostring(10) == "10")
    print(10 .. "" == "10")

end