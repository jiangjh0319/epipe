<template>
  <div class="floor">
    <div class="floor-title">
      <img :src="imgPrefix + floorObj.floorTitleImg" alt="">
    </div>
    <div class="floor-4-view">
      <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="item" v-for="(item,index) in floorObj.floorGoods" v-if="index!=1" :key="index">
        <div class="item-content">
          <div class="item-img">
            <img :src="imgPrefix + item.goodsImage" alt="">
          </div>
          <div class="item-title">{{item.goodsName}}</div>
          <div class="item-sub">
            <div class="item-price" v-if="item.priceNegotiable == 0">￥{{item.goodsStorePrice}}
              <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
              <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
              <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
            </div>
            <div class="item-price" v-if="item.priceNegotiable == 1">待询价</div>
            <div class="buy">
              <svg class="icon icon-car" aria-hidden="false">
                <use xlink:href="#icon-gouwuche-xuanzhongicon"></use>
              </svg>
            </div>
          </div>
        </div>
      </router-link>
      <div class="item" v-else>
        <div class="item-menu">
          <router-link :to="{path:'/mallsearch',query:{key: item}}" class="menu-tab" v-for="(item,index) in floorObj.floorKeywords" :key="index">{{item}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "FloorModel4",
    props: ["floorObj","imgPrefix"],
  }
</script>
<style lang="stylus" scoped>
  .floor{
    overflow-x hidden;
    width 3.45rem;
  }
  .floor-title{
    width 100%;
    height: 0.6rem;
    img{
      width 100%;
      max-height 100%;
    }
  }
  .floor-banner{
    width 3.45rem;
    height 0.95rem;
    border-radius 0.08rem;
    background: white;
    .swiper-container{
      height inherit;
    }
  }
  .floor-4-view{
    display: flex;
    justify-content space-between;
    flex-wrap wrap;
    .item{
      width: 1.675rem;
      height: 2.45rem;
      margin-bottom 0.1rem;
    }
    .item-content{
      box-sizing border-box;
      width: inherit;
      height inherit;
      padding: 0.15rem 0.14rem 0.16rem 0.14rem;
      background: white;
    }
    .item-img{
      width: 1.4rem;
      height: 1.4rem;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-title{
      margin-top: .16rem;
      font-size: .14rem;
      color: #666;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height .18rem;
    }
    .item-sub{
      display flex;
      justify-content space-between;
      margin-top .1rem;
    }
    .item-price{
      font-size 0.16rem;
      color: #333;
      position relative;
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
        top .02rem;
        right -0.28rem;
      }
    }
    .item-menu{
      display flex;
      justify-content space-between;
      flex-wrap wrap;
      width: inherit;
      height inherit;
    }
    .menu-tab{
      width: 0.79rem;
      height: 0.53rem;
      margin-bottom 0.105rem;
      font-size 0.12rem;
      color #666;
      text-align center;
      line-height 0.53rem;
      background: white;
      border-radius 0.02rem;
    }
  }
</style>
