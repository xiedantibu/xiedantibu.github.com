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

	CCLayerRGBA* layer1 = CCLayerRGBA::create();//创建CCLayerRGBA，大小就是默认的CCLayer的大小
    CCSprite *sister1 = CCSprite::create("Images/grossinis_sister1.png");
    CCSprite *sister2 = CCSprite::create("Images/grossinis_sister2.png");
    CCLabelBMFont *label = CCLabelBMFont::create("Test", "fonts/bitmapFontTest.fnt");
    
    layer1->addChild(sister1);//把sister1加入到layer1上
    layer1->addChild(sister2);//把sister2加入到layer1上
    layer1->addChild(label);//把label加入到layer1上
    this->addChild( layer1, 0, kTagLayer);//把layer1添加到CCLayer上
    setEnableRecursiveCascading(this, true);//设置始其能把色值以及透明度传递给子类

    layer1->runAction( CCRepeatForever::create(CCSequence::create(CCFadeTo::create(4, 0),CCFadeTo::create(4, 255),CCDelayTime::create(1),NULL)));//layer1在一直改变其透明度，每4秒将设置从255改变到0，又每4秒从0改变到255，并停顿一秒
    
    sister1->runAction(CCRepeatForever::create(CCSequence::create(CCFadeTo::create(2, 0),CCFadeTo::create(2, 255),CCFadeTo::create(2, 0),CCFadeTo::create(2, 255),CCDelayTime::create(1),NULL))); //layer1在一直改变其透明度，每2秒将设置从255改变到0，又每2秒从0改变到255，并停顿一秒
如LayerTestCascadingOpacityA效果图：
<div align="center">
![image](/assets/cascading_opacity.gif)<br>
</div>
LayerTestCascadingOpacityA这个例子想说明由于父类layer1的透明度一直在改变，而由于父类能把透明度传递给子类，所以子类也在改变着透明度，由上图能很直观的看出来，label以及sister1都没有runAction，但一直在一闪一闪的。如果在最后添加这么一句话layer1->setCascadeOpacityEnabled(false);，则label以及sister1是不会闪的，因为layer1并不会把透明度传递给子类

下面来看下LayerTestCascadingColorA，他跟LayerTestCascadingOpacityA效果其实是一样的。

    CCLayerRGBA* layer1 = CCLayerRGBA::create();//创建CCLayerRGBA，大小就是默认的CCLayer的大小
	...
	跟上例的代码一样
	...
	layer1->runAction(CCRepeatForever::create(CCSequence::create(CCTintTo::create(6, 255, 0, 255),CCTintTo::create(6, 255, 255, 255),CCDelayTime::create(1),NULL)));//layer1在一直改变其颜色，每6秒将绿色色值从255改变到0，又每6秒将绿色色值从0改变到255，并停顿一秒
	
	sister1->runAction(CCRepeatForever::create(CCSequence::create(CCTintTo::create(2, 255, 0, 255),CCTintTo::create(2, 255, 255, 255),CCDelayTime::create(1),NULL)));//sister1在一直改变其颜色，每2秒将绿色色值从255改变到0，又每2秒将绿色色值从0改变到255，并停顿一秒
如LayerTestCascadingColorA效果图：
<div align="center">
![image](/assets/cascading_color.gif)<br>
</div>	
LayerTestCascadingColorA这个例子想说明由于父layer1的色值一直在改变，而由于父类能把色值传递给子类，所以子类也跟着改变色值，由上图能直观的看出来，label以及sister1都没有runAction，但一直在改变自身颜色。如果在最后添加这么一句话layer1->setCascadeColorEnabled(false);，则label以及sister1是改变颜色的，因为layer1并不会把色值传递给子类。对了关于上面的两个例子我们其实并没有看到layer1的变化，虽然其一直在改变自身的色值或透明度，但一直是黑色的，为啥啊？因为他是CCLayerRGBA啊，看源码我们发现他其实跟CCLayer没啥区别，他就比CCLayer多了个CCRGBAProtocol协议，这个协议改变CCNode的色值以及透明度，但是其实他没有draw()方法，只有在其子类CCLayerColor才有draw()方法，在该类中才能，真正的显示颜色以及透明度的变化