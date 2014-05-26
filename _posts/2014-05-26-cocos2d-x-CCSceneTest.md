---
layout: post
title: "cocos2d-x之CCSceneTest以及TransitionsTest"
category : cocos2d-x
tagline: "..."
tags : [cocos2d-x-2.2.3,CCScene]
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
</div> 
从上面三副图我们可以很直观的看到，CCScene有个子类叫做CCTransitionScene,他是场景切换的基类，所有场景过渡效果的类都继承自CCTransitionScene。具体的如下：
	
	CCTransitionRotoZoom//从大到小画面缩小并跳动进入
	CCTransitionJumpZoom//立体从左边缩小跳动进入
	CCTransitionMoveInL//从左边移动进入右边
	CCTransitionMoveInR//从右边移动进入左边
	CCTransitionMoveInT//从上边移动到入下边
	CCTransitionMoveInB//从下边移动到入上边
	CCTransitionSlideInL//从左边移动入右边
	CCTransitionSlideInR//从右边移动入左边
	CCTransitionSlideInT//从上边移动入下边
	CCTransitionSlideInB//从下边移动入上边
	CCTransitionShrinkGrow//从大到小在中间缩小进入
	CCTransitionFlipX//从X轴方向立体翻转
	CCTransitionFlipY//从Y轴方向立体翻转
	CCTransitionFlipAngular//从右边头翻转进入
	CCTransitionZoomFlipX//从X轴方向立体跳动翻转
	CCTransitionZoomFlipY//从Y轴方向立体跳动翻转
	CCTransitionZoomFlipAngular//从右边立体缩小翻转进入
	CCTransitionFade//从中间渐变进入
	CCTransitionCrossFade//从外围渐变进入
	CCTransitionTurnOffTiles//从格子覆盖上层进入
	CCTransitionSplitCols//竖直分三个方块切入
	CCTransitionSplitRows//横向分三个方块切入
	CCTransitionFadeTR//从左下角向右上角格子渐变进入
	CCTransitionFadeBL//从右上角角向左下角格子渐变进入
	CCTransitionFadeUp//从下向上渐变进入
	CCTransitionFadeDown//从上向下渐变进入
	
好了，接着咱具体讲讲CCTransitionScene这个类吧：

	



	
