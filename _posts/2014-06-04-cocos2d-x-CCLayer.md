---
layout: post
title: "cocos2d-x-2.2.3-LayerTest学习"
category : cocos2d-x,CCLayer
tagline: "..."
tags : [cocos2d-x-2.2.3,CCLayer]
---
本文主要讲的是CCLayer,通过例子LayerTest来学习CCLayer。

`typedef CCLayer* (*NEWTESTFUNC)();`先来学习这一段代码。还是先看下[度娘](http://baike.baidu.com/view/1283800.htm?fr=aladdin)是怎么解释`typedef`的。typedef是用来为复杂的声明定义简单的别名，与宏定义有些差异。而上面一堆代码则引入了NEWTESTFUNC类型作为函数指针的同义词，该函数没有参数，返回值是CCLayer*类型。
	
	#define TESTLAYER_CREATE_FUNC(className) \
	static CCLayer* create##className() \
	{ return new className(); }

	#define CF(className) create##className
上面一段代码是两个宏定义，关于宏定义-[#define](http://baike.baidu.com/view/1441209.htm)，还是度娘好啊！！！  
在#define中，标准只定义了#和##两种操作。#用来把参数转换成字符串，##则用来连接前后两个参数，把它们变成一个字符串。`#define paster( n ) printf( "token " #n" = %d\n ", token##n )`  

下面就熟悉下CCLayer的源代码吧...

	//通过typedef声明了该枚举类型的别名ccTouchesMode，通过setTouchMode(ccTouchesMode mode)设置是单点触摸还是多点触摸
    typedef enum {
	kCCTouchesAllAtOnce,//单点
	kCCTouchesOneByOne,//多点
	} ccTouchesMode;
	
	//以下方法都是基本方法
	CCLayer();
    virtual ~CCLayer();
    virtual bool init();
    static CCLayer *create(void);
    virtual void onEnter();
    virtual void onExit();
    virtual void onEnterTransitionDidFinish();
    
    // 单点触摸
    virtual bool ccTouchBegan(CCTouch *pTouch, CCEvent *pEvent);
    virtual void ccTouchMoved(CCTouch *pTouch, CCEvent *pEvent);
    virtual void ccTouchEnded(CCTouch *pTouch, CCEvent *pEvent);
    virtual void ccTouchCancelled(CCTouch *pTouch, CCEvent *pEvent);

    // 多点触摸
    virtual void ccTouchesBegan(CCSet *pTouches, CCEvent *pEvent);
    virtual void ccTouchesMoved(CCSet *pTouches, CCEvent *pEvent);
    virtual void ccTouchesEnded(CCSet *pTouches, CCEvent *pEvent);
    virtual void ccTouchesCancelled(CCSet *pTouches, CCEvent *pEvent);
    
    virtual void registerWithTouchDispatcher(void);//注册触摸事件，在该方法中注册单点CCTouchDispatcher::sharedDispatcher()->addTargetedDelegate(this,INT_MIN+1,true)；注册多点 CCTouchDispatcher::sharedDispatcher()->addStandardDelegate(this,0);
    
    //设置是否可以触摸
    virtual bool isTouchEnabled();
    virtual void setTouchEnabled(bool value);
    //设置触摸方式
    virtual void setTouchMode(ccTouchesMode mode);
    virtual int getTouchMode();
    //设置触摸优先级
    virtual void setTouchPriority(int priority);
    virtual int getTouchPriority();
    //设置是否启用加速
    virtual bool isAccelerometerEnabled();
    virtual void setAccelerometerEnabled(bool value);
    virtual void setAccelerometerInterval(double interval);
    //是否接受键盘事件
    virtual bool isKeypadEnabled();
    virtual void setKeypadEnabled(bool value);
    //返回键以及menu键的回调事件
    virtual void keyBackClicked(void);
    virtual void keyMenuClicked(void);
下面是CCLayer的类图：	
<div align="center">	
![image](/assets/classcocos2d_1_1_c_c_layer.png)
</div>

从上图可以晓得，CCLayer的子类有CCLayermultlplex,CCLayerRGBA,CCLayerColor,CCLayerGradient等一系列的子类。下面我们就看下其子类的相关代码。
	
	    //CCLayerRGBA继承于CCLayer以及CCRGBAProtocol，下面是CCLayerRGBA的基本方法
	    CCLayerRGBA();
	    virtual ~CCLayerRGBA();
		virtual bool init();
		
		//下面的方法都是继承于CCRGBAProtocol
		virtual GLubyte getOpacity();    //获取透明度
    	virtual GLubyte getDisplayedOpacity();////获取显示的透明度，显示的透明度指的是如果cascadeOpacityEnabled为true的时候，则还需要乘上父类的透明度
    	virtual void setOpacity(GLubyte opacity);
    	virtual void updateDisplayedOpacity(GLubyte parentOpacity);
    	virtual bool isCascadeOpacityEnabled();//是否将父类透明度传递给子类
    	virtual void setCascadeOpacityEnabled(bool cascadeOpacityEnabled);
    	
    	virtual const ccColor3B& getColor();//获取色值
    	virtual const ccColor3B& getDisplayedColor();//获取显示的色值，显示的色值指的是如果cascadeOpacityEnabled为true的时候，则还需要乘上父类的色值

    	virtual void setColor(const ccColor3B& color);
    	virtual void updateDisplayedColor(const ccColor3B& parentColor);
    	virtual bool isCascadeColorEnabled();//是否将父类色值传递给子类
    	virtual void setCascadeColorEnabled(bool cascadeColorEnabled);
    	
    	
    	//CCLayerColor继承于CCLayerRGBA,CCBlendProtocol。
    	
    	ccVertex2F m_pSquareVertices[4];//该数组是放置四个顶点的
    	ccColor4F  m_pSquareColors[4];//该数组是放置色值的rgba
    	
    	//以下方法都是相关初始化相关方法
    	CCLayerColor();
    	virtual ~CCLayerColor();
    	static CCLayerColor* create();
    	static CCLayerColor * create(const ccColor4B& color, GLfloat width, GLfloat height);
	    static CCLayerColor * create(const ccColor4B& color);
    	virtual bool init();
	    virtual bool initWithColor(const ccColor4B& color, GLfloat width, GLfloat height);
	    virtual bool initWithColor(const ccColor4B& color);
	    
	    //改变宽高
	    void changeWidth(GLfloat w);
	    void changeHeight(GLfloat h);
	    void changeWidthAndHeight(GLfloat w ,GLfloat h);
        virtual void setContentSize(const CCSize & var);
        
        CC_PROPERTY(ccBlendFunc, m_tBlendFunc, BlendFunc) //默认值是m_tBlendFunc.src = CC_BLEND_SRC;m_tBlendFunc.dst = CC_BLEND_DST;  
 		#define CC_BLEND_SRC GL_ONE
 		#define CC_BLEND_DST GL_ONE_MINUS_SRC_ALPHA
 		
        virtual void draw();
    	
 		