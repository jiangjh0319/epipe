<template>
  <footer class="store-tab">
    <router-link :to="{path:'/storehome',query:{storeId:nowStoreId}}" tag="div" class="footer-tab-item" :class="{'tab-active': category===0}">
      <p class="tab-title">店铺首页</p>
    </router-link>
    <router-link :to="{path:'/storeclass',query:{storeId:nowStoreId}}" tag="div" class="footer-tab-item" :class="{'tab-active': category===1}">
      <p class="tab-title">店铺分类</p>
    </router-link>
    <router-link :to="{path:'/storeinfo',query:{storeId:nowStoreId}}" tag="div" class="footer-tab-item" :class="{'tab-active': category===2}">
      <p class="tab-title">店铺介绍</p>
    </router-link>
    <!--<router-link to="" tag="div" class="footer-tab-item" :class="{'tab-active': category===3}">-->
      <!--<p class="tab-title">客服</p>-->
    <!--</router-link>-->
  </footer>
</template>

<script>
	export default{
		name: 'FooterTab',
		props:["category"],
    data(){
			return{
				nowStoreId:''
      }
    },
    created(){
			this.nowStoreId=localStorage.getItem('nowStoreId');
    }
	}
</script>

<style lang="stylus" scoped>
  .store-tab{
    display flex;
    z-index 99;
    position fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: white;
    
  }
  .store-tab::before{
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
    text-align center;
    line-height 50px;
  }
  .iconfont{
    font-size: 22px;
    color: #999;
  }
  .tab-title{
    font-size: 15px;
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
    .store-tab{
      padding-bottom 34px;
    }
  }
</style>
