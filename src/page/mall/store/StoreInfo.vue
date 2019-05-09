<template>
  <div class="store-info">
    <div class="info-part">
      <div class="store-img"><img :src="imgPrefix + store.storeLogo" alt="店铺logo"></div>
      <p>
        <span class="sp1">店铺名称：</span><span class="sp2">{{store.storeName}}</span>
      </p>
      <p>
        <span class="sp1">主营类别：</span>
      </p>
      <p>
        <span class="sp2">{{store.storeZy}}</span>
      </p>
    </div>
    <div class="info-part ">
      <p><span class="sp1">动态评价</span></p>
      <p>
        <span class="sp2">描述相符：</span>
        <span class="sp2"><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i></span>
      </p>
      <p>
        <span class="sp2">服务态度：</span>
        <span class="sp2"><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i></span>
      </p>
      <p>
        <span class="sp2">发货速度：</span>
        <span class="sp2"><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i><i class="icon-star iconfont"></i></span>
      </p>
      <p><span class="sp1">店铺信息</span></p>
      <p>
        <span class="sp2">创店时间：</span><span class="sp2">{{store.createTimeStr}}</span>
      </p>
      <p>
        <span class="sp2">商品数量：</span><span class="sp2">{{storegoodscount}}件商品</span>
      </p>
      <p>
        <span class="sp2">店铺收藏：</span><span class="sp2">{{store.storeCollect}}人收藏</span>
      </p>
      <p><span class="sp1">联系方式</span></p>
      <p>
        <span class="sp2">全国统一服务热线：</span><span class="sp2">{{store.storeTel}}</span>
      </p>
      <p>
        <span class="sp2">Email：</span><span class="sp2">{{store.contactsEmail}}</span>
      </p>
      <p>
        <span class="sp2">QQ：</span><span class="sp2">{{store.storeQQ}}</span>
      </p>
      <p>
        <span class="sp2">地址：</span><span class="sp2">{{store.areaInfo}}{{store.storeAddress}}</span>
      </p>
    </div>
    <div class="info-part">
      <p><span class="sp1">店铺介绍</span></p>
      <p class="store-info-p"><span class="sp2">{{store.description}}</span></p>
    </div>
    <store-tab :category="2"></store-tab>
  </div>
</template>
<script>
	const StoreTab = () => import("../../../components/mall/StoreTab.vue");
	export default {
		data(){
			return{
				evaluateStore:'',
				imgPrefix:'',
				store:'',
				storegoodscount:''
			}
		},
		components:{
			StoreTab,
		},
    methods:{
			getData(){
				this.axios.post(this.baseURL.mall+"/m/store/storeInfo"+this.Service.queryString({
					storeId: this.$route.query.storeId,
				})).then(res =>{
					console.log('店铺介绍信息',res);
					if(res.data.h.code === 200) {
						this.store = res.data.b.store;
						this.evaluateStore = res.data.b.evaluateStore;
						this.imgPrefix = res.data.b.imgPrefix;
						this.storegoodscount = res.data.b.storegoodscount;
					}
				})
      }
    },
    created(){
			document.title='店铺介绍';
			this.getData();
    }
	}
</script>
<style lang="stylus" scoped="true">
   .store-info{
     padding-bottom 50px;
   }
   .info-part{
    padding .15rem;
    background #fff;
    margin-bottom .1rem;
    position relative;
    .store-img{
      position absolute;
      top .15rem;
      right .15rem;
      width .7rem;
      height .7rem;
      img{
        width 100%;
        display block;
      }
    }
    p{
      font-size .13rem;
      line-height .36rem;
      .sp1{
        color #333;
      }
      .sp2{
        color #666;
        margin-right .1rem;
        i{
          margin-right .1rem;
          color #ff8800;
        }
      }
    }
    .store-info-p{
      line-height .24rem;
    }
  }
</style>