<template>
  <div class="carousel-wrapper">
    <div class="header">
      <div class="header-top">
        <div class="svg" @click="goback">
          <svg class="icon icon-back" aria-hidden="false">
            <use xlink:href="#icon-zuoyoujiantou"></use>
          </svg>
        </div>
        企业日报
      </div>
      <date-picker v-if="ready" v-on:childEvent="prosDate"></date-picker>
    </div>
    <div class="carousel-wrapper" v-show="!mask">
      <div class="carousel-content">
        <div class="punch-before"></div>
        <div class="punch">
            <div class="slide-item">
              <div class="top-container" v-if="isToday">
                <div class="slide-title">今日考勤</div>
                <canvas :width="canvasConfig.width" :height="canvasConfig.height" id="current-canvas" class="canvas"></canvas>
                <div class="canvas-text-2">
                  <p class="canvas-num"><span class="sign-num">{{canvasConfig.sign}}</span><span class="total-num">/{{canvasConfig.total}}</span></p>
                  <p class="canvas-title">打卡人数</p>
                </div>
              </div>
              <div class="top-container" v-else>
                <div class="slide-title">考勤</div>
                <div class="top-content">
                  <canvas :width="canvasConfig.width" :height="canvasConfig.height" id="last-canvas" class="canvas"></canvas>
                  <div class="canvas-text">
                    <p class="canvas-num"><span class="sign-num">{{canvasConfig.sign}}</span><span class="total-num">/{{canvasConfig.total}}</span></p>
                    <p class="canvas-title">打卡人数</p>
                  </div>
                  <div class="details-container">
                    <router-link :to="{path:'/latelist',query:{date:this.date,ms:this.ms}}" tag="div" class="details-item details-late">
                      <div class="details-number">{{info.late}}</div>
                      <div class="details-title">迟到</div>
                    </router-link>
                    <router-link :to="{path:'/overtimelist',query:{date:this.date,ms:this.ms}}" tag="div" class="details-item details-overtime">
                      <div class="details-number">{{info.overtime}}</div>
                      <div class="details-title">加班</div>
                    </router-link>
                    <router-link :to="{path:'/notclocking',query:{date:this.date,ms:this.ms}}" tag="div" class="details-item details-not-clocking">
                      <div class="details-number">{{info.noSign}}</div>
                      <div class="details-title">未打卡</div>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="bottom-container">
                <div class="slide-title flex-between">
                  <div v-if="isToday">今日早到榜</div>
                  <div v-else>早到榜</div>
                  <router-link :to="{path:'/earlylist',query:{date:this.date,ms:this.ms}}" tag="div" class="link-more">
                    <span>更多</span>
                    <svg class="icon" aria-hidden="false">
                      <use xlink:href="#icon-zuoyoujiantou"></use>
                    </svg>
                  </router-link>
                </div>
                <div class="bottom-content">
                  <div class="content-item user" v-for="(item,index) in earlylist" :key="index">
                    <div class="user-avatar">
                      <img :src="item.image" v-if="item.image">
                      <img src="../../../assets/avatar.png" v-else>
                    </div>
                    <div class="user-name">{{item.userName}}</div>
                    <div class="user-department">{{item.officeName}}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="punch-after"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const TopHeader = () => import("../../../components/topheader.vue");
  const DatePicker = () => import("../../../components/DatePicker.vue");
  const Loading = () => import("../../../components/loading.vue");
  import { Carousel3d, Slide } from 'vue-carousel-3d';

  let w = document.body.clientWidth;
  function DateFormat(date) { //封装一个方法点击左右 改变头部那个时间的显示
    let now = new Date(date);
    let num = now.getDay();
    let obj = {0: "天", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六"};
    let dateObj = {};
    dateObj.year = now.getFullYear();
    dateObj.month = now.getMonth() + 1;
    dateObj.date = (now.getMonth() + 1) + "月" + now.getDate() + "日";
    dateObj.day = "星期" + obj[num];
    return dateObj;
  }
  export default{
    name: "Carousel",
    components:{
      TopHeader,
      DatePicker,
      Carousel3d,
      Slide,
      Loading
    },
    data(){
      return{
        carouselConfig:{
          width: 300,
          height: 395,
          space: 390,
        },
        canvasConfig:{
          width: parseInt(150*(w/375)),
          height: parseInt(150*(w/375)),
          radius: parseInt(55*(w/375)),
          lineWidth: parseInt(5*(w/375)),
          fontSize: parseInt(16*(w/375)),
          total: 0,
          sign: 0
        },
        mask: false,
        earlylist:[],
        info:{
          early: 0,
          late: 0,
          overtime: 0,
          noSign: 0,
        },
        isToday: false,
        date: "",
        ms: 0,
        ready: false,
      }
    },
    methods:{
      prosDate(ms,mask){
        console.log("prosDate mask",mask);
        this.mask = mask;
        let day = ["天","一","二","三","四","五","六"];
        if(ms){
          let obj = new Date(ms);
          let date = obj.getFullYear()+"-"+parseInt(obj.getMonth()+1)+"-"+obj.getDate();
          this.ms = ms;
          this.date = parseInt(obj.getMonth()+1)+"月"+obj.getDate()+"日"+" 星期"+ day[obj.getDay()];
          console.log(date);
          /*请求考勤数据*/
          this.getData(date);
        }
      },
      /*考勤率*/
      canvas(obj,config){
        let ctx = obj.getContext("2d");
        ctx.lineWidth = config.lineWidth;
        /*底图圆形*/
        ctx.beginPath();
        ctx.clearRect(0,0,config.width,config.height);
        ctx.arc(parseInt(config.width/2),parseInt(config.height/2),config.radius,0,2*Math.PI);
        ctx.strokeStyle = "#ebebeb";
        ctx.stroke();
        /*百分率圆形*/
        if(config.sign>0){
          ctx.beginPath();
          ctx.arc(parseInt(config.width/2),parseInt(config.height/2),config.radius,1.5*Math.PI,(config.sign/config.total)*2*Math.PI-0.5*Math.PI);
          ctx.strokeStyle = "#609ef7";
          ctx.stroke();
        }
      },
      /*适配*/
      adapter(){
        let w = window.screen.availWidth;
        if(w>375){
          this.carouselConfig = {
            width: 331,
            height: 430,
            space: 420
          };
        }else if(w<325){
          this.carouselConfig = {
            width: 256,
            height: 337,
            space: 332
          };
        }
      },
      /*考勤数据*/
      getData(date){
        let vm = this;
        this.axios.get(this.Service.daily+"?checkDate="+date).then(res =>{
          console.log("考勤数据",res);
          if(res.data.h.code === 200){
            let obj = res.data.b;
            vm.earlylist = obj.date;
            vm.info.late = obj.lateCount;
            vm.info.early = obj.earlyCount;
            vm.info.overtime = obj.overtimeCount;
            vm.info.noSign = obj.noSignCount;
            vm.canvasConfig.total = obj.checkCount;
            vm.canvasConfig.sign = obj.signCount;
            vm.isToday = (obj.isToday == 0)?false:true;
            setTimeout(() =>{
              vm.canvas(document.querySelector("canvas"),vm.canvasConfig);
            },100);
          }else{
            vm.canvas(document.querySelector("canvas"),vm.canvasConfig);
            vm.$toast("网络请求超时");
            vm.isToday = false;
          }
          this.mask = false;
        }).catch(err =>{
          vm.$toast("网络请求超时");
        });
      },
      /*返回*/
      goback(){
        window.location.href = "epipe://?&mark=history_back";
      }
    },
    created(){
      if(sessionStorage.getItem("ms")){
        let ms = parseInt(sessionStorage.getItem("ms"));
        this.dateObj = DateFormat(ms);
        this.ms = ms;
        this.currentDate = {
          year: new Date(ms).getFullYear(),
          month: new Date(ms).getMonth() + 1,
          day: new Date(ms).getDate()
        };
      }else{
        this.dateObj = DateFormat(new Date());
        this.ms = new Date().getTime();
        this.currentDate = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        };
      }
//      this.$emit("childEvent",this.ms,false);
    },
    mounted(){
      this.adapter();
      setTimeout(() =>{
        this.ready = true;
      },100)
    },
  }
