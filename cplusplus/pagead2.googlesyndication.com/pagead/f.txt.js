(function(){var k=this,aa=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},ba=function(a,b,c){return a.call.apply(a.bind,arguments)},ca=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var e=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,e);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},m=function(a,b,c){m=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?
ba:ca;return m.apply(null,arguments)};var r=(new Date).getTime();var u=function(a){a=parseFloat(a);return isNaN(a)||1<a||0>a?0:a},w=function(a,b){return/^true$/.test(a)?!0:/^false$/.test(a)?!1:b},da=/^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,y=function(a,b){if(!a)return b;var c=a.match(da);return c?c[0]:b};var ea=u("0.15"),fa=u("0.01"),ga=u("0.001"),ha=u("0.001"),ia=u("0.2"),ja=w("true",!0);var ka=w("false",!1),la=w("false",!1);var z=function(a){z[" "](a);return a};z[" "]=function(){};var A=function(a){try{var b;if(b=!!a&&null!=a.location.href)o:{try{z(a.foo);b=!0;break o}catch(c){}b=!1}return b}catch(e){return!1}};var ma=function(a){var b=a.toString();a.name&&-1==b.indexOf(a.name)&&(b+=": "+a.name);a.message&&-1==b.indexOf(a.message)&&(b+=": "+a.message);if(a.stack){a=a.stack;var c=b;try{-1==a.indexOf(c)&&(a=c+"\n"+a);for(var e;a!=e;)e=a,a=a.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/,"$1");b=a.replace(/\n */g,"\n")}catch(d){b=c}}return b};var C=document,E=window,F,na=null,G=C.getElementsByTagName("script");G&&G.length&&(na=G[G.length-1]);F=na;var oa=/&/g,pa=/</g,qa=/>/g,ra=/"/g,sa=/'/g,ta=/\x00/g,H={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\"},I={"'":"\\'"};var J=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(null,a[c],c,a)},K=function(a){return!!a&&"function"==typeof a&&!!a.call},ua=function(a,b){if(!(2>arguments.length))for(var c=1,e=arguments.length;c<e;++c)a.push(arguments[c])},va=function(a,b){a.addEventListener?a.addEventListener("load",b,!1):a.attachEvent&&a.attachEvent("onload",b)},wa=function(a){"google_onload_fired"in a||(a.google_onload_fired=!1,va(a,function(){a.google_onload_fired=!0}))},L=function(a,b){if(!(1E-4>
Math.random())){var c=Math.random();if(c<b){try{var e=new Uint16Array(1);window.crypto.getRandomValues(e);c=e[0]/65536}catch(d){c=Math.random()}return a[Math.floor(c*a.length)]}}return null},xa=function(){var a=E.google_unique_id;return"number"==typeof a?a:0},ya=function(a){var b=a.length;if(0==b)return 0;for(var c=305419896,e=0;e<b;e++)c^=(c<<5)+(c>>2)+a.charCodeAt(e)&4294967295;return 0<c?c:4294967296+c};var M=!0,za={},Ca=function(a,b,c,e){var d=Aa,f,h=M;try{f=b()}catch(g){try{var l=ma(g);b="";g.fileName&&(b=g.fileName);var p=-1;g.lineNumber&&(p=g.lineNumber);h=d(a,l,b,p,c)}catch(n){try{var q=ma(n);a="";n.fileName&&(a=n.fileName);c=-1;n.lineNumber&&(c=n.lineNumber);Aa("pAR",q,a,c,void 0,void 0)}catch(s){Ba({context:"mRE",msg:s.toString()+"\n"+(s.stack||"")},void 0)}}if(!h)throw g;}finally{if(e)try{e()}catch(B){}}return f},Aa=function(a,b,c,e,d,f){var h={};if(d)try{d(h)}catch(g){}h.context=a;h.msg=
b.substring(0,512);c&&(h.file=c);0<e&&(h.line=e.toString());h.url=C.URL.substring(0,512);h.ref=C.referrer.substring(0,512);Da(h);Ba(h,f);return M},Ba=function(a,b){try{if(Math.random()<(b||.01)){var c="pagead/gen_204@id=jserror"+Ea(a),e="http"+("http:"==E.location.protocol?"":"s")+"_3A//pagead2.googlesyndication.com"+c,c=e=e.substring(0,2E3);E.google_image_requests||(E.google_image_requests=[]);var d=E.document.createElement("img");d.src=c;E.google_image_requests.push(d)}}catch(f){}},Da=function(a){var b=
a||{};J(za,function(a,e){b[e]=E[a]})},Fa=function(a,b){return function(){var c=arguments;return Ca(a,function(){return b.apply(void 0,c)},void 0,void 0)}},N=function(a,b){return Fa(a,b)},Ea=function(a){var b="";J(a,function(a,e){if(0===a||a)b+="&"+e+"="+("function"==typeof encodeURIComponent?encodeURIComponent(a):escape(a))});return b};M=!ka;za={client:"google_ad_client",format:"google_ad_format",slotname:"google_ad_slot",output:"google_ad_output",ad_type:"google_ad_type",async_oa:"google_async_for_oa_experiment",dimpr:"google_always_use_delayed_impressions_experiment",peri:"google_top_experiment",pse:"google_pstate_expt"};var Ga=!!window.google_async_iframe_id,Ha=/MSIE [2-7]|PlayStation|Gecko\/20090226|Android 2\.|Opera/i,Ia=/Android/;var O=null,Ja=function(){if(!O){for(var a=window,b=a,c=0;a!=a.parent;)if(a=a.parent,c++,A(a))b=a;else break;O=b}return O};var P=function(a,b,c){c||(c=la?"https":"http");return[c,"://",a,b].join("")};var Ka=function(){},Q=function(a,b,c){switch(typeof b){case "string":La(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(b instanceof Array){var e=b.length;c.push("[");for(var d="",f=0;f<e;f++)c.push(d),Q(a,b[f],c),d=",";c.push("]");break}c.push("{");e="";for(d in b)b.hasOwnProperty(d)&&(f=b[d],"function"!=typeof f&&(c.push(e),La(d,c),c.push(":"),Q(a,f,c),e=
","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}},R={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ma=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:[//default.htm\"\x00-\x1f\x7f-\xff]/g,La=function(a,b){b.push('"');b.push(a.replace(Ma,function(a){if(a in R)return R[a];var b=a.charCodeAt(0),d="\\u";16>b?d+="000":256>b?d+="00":4096>b&&(d+="0");return R[a]=d+b.toString(16)}));b.push('"')};var S="google_ad_block google_ad_channel google_ad_client google_ad_format google_ad_height google_ad_host google_ad_host_channel google_ad_host_tier_id google_ad_output google_ad_override google_ad_region google_ad_section google_ad_slot google_ad_type google_ad_unit_key google_ad_unit_key_2 google_ad_width google_adtest google_allow_expandable_ads google_alternate_ad_url google_alternate_color google_analytics_domain_name google_analytics_uacct google_analytics_url_parameters google_available_width google_bid google_captcha_token google_city google_color_bg google_color_border google_color_line google_color_link google_color_text google_color_url google_container_id google_content_recommendation_ui_type google_contents google_country google_cpm google_ctr_threshold google_cust_age google_cust_ch google_cust_criteria google_cust_gender google_cust_id google_cust_interests google_cust_job google_cust_l google_cust_lh google_cust_u_url google_disable_video_autoplay google_ed google_eids google_enable_content_recommendations google_enable_ose google_enable_ose_periscope google_encoding google_floating_ad_position google_font_face google_font_size google_frame_id google_gl google_hints google_image_size google_kw google_kw_type google_lact google_language google_loeid google_max_num_ads google_max_radlink_len google_mtl google_num_radlinks google_num_radlinks_per_unit google_only_ads_with_video google_only_pyv_ads google_only_userchoice_ads google_original_width google_override_format google_page_url google_pgb_reactive google_previous_watch google_previous_searches google_referrer_url google_region google_responsive_formats google_reuse_colors google_rl_dest_url google_rl_filtering google_rl_mode google_rt google_safe google_sc_id google_scs google_source_type google_sui google_skip google_tag_for_child_directed_treatment google_tag_info google_tag_origin google_targeting google_tdsma google_tfs google_tl google_ui_features google_ui_version google_video_doc_id google_video_product_type google_video_url_to_fetch google_with_pyv_ads google_yt_pt google_yt_up".split(" "),
Na={google_analytics_domain_name:!0,google_analytics_uacct:!0},Oa=function(a){a.google_page_url&&(a.google_page_url=String(a.google_page_url));var b=[];J(a,function(a,e){if(null!=a){var d;try{var f=[];Q(new Ka,a,f);d=f.join("")}catch(h){}d&&ua(b,e,"=",d,";")}});return b.join("")};var T=null;var U=function(a){this.j=a;a.google_iframe_oncopy||(a.google_iframe_oncopy={handlers:{},upd:m(this.u,this)});this.r=a.google_iframe_oncopy},Pa;var V="var i=this.id,s=window.google_iframe_oncopy,H=s&&s.handlers,h=H&&H[i],w=this.contentWindow,d;try{d=w.document}catch(e){}if(h&&d&&(!d.body||!d.body.firstChild)){if(h.call){setTimeout(h,0)}else if(h.match){try{h=s.upd(h,i)}catch(e){}w.location.replace(h)}}";
/[\x00&<>"']/.test(V)&&(-1!=V.indexOf("&")&&(V=V.replace(oa,"&amp;")),-1!=V.indexOf("<")&&(V=V.replace(pa,"&lt;")),-1!=V.indexOf(">")&&(V=V.replace(qa,"&gt;")),-1!=V.indexOf('"')&&(V=V.replace(ra,"&quot;")),-1!=V.indexOf("'")&&(V=V.replace(sa,"&#39;")),-1!=V.indexOf("\x00")&&(V=V.replace(ta,"&#0;")));Pa=V;U.prototype.set=function(a,b){this.r.handlers[a]=b;this.j.addEventListener&&this.j.addEventListener("load",m(this.s,this,a),!1)};
U.prototype.s=function(a){a=this.j.document.getElementById(a);try{var b=a.contentWindow.document;if(a.onload&&b&&(!b.body||!b.body.firstChild))a.onload()}catch(c){}};U.prototype.u=function(a,b){var c=Qa("rx",a),e;o:{if(a&&(e=a.match("dt=([^&]+)"))&&2==e.length){e=e[1];break o}e=""}e=(new Date).getTime()-e;c=c.replace(/&dtd=(\d+|M)/,"&dtd="+(1E4>e?e+"":"M"));this.set(b,c);return c};var Qa=function(a,b){var c=new RegExp("\\b"+a+"=(\\d+)"),e=c.exec(b);e&&(b=b.replace(c,a+"="+(+e[1]+1||1)));return b};var W;o:{var Ra=k.navigator;if(Ra){var Sa=Ra.userAgent;if(Sa){W=Sa;break o}}W=""};var Ta=-1!=W.indexOf("Opera")||-1!=W.indexOf("OPR"),Ua=-1!=W.indexOf("Trident")||-1!=W.indexOf("MSIE"),Va=-1!=W.indexOf("Gecko")&&-1==W.toLowerCase().indexOf("webkit")&&!(-1!=W.indexOf("Trident")||-1!=W.indexOf("MSIE")),Wa=-1!=W.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Ta&&k.opera)return a=k.opera.version,"function"==aa(a)?a():a;Va?b=/rv\:([^\);]+)(\)|;)/:Ua?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Wa&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(W))?a[1]:"");return Ua&&(b=(b=k.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Xa={"120x90":!0,"160x90":!0,"180x90":!0,"200x90":!0,"468x15":!0,"728x15":!0};var X,Y=function(a){this.k=[];this.j=a||window;this.i=0;this.l=null;this.m=0},Ya=function(a,b){this.t=a;this.q=b};Y.prototype.w=function(a,b){0!=this.i||0!=this.k.length||b&&b!=window?this.p(a,b):(this.i=2,this.o(new Ya(a,window)))};Y.prototype.p=function(a,b){this.k.push(new Ya(a,b||this.j));Z(this)};Y.prototype.A=function(a){this.i=1;if(a){var b=N("sjr::timeout",m(this.n,this,!0));this.l=this.j.setTimeout(b,a)}};
Y.prototype.n=function(a){a&&++this.m;1==this.i&&(null!=this.l&&(this.j.clearTimeout(this.l),this.l=null),this.i=0);Z(this)};Y.prototype.B=function(){return!(!window||!Array)};Y.prototype.C=function(){return this.m};Y.prototype.nq=Y.prototype.w;Y.prototype.nqa=Y.prototype.p;Y.prototype.al=Y.prototype.A;Y.prototype.rl=Y.prototype.n;Y.prototype.sz=Y.prototype.B;Y.prototype.tc=Y.prototype.C;var Z=function(a){var b=N("sjr::tryrun",m(a.v,a));a.j.setTimeout(b,0)};
Y.prototype.v=function(){if(0==this.i&&this.k.length){var a=this.k.shift();this.i=2;var b=N("sjr::run",m(this.o,this,a));a.q.setTimeout(b,0);Z(this)}};Y.prototype.o=function(a){this.i=0;a.t()};
var Za=function(a){try{return a.sz()}catch(b){return!1}},$a=function(a){return!!a&&("object"==typeof a||"function"==typeof a)&&Za(a)&&K(a.nq)&&K(a.nqa)&&K(a.al)&&K(a.rl)},$=function(){if(X&&Za(X))return X;var a=Ja(),b=a.google_jobrunner;return $a(b)?X=b:a.google_jobrunner=X=new Y(a)},ab=function(a,b){$().nq(a,b)},bb=function(a,b){$().nqa(a,b)};var cb=Ga?1==xa():!xa(),db=function(){var a=z("script"),b;b=y("","pagead2.googlesyndication.com");return["<",a,' src="',P(b,"/pagead/js/r20141029/r20140417/show_ads_impl.js",""),'"></',a,">"].join("")},eb=function(a,b,c,e){return function(){var d=!1;e&&$().al(3E4);var f=a.document.getElementById(b);f&&!A(f.contentWindow)&&3==a.google_top_js_status&&
(a.google_top_js_status=6);try{if(A(a.document.getElementById(b).contentWindow)){var h=a.document.getElementById(b).contentWindow,g=h.document;g.body&&g.body.firstChild||(g.open(),h.google_async_iframe_close=!0,g.write(c))}else{var l=a.document.getElementById(b).contentWindow,p;f=c;f=String(f);if(f.quote)p=f.quote();else{h=['"'];for(g=0;g<f.length;g++){var n=f.charAt(g),q=n.charCodeAt(0),s=g+1,B;if(!(B=H[n])){var D;if(31<q&&127>q)D=n;else{var v=n;if(v in I)D=I[v];else if(v in H)D=I[v]=H[v];else{var t=
v,x=v.charCodeAt(0);if(31<x&&127>x)t=v;else{if(256>x){if(t="\\x",16>x||256<x)t+="0"}else t="\\u",4096>x&&(t+="0");t+=x.toString(16).toUpperCase()}D=I[v]=t}}B=D}h[s]=B}h.push('"');p=h.join("")}l.location.replace("javascript:"+p)}d=!0}catch(mb){l=Ja().google_jobrunner,$a(l)&&l.rl()}d&&(d=Qa("google_async_rrc",c),(new U(a)).set(b,eb(a,b,d,!1)))}},fb=function(a){var b=["<iframe"];J(a,function(a,e){null!=a&&b.push(" "+e+'="'+a+'"')});b.push("></iframe>");return b.join("")},gb=function(a,b,c,e){e=e?'"':
"";var d=e+"0"+e;a.width=e+b+e;a.height=e+c+e;a.frameborder=d;a.marginwidth=d;a.marginheight=d;a.vspace=d;a.hspace=d;a.allowtransparency=e+"true"+e;a.scrolling=e+"no"+e;a.allowfullscreen=e+"true"+e},hb=function(){var a;if(a=cb){if(!T)o:{var b=[E.top];a=[];for(var c=0,e;e=b[c++];){a.push(e);try{if(e.frames)for(var d=e.frames.length,f=0;f<d&&1024>b.length;++f)b.push(e.frames[f])}catch(h){}}for(d=0;d<a.length;d++)try{var g=a[d].frames.google_esf;if(g){T=g;break o}}catch(l){}T=null}a=!T}return a?(g={},
gb(g,0,0,!1),g.style="display:none",g.id="google_esf",g.name="google_esf",a=P(y("","googleads.g.doubleclick.net"),"pagead/html/r20141029/r20140417/zrt_lookup.html"),g.src=a,fb(g)):""},jb=function(a,b,c){var e=b.google_ad_output,d=b.google_ad_format;d||"html"!=e&&null!=e||(d=b.google_ad_width+"x"+b.google_ad_height,c&&(d+="_as"));c=!b.google_ad_slot||ib(b);d=d&&c?d.toLowerCase():"";b.google_ad_format=
d;d=[b.google_ad_slot,b.google_ad_format,b.google_ad_type,b.google_ad_width,b.google_ad_height];c=[];for(var e=0,f=F.parentElement;f&&25>e;f=f.parentNode,++e)c.push(9!=f.nodeType&&f.id||"");(c=c.join())&&d.push(c);b.google_ad_unit_key=ya(d.join(":")).toString();d=a.google_adk2_experiment=a.google_adk2_experiment||L(["C","E"],ha)||"N";if("E"==d){d=F;c=[];for(e=0;d&&25>e;++e){var f=(f=9!=d.nodeType&&d.id)?"/"+f:"",h;o:{var g=d.parentElement;h=d.nodeName.toLowerCase();if(g)for(var g=g.childNodes,l=0,
p=0;p<g.length;++p){var n=g[p];if(n.nodeName&&n.nodeName.toLowerCase()==h){if(d==n){h="."+l;break o}++l}}h=""}c.push((d.nodeName&&d.nodeName.toLowerCase())+f+h);d=d.parentElement}d=c.join()+":";c=[];if(a)try{for(var q=a.parent,e=0;q&&q!=a&&25>e;++e){for(var s=q.frames,f=0;f<s.length;++f)if(a==s[f]){c.push(f);break}a=q;q=a.parent}}catch(B){}b.google_ad_unit_key_2=ya(d+c.join()).toString()}else"C"==d&&(b.google_ad_unit_key_2="ctrl")},kb=Math.floor(1E6*Math.random()),lb=function(a){for(var b=a.data.split("\n"),
c={},e=0;e<b.length;e++){var d=b[e].indexOf("=");-1!=d&&(c[b[e].substr(0,d)]=b[e].substr(d+1))}b=c[3];if(c[1]==kb&&(window.google_top_js_status=4,a.source==top&&0==b.indexOf(a.origin)&&(window.google_top_values=c,window.google_top_js_status=5),window.google_top_js_callbacks)){for(a=0;a<window.google_top_js_callbacks.length;a++)window.google_top_js_callbacks[a]();window.google_top_js_callbacks.length=0}},ib=function(a){return a.google_override_format||!Xa[a.google_ad_width+"x"+a.google_ad_height]&&
"aa"==a.google_loader_used};Ca("sa::main",function(){var a=window;wa(a);if(!window.google_top_experiment&&!window.google_top_js_status){var b=window;if(2!==(b.top==b?0:A(b.top)?1:2))window.google_top_js_status=0;else if(top.postMessage){var c;try{c=E.top.frames.google_top_static_frame?!0:!1}catch(e){c=!1}if(c){if(window.google_top_experiment=L(["jp_c","jp_zl","jp_wfpmr","jp_zlt","jp_wnt"],ea),"jp_c"!==window.google_top_experiment){b=window;b.addEventListener?b.addEventListener("message",lb,!1):b.attachEvent&&b.attachEvent("onmessage",
lb);window.google_top_js_status=3;b={0:"google_loc_request",1:kb};c=[];for(var d in b)c.push(d+"="+b[d]);top.postMessage(c.join("\n"),"*")}}else window.google_top_js_status=2}else window.google_top_js_status=1}d=window.google_ad_output;void 0!==window.google_always_use_delayed_impressions_experiment||d&&"html"!=d||(window.google_always_use_delayed_impressions_experiment=L(["C","E"],ga));(d=!1===window.google_enable_async)||(d=navigator.userAgent,Ha.test(d)?d=!1:(void 0!==window.google_async_for_oa_experiment||
!Ia.test(navigator.userAgent)||Ha.test(navigator.userAgent)||(window.google_async_for_oa_experiment=L(["E","C"],fa)),d=Ia.test(d)?"E"===window.google_async_for_oa_experiment:!0),d=!d||window.google_container_id||window.google_ad_output&&"html"!=window.google_ad_output);if(d)a.google_loader_used="sb",a.google_start_time=r,jb(a,a),document.write(hb()+db());else{cb&&(c=a.google_ad_client,d=navigator,ja&&a&&c&&d&&(b=a.document,d=b.createElement("script"),c?(c=c.toLowerCase())&&"ca-"!=c.substring(0,3)&&
(c="ca-"+c):c="",d.async=!0,d.type="text/javascript",d.src=P("www.gstatic.com","pub-config/"+c+".js"),b=b.getElementsByTagName("script")[0],b.parentNode.insertBefore(d,b)));a.google_unique_id?++a.google_unique_id:a.google_unique_id=1;b={};d=0;for(c=S.length;d<c;d++){var f=S[d];null!=a[f]&&(b[f]=a[f])}b.google_loader_used="sa";d=0;for(c=S.length;d<c;d++)f=S[d],Na[f]||(a[f]=null);d=z("script");c={};gb(c,b.google_ad_width,b.google_ad_height,!0);c.onload='"'+Pa+'"';for(var h,f=a.document,g=c.id,l=0;!g||
f.getElementById(g);)g="aswift_"+l++;c.id=g;c.name=g;var l=b.google_ad_width,p=b.google_ad_height,g=["<iframe"];for(h in c)c.hasOwnProperty(h)&&ua(g,h+"="+c[h]);g.push('style="left:0;position:absolute;top:0;"');g.push("></iframe>");h=c.id;l="border:none;height:"+p+"px;margin:0;padding:0;position:relative;visibility:visible;width:"+l+"px;background-color:transparent";f.write(['<ins id="',h+"_expand",'" style="display:inline-table;',l,'"><ins id="',h+"_anchor",'" style="display:block;',l,'">',g.join(" "),
"</ins></ins>"].join(""));h=c.id;c=ib(b)?L(["c","e"],ia):null;jb(a,b,"e"==c);b=Oa(b);f=hb();g=(new Date).getTime();l=a.google_top_experiment;if(p=a.google_async_for_oa_experiment)a.google_async_for_oa_experiment=void 0;var n=a.google_always_use_delayed_impressions_experiment,q=a.google_auto_width_experiment,s=a.google_floating_ads_js_experiment;d=["<!doctype html><html><body>",f,"<",d,">",b,"google_show_ads_impl=true;google_unique_id=",a.google_unique_id,';google_async_iframe_id="',h,'";google_start_time=',
r,";",l?'google_top_experiment="'+l+'";':"",p?'google_async_for_oa_experiment="'+p+'";':"",n?'google_always_use_delayed_impressions_experiment="'+n+'";':"",c?'google_append_as_for_format_override="'+c+'";':"",q?'google_auto_width_experiment="'+q+'";':"",s?'google_floating_ads_js_experiment="'+s+'";':"","google_bpp=",g>r?g-r:1,";google_async_rrc=0;</",d,">",db(),"</body></html>"].join("");(a.document.getElementById(h)?ab:bb)(eb(a,h,d,!0))}});})();
