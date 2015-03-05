---
layout: post
title: "cocos2d-x避免手打输入项目cpp文件到android.mk里面编译(转载)"
category : cocos2d-x
tagline: "转载"
tags : [cocos2d-x-2.2.3]
---

*	只需要在android.mk里面写上这样的：  
	
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
	
	
*	另外一种写法

		# 定义 all-cpp-files 返回当前路径和 Classes 路径想的所有 cpp 文件，注意：这里只考虑 cpp 而没有 c，如果需要自行添加
		define all-cpp-files
		$(patsubst jni/%,%, $(shell find $(LOCAL_PATH)/../../Classes/ $(LOCAL_PATH)/hellocpp $(LOCAL_PATH)/../../libs/protobuf/src -name "*.cpp" -o -name "*.cc"  ))  
		endef
		# 这里使用新的方式替换换来的方式，以自动添加源文件
		LOCAL_SRC_FILES := $(call all-cpp-files)

