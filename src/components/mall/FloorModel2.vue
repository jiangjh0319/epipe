<template>
  <div class="floor">
    <div class="floor-title">
      <img :src="imgPrefix + floorObj.floorTitleImg" alt="">
    </div>
    <div class="floor-2-view">
      <a :href="item.advUrl" class="item" v-for="(item,index) in floorObj.floorAdvs">
        <div class="item-des">
          <p class="des-title des-title-oneline">{{item.advTitle}}</p>
          <div class="des-sub">{{item.advDescribe}}
            <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
            <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
            <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
          </div>
        </div>
        <div class="item-img">
          <img :src="imgPrefix + item.advImg" alt="">
        </div>
      </a>
    </div>
    <div class="floor-banner">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(slide,index) in floorObj.floorBanners" :key="index">
          <a :href="slide.advUrl" v-if="slide.advUrl">
            <img :src="imgPrefix + slide.advImg" alt="">
          </a>
          <div v-else>
            <img :src="imgPrefix + slide.advImg" alt="">
          </div>
        </swiper-slide>
        <div class="swiper-pagination-2" slot="pagination" v-if="floorObj.floorBanners.length>1"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: "FloorModel2",
    props:["floorObj","imgPrefix"],
    components:{
      swiper,
      swiperSlide,
    },
    data(){
      return{
        searchContainerActive: false,
        showSearch: false,
        swiperOption: {
          autoplay:true,
          pagination: {
            el: '.swiper-pagination-2'
          }
        },
      }
    }
  }
</script>
<style lang="stylus" scoped="true">
  .floor{
    overflow-x hidden;
    width 3.45rem;
  }
  .floor-title{
    width 100%;
    height: 0.6rem;
    line-height 0.6rem;
    img{
      width 100%;
      max-height 100%;
      vertical-align: middle;
    }
  }
  .floor-banner{
    width 3.45rem;
    height: 0.8625rem;
    border-radius 0.08rem;
    background: white;
    .swiper-container{
      height inherit;
    }
  }
  .floor-2-view{
    display flex;
    justify-content space-between;
    flex-wrap wrap;
    width inherit;
    .item{
      width: 1.675rem;
      margin-bottom 0.1rem;
      background: white;
    }
    .item-img{
      width 0.6rem;
      height 0.6rem;
      margin-right 0.05rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-des{
      margin-left 0.12rem;
      line-height 1.27;
      .des-title-oneline{
        overflow hidden;
        text-overflow ellipsis;
        white-space nowrap;
      }
    }
    .des-title{
      margin-bottom 0.1rem;
      font-size 0.14rem;
      font-weight bold;
      color: #333;
      text-align left;
    }
    .des-sub{
      font-size 0.12rem;
      color: #999;
      text-align left;
      position relative;
      display inline-block;
      .promotion-flag{
        width 0.2rem;
        height 0.18rem;
        line-height 0.18rem;
        border-radius 2px;
        text-align  center;
        font-size .11rem;
        background #e54545;
        color #fff;
        position absolute;
        top 0;
        right -0.28rem;
      }
    }
  }
  .floor-2-view .item:nth-child(-n + 4){
    display flex;
    justify-content space-between;
    height: 0.805rem;
    padding-top 0.2rem;
    .item-des{
      max-width 0.88rem;
      .des-title-oneline{
        white-space normal;
      }
    }
  }
  .floor-2-view .item:nth-child(n + 5){
    height: 1.5rem;
    padding-top 0.15rem;
    padding-bottom 0.1rem;
    line-height 1.27;
    .item-img{
      width: 1.05rem;
      height: 1.05rem;
      margin 0 auto;
      margin-top 0.1rem;
    }
    .des-title{
      overflow hidden;
      text-overflow ellipsis;
      white-space nowrap;
    }
  }
  .swiper-slide img{
    width: 100%;
    max-height 100%;
  }
</style>
