/**
 * Created by JJH on 2017/9/27.
 */
import axios from "axios";
/*配置axios的默认*/
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;


// const dev = 'http://192.168.3.166:8280/member/v1'; //测试
const dev = 'http://192.168.3.190:8079/member/v2'; // 习节祥
// const dev = 'http://192.168.3.40:8080/member/v4'; //
// const dev = 'http://192.168.3.40:8081/member/v1'; //本地测试
// const dev = 'http://192.168.3.241:8882/member/v1'; //自动化测试 
const product = 'https://apps.epipe.cn/member/v1';//正式环境
// const product = "http://21874u8g05.iask.in:19054/member/v1"; //正式
axios.defaults.baseURL = window.location.href.indexOf("apps.epipe.cn")>0 ? product : dev;
// axios.defaults.baseURL = product;
    
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)){
    let str = unescape(arr[2]);
    return str;
  }else{
    return null;
  } 
};

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'
console.log(getCookie("auth_token"))

                      
if (getCookie("auth_token")) {
  window.localStorage.setItem("auth_token",getCookie("auth_token"));
}

axios.interceptors.request.use(
  config => {
    if(getCookie("auth_token")){
      if(!config.headers.auth_token){
        config.headers.auth_token = getCookie("auth_token");
      }
      window.localStorage.setItem("auth_token",getCookie("auth_token"));
    }else{
      if(!config.headers.auth_token){
          config.headers.auth_token = window.localStorage.auth_token;
          // config.headers.auth_token = "a8c702f4-97b9-43cf-94b2-8925fbd3eaf9"
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
  
axios.interceptors.response.use(data => {// 如果code是10  就是token过期了
  if (data.data.h.code == 10) {
    window.location.href = "epipe://?&mark=login_out"
  }
  return data
}, error => {
  return Promise.reject(error)
})

export default axios
