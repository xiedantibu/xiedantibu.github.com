---
layout: post
title: "cocos2d-x-2.2.3-CCLayer源码学习(二)"
category : cocos2d-x
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
LayerTestCascadingColorA这个例子想说明由于父layer1的色值一直在改变，而由于父类能把色值传递给子类，所以子类也跟着改变色值，由上图能直观的看出来，label以及sister1都没有runAction，但一直在改变自身颜色。如果在最后添加这么一句话layer1->setCascadeColorEnabled(false);，则label以及sister1是改变颜色的，因为layer1并不会把色值传递给子类。对了关于上面的两个例子我们其实并没有看到layer1的变化，虽然其一直在改变自身的色值或透明度，但一直是黑色的，为啥啊？因为他是CCLayerRGBA啊，看源码我们发现他其实跟CCLayer没啥区别，他就比CCLayer多了个CCRGBAProtocol协议，这个协议改变CCNode的色值以及透明度，但是其实他没有draw()方法，只有在其子类CCLayerColor才有draw()方法，在该类中才能，真正的显示颜色以及透明度的变化。  

下面来看下LayerTest1这个例子：

	//在该例子中，重点方法是updateSize，对了说下layer的position的位置为ccp(s.width/2, s.height/2)
	void LayerTest1::updateSize(CCPoint &touchLocation)
	{    
    	CCSize s = CCDirector::sharedDirector()->getWinSize();
        
    	CCSize newSize = CCSizeMake( fabs(touchLocation.x - s.width/2)*2, fabs(touchLocation.y - s.height/2)*2);//CCSizeMake是创建一个CCSize的宏定义，看定义如下：
    	#define CCSizeMake(width, height) CCSize((float)(width), (float)(height))
    	上诉创建出的CCSize就是以(s.width/2, s.height/2)为中心，宽为abs(touchLocation.x - s.width/2)*2，高为fabs(touchLocation.y - s.height/2)*2的长方形。
    
    	CCLayerColor* l = (CCLayerColor*) getChildByTag(kTagLayer);

    	l->setContentSize( newSize );//设置CCLayerColor的大小
	}
	在ccTouchesMoved方法中，获取触摸点，回调updateSize
	void LayerTest1::ccTouchesMoved(CCSet *pTouches, CCEvent *pEvent)
	{
    	CCTouch *touch = (CCTouch*)pTouches->anyObject();//在CCSet中获取CCTouch*，也可以通过pTouches->begin()获取，当然通过begin()返回的是CCSetIterator
    	CCPoint touchLocation = touch->getLocation();//将CCTouch*转换成CCPoint

    	updateSize(touchLocation);//坐标传入updateSize方法，改变位置
	}
LayerTest1效果图如下：
<div align="center">
![image](/assets/update_size.gif)<br>
</div>
LayerTest1这个例子主要学习的是移动的时候能改变CCLayerColor的大小,通过setContentSize这个方法

下面来看下LayerTestBlend这个例子：

	schedule( schedule_selector(LayerTestBlend::newBlend), 1.0f);//每隔一秒运行newBlend方法
	
	void LayerTestBlend::newBlend(float dt)
	{
     	CCLayerColor *layer = (CCLayerColor*)getChildByTag(kTagLayer);

    	GLenum src;
    	GLenum dst;

    	if( layer->getBlendFunc().dst == GL_ZERO )
    	{
        	src = GL_SRC_ALPHA;
        	dst = GL_ONE_MINUS_SRC_ALPHA;
    	}
    	else
    	{
        	src = GL_ONE_MINUS_DST_COLOR;
        	dst = GL_ZERO;
    	}

    	ccBlendFunc bf = {src, dst};
    	layer->setBlendFunc( bf );//把渲染的图片叠加到目标图片，关于setBlendFunc具体知识点查看：http://blog.xulingmin.com/NodeTest/
	}
LayerTestBlend效果图如下：
<div align="center">
![image](/assets/ccBlendFunc.gif)<br>
</div>
LayerTestBlend该例子主要还是学习setBlendFunc这个方法对于图片渲染的影响作用。

