<template>
    <section>
        <div>
				<div class="title">
					优管
				</div>
				<div class="back">
					<img src="./../../assets/bg@3x.png" />
				</div>
				
				
				<div class="btn">
					<!--<span style="margin-right: 20px;" onclick="opens(1)">下载“优管APP”</span>-->
					<a  @click="open">打开“优管APP”</a>
				</div>
			</div>
			
			
			<div class="wxtip" id="JweixinTip" v-if="tip" @click="tip=false">
				<span class="wxtip-icon"></span>
				<p class="wxtip-txt">点击右上角<br/>选择在浏览器中打开</p>
			</div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            tip:false,
            title:'0',
        }
    },
    methods:{
        open(){
             var u = navigator.userAgent;
            if(/MicroMessenger/gi.test(u)){
            // 引导用户在浏览器中打开
                this.tip = true;
                // document.getElementById('JweixinTip').style.display = 'block';
            
                return;
            }
            var d = new Date();
            var t0 = d.getTime();
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                //Android
                if(openApp('android://com.huahan.youguang/open')){
                openApp('android://com.huahan.youguang/open');
                }else{
                    //由于打开需要1～2秒，利用这个时间差来处理－－打开app后，返回h5页面会出现页面变成app下载页面，影响用户体验
                    var delay = setInterval(function(){
                        var d = new Date();
                        var t1 = d.getTime();
                        if( t1-t0<3000 && t1-t0>2000){
                            alert('请下载APP');
                            window.location.href = "https://sj.qq.com/myapp/detail.htm?apkName=com.huahan.youguang";
                        }
                        if(t1-t0>=3000){
                            clearInterval(delay);
                        }
                    },1000);
                }
            }else if(u.indexOf('iPhone') > -1){
                    window.location.href = "itms-apps://itunes.apple.com/cn/app/id1261199805?mt=8";
            }
        }
    },
    openApp(src){
        var ifr = document.createElement('iframe');
        ifr.src = src;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function(){
            document.body.removeChild(ifr);
        },2000);
        }
}

// function submitFn(){
//     //判断浏览器
//     var u = navigator.userAgent;
//     if(/MicroMessenger/gi.test(u)){
//        // 引导用户在浏览器中打开
// 		document.getElementById('JweixinTip').style.display = 'block';
       
//         return;
//     }
//     var d = new Date();
//     var t0 = d.getTime();
//     if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
//         //Android
//         if(openApp('android://com.huahan.youguang/open')){
//          openApp('android://com.huahan.youguang/open');
//         }else{
//             //由于打开需要1～2秒，利用这个时间差来处理－－打开app后，返回h5页面会出现页面变成app下载页面，影响用户体验
//             var delay = setInterval(function(){
//                  var d = new Date();
//                  var t1 = d.getTime();
//                  if( t1-t0<3000 && t1-t0>2000){
//                     alert('请下载APP');
//                      window.location.href = "https://sj.qq.com/myapp/detail.htm?apkName=com.huahan.youguang";
//                  }
//                  if(t1-t0>=3000){
//                       clearInterval(delay);
//                  }
//             },1000);
//         }
//     }else if(u.indexOf('iPhone') > -1){
//                     window.location.href = "itms-apps://itunes.apple.com/cn/app/id1261199805?mt=8";
//     }
// }

// function openApp(src) {
// // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
// // 否则打开a标签的href链接
//      var ifr = document.createElement('iframe');
//      ifr.src = src;
//      ifr.style.display = 'none';
//      document.body.appendChild(ifr);
//      window.setTimeout(function(){
//           document.body.removeChild(ifr);
//      },2000);
// }
</script>

<style lang="stylus" scoped>
    section{
				position: relative;
                height:100%;
			}
			
			.wxtip {
				background: rgba(0, 0, 0, 0.8);
				text-align: center;
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 998;
			}
			
			.wxtip-icon {
				width: 0.52rem;
				height: 0.67rem;
				background:url(./../../assets/weixin-tip.png) no-repeat;
				display: block;
				position: absolute;
				right: 0.2rem;
				top: 0.2rem;
			}
			
			.wxtip-txt {
				margin-top: 1.07rem;
				color: #fff;
				font-size: 0.16rem;
				line-height: 1.5;
			}
			
			.back img{
				width: 100%;
			}
				
			.back{
				margin-bottom: 0.35rem;
			}
			
			.title{
				height: 0.4rem;
				line-height: 0.4rem;
				text-align: center;
				color: #fff;
				font-size: 0.18rem;
				background-color: #42a653;
			}
			
			.btn{
				text-align: center;
			}
			
			.btn a{
				
				display: inline-block;
				width: 1.6rem;
				height: 0.5rem;
				text-align: center;
				line-height: 0.5rem;
				color: #fff;
				background-color: #609df6;
				border-radius:0.05rem;
			}
</style>