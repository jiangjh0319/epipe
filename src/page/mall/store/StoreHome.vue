<template>
  <div>
    <div class="search-container">
      <div class="search-bar-vice">
        <i class="iconfont icon-sousuoicon"></i>
        <input type="text" class="search-input-vice" maxlength="20" v-model="searchKey">
        <i class="iconfont icon-guanbiicon" @click="clearInput"  v-show="!showSuggestion"></i>
      </div>
      <div class="search-btn" @click="storeHomeSearch">搜索</div>
    </div>
    <div class="store-info" ref="storeInfo">
      <div class="info">
        <div>
          <img :src="imgPrefix + store.storeLogo" alt="" v-if="store.storeLogo">
          <img src="../../../assets/default-store.png" alt="" v-else>
        </div>
        <div>{{store.storeName}}</div>
      </div>
      <div class="collecte">
        <div>
          <p>{{store.storeCollect}}</p>
          <p>粉丝数</p>
        </div>
        <div>收藏店铺</div>
      </div>
    </div>
    <div class="home-part" v-if="homeState">
      <div class="banner-img">
        <swiper :options="swiperOption" v-if="banner.length>0">
          <swiper-slide v-for="(slide,index) in banner" :key="index">
            <a :href="slide.advUrl" v-if="slide.advUrl">
              <img :src="imgPrefix + slide.advImg" v-if="slide">
            </a>
            <img :src="imgPrefix + slide.advImg" v-else>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <img src="../../../assets/default-banner.png" alt="" v-else>
      </div>
      <div class="store-coupon" v-if="storeCoupons.length>0">
        <div class="coupon-div">
          <div class="one-coupon" v-for="(item,index) in storeCoupons" :key="index">
            <div>
              <span>￥</span>
              <span>{{item.couponPrice}}</span>
            </div>
            <div>
              <p>满{{item.couponLimit}}元使用</p>
              <p @click="receiveCoupon(item.couponId)">立即领取</p>
            </div>
          </div>
        </div>
      </div>
      <div class="floor-4-view" v-for="(item ,k) in floorList" :key="k" v-if="floorList[k].floorGoods.length>0">
        <div class="floor-title">
          <img :src="imgPrefix + item.floorTitleImg" alt="楼层标题">
        </div>
        <router-link :to="{path:'/goodsdetail',query:{goodsId: obj.goodsId}}" class="item" v-for="(obj,j) in item.floorGoods" :key="j">
          <div class="item-content">
            <div class="item-img">
              <img :src="imgPrefix + obj.goodsImage" alt="商品图片">
            </div>
            <div class="item-title">{{obj.goodsName}}</div>
            <div class="item-sub">
              <div class="item-price" v-if="obj.priceNegotiable == 0">￥{{obj.goodsStorePrice}}
                <div class="promotion-flag" v-if="obj.promotionType === 'YH'">券</div>
                <div class="promotion-flag" v-if="obj.promotionType === 'ZK'">折</div>
                <div class="promotion-flag" v-if="obj.promotionType === 'TG'">团</div>
              </div>
              <div class="item-price" v-if="obj.priceNegotiable == 1">待询价
                <div class="promotion-flag" v-if="obj.promotionType === 'YH'">券</div>
                <div class="promotion-flag" v-if="obj.promotionType === 'ZK'">折</div>
                <div class="promotion-flag" v-if="obj.promotionType === 'TG'">团</div>
              </div>
              <div class="buy">
                <svg class="icon icon-car" aria-hidden="false">
                  <use xlink:href="#icon-gouwuche-xuanzhongicon"></use>
                </svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="search-part" ref="searchPart" v-if="!homeState">
      <div class="selections">
        <div class="selection-item" @click="handleSorting('')">综合排序</div>
        <div class="selection-item" @click="handleSorting('salenum')">销量优先</div>
        <div class="selection-item" @click="handleSorting('goodsStorePrice')">价格优先</div>
      </div>
      <div class="search-result">
        <router-link  :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" v-for="(item,index) in resultList" :key="index" class="result-item">
          <div class="goods-picture">
            <img :src="imgPrefix + item.goodsImage" alt="商品">
          </div>
          <div class="goods-details">
            <div class="goods-desc">{{item.goodsName}}</div>
            <div class="goods-opr">
              <div class="price" v-if="item.priceNegotiable== 0">￥{{item.goodsStorePrice}}
                <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
              </div>
              <div class="price" v-if="item.priceNegotiable== 1">待询价
                <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
              </div>
              <div class="buy">
                <!--<i class="iconfont icon-xiaogouwucheicon" @click.prevent="addToCart(index)"></i>-->
                <!--<span class="btn-buy"  @click.prevent="buyNow(index)">立即购买</span>-->
                <i class="iconfont icon-xiaogouwucheicon" @click.prevent="addToCart(index,'addCartItems')" v-if="item.priceNegotiable === 0"></i>
                <i class="iconfont icon-xunjiadan-weixuanzhong" @click.prevent="addToCart(index,'addInquiry')" v-if="item.priceNegotiable === 1"></i>
                <span class="btn-buy"  @click.prevent="buyNow(index,'buy_now')" v-if="item.priceNegotiable === 0">立即购买</span>
                <span class="btn-buy"  @click.prevent="buyNow(index,'inquiryNow')" v-if="item.priceNegotiable === 1">立即询价</span>
              </div>
            </div>
          </div>
        </router-link>
        <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMore" ref="infiniteLoading">
          <span slot="no-more">
            暂无更多数据
          </span>
          <span slot="no-results">
            暂无结果
          </span>
        </infinite-loading>
      </div>
    </div>
    <store-tab :category="0"></store-tab>
  </div>
