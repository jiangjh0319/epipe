/**
 * Created by ZWH on 2017/9/4.
 */
import Vue from "vue";
Vue.config.productionTip = false; //生产模式
Vue.config.silent = true; //去除警告

Vue.filter("img_format", function (value) {  //展会
  return value + "?imageslim&imageView2/1/w/690/h/360";
});

Vue.filter("news_format", function (value) {  //首页
  return value + "?imageslim&imageView2/1/w/268/h/160";
});

Vue.filter("man_photo_format", function (value) {  //头像
  return value + "?imageslim&imageView2/1/w/50/h/50";
});

Vue.filter("journal_img", function (value) {  //上传照片
  return value + "?imageslim&imageView2/1/w/70/h/55";
});

Vue.filter("home_time_format", function (value) {  //首页头条那边时间戳转换成日期
  return new Date(value).getFullYear() + '-' + (new Date(value).getMonth() + 1) + '-' + new Date(value).getDate()
});

Vue.filter("escape2Html", function (str) {  //解码html标签
  if(str) return;
  var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_'};
  return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash);/ig,function(all,t){
    return arrEntities[t]});
});

Vue.filter("timeSlice", function (value) {  //时间截取后三位 （秒）
  return value.slice(0,-3)
});

Vue.filter("timeSlice9", function (value) {  //时间截取后三位 （秒）
  return value.slice(0,-9)
});