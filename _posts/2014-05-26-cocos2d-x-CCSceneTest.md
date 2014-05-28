---
layout: post
title: "cocos2d-x之CCSceneTest以及TransitionsTest"
category : cocos2d-x
tagline: "..."
tags : [cocos2d-x-2.2.3,CCScene,TestCpp]
---
好了，从今天开始会将以正常的速度更新博文，![image](/assets/cat_02.jpg) ...再也不那么懒了。。。


CCScene这东西在英语中叫做场景，当然在CoCos2d-x中也是一样的东东！！！下面就先参观下CCScene的代码吧：

    //初始化中将m_bIgnoreAnchorPointForPosition设置为true，同时描点设置为(0.5,0.5)，但是此时描点不起作用啊
	CCScene::CCScene()
	{
    	m_bIgnoreAnchorPointForPosition = true;
    	setAnchorPoint(ccp(0.5f, 0.5f));
	}
CCScene的其他方法没有实质性的作用，还是先看它的类图吧：  
<div align="center">
![image](/assets/classcocos2d_1_1_c_c_scene.png) 
<p align="center">CCSceneTest图-1</p>  
![image](/assets/classcocos2d_1_1_c_c_transition_ease_scene.png) 
<p align="center">CCSceneTest图-2</p>  
![image](/assets/classcocos2d_1_1_c_c_transition_scene_oriented.png)
<p align="center">CCSceneTest图-3</p>
![image](/assets/classcocos2d_1_1_c_c_transition_progress.png)
<p align="center">CCSceneTest图-4</p>
</div> 
从上面四副图我们可以很直观的看到，CCScene有个子类叫做CCTransitionScene,他是场景切换的基类，所有场景过渡效果的类都继承自CCTransitionScene。具体的如下：
	
	=========第1种============
	CCTransitionFade     			场景在指定的时间内淡入淡出到一个指定的颜色
	=========第2种============
	CCTransitionFadeTR   			从屏幕的左下角向上卷起瓦片（tiles），从而显示场景
	CCTransitionFadeBL   			从屏幕的右上角到左下角淡出场景的瓦片
	CCTransitionFadeUp	  			从屏幕的底部到顶部淡出场景的瓦片
	CCTransitionFadeDown			从屏幕的顶部到底部淡出场景的瓦片
	=========第3种============
	CCTransitionJumpZoom			现有场景跳动着变小，新场景跳动着变大
	=========第4种============
	CCTransitionMoveInL				旧的场景会移出，而新场景会从屏幕左侧移入
	CCTransitionMoveInB				新场景从屏幕的底部移入
	CCTransitionMoveInT				新场景从屏幕的上方移入
	CCTransitionMoveInR				新场景从屏幕的右侧移入
	=========第5种============
	CCTransitionSceneOriented		将整个场景翻转过来
	CCTransitionFlipX				场景横向翻转
	CCTransitionFlipY				场景纵向翻转
	CCTransitionFlipAngular			场景一半按横向，一半按纵向翻转
	CCTransitionZoomFlipAngular		场景一半按横向，一半按纵向翻转，同时有一定缩放
	CCTransitionZoomFlipX			场景纵向翻转，同时有一定缩放
	CCTransitionZoomFlipY			场景横向翻转，同时有一定缩放
	=========第6种============
	CCTransitionPageTurn			翻动书页的过渡效果
	=========第7种============
	CCTransitionRotoZoom			当前场景旋转变小，新场景旋转变大
	=========第8种============
	CCTransitionShrinkGrow			当前场景缩小，新场景在其之上变大
	=========第9种============
	CCTransitionSlideInL			新场景从左边滑入
	CCTransitionSlideInR			新场景从右边滑入
	CCTransitionSlideInB			新场景从底部滑入
	CCTransitionSlideInT			新场景从顶部滑入
	=========第10种============
	CCTransitionSplitCols			将当前场景切成竖条，上下移动显示新场景
	CCTransitionSplitRows			将当前场景切成横条，左右移动显示新场景
	=========第11种============
	CCTransitionTurnOffTiles		将当前场景分成方块，用分成方块的新场景随机地替换当前场景分出的方块
	=========第12种============
	CCTransitionProgressRadialCCW	新场景沿着径向逆时针显示
	CCTransitionProgressRadialCW	让新的场景沿着径向顺时针显示
	=========第13种============
	CCTransitionProgressHorizontal	新场景沿着横向逐渐显示
	CCTransitionProgressVertical	让新场景沿着纵向逐渐显示
	=========第14种============
	CCTransitionProgressInOut		新场景由内到外逐渐显示
	CCTransitionProgressOutIn		让新场景由外到内逐渐显示
