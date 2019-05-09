<template>
  <footer class="footer-tab">
    <router-link to="mallhome" tag="div" class="footer-tab-item" :class="{'tab-active': category===0}">
      <div class="icon-container">
        <i class="iconfont" :class="category===0 ? 'icon-shouye-xuanzhongicon':'icon-shouyeicon'"></i>
      </div>
      <p class="tab-title">首页</p>
    </router-link>
    <router-link to="goodsclassification" tag="div" class="footer-tab-item" :class="{'tab-active': category===1}">
      <div class="icon-container">
        <i class="iconfont" :class="category===1 ? 'icon-fenlei-xuanzhongicon':'icon-fenleiicon'"></i>
      </div>
      <p class="tab-title">分类</p>
    </router-link>
    <!--<router-link v-if="this.mallType.type === '2b' " to="inquirylist" tag="div" class="footer-tab-item" :class="{'tab-active': category===4}">-->
      <!--<div class="icon-container">-->
        <!--<i class="iconfont icon-car" :class="category===4 ? 'icon-xunjiadan':'icon-xunjiadan-weixuanzhong'">-->
          <!--<div class="goods-number" v-if="inquiryGoodsNum>0">{{inquiryGoodsNum}}</div>-->
        <!--</i>-->
      <!--</div>-->
      <!--<p class="tab-title">待询价单</p>`-->
    <!--</router-link>-->
    <router-link to="shoplist" tag="div" class="footer-tab-item" :class="{'tab-active': category===2}">
      <div class="icon-container">
        <i class="iconfont icon-car" :class="category===2 ? 'icon-gouwuche-xuanzhongicon':'icon-gouwucheicon'">
          <div class="goods-number" v-if="goodsNum>0">{{goodsNum}}</div>
        </i>
      </div>
      <p class="tab-title">购物车</p>
    </router-link>
    <router-link to="malluser" tag="div" class="footer-tab-item" :class="{'tab-active': category===3}">
      <div class="icon-container">
        <i class="iconfont" :class="category===3 ? 'icon-gerenzhongxin-xuanzhongicon':'icon-gerenzhongxinicon'"></i>
      </div>
      <p class="tab-title">个人中心</p>
    </router-link>
  </footer>
</template>

<script>
  export default{
    name: 'FooterTab',
    props:["category"],
    data(){
      return{
        goodsNum: 0,
	      inquiryGoodsNum: 0
      }
    },
    methods:{
      getGoodsNumber(){
        this.axios.post(this.baseURL.mall + '/m/cart/myCartGoodsNum' + this.Service.queryString({
          token: this.mallToken.getToken()
        })).then(res =>{
          if(res.data.h.code === 200){
            this.goodsNum = res.data.b.goodsNum;
          }
        })
      },
	    getInquiryGoodsNumber(){
		    this.axios.post(this.baseURL.mall + '/m/cart/myInquiryNum' + this.Service.queryString({
			    token: this.mallToken.getToken()
		    })).then(res =>{
			    if(res.data.h.code === 200){
				    this.inquiryGoodsNum = res.data.b.myInquiryNum;
			    }
		    })
	    }
    },
    created(){
	    if(this.mallType.type === '2c'){
		    this.getGoodsNumber();
      }
      if(this.mallType.type === '2b'){
	      this.getInquiryGoodsNumber();
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .footer-tab{
    display flex;
    z-index 99;
    position fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 49px;
    background: white;

  }
  .footer-tab::before{
    content: "";
    position absolute;
    left 0;
    top 0;
    width 100%;
    height: 1px;
    background #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .footer-tab-item{
    flex: 1;
    padding: 6px 0;
    text-align center;
  }
  .iconfont{
    font-size: 22px;
    color: #999;
  }
  .tab-title{
    font-size: 11px;
    color: #999;
  }
  .tab-active{
    .iconfont{
      color: #FF8800;
    }
    .tab-title{
      color: #FF8800;
    }
  }
  .icon-car{
    position relative;
    .goods-number{
      position absolute;
      left 0;
      top 0;
      width 13px;
      height: 10px;
      border-radius 5px;
      text-align center;
      line-height 10px;
      font-size 7px;
      background #e54545;
      color: white;
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .footer-tab{
      padding-bottom 34px;
    }
  }
</style>
