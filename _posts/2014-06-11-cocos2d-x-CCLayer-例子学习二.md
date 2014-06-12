---
layout: post
title: "cocos2d-x-2.2.3-CCLayer源码学习(三)"
category : cocos2d-x
tagline: "..."
tags : [CCLayerColor,CCLayer,KeypadTest,CCKeypadDelegate]
---
本文主要讲解的是关于CCLayer在TestCPP中的例子，关于CCLayer源码解析，参见[cocos2d-x-2.2.3-CCLayer源码学习(一)](/cocos2d-x-CCLayer)  

下面我们还是先学习学习KeypadTest这个例子

	//重点方法其实就只有一句setKeypadEnabled(true);还是先看看这方法怎么实现的把，跳转到CCLayer中
	
	void CCLayer::setKeypadEnabled(bool enabled)
	{
    	if (enabled != m_bKeypadEnabled)//先判断当前CCLayer的m_bKeypadEnabled是否一样，默认m_bKeypadEnabled为false
    	{
        	m_bKeypadEnabled = enabled;

        	if (m_bRunning)
        	{
            	CCDirector* pDirector = CCDirector::sharedDirector();
            	if (enabled)
            	{
                	pDirector->getKeypadDispatcher()->addDelegate(this);//把CCKeypadDelegate加入到CCKeypadDispatcher中统一管理。由于CCLayer实现了CCKeypadDelegate接口
            	}
            	else
            	{
                	pDirector->getKeypadDispatcher()->removeDelegate(this);//把CCKeypadDelegate从CCKeypadDispatcher中移除            	}
        	}
    	}
	}

其实看到这个我们就应该想到CCTouchDelegete,是的，keypad和touch处理流程是一样的，先把delegate统一放到Handler,再把handler加入到dispach中的CCArray中，最后统一在一个方法中处理消息，再把接受到的消息分发出去。

下面我们还是看看CCKeypadDelegate这个接口:
	
	class CC_DLL CCKeypadDelegate
	{
	public:
    	
    	virtual void keyBackClicked() {}//点击返回键时候触发

    	virtual void keyMenuClicked() {};//点击menu键的时候触发
	};
	
	在KeypadTest例子中，只要用户点击返回键或者menu键，都会回调相应的方法。

下面我们接着看CCKeypadDispatcher，看看是怎么统一管理CCKeypadDelegate的

	有个枚举类ccKeypadMSGType，来区分点击事件
	typedef enum {
    // the back key clicked msg
    kTypeBackClicked = 1,
    kTypeMenuClicked,
	} ccKeypadMSGType;
	
	CCArray* m_pDelegates;//保存delegates的指针
	bool m_bLocked;//是否被锁住，默认false
    bool m_bToAdd;//是否添加,默认false
    bool m_bToRemove;//是否移除,默认false
	struct _ccCArray *m_pHandlersToAdd;//即将要加入到m_pDelegates的delegates，事先加入到m_pHandlersToAdd，当m_bLocked为true的时候
    struct _ccCArray *m_pHandlersToRemove;//即将要移除到m_pDelegates的delegates，事先加入到m_pHandlersToRemove指针中，当m_bLocked为true的时候
    
    typedef struct _ccCArray {
    unsigned int num, max;//num表示arr指向的数组所含有的成员个数，该数组的空间
    void** arr;//指向数组的指针
	} ccCArray;//ccCArray是一个结构体，后面内容会详细介绍他。
	
	下面看重点方法讲解
	void CCKeypadDispatcher::addDelegate(CCKeypadDelegate* pDelegate)//在CCLayer中直接调用方法，站在最前线的战士
	{
    	if (!pDelegate)//如果为null，返回
    	{
        	return;
    	}

    	if (! m_bLocked)//如果没有被锁住，则直接添加到m_pDelegates中，在dispatchKeypadMSG方法中有把锁判断是否锁定
    	{
        	forceAddDelegate(pDelegate);//该方法才是真正的添加CCKeypadDelegate的家伙
    	}
    	else
    	{
        	ccCArrayAppendValue(m_pHandlersToAdd, pDelegate);//把pDelegate添加到m_pHandlersToAdd中，该方法是ccCArray.h中的方法
        	m_bToAdd = true;//表明有东西添加到m_pHandlersToAdd了，标志作用
    	}
	}
	还是先来看ccCArrayAppendValue方法把。
	void ccCArrayAppendValue(ccCArray *arr, void* value)//有两个参数，m_pHandlersToAdd, pDelegate
	{
		arr->arr[arr->num] = value;//把pDelegate指针保存到数组中，通过_ccCArray结构体的void** arr来索引
		arr->num++;//数组长度+1
    	// double the capacity for the next append action
    	// if the num >= max
    	if (arr->num >= arr->max)//如果数组长度大于等于最大容量，那就扩容啊
    	{
        	ccCArrayDoubleCapacity(arr);
    	}
	}
	
	下面欣赏forceAddDelegate方法
	void CCKeypadDispatcher::forceAddDelegate(CCKeypadDelegate* pDelegate)
	{
    	CCKeypadHandler* pHandler = CCKeypadHandler::handlerWithDelegate(pDelegate);//pDelegate竟然是存放在CCKeypadHandler里面的

    	if (pHandler)
    	{
        	m_pDelegates->addObject(pHandler);//m_pDelegates添加的是CCKeypadHandler，而不是pDelegate，为啥需要这样做呢？？？
    	}
	}
	下面看看CCKeypadHandler的源码,看了半天发觉其实CCKeypadHandler没干什么事情，纯粹是多余的，感觉其实是作者是为了配套CCTouchHandler才这样搞的
	CCKeypadHandler* CCKeypadHandler::handlerWithDelegate(CCKeypadDelegate *pDelegate)
	{
    	CCKeypadHandler* pHandler = new CCKeypadHandler;

    	if (pHandler)
    	{
        	if (pHandler->initWithDelegate(pDelegate))//CCKeypadHandler持有一个CCKeypadDelegate,赋值给m_pDelegate
        	{
            	pHandler->autorelease();
        	}
        	else
        	{
            	CC_SAFE_RELEASE_NULL(pHandler);//宏定义pHandler设为null
            	#define CC_SAFE_RELEASE_NULL(p)        do { if(p) { (p)->release(); (p) = 0; } } while(0)
        	}
    	}

    	return pHandler;
	}
	
	下面还是看看CCKeypadDispatcher怎么分发消息的把。
	
	bool CCKeypadDispatcher::dispatchKeypadMSG(ccKeypadMSGType nMsgType)
	{
    	CCKeypadHandler*  pHandler = NULL;
    	CCKeypadDelegate* pDelegate = NULL;

    	m_bLocked = true;//当分发消息的时候，把开关关了

    	if (m_pDelegates->count() > 0)//这个数组>0，说明存放了CCKeypadHandler
    	{
        	CCObject* pObj = NULL;
        	CCARRAY_FOREACH(m_pDelegates, pObj)//循环迭代
        	{
            	CC_BREAK_IF(!pObj);

            	pHandler = (CCKeypadHandler*)pObj;
            	pDelegate = pHandler->getDelegate();//看到没pHandler就是多余的

            	switch (nMsgType)//根据消息类型，分发
            	{
            	case kTypeBackClicked:
                	pDelegate->keyBackClicked();//回调keyBackClicked()方法
                	break;
            	case kTypeMenuClicked:
                	pDelegate->keyMenuClicked();//回调kTypeMenuClicked()方法
                	break;
            	default:
                	break;
            	}
        	}
    	}

    	m_bLocked = false;//消息分发完毕，解锁了
    	if (m_bToRemove)//判断是否有东西需要移除，因为锁被锁住，临时存放在m_pHandlersToRemove中
    	{
        	m_bToRemove = false;//立马设置为false
        	for (unsigned int i = 0; i < m_pHandlersToRemove->num; ++i)//
        	{
            	forceRemoveDelegate((CCKeypadDelegate*)m_pHandlersToRemove->arr[i]);//把存放在数组中的CCKeypadDelegate*取出来，m_pHandlersToRemove->arr[i]移除
        	}
        	ccCArrayRemoveAllValues(m_pHandlersToRemove);//清空m_pHandlersToRemove，仅仅只需要arr->num = 0;就可以
    	}

    	if (m_bToAdd))//判断是否有东西需要添加，因为锁被锁住，临时存放在m_pHandlersToAdd中
    	{
        	m_bToAdd = false;//立马设置为false
        	for (unsigned int i = 0; i < m_pHandlersToAdd->num; ++i)
        	{
            	forceAddDelegate((CCKeypadDelegate*)m_pHandlersToAdd->arr[i]);//把存放在数组中的CCKeypadDelegate*取出来，m_pHandlersToAdd->arr[i]添加

        	}
        	ccCArrayRemoveAllValues(m_pHandlersToAdd);//清空m_pHandlersToAdd，仅仅只需要arr->num = 0;就可以

    	}

    	return true;
	}
	
	好了CCKeypadDelegate消息分发大体流程讲完了，还有一个疑问，随把消息传递给dispatchKeypadMSG啊？？？据说只有android才有实体键，所以android上是这么传递的，在TouchesJni.cpp中
	
	#define KEYCODE_BACK 0x04
    #define KEYCODE_MENU 0x52

    JNIEXPORT jboolean JNICALL Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeKeyDown(JNIEnv * env, jobject thiz, jint keyCode) {
        CCDirector* pDirector = CCDirector::sharedDirector();
        switch (keyCode) {//keyCode是android上按键的编码，在nativeKeyDown方法中，他是直接把keyCode传递过来的，如果我们还有特殊需求，也可以添加其他事件
            case KEYCODE_BACK:
                  if (pDirector->getKeypadDispatcher()->dispatchKeypadMSG(kTypeBackClicked);//终于看到dispatchKeypadMSG了，传递了ccKeypadMSGType中的kTypeBackClicked
                    return JNI_TRUE;
                break;
            case KEYCODE_MENU:
                if (pDirector->getKeypadDispatcher()->dispatchKeypadMSG(kTypeMenuClicked))////终于看到dispatchKeypadMSG了，传递了ccKeypadMSGType中的kTypeMenuClicked
                    return JNI_TRUE;
                break;
            default:
                return JNI_FALSE;
        }
        return JNI_FALSE;
    }

上面就是完整的按键回调流程，没有具体讲KeypadTest，但也差不多了！

下面就看看AccelerometerTest把。看看Accelerometer的流程是啥样的？下面仅仅只针对于Android( ⊙ o ⊙ )啊！

	setAccelerometerEnabled(true);//在onEnter()仅仅只需要设置这样就可以。
	
	//接着就可以到didAccelerate方法中接受了。该方法是CCAccelerometerDelegate中的类，CCLayer继承于CCAccelerometerDelegate中
	void AccelerometerTest::didAccelerate(CCAcceleration* pAccelerationValue)
	{

    CCDirector* pDir = CCDirector::sharedDirector();

    /*FIXME: Testing on the Nexus S sometimes m_pBall is NULL */
    if ( m_pBall == NULL ) {
        return;
    }

    CCSize ballSize  = m_pBall->getContentSize();//获取球球的大小

    CCPoint ptNow  = m_pBall->getPosition();//获取球球的位置，由于该球直接添加到CCLayer的，所以不需要转换成世界坐标系
    CCPoint ptTemp = pDir->convertToUI(ptNow);//直接转成UI坐标系：左上为原点，x轴向右，y轴向下

    ptTemp.x += pAccelerationValue->x * 9.81f;//pAccelerationValue->x * 9.81f才是加速度
    ptTemp.y -= pAccelerationValue->y * 9.81f;//注意是-啊

    CCPoint ptNext = pDir->convertToGL(ptTemp);//转换成世界坐标系
    FIX_POS(ptNext.x, (VisibleRect::left().x+ballSize.width / 2.0), (VisibleRect::right().x - ballSize.width / 2.0));
    FIX_POS(ptNext.y, (VisibleRect::bottom().y+ballSize.height / 2.0), (VisibleRect::top().y - ballSize.height / 2.0));
    m_pBall->setPosition(ptNext);//设置坐标
	}
	
	//FIX_POS确保球运动不超出屏幕
	#define FIX_POS(_pos, _min, _max) \ 
    if (_pos < _min)        \
    _pos = _min;        \
	else if (_pos > _max)   \
    _pos = _max;        \
 
关于坐标转换的，参考下这:[cocos2dx进阶学习之坐标转换](http://my.oschina.net/u/555701/blog/214691)

    void CCLayer::setAccelerometerEnabled(bool enabled)
	{
    if (enabled != m_bAccelerometerEnabled)
    {
        m_bAccelerometerEnabled = enabled;

        if (m_bRunning)
        {
            CCDirector* pDirector = CCDirector::sharedDirector();
            if (enabled)
            {
                pDirector->getAccelerometer()->setDelegate(this);//设置代理类，CCLayer继承于CCAccelerometerDelegate
            }
            else
            {
                pDirector->getAccelerometer()->setDelegate(NULL);//注意此处直接传的是NULL，在下面看看为啥传NULL啊
            }
        }
    }
	}
	
	class CCAcceleration
	{
	public:
    double x;//X轴加速度
    double y;//Y轴加速度
    double z;//Z轴加速度

    double timestamp;//时间戳
	};
	
	class CC_DLL CCAccelerometerDelegate//代理类，CCLayer继承于她
	{
	public:
    virtual void didAccelerate(CCAcceleration* pAccelerationValue) 	{CC_UNUSED_PARAM(pAccelerationValue);}
	};
	
	下面我们就看看CCAccelerometer类
	
	CCAccelerometerDelegate* m_pAccelDelegate;//有他，那肯定就有setDelegate方法，否则怎么赋值啊。
    CCAcceleration m_obAccelerationValue;//这个变量就是为了存储加速度以及时间戳的
    
    //好了，终于看到setDelegate了，从CCLayer一直追到这
    void CCAccelerometer::setDelegate(CCAccelerometerDelegate* pDelegate) 
    {
        m_pAccelDelegate = pDelegate;

        if (pDelegate)//看setDelegate设置为NULL的作用了没，为了判断运行不同的方法
        {        
            enableAccelerometerJNI();
        }
        else
        {
            disableAccelerometerJNI();
        }
    }
    
    下面先看enableAccelerometerJNI方法。 
    void enableAccelerometerJNI() {
    JniMethodInfo t;
    
    if (JniHelper::getStaticMethodInfo(t, CLASS_NAME, "enableAccelerometer", "()V")) {
        t.env->CallStaticVoidMethod(t.classID, t.methodID);//CLASS_NAME "org/cocos2dx/lib/Cocos2dxHelper"，会运行类名为org/cocos2dx/lib/Cocos2dxHelper下的enableAccelerometer方法。
        t.env->DeleteLocalRef(t.classID);
    }
	}
	
	下面继续看enableAccelerometer方法
	public static void enableAccelerometer() {
		Cocos2dxHelper.sAccelerometerEnabled = true;
		Cocos2dxHelper.sCocos2dxAccelerometer.enable();//继续查看
	}
	public void enable() {
		this.mSensorManager.registerListener(this, this.mAccelerometer, SensorManager.SENSOR_DELAY_GAME);//注册了一个监听器，其实这都是android的知识了啊。this代表Cocos2dxAccelerometer，他实现了SensorEventListener接口，他会回调public void onSensorChanged(final SensorEvent pSensorEvent) 方法。
	}
	
	//在onSensorChanged(final SensorEvent pSensorEvent)回调方法中
	
	@Override
	public void onSensorChanged(final SensorEvent pSensorEvent) {
		if (pSensorEvent.sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
			return;
		}

		float x = pSensorEvent.values[0];//获取相应方向的加速度
		float y = pSensorEvent.values[1];
		final float z = pSensorEvent.values[2];

		final int orientation = this.mContext.getResources().getConfiguration().orientation;

		if ((orientation == Configuration.ORIENTATION_LANDSCAPE) && (this.mNaturalOrientation != Surface.ROTATION_0)) {//判断旋转方向，横屏
			final float tmp = x;
			x = -y;
			y = tmp;
		} else if ((orientation == Configuration.ORIENTATION_PORTRAIT) && (this.mNaturalOrientation != Surface.ROTATION_0)) {//竖屏
			final float tmp = x;
			x = y;
			y = -tmp;
		}		
		
		Cocos2dxGLSurfaceView.queueAccelerometer(x,y,z,pSensorEvent.timestamp);//把加速度的值传递到queueAccelerometer
	}
	    //定位到queueAccelerometer
	    public static void queueAccelerometer(final float x, final float y, final float z, final long timestamp) {	
	   mCocos2dxGLSurfaceView.queueEvent(new Runnable() {//queueEvent可以实现主线程和渲染线程之间的交互
		@Override
		    public void run() {
			    Cocos2dxAccelerometer.onSensorChanged(x, y, z, timestamp);//我们发现该方法是个native方法，在C++文件中，我们找到了具体实现
		}
	   });
	 //下面就是具体实现
	JNIEXPORT void JNICALL Java_org_cocos2dx_lib_Cocos2dxAccelerometer_onSensorChanged(JNIEnv*  env, jobject thiz, jfloat x, jfloat y, jfloat z, jlong timeStamp) {
        CCDirector* pDirector = CCDirector::sharedDirector();
        pDirector->getAccelerometer()->update(x, y, z, timeStamp);//我们发现又回到了CCAccelerometer，而这次是update方法，一个轮回啊。
    }
    
    //下面前往CCAccelerometer的update方法。
    void CCAccelerometer::update(float x, float y, float z, long sensorTimeStamp) 
    {
        if (m_pAccelDelegate)
        {
            m_obAccelerationValue.x = -((double)x / TG3_GRAVITY_EARTH);//TG3_GRAVITY_EARTH 9.80665f为重力加速度，感觉是为了和其他平台相适应，所以除以重力加速度
            m_obAccelerationValue.y = -((double)y / TG3_GRAVITY_EARTH);
            m_obAccelerationValue.z = -((double)z / TG3_GRAVITY_EARTH);
            m_obAccelerationValue.timestamp = (double)sensorTimeStamp;

            m_pAccelDelegate->didAccelerate(&m_obAccelerationValue);//看到回调了啊，就是上文，例子中处理逻辑的啊
        }    
    }
    
 好了，关于CCAccelerometer的逻辑也讲的差不多了，通过CCAccelerometer设置setDelegate,又通过他接受返回数据。
 
	
    