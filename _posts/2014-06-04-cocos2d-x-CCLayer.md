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
    	
    	
CCLayerColor继承于CCLayerRGBA,CCBlendProtocol，下面是CCLayerColor的主要方法
    	
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
 		
        virtual void draw();//将位置以及颜色绘制到屏幕上
        
CCLayerColor的相关方法的具体实现：
    
    //初始化m_pSquareVertices四个顶点以及m_pSquareColors，该方法是在init()方法中回调的	bool CCLayerColor::initWithColor(const ccColor4B& color, GLfloat w, GLfloat h)
	{
    	if (CCLayer::init())
    	{
			// default blend function
       	 	m_tBlendFunc.src = GL_SRC_ALPHA;    //BlendFunc的src赋值为GL_SRC_ALPHA
        	m_tBlendFunc.dst = GL_ONE_MINUS_SRC_ALPHA;
           //设置_displayedColor以及_realColor的RGB,由于在initWithColor这个方法中没有回调CCLayeRGB的updateDisplayedColor方法，所以通过create创建的CCLayerColor，在没有单独调用setColor()或者setOpacity之前_displayedColor和_realColor的值是一样的，即使cascadeOpacityEnabled为true也没用，因为没有调用updateDisplayedColor方法，话说这里是不是cocos2d-x忘了啊？？？？
        	_displayedColor.r = _realColor.r = color.r;
        	_displayedColor.g = _realColor.g = color.g;
        	_displayedColor.b = _realColor.b = color.b;
        	_displayedOpacity = _realOpacity = color.a;

        	for (size_t i = 0; i<sizeof(m_pSquareVertices) / sizeof( m_pSquareVertices[0]); i++ )
        	{
            	m_pSquareVertices[i].x = 0.0f;
            	m_pSquareVertices[i].y = 0.0f;
        	}

        	updateColor();//将_displayedColor赋值到m_pSquareColors
            setContentSize(CCSizeMake(w,h)); //在该方法中将宽度以及长度赋值给m_pSquareVertices
			setShaderProgram(CCShaderCache::sharedShaderCache()->programForKey(kCCShader_PositionColor));//设置CCGLProgram，该处的CCGLProgram是通过CCShaderCache::sharedShaderCache()缓存获取的。通过CCGLProgram类来处理着色器相关操作，对当前绘图程序进行了封装
    	}
    	return true;
	}
	
	下面接着就看下updateColor()方法，将_displayedColor赋值到m_pSquareColors方法中，在setContentSize方法也是类似的将长.宽赋值到m_pSquareVertices
	void CCLayerColor::updateColor()
	{
    	for( unsigned int i=0; i < 4; i++ )
    	{
        	m_pSquareColors[i].r = _displayedColor.r / 255.0f;
        	m_pSquareColors[i].g = _displayedColor.g / 255.0f;
        	m_pSquareColors[i].b = _displayedColor.b / 255.0f;
        	m_pSquareColors[i].a = _displayedOpacity / 255.0f;
    	}
	}
	//CCLayerColor的设置颜色的方法，在其中调用了CCLayerRGBA的设置颜色方法。关于CCLayerColor的setOpacity也是相似的情况。
	void CCLayerColor::setColor(const ccColor3B &color)
	{
    	CCLayerRGBA::setColor(color);//调用了CCLayerRGBA的设置颜色方法
    	updateColor();//赋值到m_pSquareColors
	}
	//下面是CCLayerRGBA的设置颜色方法
	void CCLayerRGBA::setColor(const ccColor3B& color)
	{
		_displayedColor = _realColor = color;
	
		if (_cascadeColorEnabled)//表明父类可不可以可以传递颜色给自己，,首先得判断自己可以不可以传递给子类，如果自己不可以传给其他人，不好意思，你baba也不传给你。_cascadeColorEnabled在cocos2d-x中有两个作用，但是在cocos2d-x源码注释中：whether or not color should be propagated to its children.(是否将颜色传递给子类)。在实际的代码当中，_cascadeColorEnabled有两种作用，第一种是：通过_cascadeColorEnabled来判断我接不接受父类的颜色。第二种是：我可不可以传递给子类颜色。但是这两种作用仅仅通过这一个_cascadeColorEnabled属性来判断觉得有点别扭，能不能用两个属性来判断啊？？？
    	{
			ccColor3B parentColor = ccWHITE;//默认父类颜色为白色
        	CCRGBAProtocol* parent = dynamic_cast<CCRGBAProtocol*>(m_pParent);
			if (parent && parent->isCascadeColorEnabled())//表明父类可以传递颜色给子类
        	{
            	parentColor = parent->getDisplayedColor();//获取父类的显示颜色
        	}

        	updateDisplayedColor(parentColor);//将父类颜色传递给到updateDisplayedColor方法,如果父类的isCascadeColorEnabled为false，则可以将默认的ccWHITE颜色传递过去
		}
	}
	
	//更新显示颜色
	void CCLayerRGBA::updateDisplayedColor(const ccColor3B& parentColor)
	{
	     //将parentColor传递给子类，改变了_displayedColor的值
		_displayedColor.r = _realColor.r * parentColor.r/255.0;
		_displayedColor.g = _realColor.g * parentColor.g/255.0;
		_displayedColor.b = _realColor.b * parentColor.b/255.0;
    
    	if (_cascadeColorEnabled)//现在的判断和CCLayerRGBA::setColor中的判断是不一样，因为下面的操作中，你将作为父类传递给子类，很明确其作用为：我可不可以传递给子类颜色
    	{
        	CCObject *obj = NULL;
        	CCARRAY_FOREACH(m_pChildren, obj)//CCARRAY_FOREACH是一个宏定义，遍历m_pChildren中的CCNode,赋值给obj。其中m_pChildren是当前CCLayerRGBA的子类
        	{
            	CCRGBAProtocol *item = dynamic_cast<CCRGBAProtocol*>(obj);
            	if (item)
            	{
                	item->updateDisplayedColor(_displayedColor);//将当前CCLayerRGBA的_displayedColor传递给其子类
            	}
        	}
    	}
	}
   
