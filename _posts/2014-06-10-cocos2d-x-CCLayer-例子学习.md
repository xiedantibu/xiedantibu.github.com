---
layout: post
title: "cocos2d-x-2.2.3-CCLayer源码学习(二)"
category : cocos2d-x-2.2.3,CCLayer,TestCPP
tagline: "..."
tags : [CCLayerColor,CCLayer]
---
本文主要讲解的是关于CCLayer在TestCPP中的例子，关于CCLayer源码解析，参见[cocos2d-x-2.2.3-CCLayer源码学习(一)](/cocos2d-x-CCLayer)  

我们先来看看LayerTest上的例子。

	TESTLAYER_CREATE_FUNC(LayerTestCascadingOpacityA);
	...
	TESTLAYER_CREATE_FUNC(LayerMySelfTest);
    
    static NEWTESTFUNC createFunctions[] = {
    	CF(LayerTestCascadingOpacityA),
    	CF(LayerTestCascadingOpacityB),  
    	...  
	};
	TESTLAYER_CREATE_FUNC是一个宏定义，初始化CCLayer。如下：
	
	#define TESTLAYER_CREATE_FUNC(className) \
	static CCLayer* create##className() \
	{ return new className(); }
	
	CF也是一个宏定义，单纯的就是为了创建一个字符串。如下：
	
	#define CF(className) create##className
	
	NEWTESTFUNC是一个函数指针，返回值是CCLayer*类型，定义如下：
	
	typedef CCLayer* (*NEWTESTFUNC)();

    综上可明白createFunctions[]数组是一个个存放函数指针的数组，所以才有：CCLayer* pLayer = (createFunctions[sceneIdx])();相应的创建CCLayer*
	
	#define MAX_LAYER (sizeof(createFunctions) / sizeof(createFunctions[0]))//获取createFunctions[]的个数
	
下面来看个静态方法，他在下面的很多例子中是公用方法
	
	static void setEnableRecursiveCascading(CCNode* node, bool enable)
	{
    	CCRGBAProtocol* rgba = dynamic_cast<CCRGBAProtocol*>(node);//dynamic_cast的相关内容查看：http://blog.xulingmin.com/CCString难点方法解析
    	if (rgba)
    	{
        	rgba->setCascadeColorEnabled(enable); //设置是否能把自己的颜色属性传递给子类，同时设置自己可否接受其本身父类的颜色
        	rgba->setCascadeOpacityEnabled(enable);//设置是否能把自己的透明度属性传递给子类，同时设置自己可否接受其本身父类的透明度

    	}
    
    	CCObject* obj;
    	CCArray* children = node->getChildren();//获取node上的子类
    	CCARRAY_FOREACH(children, obj)//遍历children这个数组，关于CCARRAY_FOREACH在以后的文章中解析
    	{
        	CCNode* child = (CCNode*)obj;
        	setEnableRecursiveCascading(child, enable);//递归
    	}
	}
下面就来看看LayerTestCascadingOpacityA

	CCLayerRGBA* layer1 = CCLayerRGBA::create();
    CCSprite *sister1 = CCSprite::create("Images/grossinis_sister1.png");
    CCSprite *sister2 = CCSprite::create("Images/grossinis_sister2.png");
    CCLabelBMFont *label = CCLabelBMFont::create("Test", "fonts/bitmapFontTest.fnt");
    
    layer1->addChild(sister1);
    layer1->addChild(sister2);
    layer1->addChild(label);
    this->addChild( layer1, 0, kTagLayer);
    setEnableRecursiveCascading(this, true);

    layer1->runAction( CCRepeatForever::create(CCSequence::create(CCFadeTo::create(4, 0),CCFadeTo::create(4, 255),CCDelayTime::create(1),NULL)));
    
    sister1->runAction(CCRepeatForever::create(CCSequence::create(CCFadeTo::create(2, 0),CCFadeTo::create(2, 255),CCFadeTo::create(2, 0),CCFadeTo::create(2, 255),CCDelayTime::create(1),NULL)));
如图：  
<div align="center">
	![image](/assets/cascading_opacity.gif)
</div>