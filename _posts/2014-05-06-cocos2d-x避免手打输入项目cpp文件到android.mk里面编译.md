---
layout: post
title: "cocos2d-x避免手打输入项目cpp文件到android.mk里面编译(转载)"
category : cocos2d-x
tagline: "转载"
tags : [cocos2d-x]
---

只需要在android.mk里面写上这样的：  
	
	LOCAL_PATH := $(call my-dir)

	include $(CLEAR_VARS)

	LOCAL_MODULE := hellocpp_shared

	LOCAL_MODULE_FILENAME := libhellocpp
				   
	FILE_LIST := hellocpp/main.cpp
	FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/*.cpp)
	LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

	LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes

	LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static

	include $(BUILD_SHARED_LIBRARY)

	$(call import-module,cocos2dx)
	