下面来看个例子关于CCLayerColor的问题demo???

	LayerTest::onEnter();
    CCLayerColor *ccLayer01=CCLayerColor::create(ccc4(125, 20, 240, 230), 150, 150);//创建一个长宽150*150，色值为(125，20，240，230)的正方形
    ccLayer01->setPosition(VisibleRect::center());
    ccLayer01->ignoreAnchorPointForPosition(false);
    this->addChild(ccLayer01);//添加到CCLayer中
    
    ccLayer01->setCascadeColorEnabled(true);//表明我可以接受父类的颜色，但是父类传不传递是一回事。同时表明我可以传递颜色给子类，子类接不接受还是另一回事，好变扭啊，但就是这意思。。。对了ccLayer01的父亲是CCLayer,如果父亲不能传递给子类，那么默认其颜色也就是白色传递给ccLayer01
    
    CCLayerColor *ccLayer02=CCLayerColor::create(ccc4(125, 80, 150, 230), 100, 100);////创建一个长宽100*100，色值为(125，80，150，230)的正方形
    ccLayer02->setPosition(CCPoint(0, 0));
    ccLayer01->addChild(ccLayer02);//将ccLayer02添加到ccLayer01上
    ccLayer02->setCascadeColorEnabled(true);//表明ccLayer02可以接受父类的颜色，同时可以传递颜色给其子类
    ccLayer02->setColor(ccc3(125, 80, 150));//当助掉这行代码的时候，setCascadeColorEnabled为true,父类也为true，父类的颜色也传不过来，究其原因在上文已经说明，没有掉updateDisplayedColor这个方法啊，导致_displayedColor不会变化。
如下图：  
<div align="center">
![image](/assets/layercolor_01.png)<br>
图-1-父类的颜色传给ccLayer02<br>
![image](/assets/layercolor_02.png)<br>
图-2-ccLayer02真实颜色-也就是注释掉ccLayer02->setColor方法或者setCascadeColorEnabled(false)
</div>

下面接着看CCLayerColor的源码：

	void CCLayerColor::draw()
	{
    	CC_NODE_DRAW_SETUP();//将矩阵设置给OpenGL是在这个宏里面做的

    	ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position | kCCVertexAttribFlag_Color );//通知OpenGL要修改顶点和颜色

    	glVertexAttribPointer(kCCVertexAttrib_Position, 2, GL_FLOAT, GL_FALSE, 0, m_pSquareVertices);////设置顶点，m_pSquareVertices是一个4元素的数组，每个元素表示一个顶点，依次是左下角、右下角、左上角、右上角
    	glVertexAttribPointer(kCCVertexAttrib_Color, 4, GL_FLOAT, GL_FALSE, 0, m_pSquareColors);//设置颜色

    	ccGLBlendFunc( m_tBlendFunc.src, m_tBlendFunc.dst );//设置像素渲染模式，这里是 glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)，即“不论叠加多少次，亮度是不变的”

    	glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);//绘制顶点

    	CC_INCREMENT_GL_DRAWS(1);
	}
	 a、纹理创建的时候使用  setShaderProgram(CCShaderCache::sharedShaderCache()->programForKey(kCCShader_PositionTextureColor));  设置shader

     b、draw的时候先开启颜色设置   ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position | kCCVertexAttribFlag_TexCoords | kCCVertexAttribFlag_Color);
     
     c、启用shader:m_pShaderProgram->use();  m_pShaderProgram->setUniformsForBuiltins();  
      
     d、把颜色值传入：  glVertexAttribPointer(kCCVertexAttrib_Color, 4, GL_UNSIGNED_BYTE, GL_TRUE, 0, colors);
 		