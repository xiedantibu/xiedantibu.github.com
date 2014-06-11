---
layout: post
title: "cocos2d-x-2.2.3-CCLayer源码学习(一)"
category : cocos2d-x
tagline: "..."
tags : [CCLayerColor,CCLayer]
---
本文主要讲的是CCLayer,通过TestCpp来学习CCLayer。

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
    	CC_NODE_DRAW_SETUP();//启用shader

    	ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position | kCCVertexAttribFlag_Color );//该方法封装了glEnableVertexAttribArray和glDisableVertexAttribArray。要启用或者禁用顶点属性数组，调用glEnableVertexAttribArray和glDisableVertexAttribArray传入参数index。如果启用，那么当glDrawArrays或者glDrawElements被调用时，顶点属性数组会被使用

    	glVertexAttribPointer(kCCVertexAttrib_Position, 2, GL_FLOAT, GL_FALSE, 0, m_pSquareVertices);////设置顶点，m_pSquareVertices是一个4元素的数组，每个元素表示一个顶点，依次是左下角、右下角、左上角、右上角
    	glVertexAttribPointer(kCCVertexAttrib_Color, 4, GL_FLOAT, GL_FALSE, 0, m_pSquareColors);//设置颜色

    	ccGLBlendFunc( m_tBlendFunc.src, m_tBlendFunc.dst );//设置像素渲染模式，这里是 glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)，即“不论叠加多少次，亮度是不变的”

    	glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);//提供绘制功能。当采用顶点数组方式绘制图形时，使用该函数。该函数根据顶点数组中的坐标数据和指定的模式，进行绘制。

    	CC_INCREMENT_GL_DRAWS(1);
	}
	
	/**
	CC_NODE_DRAW_SETUP宏定义，启用shader
	*/
	#define CC_NODE_DRAW_SETUP() \
	do { \
    	ccGLEnable(m_eGLServerState); \
    	CCAssert(getShaderProgram(), "No shader program set for this node"); \
    	{ \
        	getShaderProgram()->use(); \
        	getShaderProgram()->setUniformsForBuiltins(); \
    	} \
	} while(0)
	
	/**
	glVertexAttribPointer 指定了渲染时索引值为 index 的顶点属性数组的数据格式和位置。size指定每个属性值的组件数量且必须为1、2、3、4之一。type指定每个组件的数据格式，stride指定了一个属性到下一个属性之间的步长（这就允许属性值被存储在单一数组或者不同的数组中）。当数组中的值被访问并被转换至浮点值时，如果normalized被设置为GL_TRUE，意味着整数型的值会被映射至区间[-1,1](有符号整数)，或者区间[0,1]（无符号整数），反之，这些值会被直接转换为浮点值而不进行归一化处理。
	*/
	void glVertexAttribPointer( GLuint index, GLint size, GLenum type, GLboolean normalized, GLsizei stride,const GLvoid * pointer); 
	
	index：指定要修改的顶点属性的索引值
	
	size：指定每个顶点属性的组件数量。必须为1、2、3或者4。初始值为4。（如position是由3个（x,y,z）组成，而颜色是4个（r,g,b,a））
	
	type：指定数组中每个组件的数据类型。可用的符号常量有GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT,GL_UNSIGNED_SHORT, GL_FIXED, 和 GL_FLOAT，初始值为GL_FLOAT。
	
	normalized：指定当被访问时，固定点数据值是否应该被归一化（GL_TRUE）或者直接转换为固定点值（GL_FALSE）。
	
	stride：指定连续顶点属性之间的偏移量。如果为0，那么顶点属性会被理解为：它们是紧密排列在一起的。初始值为0。
	
	pointer：指定一个指针，指向数组中第一个顶点属性的第一个组件。初始值为0。
	
	
	/**
	提供绘制功能。当采用顶点数组方式绘制图形时，使用该函数。该函数根据顶点数组中的坐标数据和指定的模式，进行绘制。调用该函数之前需要，调用glEnableVertexAttribArray、glVertexAttribPointer等设置顶点属性和数据。
	  */ 
	  glDrawArrays (GLenum mode, GLint first, GLsizei count);
	  
	  1.mode，绘制方式，OpenGL2.0以后提供以下参数：GL_POINTS、GL_LINES、GL_LINE_LOOP、GL_LINE_STRIP、GL_TRIANGLES、GL_TRIANGLE_STRIP、GL_TRIANGLE_FAN。
	  
	  2.first，从数组缓存中的哪一位开始绘制，一般为0。
	  
	  3.count，数组中顶点的数量。
	
	
	/**
	openGl还有一个绘制功能的方法glDrawElements。glDrawElements是一个OPENGL的图元绘制函数，从数组中获得数据渲染图元.glDrawElements函数能够通过较少的函数调用绘制多个几何图元，而不是通过OPENGL函数调用来传递每一个顶点，法线，颜色信息。你可以事先准备一系列分离的顶点、法线、颜色数组，并且调用一次glDrawElements把这些数组定义成一个图元序列。当调用glDrawElements函数的时候，它将通过索引使用count个成序列的元素来创建一系列的几何图元。mode指定待创建的图元类型和数组元素如何用来创建这些图元
	*/
	void glDrawElements( GLenum mode, GLsizei count,GLenum type, const GLvoid *indices）
	
	1.mode指定绘制图元的类型，它应该是下列值之一，GL_POINTS, GL_LINE_STRIP, GL_LINE_LOOP, GL_LINES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, GL_TRIANGLES, GL_QUAD_STRIP, GL_QUADS, and GL_POLYGON.
	
	2.count为绘制图元的数量乘上一个图元的顶点数。
	
	3.type为索引值的类型，只能是下列值之一：GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT, or GL_UNSIGNED_INT
	
	4.indices：指向索引存贮位置的指针。
	
	例如：glDrawElements(GL_TRIANGLES, (GLsizei)n*6, GL_UNSIGNED_SHORT, m_pIndices);这样实现绘制，等效替代glDrawArrays(GL_TRIANGLES,0,(GLsizei)n*6)。
	
	glArrayElement和glDrawArrays的区别：glArrayElement函数用法简单直接，只要把所有的顶点、法向量等数据，按照三角形的顺序准备好，就可以直接渲染，但缺点是不支持顶点索引，所以内存占用比较大。举例来说，如果一个网格有100个顶点，一般大约会有200个三角面，如果使用glArrayElement就需要存储200×3＝600个顶点的数据，相比原有的数据多了5倍。如果是已经条带化的数据，这种冗余数据多的可能就不只5倍了。权衡之下还是决定使用glDrawElements函数。  
	
	glDrawElements函数支持顶点数据列表，更为方便的是它还支持顶点索引，所以就成为了快速渲染的首选。注意type为索引值的类型，只能是下列值之一：GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT, or GL_UNSIGNED_INT

	
	/**
	绘制界面的主要步骤
	*/
	 a、纹理创建的时候使用  setShaderProgram(CCShaderCache::sharedShaderCache()->programForKey(kCCShader_PositionTextureColor));  设置shader，在CCLayerColor中initWithColor设置

     b、draw的时候先开启颜色设置   ccGLEnableVertexAttribs( kCCVertexAttribFlag_Position | kCCVertexAttribFlag_TexCoords | kCCVertexAttribFlag_Color);
     
     c、启用shader:m_pShaderProgram->use();  m_pShaderProgram->setUniformsForBuiltins();  
      
     d、把颜色值传入：  glVertexAttribPointer(kCCVertexAttrib_Color, 4, GL_UNSIGNED_BYTE, GL_TRUE, 0, colors);
     
     e、通过glDrawElements或者glDrawArrays绘制
#####mode指定绘制图元的类型

1.	GL_POINTS：把每一个顶点作为一个点进行处理，顶点n即定义了点n，共绘制N个点 
 
2.	GL_LINES：把每一个顶点作为一个独立的线段，顶点2n－1和2n之间共定义了n条线段，总共绘制N/2条线段  

3.	GL_LINE_STRIP：绘制从第一个顶点到最后一个顶点依次相连的一组线段，第n和n+1个顶点定义了线段n，总共绘制n－1条线段

4.	GL_LINE_LOOP：绘制从第一个顶点到最后一个顶点依次相连的一组线段，然后最后一个顶点和第一个顶点相连，第n和n+1个顶点定义了线段n，总共绘制n条线段  

5.	GL_TRIANGLES：把每个顶点作为一个独立的三角形，顶点3n－2、3n－1和3n定义了第n个三角形，总共绘制N/3个三角形  

6.	GL_TRIANGLE_STRIP：绘制一组相连的三角形，对于奇数n，顶点n、n+1和n+2定义了第n个三角形；对于偶数n，顶点n+1、n和n+2定义了第n个三角形，总共绘制N-2个三角形  

7.	GL_TRIANGLE_FAN：绘制一组相连的三角形，三角形是由第一个顶点及其后给定的顶点确定，顶点1、n+1和n+2定义了第n个三角形，总共绘制N-2个三角形  

8.	GL_QUADS：绘制由四个顶点组成的一组单独的四边形。顶点4n－3、4n－2、4n－1和4n定义了第n个四边形。总共绘制N/4个四边形  

9.	GL_QUAD_STRIP：绘制一组相连的四边形。每个四边形是由一对顶点及其后给定的一对顶点共同确定的。顶点2n－1、2n、2n+2和2n+1定义了第n个四边形，总共绘制N/2-1个四边形  

10.	GL_POLYGON：绘制一个凸多边形。顶点1到n定义了这个多边形。  
可以参考下这个文档：<http://blog.sina.com.cn/s/blog_6084f58801019dja.html>

好了，下面接着看CCLayerGradient的源码吧：  
	
	CCLayerGradient继承于CCLayerColor,使用该类我们可以通过代码创建渐变效果
	
	static CCLayerGradient* create(const ccColor4B& start, const ccColor4B& end);//初始化CCLayerGradient，会回调updateColor方法
	static CCLayerGradient* create(const ccColor4B& start, const ccColor4B& end, const CCPoint& v);
	virtual bool init();
	virtual bool initWithColor(const ccColor4B& start, const ccColor4B& end);
	virtual bool initWithColor(const ccColor4B& start, const ccColor4B& end, const CCPoint& v);
	
	CC_PROPERTY_PASS_BY_REF(ccColor3B, m_startColor, StartColor)
    CC_PROPERTY_PASS_BY_REF(ccColor3B, m_endColor, EndColor)
    CC_PROPERTY(GLubyte, m_cStartOpacity, StartOpacity)
    CC_PROPERTY(GLubyte, m_cEndOpacity, EndOpacity)
    CC_PROPERTY_PASS_BY_REF(CCPoint, m_AlongVector, Vector)
    
    virtual void setCompressedInterpolation(bool bCompressedInterpolation);//是否通过插值压缩通过规范和非规范的向量来显示所在的渐变  默认:yes
    virtual bool isCompressedInterpolation();
    virtual void updateColor(); //在上诉的一切方法中都回调了该方法，下面就来欣赏下updateColor
    
   	/**
   	   updateColor方法是CCLayerGradient的重点方法
   	*/
    void CCLayerGradient::updateColor()
	{
    	CCLayerColor::updateColor();//回调了CCLayerColor中的updateColor方法

        /**
           float
			ccpLength(const CCPoint& v)//ccpLength是返回CCPoint的长度
			{
    			return v.getLength();
			}
			
			inline float getLength() const {
        		return sqrtf(x*x + y*y);
    		};
        */
    	float h = ccpLength(m_AlongVector);//m_AlongVector就是通过initWithColor赋值的CCPoint。
    	if (h == 0)
        	return;

    	float c = sqrtf(2.0f);
    	CCPoint u = ccp(m_AlongVector.x / h, m_AlongVector.y / h);//就是此时就相当于ccp(cosx,sinx)
    	// Compressed Interpolation mode
    	if (m_bCompressedInterpolation)
    	{
        	float h2 = 1 / ( fabsf(u.x) + fabsf(u.y) );//由于cosx+sinx的范围是1<=cosx+sinx<=sqrtf(2.0f),所以h2的范围就是1/2<=h2<=sqrtf(2.0f)/2,(h2 * (float)c)的范围也就是sqrtf(2.0f)/2<=(h2 * (float)c)<=1
        	u = ccpMult(u, h2 * (float)c);//通过上诉可明白通过h2 * (float)c的作用,u变小了。
    	}

    	float opacityf = (float)_displayedOpacity / 255.0f;

    	ccColor4F S = {
        	_displayedColor.r / 255.0f,
        	_displayedColor.g / 255.0f,
        	_displayedColor.b / 255.0f,
       	 	m_cStartOpacity * opacityf / 255.0f
    	};  
    	//ccColor4F c4 = {c.r/255.f, c.g/255.f, c.b/255.f, 1.f};把ccColor3B转化为ccColor4F

    	ccColor4F E = {
        	m_endColor.r / 255.0f,
        	m_endColor.g / 255.0f,
        	m_endColor.b / 255.0f,
        	m_cEndOpacity * opacityf / 255.0f
    	};

    	// (-1, -1)  给cclayerColor的m_pSquareColors赋值
    	m_pSquareColors[0].r = E.r + (S.r - E.r) * ((c + u.x + u.y) / (2.0f * c));
    	m_pSquareColors[0].g = E.g + (S.g - E.g) * ((c + u.x + u.y) / (2.0f * c));
    	m_pSquareColors[0].b = E.b + (S.b - E.b) * ((c + u.x + u.y) / (2.0f * c));
    	m_pSquareColors[0].a = E.a + (S.a - E.a) * ((c + u.x + u.y) / (2.0f * c));
    	// (1, -1)
    	m_pSquareColors[1].r = E.r + (S.r - E.r) * ((c - u.x + u.y) / (2.0f * c));
    	m_pSquareColors[1].g = E.g + (S.g - E.g) * ((c - u.x + u.y) / (2.0f * c));
    	m_pSquareColors[1].b = E.b + (S.b - E.b) * ((c - u.x + u.y) / (2.0f * c));
    	m_pSquareColors[1].a = E.a + (S.a - E.a) * ((c - u.x + u.y) / (2.0f * c));
    	// (-1, 1)
    	m_pSquareColors[2].r = E.r + (S.r - E.r) * ((c + u.x - u.y) / (2.0f * c));
    	m_pSquareColors[2].g = E.g + (S.g - E.g) * ((c + u.x - u.y) / (2.0f * c));
    	m_pSquareColors[2].b = E.b + (S.b - E.b) * ((c + u.x - u.y) / (2.0f * c));
    	m_pSquareColors[2].a = E.a + (S.a - E.a) * ((c + u.x - u.y) / (2.0f * c));
    	// (1, 1)
    	m_pSquareColors[3].r = E.r + (S.r - E.r) * ((c - u.x - u.y) / (2.0f * c));
    	m_pSquareColors[3].g = E.g + (S.g - E.g) * ((c - u.x - u.y) / (2.0f * c));
    	m_pSquareColors[3].b = E.b + (S.b - E.b) * ((c - u.x - u.y) / (2.0f * c));
    	m_pSquareColors[3].a = E.a + (S.a - E.a) * ((c - u.x - u.y) / (2.0f * c));
	}
    
    以上就是CCLayerGradient的主要讲解
下面接着就看看CCLayerMultiplex的源码吧，他继承自CCLayer

	unsigned int m_nEnabledLayer;//表示当前使用的CCLayer
    CCArray*     m_pLayers;//把CCLayer存储在CCArray*中。
    
    /**
    下面这些方法都跟CCLayerMultiplex的初始化有关，主要的思想是把CCLayer加入到m_pLayers中
    */
    static CCLayerMultiplex* create();
    static CCLayerMultiplex* createWithArray(CCArray* arrayOfLayers);//直接把含有CCLayer的数组添加到m_pLayers中
    static CCLayerMultiplex * create(CCLayer* layer, ... );//初始化的时候(layer1,layer2,null)
    static CCLayerMultiplex * createWithLayer(CCLayer* layer);
    void addLayer(CCLayer* layer);
    bool initWithLayers(CCLayer* layer, va_list params);
    bool initWithArray(CCArray* arrayOfLayers);
    bool initWithArray(CCArray* arrayOfLayers);
    
    void switchTo(unsigned int n);//移除原先的CCLayer,把序列号为n的CCLayer添加上去
    void switchToAndReleaseMe(unsigned int n);移除原先的CCLayer，同时把m_pLayers数组中的CCLayer也去除，再把序列号为n的CCLayer添加上去
    
    下面看具体方法详解
    CCLayerMultiplex * CCLayerMultiplex::create(CCLayer * layer, ...)
	{
    	va_list args;//va_list在前面的文章已经讲解过，具体看:http://blog.xulingmin.com/CCString难点方法解析/
    	va_start(args,layer);//args指向可变参数的第一个参数

    	CCLayerMultiplex * pMultiplexLayer = new CCLayerMultiplex();
    	if(pMultiplexLayer && pMultiplexLayer->initWithLayers(layer, args))//把args指针传给initWithLayers
    	{
        	pMultiplexLayer->autorelease();
        	va_end(args);//获取所有的参数之后，我们有必要将这个 args 指针关掉
        	return pMultiplexLayer;
    	}
    	va_end(args);
    	CC_SAFE_DELETE(pMultiplexLayer);
    	return NULL;
	}
    
    //在上一个方法中，我们知道传给initWithLayers方法CCLayer *以及va_list指针，
    bool CCLayerMultiplex::initWithLayers(CCLayer *layer, va_list params)
	{
    	if (CCLayer::init())
    	{
        	m_pLayers = CCArray::createWithCapacity(5);//先创建5个空间的CCArray
        	m_pLayers->retain();
        	m_pLayers->addObject(layer);//把create中的第一个参数列表的layer加入到CCArray中

        	CCLayer *l = va_arg(params,CCLayer*);//通过指针params指向参数列表中的下一个layer，并返回
        	while( l ) {//判断是否为空
            	m_pLayers->addObject(l);//加入到CCArray中
            	l = va_arg(params,CCLayer*);
        	}

        	m_nEnabledLayer = 0;//设置添加到parent的layer序号为0
        	this->addChild((CCNode*)m_pLayers->objectAtIndex(m_nEnabledLayer));//把序号为0的layer添加到父类中
        	return true;
    	}

    	return false;
	}
    //initWithArray的方法跟initWithLayers方法类似
	bool CCLayerMultiplex::initWithArray(CCArray* arrayOfLayers)
	{
    	if (CCLayer::init())
    	{
        	m_pLayers = CCArray::createWithCapacity(arrayOfLayers->count());//创建CCArray，空间为arrayOfLayers的个数
        	m_pLayers->addObjectsFromArray(arrayOfLayers);//直接把arrayOfLayers赋值给m_pLayers
        	m_pLayers->retain();

        	m_nEnabledLayer = 0;//设置添加到parent的layer序号为0
        	this->addChild((CCNode*)m_pLayers->objectAtIndex(m_nEnabledLayer));//把序号为0的layer添加到父类中
        	return true;
    	}
    	return false;
	}
	//切换CCLayer,同时remove数组中的CCLayer
	void CCLayerMultiplex::switchToAndReleaseMe(unsigned int n)
	{
    	CCAssert( n < m_pLayers->count(), "Invalid index in MultiplexLayer switchTo message" );

    	this->removeChild((CCNode*)m_pLayers->objectAtIndex(m_nEnabledLayer), true);//从parent中移除序号为m_nEnabledLayer的cclayer
    	m_pLayers->replaceObjectAtIndex(m_nEnabledLayer, NULL);//把m_nEnabledLayer序号的CCLayer置为NULL

    	m_nEnabledLayer = n;//把需要转换的CCLayer序号赋值给m_nEnabledLayer

    	this->addChild((CCNode*)m_pLayers->objectAtIndex(n));//把序号为n的CCLayer赋值add到parent
	}
	
以上内容就是CCLayer相关类的源码解析，主要讲了CCLayer,CCLayerRGBA,CCLayerColor,CCLayerGradient四个类，下面就解读下在TestCpp中，上诉四个类的表现,参见[cocos2d-x-2.2.3-CCLayer源码学习(二)](/cocos2d-x-CCLayer-例子学习)。

    

 		