</template>
<script>
	import 'swiper/dist/css/swiper.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	const StoreTab = () => import("../../../components/mall/StoreTab.vue");
	const InfiniteLoading = () => import("vue-infinite-loading");
	export default {
		data(){
			return{
				homeState: true,
        resultList:[],
				imgPrefix: '',
				searchKey:'',
				showSuggestion:true,
				searchKey:'',
        floorList:[],
				storeCoupons:[],
				store:[],
				banner:[],
				pageNo:1,
				swiperOption: {
					autoplay:true,
					pagination: {
						el: '.swiper-pagination',
					}
				},
			}
		},
		components:{
			StoreTab,
			swiper,
			swiperSlide,
			InfiniteLoading
		},
		methods: {
			getCouponInfoList(){
				this.axios.post(this.baseURL.mall+"/m/store/storeCoupons"+this.Service.queryString({
					storeId: this.$route.query.storeId
				})).then(res =>{
					console.log(res);
					if(res.data.h.code === 200){
						this.storeCoupons=res.data.b.storeCoupons;
          }
				})
      },
			receiveCoupon(couponId){
				console.log(couponId);
				this.axios.post(this.baseURL.mall + '/m/my/getCoupon' +this.Service.queryString({
					token:this.mallToken.getToken(),
					couponId:couponId
				})).then(res=>{
					console.log(res);
					if(res.data.h.code === 200){
						this.$toast("领取成功");
					}else if(res.data.h.code === 30){
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
      getBannerInfo(){
	      this.axios.post(this.baseURL.mall+"/m/store/storeBanners"+this.Service.queryString({
		      storeId: this.$route.query.storeId
	      })).then(res =>{
		      console.log('店铺banner信息',res);
		      if(res.data.h.code === 200) {
			      this.store = res.data.b.store;
			      this.imgPrefix = res.data.b.imgPrefix;
			      this.banner = res.data.b.banners;
		      }
	      })
      },
			addToCart(index,type){
				console.log(index);
				this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
					token:this.mallToken.getToken(),
					goodsId:this.resultList[index].goodsId,
					count:1,
					specId:this.resultList[index].specId
				})).then(res=>{
					console.log(res);
					if(res.data.h.code==200){
						this.$toast(res.data.b.msg);
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
//			addToCart(index){
//				console.log(index);
//				this.axios.post(this.baseURL.mall + "/m/cart/addCartItems"+this.Service.queryString({
//					token:this.mallToken.getToken(),
//					goodsId:this.resultList[index].goodsId,
//					count:1,
//					specId:this.resultList[index].specId
//				})).then(res=>{
//					console.log(res);
//					if(res.data.h.code==200){
//						this.$toast(res.data.b.msg);
//					}else  if(res.data.h.code === 50 || res.data.h.code === 30){
//						if(this.isApp.state){
//							window.location.href = "epipe://?&mark=login";
//						}else{
//							this.$router.replace("/accountlogin");
//						}
//					}else{
//						this.$toast(res.data.h.msg);
//					}
//				})
//			},
//			buyNow(index){
//				console.log(index);
//				this.axios.post(this.baseURL.mall + "/m/cart/buy_now"+this.Service.queryString({
//					token:this.mallToken.getToken(),
//					goodsId:this.resultList[index].goodsId,
//					count:1,
//					specId:this.resultList[index].specId
//				})).then(res=>{
//					console.log(res);
//					if(res.data.h.code==200){
//						localStorage.setItem("settleOrder",JSON.stringify(res.data.b));
//						if(localStorage.getItem("settleOrder")){
//							this.$router.push({path:'/ConfirmOrder'});
//						}
//					}else  if(res.data.h.code === 50 || res.data.h.code === 30){
//						if(this.isApp.state){
//							window.location.href = "epipe://?&mark=login";
//						}else{
//							this.$router.replace("/accountlogin");
//						}
//					}else{
//						this.$toast(res.data.h.msg);
//					}
//				})
//			},
			getFloorData(){
				this.axios.post(this.baseURL.mall+"/m/store/storeFloors"+this.Service.queryString({
					storeId: this.$route.query.storeId
				})).then(res =>{
					console.log('店铺楼层',res);
					if(res.data.h.code === 200){
						this.floorList=res.data.b.floors;
						this.imgPrefix=res.data.b.imgPrefix;
          }
				})
      },
			storeHomeSearch(){
				if(this.searchKey){
					this.homeState=false;
					this.pageNo=1;
					this.resultList=[];
        }
      },
			loadMore($state){
        this.axios.post(this.baseURL.mall+"/m/store/goodsList"+this.Service.queryString({
          storeId: this.$route.query.storeId,
          keyword: this.searchKey,
          pageNo: this.pageNo,
          pageSize: 10
        })).then(res =>{
          console.log('店铺搜索',res);
          if(res.data.h.code === 200) {
            if (res.data.b.goods.length < 1) {
              $state.complete();
            }else{
              this.pageNo++;
              this.resultList = this.resultList.concat(res.data.b.goods);
              this.imgPrefix = res.data.b.imgPrefix;
              $state.loaded();
            }
          }else{
            $state.complete();
          }
        })
      },
      handleSearchKey(){
				if(this.searchKey){
					this.showSuggestion=false;
        }else{
					this.showSuggestion=true;
					this.homeState=true;
        }
      },
			clearInput(){
      	this.searchKey='';
				this.homeState=true;
      }
    },
    watch:{
			searchKey(){
				this.handleSearchKey();
      }
    },
    mounted(){
//	    let fixH=window.getComputedStyle(this.$refs.storeInfo).height.replace("px","")*1 + 95;
//      console.log(fixH);
//      let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//      console.log(winH);
//      let partH=winH-fixH;
//      this.$refs.searchPart.style.height = partH +'px';
    },
    created(){
      document.title = '店铺首页';
      this.getFloorData();
      this.getBannerInfo();
      this.getCouponInfoList();
      localStorage.setItem("nowStoreId",this.$route.query.storeId);
    },
	}
</script>
<style lang="stylus" scoped="true">
  .search-container{
    z-index 9;
    box-sizing border-box;
    display flex;
    justify-content space-between;
    align-items center;
    position fixed;
    left 0;
    top 0;
    width: 100%;
    height: 45px;
    padding: 0 0.15rem;
    background: white;
    border-bottom 1px solid #e5e5e5;
    .search-bar{
      width: 3.25rem;
      height: 29px;
      margin 0 auto;
      line-height 29px;
      padding 0 0.1rem;
      background: rgba(255,255,255,0.7);
      border-radius 0.145rem;
    }
    .icon-search{
      width: 14px;
      height: 15px;
    }
    .search-input{
      width: 3rem;
      height inherit;
      font-size 0.14rem;
      color: #ccc;
      outline none;
      background transparent;
    }
  }
  .search-bar-vice{
    width: 2.65rem;
    height: 29px;
    white-space nowrap;
    line-height 29px;
    padding 0 0.1rem;
    border-radius 0.145rem;
    background: #f2f2f5;
    .search-input-vice{
      width 2.25rem;
      height inherit;
      font-size 0.14rem;
      color: #333;
      outline none;
      background transparent;
    }
  }
  .search-btn{
    width: 0.5rem;
    height: 29px;
    border-radius 4px;
    background: #d74a45;
    color: white;
    line-height 29px;
    text-align center;
  }
  .icon-guanbiicon{
    color: #b3b3b3;
  }
  .home-part{
    padding-bottom 50px;
    padding-top 90px;
  }
  .search-part{
    padding-top 90px;
    padding-bottom 50px;
    overflow scroll;
    -webkit-overflow-scrolling touch;
  }
  .store-info{
    height 45px;
    padding 8px 15px;
    overflow hidden;
    box-sizing border-box;
    position fixed;
    top 45px;
    z-index 10;
    background #f5f5f5;
    width 100%;
    .info{
      height 100%;
      float left;
      div{
        float left;
        height 100%;
        line-height 29px;
        font-size .14rem;
        color #333;
        margin-right .15rem;
        width 30px;
        img{
          display block;
          height 100%;
          width  100%;
        }
      }
      div:last-child{
        width 1.5rem;
        overflow hidden;
        text-overflow ellipsis;
        -ms-text-overflow ellipsis;
        -o-text-overflow ellipsis;
        -webkit-text-overflow ellipsis;
        white-space nowrap;
      }
    }
    .collecte{
      float right;
      height 100%;
      div{
        float left;
        text-align center;
        p{
          font-size .12rem;
          color #ff8800;
          line-height 1.27;
        }
      }
      div:last-child{
        width .6rem;
        height .23rem;
        line-height .23rem;
        border-radius .15rem;
        background #ff8800;
        font-size  .12rem;
        color #fff;
        margin-left .15rem;
        position relative;
        top 50%;
        transform translateY(-50%);
      }
    }
  }
  .banner-img{
    height 1.6rem;
    background #ccc;
    img{
      height 1.6rem;
      width 100%;
    }
  }
  .store-coupon{
    height .6rem;
    padding .15rem 0;
    background #fff;
    overflow-x scroll;
    overflow-y hidden;
    -webkit-overflow-scrolling touch;
    &::-webkit-scrollbar {/*隐藏滚轮*/
      display: none;
      width: 0px;
    }
    .coupon-div{
      width 15rem;
      .one-coupon{
        width 1.6rem;
        height 100%;
        background url("../../../assets/couponBg.png") no-repeat top center;
        background-size 100% auto;
        margin-left .12rem;
        float left;
        div{
          float left;
          height 100%;
          &:first-child{
            width .68rem;
            color #fff;
            text-align center;
            line-height .6rem;
            span:first-child{
              font-size .145rem;
            }
            span:last-child{
              font-size .26rem;
            }
          }
          &:last-child{
            width .92rem;
            color #fff;
            font-size .12rem;
            border-left 1px dashed #fff;
            box-sizing border-box;
            height .6rem;
            p{
              width 100%;
              text-align center;
              line-height 1.27;
              &:first-child{
                margin-top .11rem;
              }
              &:last-child{
                width .7rem;
                height .2rem;
                line-height .2rem;
                text-align center;
                background #ff3333;
                font-size .1rem;
                margin 0 auto;
                border-radius 16px;
                margin-top .05rem;
              }
            }
          }
        }
      }
    }
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
    top 2px;
    right -0.28rem;
  }
  .floor-4-view{
    display: flex;
    justify-content space-between;
    flex-wrap wrap;
    padding 0 .15rem;
    .floor-title{
      width 100%;
      height: 0.6rem;
      text-align center;
      img{
        height 100%;
        width 100%;
      }
    }
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
      line-height: .18rem;
      color: #666;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
      height .36rem;
    }
    .item-sub{
      display flex;
      justify-content space-between;
    }
    .item-price{
      font-size 0.16rem;
      color: #333;
      position relative;
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
  .selections{
    display flex;
    justify-content space-between;
    align-items center;
    position fixed;
    left 0;
    top 90px;
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
      background: #dedede;
    }
  }
  .goods-details{
    display flex;
    flex-direction column;
    justify-content space-between;
    width: 2.25rem;
    padding-right 0.15rem;
    border-bottom 1px solid #e5e5e5;
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
    display: -webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
  
  }
  .goods-opr{
    display flex;
    justify-content space-between;
  }
  .price{
    margin-bottom 0.18rem;
    font-size: 0.18rem;
    line-height: 1;
    color: #d74845;
    position relative;
  }
  .buy{
    font-size: 0;
  }
  .icon-xiaogouwucheicon,.icon-xunjiadan-weixuanzhong{
    margin-right: 0.2rem;
    font-size .18rem;
    color #999;
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
    -webkit-overflow-scrolling: touch;
    padding-top 40px;
    background #fff;
  }
  .no-result{
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    color: #999;
  }
</style>