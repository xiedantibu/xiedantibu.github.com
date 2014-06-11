---
layout: post
title: "图示CCScrollView的相关概念"
category : cocos2d-x
tagline: "转载"
tags : [cocos2d-x-2.2.3,CCScrollView]
---
转载自：[http://blog.csdn.net/while0/article/details/11527899](http://blog.csdn.net/while0/article/details/11527899) 		
<div align="center">
![image](/assets/20130910154934484.jpeg)
</div> 

1.	设置ScrollView的视口大小的函数是：setViewSize，视口的左下角始终为ScrollView本地坐标(0, 0)位置，这个是无论视图怎么滚动都是不变的，图中红色虚线范围为视口。  
2.	设置ScrollView内容的宽度和长度的函数：getContainer()->setContentSize  
3.	设置内容的偏移的函数：setContentOffset， 通过触摸拖动也可以改变偏移。
4.	最大偏移位置：maxContainerOffset，看源码可知始终返回 ccp(0.0f, 0.0f)，图中第三列。最小偏移位置 : minContainerOffset，具体怎么算得去看源码，就是视口尺寸减去内容尺寸，图中第1列。    