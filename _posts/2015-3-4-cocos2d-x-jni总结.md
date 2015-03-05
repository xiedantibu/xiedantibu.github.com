---
layout: post
title: "cocos2d-x中jni总结"
category : cocos2d-x
tagline: "..."
tags : [cocos2d-x]
---
 本文为[xiedantibu](http://blog.xulingmin.com/)在学习cocos2d-x的笔记，转载请注明作者及出处！ 
###目录
 ----
 <a id='top' name='top'></a>
 &nbsp;&nbsp;&nbsp;&nbsp;[**JNIEnv*指针实例的获取**](#jnienv)     
 &nbsp;&nbsp;&nbsp;&nbsp;[**jstring以及std::string之间的转换**](#jstringtostring)   
 &nbsp;&nbsp;&nbsp;&nbsp;[**获取方法的信息**](#getMethodInfo)  
 &nbsp;&nbsp;&nbsp;&nbsp;[**C++回调JAVA的静态方法以及普通方法**](#CallMethod)  
 &nbsp;&nbsp;&nbsp;&nbsp;[**java回调c++实现的方法**](#NativeMethod)  
 
 
 --- 
<a id='jnienv' name='jnienv'> </a>
####[JNIEnv*环境变量的获取](#top)
---

	 JNIEnv* JniHelper::getEnv() {
        JNIEnv *_env = (JNIEnv *)pthread_getspecific(g_key);
        if (_env == nullptr)
            _env = JniHelper::cacheEnv(_psJavaVM);
        return _env;
    }
    
 --- 
<a id='jstringtostring' name='jstringtostring'> </a>
####[jstring以及std::string之间的转换](#top)
---

*	**jstring转成std::string**

		std::string JniHelper::jstring2string(jstring jstr) 
		{
        	if (jstr == nullptr) {
            	return "";
        	}
        	JNIEnv *env = JniHelper::getEnv();
        	if (!env) {
            	return nullptr;
        	}
        	const char* chars = env->GetStringUTFChars(jstr, nullptr);//将jstring转成char*
        	std::string ret(chars);
        	env->ReleaseStringUTFChars(jstr, chars);//删除引用
        	return ret;
    	}
---
*	**std::string转成jstring**

		JNIEnv* env = cocos2d::JniHelper::getEnv();
    	jstring _jstrClassName = env->NewStringUTF(className);//将std::string转成jstring
---
    	
*	**jstringtostring相互转换的例子**

		public static String getItem(String key) {//Cocos2dxLocalStorage.java类中的方法，传入一个key
        	return ret == null ? "" : ret;//返回String
    	}
    	//下面是在c++中回调这个方法
    	std::string localStorageGetItem( const std::string& key )
		{
			assert( _initialized );
    		JniMethodInfo t;//一个struct含有JNIEnv * ,jclass,jmethodID属性

    		std::string ret;
    		if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/lib/Cocos2dxLocalStorage", "getItem", "(Ljava/lang/String;)Ljava/lang/String;")) {//获取getItem类id，以及方法id
        	jstring jkey = t.env->NewStringUTF(key.c_str());//将std::string转成jstring
        	jstring jret = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID, jkey);//传入获取的类id,方法id,回调getItem方法，返回jstring
        	ret = JniHelper::jstring2string(jret);//jstring转成std::string
        	t.env->DeleteLocalRef(jret);//删除引用
        	t.env->DeleteLocalRef(jkey);//删除引用
        	t.env->DeleteLocalRef(t.classID);//删除引用
    	}
    		return ret;
		}
 --- 
<a id='getMethodInfo' name='getMethodInfo'> </a>
####[获取方法的信息](#top)
---

*	获取静态方法信息`static bool getStaticMethodInfo(JniMethodInfo &methodinfo,
                                    const char *className,
                                    const char *methodName,
                                    const char *paramCode);`
                                    
*	获取常规方法信息`static bool getMethodInfo(JniMethodInfo &methodinfo,
                                    const char *className,
                                    const char *methodName,
                                    const char *paramCode);`

	>className表示的是包名+类名,methodName表示的是调用的方法名,paramCode表示的是传入参数以及返回值类型,它的格式为：(参数)返回类型 ,不管是常规还是静态方法最终都把相关信息保存在methodinfo中.
	
*	**paramCode参数类型书写格式对应表**

参数类型 | 参数简写 |    
------------ | ------------- |   
boolean	| Z	|
byte |	B	|
char |	C	|
short |	S	|
int |	I	|
long |	J	|
float |	F	|
double |	D	|
void |	V	|
Object |	Ljava/lang/String; 	|
Array	| [Ljava/lang/String;	|

>	注意Object以及Array两种类型之后的分号。示例：(IIII)V //表示传入参数是4个整数，返回值为void。ILjava/lang/String;I //表示的是传入参数为(int,string,int)
	
 --- 
<a id='CallMethod' name='CallMethod'> </a>
####[C++回调JAVA的静态方法以及普通方法](#top)
---

JNIEvn\*有一系列的CallStatic[返回类型]Method、Call[返回类型]Method方法，针对不同的函数返回类型选择性调用。 
   
*	**返回类型为void时候:**

>*	CallStaticVoidMethod ———void返回类型
>*	CallVoidMethod ———void返回类型

---

*	**函数名以及函数返回值类型对应表** 
 
函数名 | 函数返回值类型 | 
------------ | ------------- | 
Void | void  | 
Object | jobject |
Boolean |	jboolean	|
Byte |	jbyte	|
Char |	jchar	|
Short|	 jshort	|
Int |	jint	|
Long |	jlong	|
Float |	jfloat	|
Double | jdouble 	|

---

*	**回调普通方法以及静态方法最主要的区别在于传入的参数:**  

>*	jniMethodInfo.env->CallVoidMethod(jobject jobj,jmethodID methodId,..需要传入的参数..)
>*	jniMethodInfo.env->CallStaticObjectMethod(jclass jclassid,jmethodID methodId,..需要传入的参数..)
>*	以上两个方法最主要的区别在于第一个参数的不同，普通方法传入的是jobject，而静态方法传入的是jclass。在调用普通Method的时候必须先通过方法`jniMethodInfo.env->CallStaticObjectMethod(jniMethodInfo.classID, jniMethodInfo.methodID,...);`获取jobject实例，至于静态方法则不需要那么麻烦。

---
* 	**普通方法回调例子**

		 bool isHave = JniHelper::getStaticMethodInfo(minfoDeviceUuid,"包名","getInstance","()Lcom/u9time/buyumalatang/activity/NewArcadeFishActivity;");
        jobject jobj;//获取实例
        if (isHave) {
            jobj = minfoDeviceUuid.env->CallStaticObjectMethod(minfoDeviceUuid.classID, minfoDeviceUuid.methodID);//调用CallStaticObjectMethod方法获取实例
            bool isHaveUuid = JniHelper::getMethodInfo(minfoDeviceUuid, "com/u9time/buyumalatang/activity/NewArcadeFishActivity", "showSubWebView", "(Ljava/lang/String;Ljava/lang/String;)V");//获取普通方法信息
            
            if(isHaveUuid){
                jstring strUrl = str2jstring(minfoDeviceUuid.env, CCUserDefault::sharedUserDefault()->getStringForKey("AU").c_str());

                jstring strWebviewType = str2jstring(minfoDeviceUuid.env, "protocol");
                minfoDeviceUuid.env->CallVoidMethod(jobj, minfoDeviceUuid.methodID, strUrl, strWebviewType);//回调普通方法
            }
        }
---
* 	**静态方法回调例子**
	
			
			void localStorageSetItem( const std::string& key, const std::string& value)
			{
			assert( _initialized );
    		JniMethodInfo t;
    		if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/lib/Cocos2dxLocalStorage", "setItem", "(Ljava/lang/String;Ljava/lang/String;)V")) {//获取setItem方法信息
        		jstring jkey = t.env->NewStringUTF(key.c_str());
        		jstring jvalue = t.env->NewStringUTF(value.c_str());
        		t.env->CallStaticVoidMethod(t.classID, t.methodID, jkey, jvalue);//回调方法
        		t.env->DeleteLocalRef(jkey);
        		t.env->DeleteLocalRef(jvalue);
        		t.env->DeleteLocalRef(t.classID);
   		 	}
			}
	
 --- 
<a id='NativeMethod' name='NativeMethod'> </a>
####[java回调c++实现的方法](#top)
---

*	**没有返回值的回调**

		private static native void nativeInsertText(final String text);
		
		extern "C" {
		JNIEXPORT void JNICALL Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeInsertText(JNIEnv* env, jobject thiz, jstring text) {//注意命名，以及方法包含在extern "C"中
        	const char* pszText = env->GetStringUTFChars(text, NULL);
        	cocos2d::IMEDispatcher::sharedDispatcher()->dispatchInsertText(pszText, strlen(pszText));
        env->ReleaseStringUTFChars(text, pszText);
    	}
		}
*	**含有返回值的回调**

		private static native int[] getGLContextAttrs();
		
		extern "C" {
		
			jintArray Java_org_cocos2dx_lib_Cocos2dxActivity_getGLContextAttrs(JNIEnv*  env, jobject thiz)
			{
    			cocos_android_app_init(env, thiz);
    			cocos2d::Application::getInstance()->initGLContextAttrs(); 
    			GLContextAttrs _glContextAttrs = GLView::getGLContextAttrs();
    
    			int tmp[6] = {_glContextAttrs.redBits, _glContextAttrs.greenBits, _glContextAttrs.blueBits,
                           _glContextAttrs.alphaBits, _glContextAttrs.depthBits, _glContextAttrs.stencilBits};


    			jintArray glContextAttrsJava = env->NewIntArray(6);
        		env->SetIntArrayRegion(glContextAttrsJava, 0, 6, tmp); 
    
    			return glContextAttrsJava;
		}
		
		}