好了，效果实在太多了，终于扯完了，了解下就好。下面我们还是先讲讲Scene生命周期:

    ===========屌丝切换场景=====CCScene=============
    
	目前有三个CCLayer,分别是SceneTestLayer1，SceneTestLayer2，SceneTestLayer3。现在通过pushScene(CCScene *scene)从SceneTestLayer1调转到SceneTestLayer2，通过replaceScene(CCScene *scene)从SceneTestLayer2调转到SceneTestLayer3，下面看相关的跳转情况：
	=========从SceneTestLayer1调转到SceneTestLayer2===========
	Cocos2d: SceneTestLayer1#onExit
	Cocos2d: SceneTestLayer2#onEnter
	Cocos2d: SceneTestLayer2#onEnterTransitionDidFinish 
	
	=========从SceneTestLayer2调转到SceneTestLayer3===========
	Cocos2d: SceneTestLayer2#onExit
	Cocos2d: SceneTestLayer2#~SceneTestLayer2
	Cocos2d: SceneTestLayer3#onEnter
	Cocos2d: SceneTestLayer3#onEnterTransitionDidFinish
     
    从上面的跳转情况可以得出这么个结论：
    1) .当通过pushScene(CCScene *scene)切换Scence的时候，正在运行的场景是不会clearn掉的，他仅仅被压到栈中，所以相应的生命周期是：1#onExit-》2#onEnter-》2#onEnterTransitionDidFinish
    2) .当通过replaceScene(CCScene *scene)切换Scence的时候，正在运行的场景被新场景替换掉，所以正在运行的场景也就会clean掉，则相应的生命周期是：2#onExit-》2#~SceneTestLayer2-》3#onEnter-》3#onEnterTransitionDidFinish
 
	===========高富帅切换场景=======CCTransitionScene===========
	
	现在还是有三个CCLayer,分别是SceneTestLayer1，SceneTestLayer2，SceneTestLayer3。现在通过pushScene(CCTransitionScene *scene)从SceneTestLayer1调转到SceneTestLayer2，通过replaceScene(CCTransitionScene *scene)从SceneTestLayer2调转到SceneTestLayer3，下面看相关的跳转情况：
	=========从SceneTestLayer1调转到SceneTestLayer2===========
	Cocos2d: SceneTestLayer2#onEnter
	Cocos2d: SceneTestLayer1#onExit
	Cocos2d: SceneTestLayer2#onEnterTransitionDidFinish 
	
	=========从SceneTestLayer2调转到SceneTestLayer3===========
	Cocos2d: SceneTestLayer3#onEnter
	Cocos2d: SceneTestLayer2#onExit
	Cocos2d: SceneTestLayer3#onEnterTransitionDidFinish
	Cocos2d: SceneTestLayer2#~SceneTestLayer2
	
	从上面的跳转情况可以得出这么个结论：
    1) .当通过pushScene(CCTransitionScene *scene)切换Scence的时候，通过和屌丝切换比较我们发现生命周期竟然变了，当然切换的时候也没发生剧变，正在运行的场景也仅仅就是被压到栈中，相应的生命周期：2#onEnter-》1#onExit-》2#onEnterTransitionDidFinish 
    2) .当通过replaceScene(CCTransitionScene *scene)切换Scence的时候，通过和屌丝切换比较周期也变了，正在运行的场景当然也被新场景替换掉，所以正在运行的场景也就会clean掉，则相应的生命周期是：3#onEnter-》2#onExit-》3#onEnterTransitionDidFinish-》2#~SceneTestLayer2
    
    通过比较上诉两张切换方式，也不难理解，由于通过高富帅切换的时候需要场景A,B做动作，摆pose！不能太早把老场景扔到栈中，或者直接清掉！充分利用好你了，才把你扔一边去，现在的场景切换就很是表达这个观念。。。
    
    对了，关于上诉的生命周期，还有一个欠缺的，没有init()方法，其实他也不是随便出现的，只有通过create()，才会有init()，而通过new出来的可惜了，不会运行你的。当然了，init()方法如果有，基本上是第一个运行的。
    
    还有一个疑问，为啥生命周期通过高富帅切换场景突变了？？？下面的博文会解答这问题...
