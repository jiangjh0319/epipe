<template>
  <div class="plastic-list">
    <div class="selections">
      <div class="selection-item" @click="comprehensiveFilter" :class="{active : sortField === 'createTime' || sortField === 'goodsClick'}">综合<i class="iconfont icon-xia_" :class="{active : sortField === 'createTime' || sortField === 'goodsClick'}"></i>
      </div>
      <div class="selection-item" @click="handleSorting('salenum')" :class="{active : sortField === 'salenum'}">销量</div>
      <div class="selection-item" @click="handleSorting('goodsStorePrice')" :class="{active : sortField === 'goodsStorePrice'}">价格<i class="iconfont icon-shang_ price-up" :class="{active : sortField === 'goodsStorePrice' && sortOrder === 'desc'}"></i><i class="iconfont icon-xia_ price-down" :class="{active : sortField === 'goodsStorePrice' && sortOrder === 'asc'}"></i>
      </div>
      <div class="selection-item" @click="filterChange">筛选<i class="iconfont icon-shuai_"></i></div>
    </div>
    <div class="floor-4-view" ref="result">
      <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="result-item" v-for="(item,index) in resultList" :key="index" v-if="resultList.length>0">
        <div class="item-content">
          <div class="item-img">
            <img :src="imgPrefix + item.goodsImage" alt="商品">
          </div>
          <div class="item-title">{{item.goodsName}}</div>
          <div class="item-sub">
            <div class="item-price" v-if="item.priceNegotiable == 0">￥{{item.goodsStorePrice}}
              <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
              <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
              <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
            </div>
            <div class="item-price" v-if="item.priceNegotiable == 1">待询价</div>
            <div class="buy"  @click.prevent="buyNow(index,'buy_now')" v-if="item.priceNegotiable === 1">立即询价</div>
            <div class="buy"  @click.prevent="buyNow(index,'buy_now')" v-if="item.priceNegotiable === 0">立即购买</div>
          </div>
        </div>
      </router-link>
    </div>
    <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMore" ref="infiniteLoading">
      <span slot="no-more">暂无更多数据</span>
      <span slot="no-results">暂无结果</span>
    </infinite-loading>
    <div class="filter-part" v-if="comprehensiveCondition">
      <div class="filter-item">
        <div class="comprehensive" @click="selectComprehensiveType('createTime')" :class="{active : sortField === 'createTime'}">按最新</div>
        <div class="comprehensive" @click="selectComprehensiveType('goodsClick')" :class="{active : sortField === 'goodsClick'}">按人气</div>
      </div>
    </div>
    <div class="filter-part" v-if="filterCondition">
      <div class="filter-item">
        <div class="item-tit">分类</div>
        <div class="item-con">
          <span :class="{active : gcId === 2339001281020928}" @click="selectClass(2339001281020928)">全部</span>
          <span v-for="item in subClasses" :key="item.gcId" @click="selectClass(item.gcId)" :class="{active : gcId=== item.gcId}">{{item.gcName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	const InfiniteLoading = () => import("vue-infinite-loading");
	export default {
		name: 'ConduitList',
		components:{
			InfiniteLoading
		},
		data () {
			return {
				pageNo: 1,
				resultList: [],
				subClasses: [],
				filterCondition: false,
				comprehensiveCondition: false,
				gcId: 2338907839857664,
				sortField: 'createTime',
				sortOrder: 'asc'
			}
		},
		methods: {
			loadMore($state){
				setTimeout(() =>{
					this.axios.post(this.baseURL.mall+"/m/search/goodsClassSearch"+this.Service.queryString({
						gcIds: this.gcId,
						pageNo: this.pageNo,
						pageSize: 15,
						sortField: this.sortField,
						sortOrder: this.sortOrder
					})).then(res =>{
						console.log("搜索结果",res);
						if(res.data.h.code === 200){
							if(res.data.b.subClasses.length>0){
								this.subClasses = res.data.b.subClasses;
							}
							if(res.data.b.goods.length<1){
								$state.complete();
							}else{
								this.pageNo ++;
								this.imgPrefix = res.data.b.imgPrefix;
								this.resultList = this.resultList.concat(res.data.b.goods);
								$state.loaded();
							}
						}else{
							$state.complete();
						}
					});
				},200);
			},
			filterChange () {
				this.filterCondition = !this.filterCondition;
			},
			comprehensiveFilter () {
				this.comprehensiveCondition = !this.comprehensiveCondition;
			},
			selectClass (id) {
				this.filterCondition = !this.filterCondition;
				this.gcId = id;
				this.pageNo = 1;
				this.resultList = [];
				this.loadMore();
			},
			selectComprehensiveType (type) {
				this.comprehensiveCondition = !this.comprehensiveCondition;
				this.sortField = type;
				this.pageNo = 1;
				this.resultList = [];
				this.loadMore();
			},
			handleSorting (sortField) {
				this.sortField = sortField;
				this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
				this.pageNo = 1;
				this.resultList = [];
				this.loadMore();
			},
			buyNow(index,type){
				console.log(index);
				this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
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
							this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href)+"?key="+this.searchKey);
						}
					}else{
						this.$toast(res.data.h.msg);
					}
				})
			},
		},
		created () {
			document.title="管道城";
		}
	}
</script>

<style lang="stylus" scoped>
  .plastic-list{
    overflow hidden;
  }
  .filter-part{
    width 100%;
    height 100%;
    position absolute;
    left 0;
    top 0;
    background rgba(0,0,0,0.2);
    .filter-item{
      padding .15rem .15rem 0 .15rem;
      background #fff;
      overflow hidden;
      margin-top 40px;
      .comprehensive{
        padding-bottom .15rem;
        font-size .14rem;
        color #333;
        &.active{
          color #d74a45;
        }
      }
      .item-tit{
        font-size .14rem;
        color #333;
      }
      .item-con{
        margin-top .15rem;
        span{
          display inline-block;
          font-size .14rem;
          color #666;
          margin 0 .25rem .15rem 0;
        }
        .active{
          color #d74a45;
        }
      }
    }
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
    border-bottom 1px solid #e5e5e5;
    background: white;
  }
  .selection-item{
    flex: 1;
    &.active{
      color #d74a45;
    }
    i{
      font-size .12rem;
      color #666;
      &.active{
        color #d74a45;
      }
    }
    .price-up{
      position relative;
      bottom 3px;
    }
    .price-down{
      position relative;
      top 3px;
      right 12px;
    }
  }
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
    padding 0 .15rem;
    padding-top 50px;
    -webkit-overflow-scrolling: touch;
    .result-item{
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
    .buy{
      width .65rem;
      height .24rem;
      line-height .24rem;
      font-size .12rem;
      color #fff;
      background #d74a45;
      border-radius 2px;
      text-align center;
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
