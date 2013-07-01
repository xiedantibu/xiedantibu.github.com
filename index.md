---
layout: page
title: xiedantibu
tagline: 。。。。
---
{% include JB/setup %}

{% for post in site.posts %}
<div>
<div class="span10"><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></div>
<div class="span2"><span>{{ post.date | date: "%Y-%m-%d" }}</span></div>
</div>
{% endfor %}
