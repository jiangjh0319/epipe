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

Vue.filter("oa_details_status", function (value) { 
    if(value == '1'){
        return '已同意'
    }else if(value =='0'){
        return '已拒绝'
    }else if(value=='2'){
        return '已撤销'
    }else if(value =='5'){
        return '已退回'
    }else if(value == '6'){
        return '已评论'
    }
});

Vue.filter("escape2Html", function (str) {  //解码html标签
  if(str) return;
  var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'"','rdquo':'"','mdash':'_'};
  return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash);/ig,function(all,t){
    return arrEntities[t]});
});

Vue.filter("timeSlice", function (value) {  //时间截取后三位 （秒）
  value+=''
  return value.slice(0,-3)
});

Vue.filter("timeSlice9", function (value) {  //时间截取后9位 （秒）
  value+=''
  return value.slice(0,-9)
});

Vue.filter("awaits", function (value) {  //时间截取后9位 （秒）
  let str = '';
  if(value.linkType==4){
      str='或签'
  }else if(value.linkType==3){
      str='会签'
  }
  return  str+'审批'
});