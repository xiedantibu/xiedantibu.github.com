//
//  main.cpp
//  Prog01
//
//  Created by agile on 14-6-18.
//  Copyright (c) 2014年 agile. All rights reserved.
//

#include <iostream>

int main(int argc, const char * argv[])
{

    /**
    auto st=new std::string("test");
    printf("===%s=\n",st->c_str());
    */
    
    /**
     //while循环学习
    int sum=0,i=0;
    while (i<=10) {
        sum+=i;
        i++;
    }
    printf("===%i===\n",sum);
    */
    
    /**
     //结束是输入ctrl+d
    int sum=0,i=0;
    
    while(std::cin>>i)
    {
        sum+=i;
    }
    printf("===%i===\n",sum);
     */
    
    /**
    int curVal=0,val=0;
    
    if(std::cin>>curVal)
    {
        int cnt=1;//保存我们正在处理的当前值
        
        while (std::cin>>val) {//读取剩余的值
            if(val == curVal)
            {
                ++cnt;
            }
            else
            {
                printf("%i occurs %i times\n",curVal,cnt);
                curVal=val;
                cnt=1;
            }
        }
        printf("%i occurs %i times\n",curVal,cnt);
    }
    */
    
    return 0;
}

