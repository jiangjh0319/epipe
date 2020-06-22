/**
 * Created by JJH on 2017/9/27.
 */
import axios from "axios";
/*配置axios的默认*/
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;


const dev = 'http://192.168.3.166:8280/member/v3'; //测试
// const dev = 'http://192.168.3.170:8079/member/v3'; // 习节祥
// const dev = 'http://192.168.3.40:8081/member/v1'; //
// const dev = 'http://192.168.3.249:8079/member/v1'; //本地测试
// const dev = 'http://192.168.3.241:8882/member/v1'; //自动化测试 
// const dev = 'http://192.168.3.185:8080/member/v3'; //伊旗 
// const product = 'https://apps.epipe.cn/member/v3';//正式环境
const product = "http://21874u8g05.iask.in:19054/member/v1"; //正式
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
          // config.headers.auth_token = "17ca2932-2674-4cb5-a557-a894923cd4b3"
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