下面来看下LayerGradient这个例子：  
	
	CCLayerGradient* layer1 = CCLayerGradient::create(ccc4(255,0,0,255), ccc4(0,255,0,120), ccp(0.9f, 0.9f));//初始化CCLayerGradient，start的颜色是(255,0,0,255),end颜色是(0,255,0,120),point是(0.9f,0.9f)。由上文我们很清楚上诉所代表意义。
	setTouchEnabled(true);//有触摸作用，主要的效果看下面的ccTouchesMoved方法
	...
    CCMenuItemToggle *item = CCMenuItemToggle::createWithTarget(this, menu_selector(LayerGradient::toggleItem), item1, item2, NULL);//点击运行toggleItem方法
    ...
	
	//在toggleItem主要是改变isCompressedInterpolation的状态，CompressedInterpolation有什么用处呢？其实就是改变两种色值的间距，具体看上一篇文章
	void LayerGradient::toggleItem(CCObject *sender)
	{
    	CCLayerGradient *gradient = (CCLayerGradient*)getChildByTag(kTagLayer);
    	gradient->setCompressedInterpolation(! gradient->isCompressedInterpolation());
	}
	
	void LayerGradient::ccTouchesMoved(CCSet * touches, CCEvent *event)
	{
    	CCSize s = CCDirector::sharedDirector()->getWinSize();

    	CCSetIterator it = touches->begin();//获取touches的迭代器。在上面我们应该注意到touches->anyObjec(),他返回的是(* it)
    	CCTouch* touch = (CCTouch*)(*it);//注意(*it)，因为迭代器是个指针
    	CCPoint start = touch->getLocation();    

    	CCPoint diff = ccpSub( ccp(s.width/2,s.height/2), start);//两个point相减
    	diff = ccpNormalize(diff);//ccpNormalize返回diff的标准化向量，就是长度为1

    	CCLayerGradient *gradient = (CCLayerGradient*) getChildByTag(1);
    	gradient->setVector(diff);//把diff赋值给m_AlongVector，而m_AlongVector是颜色向量。颜色向量的改变，最终会改变m_pSquareColors
	}
	
	下面先来看看anyObject()方法，来比较下touches->begin()区别：
	CCObject* CCSet::anyObject()
	{
    	if (!m_pSet || m_pSet->empty())//先来判断set是否为空
    	{
        	return 0;
    	}
    
    	CCSetIterator it;//set的迭代器

    	for( it = m_pSet->begin(); it != m_pSet->end(); ++it)//通过it迭代器循环迭代m_pset,只要(*it)不为空，就返回。我们友下面就可以很清楚的看到：m_pSet->begin()是CCSetIterator类型，而*it则是CCObject*
    	{
        	if (*it)
        	{
            	return (*it);
        	}
    	}

    	return 0;
	}	
	
	下面接着看ccpSub方法，很简单：
	static inline CCPoint
	ccpSub(const CCPoint& v1, const CCPoint& v2)
	{
    	return v1 - v2;
	}
	下面接着看ccpNormalize方法
	CCPoint
	ccpNormalize(const CCPoint& v)
	{
    	return v.normalize();//真正的标准化向量是通过normalize()实现的
	}
	接着看normalize()方法
	inline CCPoint normalize() const {
        float length = getLength();//获取其长度sqrtf(x*x + y*y);
        if(length == 0.) return CCPoint(1.f, 0);
        return *this / getLength();//返回其标准化向量(cosx,sinx)
    };
LayerGradient效果图如下：
<div align="center">
![image](/assets/LayerGradient.gif)<br>
</div>
关于LayerGradient的例子，其实主要是两个方法，通过触摸改变m_AlongVector，以及是否改变两种颜色的间隔距离setCompressedInterpolation()，当然上面主要讲的还有一些其他知识点，还是需要稍加学习。

下面来看看LayerIgnoreAnchorPointScale例子

	CCSize s = CCDirector::sharedDirector()->getWinSize();

    CCLayerColor *l = CCLayerColor::create(ccc4(255, 0, 0, 255), 200, 200);//创建背景为红色，大小为200*200

    l->setAnchorPoint(ccp(0.5f, 1.0f));//设置描点为(0.5f,1.0f)。注意此时虽然描点为(0.5f,1.0f)，但是由于ignoreAnchorPointForPosition为false,则还是以基准点(0,0)为描点，只有ignoreAnchorPointForPosition为true的时候，才以(0.5f,1.0f)为描点，但是以上说的仅仅针对于设置位置，关于Scale放大缩小还是以原来的的描点(0.5f,1.0f)为基准，不管ignoreAnchorPointForPosition是否为true
    l->setPosition(ccp( s.width/2, s.height/2));

    CCScaleBy *scale = CCScaleBy::create(2, 2);
    CCScaleBy* back = (CCScaleBy*)scale->reverse();
    CCSequence *seq = CCSequence::create(scale, back, NULL);

    l->runAction(CCRepeatForever::create(seq));//CCLayerColor每隔两秒一直在放大缩小

    this->addChild(l, 0, kLayerIgnoreAnchorPoint);

    CCSprite *child = CCSprite::create("Images/grossini.png");
    l->addChild(child);
    CCSize lsize = l->getContentSize();
    child->setPosition(ccp(lsize.width/2, lsize.height/2));//把child加入到CCLayerColor，且放在CCLayerColor的中间位置

    CCMenuItemFont *item = CCMenuItemFont::create("Toogle ignore anchor point", this, menu_selector(LayerIgnoreAnchorPointScale::onToggle));//在onToggle方法中改变ignoreAnchorPointForPosition的值
	...
LayerIgnoreAnchorPointScale效果图如下：
<div align="center">
![image](/assets/LayerIgnoreAnchorPointScale.gif)<br>
</div>
关于LayerIgnoreAnchorPointScale的例子，主要是学习描点对于位置以及放大缩小的作用，以及ignoreAnchorPointForPosition对于位置以及放大缩小的影响。我们看到上图，不管ignoreAnchorPointForPosition怎么变，以及位置怎么改，都是以(0.5,1)放大缩小

关于CCLayer的例子还有很多，在下一篇继续讲解-[cocos2d-x-2.2.3-CCLayer源码学习(三)](/cocos2d-x-CCLayer-例子学习二)
