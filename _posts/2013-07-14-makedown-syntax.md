---
layout: post
title: "Markdown 基础语法"
category : Markdown
tagline: "转载本站文章请注明作者和出处"
tags : [Markdown]
---

Markdown是啥呢？还是问[度娘](http://baike.baidu.com/view/2311114.htm "Markdown")比较方便,这也是为了写博客才学点Markdown的基础语法，具体语法参考了图领社区的[Markdown语法说明（详解版）](http://www.ituring.com.cn/article/504)这篇文章。

####特殊字符自动转换
在html中，有两个字符需要特殊处理:<和&。<符号用于起始标签，&符号则用于标记html实体，如果只是想要使用这些符号，则要`&lt;`和`&amp;`

在Markdown中如果在文档中需要插入一个著作权的符号，可以这样写：`&copy;`

在Markdown中如果是单纯的使用这两个符号&和<直接使用就行，Markdown直接给我们转了啊

####标题
Markdown支持两种标题的语法，Setext和atx形式。    
Setext用底线的形式表示，利用=（一级标题）和-（二级标题），例如：

	This is an H1
	=============

	This is an H2
	-------------

Atx 形式则是在行首插入 1 到 6 个 # ，对应到标题 1 到 6 级，例如：

	# This is an H1

	## This is an H2

	###### This is an H6

###换行
仅仅只需要在行尾加上两个以上的空白，然后按enter.  
###Blockquotes
Markdown 使用 email 形式的区块引言，如果你很熟悉如何在 email 信件中引用，就知道怎么在 Markdown 文档中建立一个区块引言，那会看起来像是强迫断行，然后在每行的最前面加上 >  

	> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
	> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
	> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
	> 
	> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
	> id sem consectetuer libero luctus adipiscing.

区块引言可以有级别（例如：引言内的引言），只要根据级别加上不同数量的 > ：

	> This is the first level of quoting.
	>
	> > This is nested blockquote.
	>
	> Back to the first level.

###列表
无序列表使用星号(\*)加号(\+)或是减号(\-)作为列表标记，效果都相同：

	*   Red
	*   Green
	*   Blue

有序列表则使用数字接着一个英文句点：

	1.  Bird
	2.  McHale
	3.  Parish


        
###程序代码区块
在 Markdown 中建立程序代码区块很简单，只要简单地缩排 4 个空白或是 1 个 tab 就可以：
###分隔线
你可以在一行中用三个或以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。你也可以在星号中间插入空白：

	* * *

	***

	*****

	- - -

	---------------------------------------
###链接
Markdown 支持两种形式的链接语法： 行内和参考两种形式。
行内形式链接：

	This is [an example](http://example.com/ "Title") inline link.

	[This link](http://example.net/) has no title attribute.

	See my [About](/about/) page for details. 我是相对路径啊
参考形式的链接：

	This is [an example][id] reference-style link.

接着，在文档的任意处，可以把这个标签的链接内容定义出来：

	[id]: http://example.com/  "Optional Title Here"	

简化写法形式：

	[Google][]

然后定义链接内容：

	[Google]: http://google.com/

###强调
Markdown 使用一个星号（\*）和底线（\_）作为标记强调字词的符号，被\* 或 \_ 包围的字词会被转成用 `<em>` 标签包围，用两个 \* 或 \_ 包起来的话，则会被转成 `<strong>`

	*single asterisks*

	_single underscores_

	**double asterisks**

	__double underscores__

###行内程序代码
如果要标记一小段行内程序代码，可以用反引号把它包起来（\`），例如：

	Use the `printf()` function.

###图片
图片链接有两种形式，很像链接一样，行内和参考
行内图片：

	![Alt text](/path/to/img.jpg)

	![Alt text](/path/to/img.jpg "Optional title")
参考式的图片：

	![Alt text][id]
「id」是图片参考的名称，图片参考的定义方式则和链接参考一样：

	[id]: url/to/image  "Optional title attribute"
###自动链接
Markdown 支持比较简短的自动链接形式来处理网址和电子邮件信箱，只要是用方括号包起来， Markdown 就会自动把它转成链接，链接的文字就和链接位置一样

	<http://xiedantibu.github.com/>

###转义字符
Markdown 支持在下面这些符号前面加上反斜杠来帮助插入普通的符号：

	\   反斜杠
	`   反引号
	*   星号
	_   底线
	{}  大括号
	[]  方括号
	()  括号
	#   井字号
	+   加号
	-   减号
	.   英文句点
	!   惊叹号
