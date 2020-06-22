// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router/router";
import store from "./store/index.js"; //vuex
import "./js/rem";
import "./js/filter"; //过滤器
import "./js/http"; //axios请求配置
import "./assets/iconfont"; //字体图标库
import "./style/reset.styl";
import "./style/style.styl";


// 引入服务
import Service from "./js/Service";
Vue.prototype.Service = Service;
//  数据交互
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
// 引用封装的插件
import Util from "./js/Util";
Vue.prototype.Util = Util;
//引入echarts以及封装的echarts方法库
import echartsLib from "./js/echartsLib";
Vue.prototype.echartsLib = echartsLib;

//引入mes封装方法
import MES from "./js/MES";
Vue.prototype.$mes = MES;

//引入http请求配置
import {baseURL,mallToken,isApp,mallType} from "./js/IPconfig";
Vue.prototype.baseURL = baseURL;
Vue.prototype.mallToken = mallToken;
Vue.prototype.isApp = isApp;
Vue.prototype.mallType = mallType;


//  提示框
import {Alert, Confirm, Prompt, Toast} from "wc-messagebox";
import "wc-messagebox/style.css";
import wcSwiper from 'wc-swiper';//轮播图
import "wc-swiper/style.css";//轮播图样式
Vue.use(Confirm);
Vue.use(Toast);
Vue.use(Alert);
Vue.use(wcSwiper);


import Vant from 'vant'
import 'vant/lib/index.css';
Vue.use(Vant)
// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)


import 'vant/lib/index.css';
import {Col, Row,Collapse,CollapseItem,Button ,Popup,Tabbar,TabbarItem,RadioGroup,Radio,Picker,Progress,Search,ActionSheet,Tab,Tabs,Dialog,Field,PullRefresh,List,Loading,Step, Steps,Cell, CellGroup,DatetimePicker,Checkbox, CheckboxGroup,Divider,Icon,Uploader,Overlay,Swipe, SwipeItem,NavBar,Grid,GridItem    } from 'vant';
Vue.use(Collapse).use(Col).use(Row).use(CollapseItem).use(Tabbar).use(Button ).use(TabbarItem).use(Popup).use(RadioGroup).use(Radio).use(Picker).use(Progress).use(Search).use(ActionSheet).use(Tab).use(Tabs).use(Dialog).use(Field).use(PullRefresh).use(List).use(Loading).use(Grid).use(GridItem)
.use(Step).use(Steps).use(Cell).use(CellGroup).use(DatetimePicker).use(Checkbox).use(CheckboxGroup).use(Divider).use(Icon).use(Uploader).use(Overlay).use(Swipe).use(SwipeItem).use(NavBar);  


//日历插件
import Calendar from 'vue-mobile-calendar'
Vue.use(Calendar);

import FastClick from 'fastclick';
FastClick.attach(document.body)

window.eventBus = new Vue();
/* eslint-disable no-new */


new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {App}
});