下面我们先不关注CCTransitionScene，还是跳转到CCDirector,再细细的品味下关于场景转换，以及渲染。具体渲染流程，查看[cocos2d-x-渲染](/cocos2d-x-渲染/)

	replaceScene以及pushScene具体实现是怎么工作的？为什么replace会清空，而push却不会。。。
	
	=====replaceScene 具体实现===
	void CCDirector::replaceScene(CCScene *pScene)
	{	
    	unsigned int index = m_pobScenesStack->count();//m_pobScenesStack是CCArray*类型
    	m_bSendCleanupToScene = true;                  //replace和push的主要区别就在于m_bSendCleanupToScene是否为true
    	m_pobScenesStack->replaceObjectAtIndex(index - 1, pScene);//把新加入的CCScene添加到最后一个，覆盖了原来的场景

    	m_pNextScene = pScene;//m_pNextScene只有在replace以及push中赋值，在setNextScene中设置为NULL
	}
	
	=========pushScene 具体实现============
	void CCDirector::pushScene(CCScene *pScene)
	{
    	m_bSendCleanupToScene = false;//replace和push的主要区别就在于m_bSendCleanupToScene是否为true
    	m_pobScenesStack->addObject(pScene);//把新加入的CCScene添加到最后一个，比较下和replaceScene中的区别
    	m_pNextScene = pScene;//m_pNextScene只有在replace以及push中赋值，在setNextScene中设置为NULL
	}
	从上我们可以明白replaceScene以及pushScene两则的具体区别就在于m_bSendCleanupToScene,以及是否把原先的场景压入栈
	
	=============popScene 他能将top上的栈给挤出来==========
	void CCDirector::popScene(void)
	{
    	m_pobScenesStack->removeLastObject();//移除最后一个
    	unsigned int c = m_pobScenesStack->count();

    	if (c == 0)
    	{
        	end();
    	}
    	else //else后面的处理方式跟replace比较下，熟悉吧，一摸一样
    	{
        	m_bSendCleanupToScene = true;
        	m_pNextScene = (CCScene*)m_pobScenesStack->objectAtIndex(c - 1);
    	}
	}
    
    =========明白了上面一系列的东西，我们就该去啃骨头了=====定位到CCDirector中的drawScene()====
    void CCDirector::drawScene(void)
    {
         ...
        if (m_pNextScene) //如果m_pNextScene不为空，这个m_pNextScene在刚才push，以及replace赋值过，在setNextScene中设置为NULL
    	{
        	setNextScene();//重点是setNextScene这个方法
    	}
    	...
    }
       
    =======男主角===setNextScene上场=====
    void CCDirector::setNextScene(void)
	{
    	bool runningIsTransition = dynamic_cast<CCTransitionScene*>(m_pRunningScene) != NULL;//将正在运行的Scene转化为CCTransitionScene，如果Scene为CCTransitionScene类型，则runningIsTransition为true,否则为false.m_pRunningScene在接下来会通过m_pNextScene赋值得到
    	bool newIsTransition = dynamic_cast<CCTransitionScene*>(m_pNextScene) != NULL;//m_pNextScene为即将要运行的Scene。在pushScene或者replaceScene中赋值，如果m_pNextScene为CCTransitionScene类型，最newIsTransition为true,否则为false.

     	if (! newIsTransition)//当m_pNextScene不是CCTransitionScene时候执行下面一段代码
     	{
         	if (m_pRunningScene)
         	{
            	 m_pRunningScene->onExitTransitionDidStart();
             	m_pRunningScene->onExit();
         	}
 
         	if (m_bSendCleanupToScene && m_pRunningScene)//当m_bSendCleanupToScene的时候，会清空m_pRunningScene
         	{
             	m_pRunningScene->cleanup();
         	}
     	}

    	if (m_pRunningScene)
    	{
        	m_pRunningScene->release();
    	}
    	m_pRunningScene = m_pNextScene;//将m_pNextScene赋值给正在运行的场景
    	m_pNextScene->retain();
    	m_pNextScene = NULL;//设置为NULL,是因为在drawScene方法中有个判断，如果m_pNextScene不为null,就执行setNextScene

    	if ((! runningIsTransition) && m_pRunningScene)//当m_pRunningScene不是CCTransitionScene时候执行下面一段代码

    	{
        	m_pRunningScene->onEnter();//如果m_pRunningScene为CCTransitionScene类型(其实此时的m_pRunningScene的值为m_pNextScene，因为在前面刚刚赋值)，则会进入到CCTransitionScene子类的onEnter()中，在这方法中是真正的运行动画的实现的地方
        	m_pRunningScene->onEnterTransitionDidFinish();
    	}
	}
    下面来总结下setNextScene这个方法吧。 
    1.如果当前正在运行的m_pRunningScene的场景为CCSence,则runningIsTransition为false，此时如果m_pNextScene是通过pushScene(CCTransitionScene *scene)赋值的CCTransitionScene场景类，则newIsTransition相应的就是true了，此时第一个if语句就不能运行，接着将CCTransitionScene类型的newIsTransition赋值给m_pRunningScene，此时m_pRunningScene就是CCTransitionScene类型，由于runningIsTransition为false,所以第二个if自然就能进去，接着m_pRunningScene就去运行onEnter，以及onEnterTransitionDidFinish().(如果此时有A，B两个场景，A场景通过高富帅跳转到B，通过上文学习，我们知道没有立即运行A的onExit，而是运行B的onEnter，以及onEnterTransitionDidFinish),说道这里可能有人以为结束了，其实CCTransitionScene的onEnter方法中还是做了很多工作的，为什么这么讲啊？我们还是直接去看看CCTransitionScene的onEnter方法把。
    
    ======下面看到的方法是CCTransitionScene的子类CCTransitionRotoZoom的onEnter方法===========
    void CCTransitionRotoZoom:: onEnter()
	{
    	CCTransitionScene::onEnter();//真正m_pInScene的onEnter()方法，此处m_pInScene是CCScene类型，是我们初始化CCTransitionScene的时候传进来的CCScene传给m_pInScene

   		 m_pInScene->setScale(0.001f);
    	m_pOutScene->setScale(1.0f);

    	m_pInScene->setAnchorPoint(ccp(0.5f, 0.5f));
    	m_pOutScene->setAnchorPoint(ccp(0.5f, 0.5f));

    	CCActionInterval *rotozoom = (CCActionInterval*)(CCSequence::create
    	(
        	CCSpawn::create
        	(
            	CCScaleBy::create(m_fDuration/2, 0.001f),
            	CCRotateBy::create(m_fDuration/2, 360 * 2),NULL),CCDelayTime::create(m_fDuration/2), NULL));

    	m_pOutScene->runAction(rotozoom);
    	m_pInScene->runAction
    	(
        	CCSequence::create
        	(
            	rotozoom->reverse(),
            	CCCallFunc::create(this, callfunc_selector(CCTransitionScene::finish)),
            	NULL
        	)
    	);
	}
    在onEnter的方法中我们看到m_pOutScene以及m_pInScene分别执行了相应的动画，同时结束的时候还运行finish()方法。在finish()方法中又这么一句话this->schedule(schedule_selector(CCTransitionScene::setNewScene), 0);重点就是setNewScene这个方法，运行完finish()方法接着又去运行了setNewScene()方法了，好了接着咱们就去看setNewScene()方法
    
    void CCTransitionScene::setNewScene(float dt)
	{    
    	this->unschedule(schedule_selector(CCTransitionScene::setNewScene));//解除这个定时器
    	// Before replacing, save the "send cleanup to scene"
    	CCDirector *director = CCDirector::sharedDirector();
    	m_bIsSendCleanupToScene = director->isSendCleanupToScene();//在replace之前事先保存是否清空Scene的标志位，因为在cleanup()方法中，通过这个标志位判断是否清空m_pOutScene这个场景
    
    	director->replaceScene(m_pInScene);//这句话是重点的重点，这里又去执行了replaceScene(),而且m_pInScene此时就是CCScene类型，因为他是在CCTransitionScene初始化的时候传入进来的CCScene的参数。好了，我们冷静，思考下，发现了这么好玩的事情，又得去执行setNextScene方法，通过replaceScene(CCTransitionScene)或者pushScene(CCTransitionScene)切换场景竟然会出现这么神奇的情况，会出现两次把场景压入栈中，第一次replace或者push进去的是CCTransitionScene的场景，第二次是通过replace进去CCScene替换掉第一次的CCTransitionScene场景，所以也就会出现运行两次的setNextScene方法，所以setNextScene方法中的两个标志位也会出现有意思的情况，我来用具体例子来解释下把：如果现在有两个场景A,B。A跳转到B场景是通过高富帅方式跳转的，在第一次进入setNextScene方法的时候，我们会发现runningIsTransition为false,newIsTransition为true,runningIsTransition为false表示正在运行的场景m_pRunningScene不是CCTransitionScene类型？？?为啥这么说呢，我们原先可没明确说明场景A不是CCTransitionScene类型啊，确实是个疑问，等下慢慢细说。。。而newIsTransition为true,表面m_pNextScene为CCTransitionScene类型，这个确实是CCTransitionScene类型，因为刚才我们通过replaceScene或者pushScene进来的时候就是CCTransitionScene类型啊，在setNextScene中我们发现，m_pRunningScene被赋值了，变成了CCTransitionScene类型，同时m_pNextScene赋值为NULL,现在要明确点啊，运行的场景变成了CCTransitionScene类型了！！！好了，这是第一次 进入setNextScene方法。上面我们讲到由于通过replaceScene(m_pInScene),所以又第二次进入setNextScene方法，此时的话m_pRunningScene是CCTransitionScene类型，所以相应的runningIsTransition为true,而newIsTransition为false，因为m_pInScene为CCScene类型，看到了把，跟第一次比起来，两个标志位发生了改变了。在setNextScene方法中，同样的m_pRunningScene会被m_pInScene赋值，变成普通的CCScene类型，如果我们再一次切换场景，进入setNextScene方法，则m_pRunningScene就是CCScene类型，所以runningIsTransition就为false。好了这也解决了我们刚才的疑问，第一次进来的时候我很明确的就是A场景就是为CCScene类型。
    	
    	上面说了这么一大段，啰嗦的，其实可以归纳为：通过高富帅转换的时候，会两次的进入setNextScene方法，而最终转换成功后显示的场景就是CCScene类型，而不是CCTransitionScene类型。
    
    // issue #267
    m_pOutScene->setVisible(true);
}	
    
接着咱具体讲讲CCTransitionScene这个类吧：

	=======相关属性=======
	CCScene    * m_pInScene;  //进入的场景
    CCScene    * m_pOutScene; //出去的场景
    float    m_fDuration;     //场景切换的时间
    bool    m_bIsInSceneOnTop;  //改变进出场场景visit的顺序，是否对场景进行渲染排序，是否保证新场景在最上面
    bool    m_bIsSendCleanupToScene;//在切换完成后是否清空旧场景
	



	