</script>

<style lang="stylus" scoped>
  .header{
    position fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #609EF7;
  }
  .header-top{
    width:100%;
    height: 0.44rem;
    text-align center;
    line-height:0.44rem;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    color: white;
    .icon-back{
      font-size: 0.17rem;
      margin-left: -0.2rem;
      color: white;
    }
    .svg{
      position absolute;
      left 0;
      top 0;
      width 0.58rem;
    }
  }
  .carousel-wrapper{
    position: fixed;
    width: 100%;
    left: 0;
    top: 1.25rem;
  }
  .carousel-3d-container{
    margin: 0 auto !important;
  }
  .carousel-3d-slide{
    background: white !important;
    border-radius 0.05rem;
    box-shadow 0 0 20px rgba(95,157,247,0.2);
  }
  .slide-item{
    padding: 0 0.15rem;
  }
  .slide-title{
    height 0.44rem;
    line-height 0.44rem;
    font-size 0.17rem;
    color #333;
    text-align left;
    border-bottom 1px solid #ebebeb;
  }
  #current-canvas{
    display block;
    margin 0 auto;
  }
  #last-canvas{
    float left;
    margin-left -0.15rem;
  }
  .flex-between{
    display flex;
    justify-content space-between;
  }
  .link-more{
    font-size: 0;
    color: #999;
    span{
      font-size: 0.15rem;
    }
    .icon{
      font-size: 0.15rem;
      transform: rotate(180deg);
    }
  }
  .bottom-content{
    padding-top 0.25rem;
    display flex;
    justify-content space-around;
  }
  .user-avatar{
    width: 0.44rem;
    height: 0.44rem;
    margin 0 auto;
    border-radius: 50%;
    img{
      width: 100%;
      height: 100%;
      border-radius 50%;
    }
  }
  .user-name{
    text-align center;
    font-size: 0.14rem;
    color: #333;
  }
  .user-department{
    max-width: 6em;
    text-align center;
    font-size: 0.12rem;
    color: #666;
  }
  .details-container{
    display flex;
    flex-wrap wrap;
    align-items center;
    width 1.45rem;
  }
  .top-content{
    position relative;
    overflow hidden;
  }
  .details-container{
    float right;
    margin-right -0.15rem;
    padding: 0.25rem 0;
  }
  .details-item{
    width 50%;
    height 0.55rem;
    text-align center;
  }
  .details-number{
    margin: 0.05rem 0;
    font-size 0.17rem;
  }
  .details-title{
    font-size 0.14rem;
    color #333;
  }
  .details-late .details-number{
    color: #FF8800;
  }
  .details-leave .details-number{
    color: #FFB662;
  }
  .details-overtime .details-number{
    color: #609FF7;
  }
  .details-not-clocking .details-number{
    color: #F4706C;
  }
  .canvas-text{
    box-sizing border-box;
    position: absolute;
    left:-0.15rem;
    top:0;
    width:1.5rem;
    height:1.5rem;
    padding 0.57rem 0;
  }
  .canvas-text-2{
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0.44rem;
    margin: auto;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0.57rem 0;
  }
  .canvas-num{
    font-size 0.16rem;
  }
  .canvas-title{
    font-size: 0.12rem;
    color #666;
  }
  .sign-num{
    color: #0fc37c;
  }
  .total-num{
    color: #999;
  }
  .top-container{
    position relative;
  }

  .carousel-content{
    overflow: hidden;
    width: 100%;
    height: 3.95rem;
    text-align center;
    .punch{
      box-sizing border-box;
      display inline-block;
      width: 3.1rem;
      height: 3.95rem;
      margin 0 auto;
      background: white;
      border-radius: 0.05rem;
    }
    .punch-before,.punch-after{
      width: 0.15rem;
      height: 3.45rem;
      margin-top 0.58rem;
      background: white;
    }
    .punch-before{
      float: left;
    }
    .punch-after{
      float: right;
    }
  }

  .date-picker{
    padding-bottom: 0.5rem;
  }
  .date-header{
    display flex;
    justify-content space-around;
    align-items center;
    width 3rem;
    height 0.87rem;
    margin 0 auto;
  }
  .current-date{
    display flex;
    justify-content center;
    align-items center;
    font-size 0.17rem;
    color white;
    .date{
      margin-right 0.36rem;
    }
  }
  .icon{
    width: 0.15rem;
    height: 0.15rem;
    color: #999;
  }
  .arrow{
    z-index 9;
    cursor pointer;
  }
  .arrow-left{
    margin-right 0.46rem;
  }
  .arrow-right{
    transform: rotate(180deg);
  }
  .date-content{
    position: fixed;
    top: 1.11rem;
    left: 0;
    height: 100%;
    background: rgba(44,44,44,0.3);
  }
  .date-info{
    height 0.47rem;
    padding 0 0.15rem;
    line-height 0.47rem;
    font-size 0.17rem;
    color #333;
    background white;
  }
  .flex-between{
    display flex;
    justify-content space-between;
  }
  .date-days{
    height 0.34rem;
    line-height 0.34rem;
    font-size 0.14rem;
    color #666;
    background white;
    border-bottom 1px solid #ebebeb;
  }
  .day-item{
    width: 14.28%;
    text-align center;
  }
  .day-list{
    padding-top: 0.1rem;
    padding-bottom: 0.3rem;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    flex-wrap: wrap;
    word-wrap: break-word;
    word-break: break-all;
    width: 100%;
    background white;
    box-shadow 0 5px 10px rgba(0,0,0,0.15);
  }
  .list-item{
    z-index 9;
    width: 14.28%;
    height: 0.34rem;
    line-height 0.34rem;
    text-align center;
  }
  .active{
    width: 0.34rem;
    height: 0.34rem;
    margin: 0 auto;
    border-radius: 50%;
    background: #609ef7;
    box-shadow: 0 0 10px rgba(96,158,247,1);
    color: white;
  }
</style>
