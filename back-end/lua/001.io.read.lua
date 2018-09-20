function fact(n)
    if(n == 0 ) then
        return 1
    else
        return n*fact(n-1)
    end
end

print("enter a number")

a = io.read("*number") -- 输入一个数字
print(a)
print(fact(a))