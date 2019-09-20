export const baseURL = {
	//mall: "http://192.168.3.177/epmall-front",  //梁焱升本地
	//mall: "http://192.168.3.209/epmall-front",  //刘春祥本地
	//mall: "http://192.168.3.167:8888",          //2c 测试环境
	// mall: "http://192.168.3.167",               //2b 测试环境
	// mall: "https://mall.epipe.cn",              //2c 正式环境
	mall: "https://b2b.epipe.cn",              //2b 正式环境
	//mall: window.location.href.indexOf("b2b.epipe.cn") > 0 ? "https://b2b.epipe.cn" : "https://mall.epipe.cn"                 //正式环境
	//mall: window.location.href.indexOf("192.168.3.167:8888") > 0 ? "http://192.168.3.167:8888" : "http://192.168.3.167"     //测试环境
}
export const mallType = {
	type:'2b'
	//type: "2c"
	//type: window.location.href.indexOf("b2b.epipe.cn") > 0 ? "2b" : "2c"                //正式环境
	//type: window.location.href.indexOf("192.168.3.167:8888") > 0 ? "2c" : "2b"        //测试环境
}


export const mallToken = {
  setToken: function(token){
    localStorage.setItem("mallLoginToken",token);
    console.log("设置成功");
  },
  getToken: function(){
    const token = localStorage.getItem("mallLoginToken");
    if(!isApp.state){
	    return token;
    }else{
			// return this.getCookie("auth_token") +'=app';
			return this.getCookie('auth_token') +'=app';
    }
	},
	getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
};
export const isApp = {
	state: ''
};
export const browser = {
	versions: function () {
		var u = navigator.userAgent, app = navigator.appVersion;
		return {         //移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
	var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
	if (ua.match(/MicroMessenger/i) == "micromessenger" ) {
		//在微信中打开  || 在IOS浏览器打开  ||  在安卓浏览器打开
		isApp.state=false;
	}else{
		isApp.state=true;
	}
} else {
	//否则就是PC浏览器打开
	isApp.state=false;
}

