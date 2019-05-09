<template>
  <div class="carousel-wrapper">
    <div class="header">
      <top-header title="企业日报"></top-header>
      <date-picker v-on:childEvent="prosDate"></date-picker>
    </div>
    <div class="carousel-wrapper" v-show="!mask">
      <div class="carousel-content">
        <div class="punch-before"></div>
        <div class="punch">
            <div class="slide-item">
              <div class="top-container" v-if="false">
                <div class="slide-title">今日考勤</div>
                <canvas :width="canvasConfig.width" :height="canvasConfig.height" id="current-canvas" class="canvas"></canvas>
              </div>
              <div class="top-container" v-else>
                <div class="slide-title">今日考勤</div>
                <div class="top-content">
                  <canvas :width="canvasConfig.width" :height="canvasConfig.height" id="last-canvas" class="canvas"></canvas>
                  <div class="details-container">
                    <div class="details-item details-late">
                      <div class="details-number">3</div>
                      <div class="details-title">迟到</div>
                    </div>
                    <div class="details-item details-leave">
                      <div class="details-number">3</div>
                      <div class="details-title">早退</div>
                    </div>
                    <div class="details-item details-overtime">
                      <div class="details-number">3</div>
                      <div class="details-title">加班</div>
                    </div>
                    <div class="details-item details-not-clocking">
                      <div class="details-number">3</div>
                      <div class="details-title">未打卡</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-container">
                <div class="slide-title flex-between">
                  <div>今日早到榜</div>
                  <router-link to="/earlylist" tag="div" class="link-more">
                    <span>更多</span>
                    <svg class="icon" aria-hidden="false">
                      <use xlink:href="#icon-zuoyoujiantou"></use>
                    </svg>
                  </router-link>
                </div>
                <div class="bottom-content">
                  <div class="content-item user">
                    <div class="user-avatar"></div>
                    <div class="user-name">哈哈哈</div>
                    <div class="user-department">产品部</div>
                  </div>
                  <div class="content-item user">
                    <div class="user-avatar"></div>
                    <div class="user-name">哈哈哈</div>
                    <div class="user-department">产品部</div>
                  </div>
                  <div class="content-item user">
                    <div class="user-avatar"></div>
                    <div class="user-name">哈哈哈</div>
                    <div class="user-department">产品部</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="punch-after"></div>
      </div>
      <!--<carousel-3d-->
        <!--:autoplay="false"-->
        <!--:space="carouselConfig.space"-->
        <!--:width="carouselConfig.width"-->
        <!--:height="carouselConfig.height"-->
        <!--:clickable="false"-->
        <!--:display="3"-->
        <!--:border="0"-->
        <!--:perspective="0"-->
      <!--&gt;-->
        <!--<slide :index="0">-->
          <!--<div class="slide-item">-->
            <!--<div class="slide-title">今日考勤</div>-->
            <!--<canvas :width="canvasConfig.width" :height="canvasConfig.height" id="current-canvas" class="canvas"></canvas>-->
            <!--<div class="bottom-container">-->
              <!--<div class="slide-title flex-between">-->
                <!--<div>今日早到榜</div>-->
                <!--<router-link to="/earlylist" tag="div" class="link-more">-->
                  <!--<span>更多</span>-->
                  <!--<svg class="icon" aria-hidden="false">-->
                    <!--<use xlink:href="#icon-zuoyoujiantou"></use>-->
                  <!--</svg>-->
                <!--</router-link>-->
              <!--</div>-->
              <!--<div class="bottom-content">-->
                <!--<div class="content-item user">-->
                  <!--<div class="user-avatar"></div>-->
                  <!--<div class="user-name">哈哈哈</div>-->
                  <!--<div class="user-department">产品部</div>-->
                <!--</div>-->
                <!--<div class="content-item user">-->
                  <!--<div class="user-avatar"></div>-->
                  <!--<div class="user-name">哈哈哈</div>-->
                  <!--<div class="user-department">产品部</div>-->
                <!--</div>-->
                <!--<div class="content-item user">-->
                  <!--<div class="user-avatar"></div>-->
                  <!--<div class="user-name">哈哈哈</div>-->
                  <!--<div class="user-department">产品部</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</slide>-->
      <!--</carousel-3d>-->
    </div>
  </div>
</template>

<script>
  import TopHeader from "../../../components/topheader.vue"
  import DatePicker from "../../../components/DatePicker.vue"
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  export default{
    name: "Carousel",
    components:{
      TopHeader,
      DatePicker,
      Carousel3d,
      Slide
    },
    data(){
      return{
        carouselConfig:{
          width: 300,
          height: 395,
          space: 390,
        },
        canvasConfig:{
          width: 150,
          height: 150,
          radius: 55,
          lineWidth: 5,
          fontSize: 16
        },
        mask: false,
      }
    },
    methods:{
      prosDate(ms,mask){
        this.mask = mask;
        if(ms){
          let obj = new Date(ms);
          let date = obj.getFullYear()+"-"+parseInt(obj.getMonth()+1)+"-"+obj.getDate();
          console.log(date);
          /*请求考勤数据*/
          this.getDate(date);
        }
      },
      /*考勤率*/
      canvas(obj,config){
        let ctx = obj.getContext("2d");
        ctx.lineWidth = config.lineWidth;
        /*底图圆形*/
        ctx.beginPath();
        ctx.arc(parseInt(config.width/2),parseInt(config.height/2),config.radius,0,2*Math.PI);
        ctx.strokeStyle = "#ebebeb";
        ctx.stroke();
        /*百分率圆形*/
        ctx.beginPath();
        ctx.arc(parseInt(config.width/2),parseInt(config.height/2),config.radius,1.5*Math.PI,1.3*Math.PI);
        ctx.strokeStyle = "#609ef7";
        ctx.stroke();
        /*文字*/
        ctx.font = config.fontSize + 'px message-box';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0fc37c';
        ctx.fillText('109/123',parseInt(config.width/2),parseInt(config.height/2));

        ctx.font = config.fontSize*0.81 + 'px message-box';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.fillText('打卡人数',parseInt(config.width/2),parseInt(config.height/2)+config.fontSize*1.2);
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
        let canvasConfig = {
          width: parseInt(150*(w/375)),
          height: parseInt(150*(w/375)),
          radius: parseInt(55*(w/375)),
          lineWidth: parseInt(5*(w/375)),
          fontSize: parseInt(16*(w/375))
        };
        this.canvas(document.querySelector("canvas"),canvasConfig);
      },
      /*考勤数据*/
      getDate(date){
        this.axios.get(this.Service.daily+"?checkDate=2017-11-10").then(res =>{
          console.log(res);
        })
      },
    },
    mounted(){
      this.adapter();
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
    border-radius: 50%;
    border: 1px solid green;
  }
  .user-name{
    text-align center;
    font-size: 0.14rem;
    color: #333;
  }
  .user-department{
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

  .carousel-content{
    overflow: hidden;
    width: 100%;
    height: 3.95rem;
    text-align center;
    .punch{
      box-sizing border-box;
      display inline-block;
      width: 3rem;
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
</style>
