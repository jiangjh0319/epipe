<template>
  <div class="search-wrapper">
    <div class="search-wrapper">
      <div class="has-search">
        <div class="selections">
          <div class="selection-item" :class="{orderColor:orderState==1}" @click="orderBy(1)">综合排序</div>
          <div class="selection-item" :class="{orderColor:orderState==2}" @click="orderBy(2)">销量优先</div>
          <div class="selection-item" :class="{orderColor:orderState==3}" @click="orderBy(3)">价格优先</div>
        </div>
        <div class="search-result">
          <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="result-item" v-for="(item,index) in resultList" :key="index">
            <div class="goods-picture">
              <img :src="imgPrefix + item.goodsImage" alt="商品">
            </div>
            <div class="goods-details">
              <div class="goods-desc">{{item.goodsName}}</div>
              <div class="goods-opr">
                <div class="price">￥{{item.goodsStorePrice}}
                  <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
                </div>
                <div class="buy">
                  <i class="iconfont icon-xiaogouwucheicon" @click.prevent="addToCart(index)"></i>
                  <span class="btn-buy" @click.prevent="buyNow(index)">立即购买</span>
                </div>
              </div>
            </div>
          </router-link>
          <infinite-loading spinner="bubbles"   @infinite="infiniteHandler" ref="infiniteLoading">
            <span slot="no-more">
              暂无更多加载
            </span>
            <span slot="no-results">
              暂无结果
            </span>
          </infinite-loading>
        </div>
      </div>
    </div>
    <store-tab :category="1"></store-tab>
  </div>
</template>

<script>
	const StoreTab = () => import("../../../components/mall/StoreTab.vue");
	const InfiniteLoading = () => import("vue-infinite-loading");
	export default{
		name: "Search",
		data(){
			return{
				resultList: [],
				imgPrefix: "",
				orderState:1,
				pageNo:1,
				sortField:'',
				sortOrder:'',
				state:''
			}
		},
		components:{
			StoreTab,
			InfiniteLoading
		},
		methods:{
			infiniteHandler($state){
				console.log($state);
				this.state=$state;
				setTimeout(() =>{
					let vm = this;
					vm.axios.post(vm.baseURL.mall + "/m/store/goodsList"+vm.Service.queryString({
						stcId:vm.$route.query.gcId,
						pageSize:10,
						pageNo:this.pageNo,
						sortField:this.sortField,
						sortOrder:this.sortOrder
					})).then(res=> {
						console.log(res);
						if(res.data.h.code==200){
							if (res.data.b.goods.length < 1) {
								$state.complete();
							} else {
								vm.imgPrefix=res.data.b.imgPrefix;
								vm.resultList = vm.resultList.concat(res.data.b.goods);
								this.pageNo++;
								setTimeout(()=>{
									$state.loaded();
								},1000);
							}
						}else{
							$state.complete();
						}
					})
				},1000);
			},
			orderBy(index){
				this.orderState=index;
				this.resultList=[];
				this.pageNo=1;
				switch (index){
					case 1:
						this.sortField='';
						this.sortOrder='';
						break;
					case 2:
						this.sortField='salenum';
						this.sortOrder='desc';
						break;
					case 3:
						this.sortField='goodsStorePrice';
						this.sortOrder='asc';
						break;
				};
				this.infiniteHandler(this.state);
			},
			addToCart(index){
				console.log(index);
				this.axios.post(this.baseURL.mall + "/m/cart/addCartItems"+this.Service.queryString({
					token:this.mallToken.getToken(),
					goodsId:this.resultList[index].goodsId,
					count:1,
					specId:this.resultList[index].specId
				})).then(res=>{
					console.log(res);
					if(res.data.h.code==200){
						this.$toast(res.data.b.msg);
						this.$refs.footertab.getGoodsNumber();
					}else  if(res.data.h.code === 50 || res.data.h.code === 30){
						if(this.isApp.state){
							window.location.href = "epipe://?&mark=login";
						}else{
							this.$router.replace("/accountlogin");
						}
					}else{
						this.$toast(res.data.h.msg);
					}
				})
			},
			buyNow(index){
				console.log(index);
				this.axios.post(this.baseURL.mall + "/m/cart/buy_now"+this.Service.queryString({
					token:this.mallToken.getToken(),
					goodsId:this.resultList[index].goodsId,
					count:1,
					specId:this.resultList[index].specId
				})).then(res=>{
					console.log(res);
					if(res.data.h.code==200){
						localStorage.setItem("settleOrder",JSON.stringify(res.data.b));
						if(localStorage.getItem("settleOrder")){
							this.$router.push({path:'/ConfirmOrder'});
						}
					}else  if(res.data.h.code === 50 || res.data.h.code === 30){
						if(this.isApp.state){
							window.location.href = "epipe://?&mark=login";
						}else{
							this.$router.replace("/accountlogin");
						}
					}else{
						this.$toast(res.data.h.msg);
					}
				})
			}
		},
		created(){
			document.title="店铺分类";
		},
	}
</script>

<style lang="stylus" scoped="true">
  
  .has-search{
    background: white;
  }
  .selections{
    display flex;
    justify-content space-between;
    align-items center;
    position fixed;
    left 0;
    top 0;
    z-index 9;
    width: 100%;
    height: 40px;
    line-height 40px;
    text-align center;
    background: white;
  }
  .selections:after{
    content: "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height 1px;
    background #e5e5e5;
    transform scaleY(0.5);
  }
  .selection-item{
    flex: 1;
  }
  .orderColor{
    color #d74845;
  }
  .result-item{
    display flex;
    justify-content space-between;
    height: 1.2rem;
  }
  .goods-picture{
    width: 1.35rem;
    img{
      display block;
      width: 1.1rem;
      height: 1.1rem;
      margin: 0.05rem auto;
    }
  }
  .goods-details{
    display flex;
    flex-direction column;
    justify-content space-between;
    width: 2.25rem;
    padding-right 0.15rem;
    position relative;
  }
  .goods-details:after{
    content: "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height 1px;
    background #e5e5e5;
    transform scaleY(0.5);
  }
  .goods-desc{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-top 0.15rem;
    font-size: 14px;
    line-height: 18px;
    color: #333;
  }
  .goods-opr{
    display flex;
    justify-content space-between;
  }
  .price{
    margin-top .06rem;
    font-size: 0.18rem;
    line-height: 1;
    color: #d74845;
    position relative;
  }
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
    top 1px;
    right -0.28rem;
  }
  .buy{
    font-size: 0;
  }
  .icon-xiaogouwucheicon{
    margin-right: 0.2rem;
  }
  .btn-buy{
    display inline-block;
    width: 0.75rem;
    height: 0.3rem;
    margin-bottom 0.1rem;
    line-height 0.3rem;
    font-size: 0.14rem;
    text-align center;
    background: #d74a45;
    border-radius: 4px;
    color: white;
  }
  .search-result{
    margin-top  40px;
    padding-bottom 50px;
  }
  .no-result{
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    color: #999;
  }
</style>
