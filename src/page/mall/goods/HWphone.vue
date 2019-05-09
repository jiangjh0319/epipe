<template>
  <div class="hw-phoen">
    <div class="welfare-purchase"><img src="./HWphoneImg/01.png" alt="福利内购" class="welfare-purchase-img"></div>
    <div class="one-purchase" v-for="item in welfareList" :key="item.goodsId">
      <router-link :to="{path:'/GoodsDetail',query:{goodsId:item.goodsId}}">
        <div class="one-purchase-bg">
          <div class="one-purchase-l">
            <div class="one-purchase-lt">{{item.goodsName}}</div>
            <div class="one-purchase-lb">{{item.goodsStorePrice}}</div>
          </div>
          <div class="one-purchase-r"><img :src="item.goodsImage" :alt="item.goodsName"></div>
        </div>
      </router-link>
    </div>
    <div class="break-lowprice"><img src="./HWphoneImg/03.png" alt="突破底价"></div>
    <div class="lowprice-goods" v-for="(obj,index1) in lowpriceList" :key="index1">
      <div v-for="(oneObj,index2) in obj" :key="oneObj.goodsId" class="one-good" :class="index2 == 0 ? 'one-good-l' : 'one-good-r'">
        <router-link :to="{path:'/GoodsDetail',query:{goodsId:oneObj.goodsId}}">
          <div class="good-pic"><img :src="oneObj.goodsImage" :alt="oneObj.goodsName"></div>
          <div class="good-desc">{{oneObj.goodsName}}</div>
          <div class="good-price">{{oneObj.goodsStorePrice}}</div>
        </router-link>
      </div>
    </div>
    <div class="back-home">
      <!--<router-link :to="{path:'/mallhome'}">-->
        <!--<img src="./HWphoneImg/05.png" alt="返回首页">-->
      <!--</router-link>-->
    </div>
  </div>
</template>

<script>
	export default {
		name: 'HWphone',
    data () {
			return {
				welfareList: [],  // 福利内购
        lowpriceList: [],   // 突破底价
      }
    },
    methods: {
			getDataInfo(){
				this.axios.get(this.baseURL.mall + '/m/goods/hwPhones').then(res =>{
					if(res.data.h.code === 200){
						this.welfareList = res.data.b.bigDiscount;
						this.lowpriceList = res.data.b.bottomPrice;
						this.lowpriceList = this.splitArray(this.lowpriceList,2);
          }
				})
      },
	    splitArray(arr, len){
        let a_len = arr.length;
        let result = [];
        for(let i=0;i<a_len;i+=len) {
          result.push(arr.slice(i,i+len));
        }
        return result;
      }
    },
    created () {
      document.title="华为专场";
      this.getDataInfo();
    }
	}
</script>

<style lang="stylus" scoped>
  .welfare-purchase
    font-size 0;
    .welfare-purchase-img
      width 100%;
  .one-purchase
    height 2.28rem;
    background url("./HWphoneImg/00.png") repeat-y;
    overflow hidden;
    .one-purchase-bg
      height 2.2rem;
      margin-top .08rem;
      background url("./HWphoneImg/02.png") no-repeat center;
      background-size 100%;
      .one-purchase-l
        width 1.5rem;
        height 1.25rem;
        float left;
        margin .28rem 0 0 .35rem;
        .one-purchase-lt
          height .88rem;
          font-size .12rem;
          color #fff;
          font-weight bold;
          line-height .23rem;
          overflow hidden;
        .one-purchase-lb
          height .35rem;
          line-height .35rem;
          font-size .23rem;
          color #cd212f;
          font-weight bold;
          display inline-block;
          margin-left .3rem;
      .one-purchase-r
        width 1.25rem;
        height 1.25rem;
        float right;
        margin .28rem .375rem 0 0;
        img
          width 100%;
          height 100%;
  .break-lowprice
    height .65rem;
    background url("./HWphoneImg/00.png") repeat-y;
    img
      width 100%;
      margin-top .15rem;
  .lowprice-goods
    height 2.35rem;
    background url("./HWphoneImg/00.png") repeat-y;
    padding-top .1rem;
    .one-good
      width 1.81rem;
      height 100%;
      background url("./HWphoneImg/04.png") no-repeat center;
      background-size 100%;
      position relative;
      .good-pic
        width 1.2rem;
        height 1.2rem;
        margin 0 auto;
        margin-top .26rem;
        img
          width 100%;
          height 100%;
      .good-desc
        width 1.2rem;
        margin 0 auto;
        font-size .12rem;
        color #fff;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-top .04rem;
      .good-price
        width 1.2rem;
        height .4rem;
        line-height .4rem;
        margin 0 auto;
        position absolute;
        left .305rem;
        bottom 0;
        font-size .16rem;
        color #e4ca89;
        font-weight bold;
        margin-left .25rem;
    .one-good-l
      float left;
    .one-good-r
      float right;
  .back-home
    height .4rem;
    background url("./HWphoneImg/00.png") repeat-y;
    overflow hidden;
    a
      display block;
      width 2.55rem;
      height .3rem;
      margin .25rem auto;
      img
        width 100%;
</style>
