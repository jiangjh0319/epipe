<template>
  <div>
    <div class="search-container">
      <div class="search-bar-vice">
        <i class="iconfont icon-sousuoicon"></i>
        <input type="text" class="search-input-vice" maxlength="20" v-model="searchKey">
        <i class="iconfont icon-guanbiicon" @click="clearInput" v-show="!showSuggestion"></i>
      </div>
      <div class="search-btn" @click="handleSearch">搜索</div>
    </div>
    <div class="search-wrapper">
      <div class="search-type">
        <div :class="{'active-type':nowType===1}" @click="changeType(1)">供需</div>
        <div :class="{'active-type':nowType===2}" @click="changeType(2)">商品</div>
        <div :class="{'active-type':nowType===3}" @click="changeType(3)">店铺</div>
      </div>
      <div class="no-search" v-if="!hasSearch">
        <div class="suggestion-content" v-if="showSuggestion">
          <div class="history" v-if="historyList.length>0">
            <p class="sub-title">最近搜索</p>
            <div class="suggestions">
              <div class="suggestion-item" v-for="(item,index) in historyList" :key="index" @click="handleSuggestion(item)">{{item}}</div>
            </div>
          </div>
          <div class="hot">
            <p class="sub-title">热门搜索</p>
            <div class="suggestions">
              <div class="suggestion-item" v-for="(item,index) in hotList" :key="index" @click="handleSuggestion(item.name)">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="related-search" v-else>
          <div class="related-title">关于“{{searchKey | trim}}”的搜索</div>
          <div class="related-item"></div>
        </div>
      </div>
      <div class="has-search" v-else>
        <div class="selections"  v-if="nowType === 2 ||  nowType === 3">
          <div class="selection-item" @click="handleSorting('')">综合排序</div>
          <div class="selection-item" @click="handleSorting('salenum')">销量优先</div>
          <div class="selection-item" @click="handleSorting('goodsStorePrice')">价格优先</div>
        </div>
        <div class="supply-demand-result" v-if="nowType === 1">
          <div class="tab" v-if="tabShow">
            <div @click="tabClick"><span class="active">供应</span></div>
            <div @click="tabClick"><span>需求</span></div>
          </div>
          <div class="tab" v-else>
            <div @click="tabClick"><span>供应</span></div>
            <div @click="tabClick"><span class="active">需求</span></div>
          </div>
          <div class="list-part" v-if="tabShow">
            <router-link tag="div" class="list-content" v-for="item in supplyList" :key="item.supplyId" :to="{path:'/SupplyDemandDetail',query:{id: item.supplyId, type: 'S'}}">
              <div class="list-content-l"><i class="iconfont icon-gong"></i></div>
              <div class="list-content-m">{{item.supplyName}}</div>
              <div class="list-content-r">{{item.createTime}}</div>
            </router-link>
            <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMoreSupply" ref="infiniteLoading">
              <span slot="no-more">暂无更多数据</span>
              <span slot="no-results">暂无结果</span>
            </infinite-loading>
          </div>
          <div class="list-part" v-else>
            <router-link tag="div" class="list-content" v-for="item in demandList" :key="item.demandId" :to="{path:'/SupplyDemandDetail',query:{id: item.demandId, type: 'D'}}">
              <div class="list-content-l"><i class="iconfont icon-xu"></i></div>
              <div class="list-content-m">{{item.demandName}}</div>
              <div class="list-content-r">{{item.createTime}}</div>
            </router-link>
            <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMoreDemand" ref="infiniteLoading">
              <span slot="no-more">暂无更多数据</span>
              <span slot="no-results">暂无结果</span>
            </infinite-loading>
          </div>
        </div>
        <div class="search-result" ref="result" v-if="nowType === 2">
          <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="result-item" v-for="(item,index) in resultList" :key="index" v-if="resultList.length>0">
            <div class="goods-picture">
              <img :src="imgPrefix + item.goodsImage" alt="商品">
            </div>
            <div class="goods-details">
              <div class="goods-desc">{{item.goodsName}}</div>
              <div class="goods-opr">
                <div class="price" v-if="item.priceNegotiable === 0">￥{{item.goodsStorePrice}}
                  <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
                </div>
                <div class="price" v-if="item.priceNegotiable === 1">待询价</div>
                <div class="buy">
                  <i class="iconfont icon-xiaogouwucheicon" @click.prevent="addToCart(index,'addCartItems')" v-if="item.priceNegotiable === 0"></i>
                  <i class="iconfont icon-xunjiadan-weixuanzhong color999" @click.prevent="addToCart(index,'addInquiry')" v-if="item.priceNegotiable === 1"></i>
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
          <!--<div class="no-result" v-if="resultList.length<1">暂无搜索结果</div>-->
        </div>
        <div class="store-search" v-if="nowType === 3">
          <div  v-for="(item,index) in resultListStore" :key="index" v-if="resultListStore.length>0"  class="store-search-result">
            <div class="store-name">
              <div class="store-name-l">
                <div>
                  <img :src="imgPrefix+item.storeImg" alt="店铺头像" v-if="item.storeImg">
                  <img :src="imgUrl" alt="店铺头像" v-else>
                </div>
                <div>{{item.storeName}}</div>
              </div>
              <div class="store-name-r"> <router-link :to="{path:'/storehome',query:{storeId: item.storeId}}">进店逛逛</router-link></div>
            </div>
            <div class="store-flag">
              <div>{{item.storeOpenTime}}年老店</div>
              <div>收藏人数{{item.favNum}}</div>
            </div>
            <div class="store-goods">
              <router-link :to="{path:'/goodsdetail',query:{goodsId: obj.goodsId}}"  v-for="(obj,index2) in item.goodsList" :key="index2"><img :src="imgPrefix + obj.goodsImage" alt=""></router-link>
            </div>
          </div>
          <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMoreStore" ref="infiniteLoading">
          <span slot="no-more">
            暂无更多数据
          </span>
            <span slot="no-results">
            暂无结果
          </span>
          </infinite-loading>
          <!--<div class="no-result" v-if="resultList.length<1">暂无搜索结果</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const InfiniteLoading = () => import("vue-infinite-loading");
  const imgUrl = require("../../../assets/defaultStore.png");
  export default{
    name: "Search",
    components:{
      InfiniteLoading
    },
    data(){
      return{
        showSuggestion: true,
        searchKey: this.$route.query.key || "",
        hasSearch: false,
        resultList: [],
	      resultListStore:[],
        imgPrefix: "",
        historyList: localStorage.getItem("historySearch") ? localStorage.getItem("historySearch").split(',') : [],
        hotList: [],
        initOrder: true,
        saleOrder: true,
        priceOrder: true,
        pageNo: 1,
        order: "",
        sortField: "",
	      nowType:1,
	      imgUrl:imgUrl,
	      tabShow: true,
	      supplyList: [],
	      demandList: []
      }
    },
    watch:{
      searchKey(){
        if(!this.searchKey){
          this.hasSearch = false;
        }
        this.handleSearchKey();
      }
    },
    filters:{
      trim(str){
        return str.trim();
      }
    },
    created(){
      this.getHotKey();
      let keyword = this.$route.query.key;
      if(keyword){
        this.handleSearch();
      }
    },
    methods:{
      handleSearchKey(){
        setTimeout(() =>{
          if(this.searchKey){
            this.showSuggestion = false;
          }else{
            this.showSuggestion = true;
          }
        },200);
      },
      clearInput(){
        this.searchKey = "";
      },
	    changeType(index){
      	this.nowType = index;
      },
      /*搜索*/
      handleSearch(){
        if(this.searchKey){
          this.hasSearch = true;
          let arr = localStorage.getItem("historySearch") ? localStorage.getItem("historySearch").split(",") : [];
          if(arr.indexOf(this.searchKey)<0){
            arr.unshift(this.searchKey);
          }
          if(arr.length > 10){
            arr = arr.slice(0,10);
          }
          this.historyList = arr;
          localStorage.setItem("historySearch",arr);
          this.pageNo = 1;
        }
      },
      /*排序*/
      handleSorting(field){
        console.log("field",field);
        this.sortField = field;
        if(field === 'salenum'){
          this.order = this.saleOrder ? 'asc' : 'desc';
          this.saleOrder = !this.saleOrder;
        }else if(field === 'goodsStorePrice'){
          this.order = this.priceOrder ? 'asc' : 'desc';
          this.priceOrder = !this.priceOrder;
        }else{
          this.order = "";
        }
        this.changeFilter();
      },
      /*加载更多*/
      loadMore($state){
        setTimeout(() =>{
          this.axios.post(this.baseURL.mall+"/m/search/goodsKeywordSearch"+this.Service.queryString({
            keyword: this.searchKey,
            pageNo: this.pageNo,
            sortField: this.sortField || "",
            sortOrder: this.order || ""
          })).then(res =>{
            console.log("搜索结果",res);
            if(res.data.h.code === 200){
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
      //加载数据店铺
	    loadMoreStore($state){
		    setTimeout(() =>{
			    this.axios.post(this.baseURL.mall+"/m/search/storeSearch"+this.Service.queryString({
				    keyword: this.searchKey,
				    pageNo: this.pageNo,
            pageSize:10,
				    sortField: this.sortField || "",
				    sortOrder: this.order || ""
			    })).then(res =>{
				    console.log("搜索结果",res);
				    if(res.data.h.code === 200){
					    if( res.data.b.storeList.length<1){
						    $state.complete();
						    console.log(this.resultListStore.length);
					    }else{
						    this.pageNo ++;
						    this.imgPrefix = res.data.b.imgPrefix;
						    this.resultListStore = this.resultList.concat(res.data.b.storeList);
						    $state.loaded();
					    }
				    }else{
					    $state.complete();
				    }
			    });
		    },200);
      },
      changeFilter() {
        this.pageNo = 1;
        this.resultList = [];
        this.resultListStore=[];
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        });
      },
      handleSuggestion(key){
        this.searchKey = key;
        this.resultList = [];
        this.resultListStore=[];
        this.handleSearch();
      },
      /*请求热门搜索关键字*/
      getHotKey(){
        this.axios.get(this.baseURL.mall + '/m/search/hotKeywords').then(res =>{
          console.log("热门搜索关键字",res);
          if(res.data.h.code === 200){
            this.hotList = res.data.b;
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
	    tabClick(){
		    this.tabShow = !this.tabShow;
		    this.pageNo = 1;
		    if(!this.tabShow && this.demandList.length === 0 ){
			    this.loadMoreDemand();
		    }
	    },
	    loadMoreSupply($state){
		    setTimeout(() => {
			    this.axios.post(this.baseURL.mall + "/m/demandAndSupply/querySupplyInfo" + this.Service.queryString({
				    pageNo: this.pageNo,
				    pageSize: 15,
				    queryName: this.searchKey
			    })).then(res => {
				    if (res.data.h.code === 200) {
					    if (res.data.b.supplyList.length < 1) {
						    $state.complete();
					    } else {
						    this.pageNo++;
						    this.supplyList = this.supplyList.concat(res.data.b.supplyList);
						    $state.loaded();
					    }
				    } else {
					    $state.complete();
				    }
			    })
		    },200)
	    },
	    loadMoreDemand($state){
		    setTimeout(() => {
			    this.axios.post(this.baseURL.mall + "/m/demandAndSupply/queryDemandInfo" + this.Service.queryString({
				    pageNo: this.pageNo,
				    pageSize: 15,
				    queryName: this.searchKey
			    })).then(res => {
				    if (res.data.h.code === 200) {
					    if (res.data.b.demandList.length < 1) {
						    $state.complete();
					    } else {
						    this.pageNo++;
						    this.demandList = this.demandList.concat(res.data.b.demandList);
						    $state.loaded();
					    }
				    } else {
					    $state.complete();
				    }
			    })
		    },200)
	    }
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
  .suggestion-content{
    padding 0.2rem 0.15rem;
    background: white;
    border-bottom 1px solid #e5e5e5;
    margin-top 85px;
  }
  .search-type{
    /*margin-top 45px;*/
    height 40px;
    background #f5f5f5;
    display flex;
    z-index 10;
    justify-content center;
    justify-items center;
    position fixed;
    top 45px;
    width 100%;
    div{
      flex 1;
      font-size .15rem;
      color #999;
      text-align center;
      line-height .4rem;
      margin 0 .4rem;
    }
    .active-type{
      color #333;
      border-bottom 2px solid #ff8800;
    }
  }
  .sub-title{
    font-size: 0.11rem;
    color: #666;
    margin-bottom 0.15rem;
  }
  .hot .sub-title{
    margin-top 0.2rem;
  }
  .suggestions{
    font-size 0;
  }
  .suggestion-item{
    display inline-block;
    height: 0.3rem;
    line-height 0.3rem;
    padding: 0 4px;
    margin-right: 0.1rem;
    margin-bottom: 0.1rem;
    text-align center;
    font-size 0.12rem;
    color #666;
    border: 1px solid #e5e5e5;
    background #efefef;
    cursor pointer;
  }
  .related-search{
    margin-top: 46px;
    background: white;
    border-bottom: 1px solid #e5e5e5;
  }
  .related-title,.related-item{
    height: 40px;
    margin-left 0.15rem;
    line-height: 40px;
    font-size: 14px;
  }
  .related-title{
    color: #666;
    border-bottom: 1px dotted #e5e5e5;
  }
  .related-item{
    color: #d74745;
  }
  .related-item:not(:last-child){
    border-bottom: 1px dotted #e5e5e5;
  }
  .icon-guanbiicon{
    color: #b3b3b3;
  }
  .has-search{
    /*margin-top 46px;*/
    //background: white;
  }
  .selections{
    display flex;
    justify-content space-between;
    align-items center;
    position fixed;
    left 0;
    top 85px;
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
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
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
  .buy{
    font-size: 0;
    i{
      margin-right .18rem;
      font-size .18rem;
      color #999;
    }
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
  .search-result,.supply-demand-result{
    -webkit-overflow-scrolling: touch;
    padding-top 125px;
    background #fff;
  }
  .supply-demand-result{
    -webkit-overflow-scrolling: touch;
    padding-top 85px;
    background #fff;
    .tab{
      height .45rem;
      line-height .45rem;
      display flex;
      justify-content center;
      align-items center;
      position relative;
      &::after{
        content: "";
        position absolute;
        left 0;
        bottom: 0;
        width 100%;
        height: 1px;
        background #E9E9E9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      div{
        flex 1;
        font-size .16rem;
        color #33;
        text-align center;
        span{
          display inline-block;
          height .45rem;
          padding 0 .1rem;
        }
        .active{
          border-bottom 2px solid #ff5959;
        }
      }
    }
    .list-part{
      width 100%;
      padding .25rem .15rem;
      box-sizing border-box;
      .list-content{
        display flex;
        align-items center;
        margin-bottom .35rem;
        &:last-child{
          margin-bottom 0;
        }
        .list-content-l{
          margin-right .05rem;
          .icon-gong{
            color #fd545c;
          }
          .icon-xu{
            color #0fc27c;
          }
        }
        .list-content-m{
          flex 1;
          font-size .15rem;
          color #333
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .list-content-r{
          font-size .12rem;
          color #999;
          margin-left .2rem;
        }
      }
    }
  }
  .no-result{
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    color: #999;
  }
  .store-search{
    margin-top 125px;
  }
  .store-search-result{
    padding .08rem .15rem .15rem .15rem;
    overflow hidden;
    margin-top .1rem;
    display block;
    background #fff;
    .store-name{
      overflow hidden;
      position relative;
      .store-name-l{
        float left;
        div:first-child{
          width .3rem;
          height .3rem;
          border-radius 1px;
          float left;
          img{
            width 100%;
            height 100%;
          }
        }
        div:last-child{
          float left;
          font-size .14rem;
          color #333;
          line-height .3rem;
          margin-left .1rem;
          font-weight bold;
        }
      }
      .store-name-r{
        float right;
        width .6rem;
        height .23rem;
        border 1px solid #d74a45;
        border-radius .2rem;
        text-align  center;
        position absolute;
        right 0;
        top 50%;
        transform translateY(-50%);
        a{
          font-size .12rem;
          color #d74a45;
          line-height .23rem;
        }
      }
    }
    .store-flag{
      margin-top .08rem;
      overflow hidden;
      div{
        float left;
        margin-right .1rem;
        padding .08rem .1rem;
        font-size .12rem;
        color #999;
        background #f5f5f5;
        text-align center;
        border-radius .2rem;
      }
    }
    .store-goods{
      margin-top .1rem;
      display flex;
      overflow hidden;
      a{
        flex 1;
        margin-right .06rem;
        img{
          height 100%;
          width 100%;
        }
      }
      div:last-child{
        margin-right 0;
      }
    }
  }
  .store-search-result:first-child{
    margin-top 0;
  }
</style>
