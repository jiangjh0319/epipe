<template>
  <div class="goods-con" v-if="showSelection">
    <div class="detail-tab" ref="header">
      <ul>
        <li v-for="(item, index) in tabList" :class="{tabActive:selected==index}" @click="change(index)"><span>{{item}}</span></li>
      </ul>
    </div>
    <div class="tab-con" ref="conpart"  v-if="showIndex === 0" >
      <div v-for="(item,index) in goodsList" :key="index">
        <div class="goods-banner">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(slide,index) in banner" :key="index">
              <img :src="bannerPrefix + slide" v-if="slide">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="goods-des">
          <p>{{item.goodsName}}</p>
          <div class="goods-price"  v-if="item.priceNegotiable === 0"><span>￥</span><span>{{goodsStorePrice}}</span><span class="origina-priece" v-if="item.promotionType === 'TG'">市场价￥{{item.goodsOriginalPrice}}</span></div>
          <div class="goods-price"  v-if="item.priceNegotiable === 1"><span>待询价</span></div>
          <div class="promotion-detail" v-if="item.promotionType === 'YH'">
            <div class="promotion-tit">领券</div>
            <div class="promotion-con" @click="showPromotionInfo('YH')"><span v-for="(coupon,index) in item.promotionList" :key="index" v-if="index < 2">{{coupon.couponDesc}}</span></div>
            <div class="promotion-more" @click="showPromotionInfo('YH')">...</div>
          </div>
          <div class="promotion-detail" v-if="item.promotionType === 'ZK'">
            <div class="promotion-tit discount-tit">折扣</div>
            <div class="promotion-con" @click="showPromotionInfo">
              <span class="discount-span" v-for="(coupon,index) in item.promotionList" :key="index" v-if="index === 0 && item.promotionList.length == 1">{{coupon.couponDesc}}</span>
              <span class="discount-span" v-for="(coupon,index) in item.promotionList" :key="index" v-if="index === 0 && item.promotionList.length>1">{{coupon.couponDesc + '，'}}</span>
              <span class="discount-span" v-for="(coupon,index) in item.promotionList" :key="index" v-if="index === 1">{{coupon.couponDesc}}</span>
            </div>
            <div class="promotion-more" @click="showPromotionInfo">...</div>
          </div>
          <div class="promotion-detail" v-if="item.promotionType === 'TG'">
            <div class="promotion-tit discount-tit">团购</div>
            <div class="promotion-con">本商品参与团购活动，活动于{{item.promotionList[0].endTimeStr}}结束。</div>
          </div>
        </div>
        <div class="goods-transport" v-if="priceNegotiable === 0 ">
          <div class="one-line">
            <span class="sp1">发货</span><span class="sp2">{{shipAddress}}</span>
          </div>
          <div class="one-line" @click="changeTrasAdress()">
            <span class="sp1">送至</span><span class="sp2">{{receiveAddress}}</span><span class="sp3"><i class="iconfont icon-jinru"></i></span>
          </div>
          <div class="one-line">
            <span class="sp1">运费</span><span class="sp4">{{transportPrice}}<i>元</i></span>
          </div>
        </div>
        <div class="goods-spec">
          <ul>
            <li  v-for="(item,i) in specList" :key="i" >
              <div class="spec-name">{{item.spName}}</div>
              <div class="con-spec">
                <span  v-for="(obj,j) in item.specValueList" :key="j"  :data-value-id=obj.spValueId  :class="{specActive:checkedArr[i]==j || item.specValueList.length==1}"  @click="selt(i,j)">{{obj.spValueName}}</span>
              </div>
            </li>
            <li>
              <div class="spec-name">数量</div>
              <div class="con-spec">
                <span><input type="button" value="-"  @click="reduce"></span><span><input type="number" v-model="buyValue"  pattern="[0-9]*"></span><span><input type="button" value="+" @click="add"></span>
              </div>
            </li>
          </ul>
        </div>
        <div class="goods-type">
          <ul>
            <li>
              <div>
                <p class="p1">{{item.salenum}}</p>
                <p class="p2">商品销量</p>
              </div>
            </li>
            <li>
              <div>
                <p class="p1">{{item.commentnum}}</p>
                <p class="p2">商品评价</p>
              </div>
            </li>
            <li>
              <div>
                <p class="p1">{{item.collect}}</p>
                <p class="p2">商品收藏</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </div>
    <div class="tab-con" ref="conpart" v-if="showIndex === 1">
      <div class="goods-spcpic" v-for="(item,index) in detailList" :key="index" v-html="item"></div>
    </div>
    <div class="tab-con" ref="conpart" v-if="showIndex === 2">
        <div class="comment" v-for="(item,index) in commentList" :key="index">
          <div class="user-info">
            <div class="pic"><img :src="item.userImgUrl" alt=""></div>
            <div class="pho">{{item.gevalFrommembername}}</div>
            <div class="star">
              <i class="iconfont icon-star" v-for="(i,k) in item.gevalScore" :key="k" /><i class="iconfont icon-star" style="color:#cdcdcd;" v-for="(i,k) in (5-item.gevalScore)" :key="k" />
            </div>
          </div>
          <div class="comment-con">{{item.gevalContent}}</div>
          <div class="time">
            <div class="time-con">{{item.gevalAddTimeStr}}</div>
            <div class="thumps"><i class="iconfont icon-dianzan1"></i><i>12</i></div>
          </div>
        </div>
        <infinite-loading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
          <span slot="no-more">
            暂无更多加载
          </span>
          <span slot="no-results">
            暂无结果
          </span>
        </infinite-loading>
      </div>
    <div class="add-buy" ref="footer">
      <ul>
        <li>
          <div>
            <router-link :to="{path:'/StoreHome',query:{storeId:storeId}}">
              <p><i class="iconfont icon-dianpu colorff8800"></i></p>
              <p>店铺</p>
            </router-link>
          </div>
          <div @click="collection">
            <p><i class="iconfont" :class="collectNum==0 ? 'icon-shoucang-weixuan color999' : 'icon-shoucang-xuanzhong colorff8800'"></i></p>
            <p>收藏</p>
          </div>
          <div v-if="priceNegotiable === 0">
            <a href="#/ShopList">
              <p><i class="iconfont icon-gouwucheicon color999"></i></p>
              <p>购物车</p>
            </a>
          </div>
          <div v-if="priceNegotiable === 1">
            <a href="#/InquiryList">
              <p><i class="iconfont icon-xunjiadan-weixuanzhong color999"></i></p>
              <p>待询价</p>
            </a>
          </div>
        </li>
        <li v-if="priceNegotiable === 0 " @click="addToCartInquiry('addCartItems')">加入购物车</li>
        <li v-if="priceNegotiable === 0 " @click="buyInquiryNow('buy_now')" >立即购买</li>
        <li v-if="priceNegotiable === 1 " @click="addToCartInquiry('addInquiry')">加入待询价</li>
        <li v-if="priceNegotiable === 1 " @click="buyInquiryNow('inquiryNow')">立即询价</li>
      </ul>
    </div>
    <div class="promotion-popup" v-if="promotionShowState && promotionType === 'YH'" @touchmove.prevent>
      <div class="popup-con">
        <div class="popup-tit">优惠券<span  @click="showPromotionInfo">ｘ</span></div>
        <div class="popup-list">
          <div class="coupon-type-list">
            <div class="coupon-tit">可领取的优惠券</div>
            <div v-if="promotionList.canPromotionList.length == 0" class="coupon-info-nodata">
              <p><i class="iconfont icon-quan"></i></p>
              <p>暂无可领取优惠券</p>
            </div>
            <div class="coupon-info" v-for="(obj,index) in promotionList.canPromotionList" :key="index" v-if="promotionList.canPromotionList.length>0">
              <div class="coupon">
                <div><span>￥</span><span>{{obj.couponPrice}}</span></div>
              </div>
              <div class="condition">
                <p>满{{obj.couponLimit}}可用</p>
                <p>{{obj.startTimeStr.substring(0,10)}}～{{obj.endTimeStr.substring(0,10)}}</p>
              </div>
              <div class="receive" @click="receiveCoupon(obj.couponId)">领取</div>
            </div>
          </div>
          <div class="coupon-type-list"  v-if="promotionList.gotPromotionList.length>0">
            <div class="coupon-tit">已领取的优惠券</div>
            <div class="coupon-info" v-for="(obj,index) in promotionList.gotPromotionList" :key="index">
              <div class="coupon">
                <div><span>￥</span><span>{{obj.couponPrice}}</span></div>
              </div>
              <div class="condition">
                <p>满{{obj.couponLimit}}可用</p>
                <p>{{obj.startTimeStr.substring(0,10)}}～{{obj.endTimeStr.substring(0,10)}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="promotion-popup" v-if="promotionShowState && promotionType === 'ZK'" @touchmove.prevent>
      <div class="popup-con">
        <div class="popup-tit">折扣<span  @click="showPromotionInfo">ｘ</span></div>
        <div class="discount-detail">
          <div class="discount-flag">折扣</div>
          <div class="discount-labal">
            <span v-for="(coupon,index) in  goodsList[0].promotionList" :key="index" v-if="index <  goodsList[0].promotionList.length - 1">{{coupon.couponDesc + '，'}}</span>
            <span v-for="(coupon,index) in  goodsList[0].promotionList" :key="index" v-if="index ==  goodsList[0].promotionList.length - 1">{{coupon.couponDesc + '。'}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="select-address" v-else>
    <area-selector @selectArea="handleSelection"></area-selector>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import InfiniteLoading from 'vue-infinite-loading';
  import Pagination from '../../../components/Pagination.vue';
  const AreaSelector = () => import("../../../components/mall/AreaSelector.vue");
  export default {
    data:function () {
      return{
        checkedArr:[], //规格判断
        selected: 0,
        showIndex: 0,
        tabList:['商品','详情','评价'],
        commentList:[],   //评论
        goodsList:[],     //商品
        detailList:[],    //详情
        specList:[],  //规格
        bannerPrefix:'',  //图片地址
        banner:[],        //商品图片
	      storeId:'',
        swiperOption: {
          autoplay:true,
          pagination: {
            el: '.swiper-pagination'
          }
        },
        goodsStorePrice:'',   //商品价格
        buyValue:1,   //购买数量
        goodsId:'',   //商品ID
        specId:'',    //规格组合id
        specIdArr:[],
        goodsSpecObj:'', //组合
        collectNum:0,
        promotionShowState:false,
	      promotionType:'',
        promotionList:[],
	      priceNegotiable:'',
	      shipAddress:'',
        receiveAddress:'',
        transportPrice:'',
	      showSelection: true,
	      areaObj: {}
      }
    },
    components: {
      InfiniteLoading,
      Pagination,
      swiper,
      swiperSlide,
	    AreaSelector
    },
    mounted () {

//      let headerH=window.getComputedStyle(this.$refs.header).height.replace("px","");
//      //console.log(headerH);
//      let footerH=window.getComputedStyle(this.$refs.footer).height.replace("px","");
//      //console.log(footerH);
//      let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//      //console.log(winH);
//      let conH=winH-headerH-footerH;
//      this.$refs.conpart.style.height = conH +'px';
    },
    methods: {
    	//领取优惠券
	    receiveCoupon(couponId){
	    	console.log(couponId);
		    this.axios.post(this.baseURL.mall + '/m/my/getCoupon' +this.Service.queryString({
			    token:this.mallToken.getToken(),
			    couponId:couponId
		    })).then(res=>{
			    console.log(res);
			    if(res.data.h.code === 200){
			    	this.$toast("领取成功");
			    	this.getCouponList();
          }else if(res.data.h.code === 30){
				    if(this.isApp.state){
					    window.location.href = "epipe://?&mark=login";
				    }else{
					    this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
				    }
          }else{
				    this.$toast(res.data.h.msg);
          }
		    })
      },
      //优惠券详情列表
      getCouponList(){
	      this.axios.post(this.baseURL.mall + "/m/my/myGoodsCoupons"+this.Service.queryString({
		      token:this.mallToken.getToken(),
		      goodsId:this.goodsId
	      })).then(res=>{
		      console.log(res);
		      if(res.data.h.code === 200){
			      this.promotionList=res.data.b;
		      }else if(res.data.h.code === 30){
			      if(this.isApp.state){
				      window.location.href = "epipe://?&mark=login";
			      }else{
				      this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
			      }
		      }
	      })
      },
    	//促销信息详情展开
	    showPromotionInfo(promotionType){
	    	console.log(promotionType);
	    	this.promotionShowState=!this.promotionShowState;
	    	if(promotionType === 'YH'){
			    this.getCouponList();
        }
      },
      //tab切换
      change(index) {
        this.selected = index;
        this.showIndex = index;
      },
      //更换发货地址
	    changeTrasAdress(){
	    	this.showSelection = false;
      },
	    /*监听回调函数*/
	    handleSelection(obj){
		    console.log(obj);
		    this.receiveAddress = obj.provice+obj.city+obj.area;
		    this.areaObj = obj;
		    this.showSelection = true;
		    this.axios.post(this.baseURL.mall + "/m/goods/queryTransportInfoByAreaId"+this.Service.queryString({
			    token: this.mallToken.getToken(),
			    goodsId: this.goodsId,
          storeId: this.storeId,
			    areaId: obj.areaId
		    })).then(res=>{
		    	  if(res.data.h.code == 200){
		    	  	this.transportPrice = res.data.b.sprice;
            }
        })
	    },
      //选择规格
      selt(i,j){
        console.log(i,j);
        this.$set(this.checkedArr,i,j);
//        let valueId=e.target.getAttribute('data-value-id');
        let valueId=this.specList[i].specValueList[j].spValueId;
        this.specIdArr.splice(i,1,valueId);
        let state=false;
        console.log(this.specIdArr);
        for(let a=0;a<this.specIdArr.length;a++){
          if(this.specIdArr[a]=='' ||  this.specIdArr[a]==undefined ||  typeof (this.specIdArr[a])==undefined){
           state=true;
          }
        }
        if(state!==true){
          let specIdStr=this.specIdArr.join(',');
          this.specId=this.goodsSpecObj[specIdStr].goodsSpecId;     //匹配组合规格id
          this.goodsStorePrice=this.goodsSpecObj[specIdStr].specGoodsPrice;   //选择完整规格后价格更新
          console.log('specId',this.specId);
        }
      },
      handleInput(e){
        e.target.value=e.target.value.replace(/[^\d]/g,'');
      },
      //购买商品加减
      add(){
        this.buyValue++;
      },
      reduce(){
        if(this.buyValue!==1){
          this.buyValue--;
        }
      },
      //收藏商品&取消收藏
      collection(){
        console.log(this.goodsId);
        let url='';
        if(this.collectNum==0){
          url='/m/favorite/collectGoods';
        }else{
          url='/m/favorite/deleteFavGoods';
        }
        this.axios.post(this.baseURL.mall + url +this.Service.queryString({
          token:this.mallToken.getToken(),
          goodsIds:this.goodsId
        })).then(res=>{
          console.log(res);
          if(res.data.h.code===200){
            this.$toast(res.data.b.msg);
            this.getGoodsDetail();
          }else  if(res.data.h.code === 50 || res.data.h.code === 30){
            if(this.isApp.state){
              window.location.href = "epipe://?&mark=login";
            }else{
	            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }else{
            this.$toast(res.data.h.msg);
          }
        })
      },
      //加入购物车(加入待询价)
	    addToCartInquiry(url){
        if(this.specList.length>0){
          if(this.specId==''){
            this.$toast('请选择规格');
            return false;
          }
        }
        this.axios.post(this.baseURL.mall + "/m/cart/"+url+this.Service.queryString({
          token:this.mallToken.getToken(),
          goodsId:this.goodsId,
          count:this.buyValue,
          specId:this.specId!='' ? this.specId : this.goodsList[0].specId
        })).then(res=>{
          console.log(res);
          if(res.data.h.code==200){
            this.$toast(res.data.b.msg);
          }else  if(res.data.h.code === 50 || res.data.h.code === 30){
            if(this.isApp.state){
              window.location.href = "epipe://?&mark=login";
            }else{
	            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }else{
            this.$toast(res.data.h.msg);
          }
        })
      },
      //立即购买(立即询价)
	    buyInquiryNow(url){
        if(this.specList.length>0){
          if(this.specId==''){
            this.$toast('请选择规格');
            return false;
          }
        }
        this.axios.post(this.baseURL.mall + "/m/cart/"+url+this.Service.queryString({
          token:this.mallToken.getToken(),
          goodsId:this.goodsId,
          count:this.buyValue,
          specId:this.specId!='' ? this.specId : this.goodsList[0].specId
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
              this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }else{
            this.$toast(res.data.h.msg);
          }
        })
      },
      /*设置缓存*/
      setStore: function (item){
        let storeList = localStorage.getItem("browser_history") ? JSON.parse(localStorage.getItem("browser_history")) : new Array();
        if(JSON.stringify(storeList).indexOf(JSON.stringify(item)) < 0){
          storeList.unshift(item);
          if(storeList.length>20){
            storeList = storeList.splice(0,20);
          }
        }
        localStorage.setItem("browser_history",JSON.stringify(storeList));
        console.log("localList",storeList);
      },
      //获取商品信息与详情
      getGoodsDetail(){
        this.axios.get(this.baseURL.mall + '/m/goods/goodsInfo?goodsId='+this.$route.query.goodsId+'&token='+this.mallToken.getToken()).then(res =>{
          console.log("商品详情",res);
          if(res.data.h.code === 200){
            let goodsData=res.data.b;
            this.setStore(goodsData.goods[0]);
            this.goodsStorePrice=goodsData.goods[0].goodsStorePrice;
            this.promotionType=goodsData.goods[0].promotionType;
            this.goodsList=goodsData.goods;
            this.priceNegotiable=goodsData.goods[0].priceNegotiable;
            this.storeId=goodsData.goods[0].storeId;
            if(goodsData.goodsSpecObj){
              this.goodsSpecObj=goodsData.goodsSpecObj;
            }
            this.collectNum=goodsData.goods[0].collectState;
            if(goodsData.specList){
              this.specList=goodsData.specList;
              this.specIdArr=new Array(goodsData.specList.length);
              for(let k=0;k<this.specList.length;k++){
                for(let j=0;j<this.specList[k].specValueList.length;j++){
                  if(this.specList[k].specValueList.length==1){
                    this.selt(k,j);   //只有一种规格默认获取specId
                  }
                }
              }
            }
            this.bannerPrefix=goodsData.imgPrefix;
            localStorage.setItem("imgPrefix",goodsData.imgPrefix);
            this.banner=goodsData.goods[0].goodsImageMore;
            let detailImg= goodsData.detail[0].replace(/&lt;/g,"<");
            detailImg= detailImg.replace(/&gt;/g,">");
            this.detailList.push(detailImg);
            this.goodsId=goodsData.goods[0].goodsId;
	          this.getTransportInfo();
          }
        })
      },
      //获取发货信息
      getTransportInfo(){
	      this.axios.post(this.baseURL.mall + "/m/goods/autoGetTransportInfoByIp"+this.Service.queryString({
		      token:this.mallToken.getToken(),
          goodsId: this.goodsId,
          storeId: this.storeId
	      })).then(res=> {
		      //console.log('发货信息'+res);
          if(res.data.h.code == 200){
          	this.shipAddress = res.data.b.goodsAreaInfo;
          	this.receiveAddress = res.data.b.areaInfo;
          	this.transportPrice = res.data.b.sprice;
          }
	      })
      },
      //获取商品评论
      onInfinite(){
        this.axios.get(this.baseURL.mall + '/m/goods/goodsComment',{
          params: {
            pageNo:this.commentList.length/10+1,
            pageSize: 10,
            goodsId: this.$route.query.goodsId
          }
        }).then(res =>{
          console.log("商品评论",res);
          if(res.data.h.code === 200){
            if (res.data.b.comment.length == 0) {
              console.log("加载完了")
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else if (res.data.b.comment) {
              this.commentList = this.commentList.concat(res.data.b.comment)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          }else{
            console.log("加载完了")
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        })
      }
    },
    created(){
      document.title="商品详情";
      this.getGoodsDetail();
      //this.getComment();
    }
  }
</script>
<style lang="stylus">
  ::-webkit-scrollbar {/*隐藏滚轮*/
    display: none;
    width: 0px;
  }
  .color999{
    color #999;
  }
  .colorff8800{
    color #ff8800;
  }
  .detail-tab{
    width 100%;
    height .45rem;
    line-height .45rem;
    background #fff;
    border-bottom 1px solid #e5e5e5;
    position fixed;
    top 0;
    z-index 10;
    ul{
      li{
        width 33.333%;
        float left;
        text-align center;
        span{
          display inline-block;
          width .5rem;
          font-size .16rem;
          color #333;
        }
      }
      li.tabActive{
        span{
          height .44rem;
          color #ff8800;
          border-bottom 1px solid #ff8800;
        }
      }
    }
  }
  .add-buy{
    width 100%;
    height 49px;
    line-height 49px;
    position fixed;
    bottom 0;
    ul{
      li{
        width 30%;
        text-align center;
        float left;
        font-size 15px;
        color #fff;
      }
      li:nth-child(1){
        height 48px;
        line-height 48px;
        border-top 1px solid #e5e5e5;
        background #fff;
        width 40%;
        div{
          width 33.333%;
          height 100%;
          float left;
/*          display flex;
          justify-content center;
          align-items center;*/
          p{
            line-height normal;
            font-size 12px;
            color #666;
          }
          p:first-child{
            margin-top 9px;
          }
        }
        div{
          p:first-child{
            margin-top 6px;
            i{
              font-size 18px;
            }
          }
        }
      }
      li:nth-child(2){
        background #f19b37;
      }
      li:nth-child(3){
        background #d74a45;
      }
    }
  }
  .conNoActive{
    display none;
  }
  .conActive{
    display block;
  }
  .tab-con{
    margin-top .45rem;
    padding-bottom 50px;
    /*overflow-y scroll;*/
    -webkit-overflow-scrolling touch;
    .goods-banner{
      height 3.75rem;
      background #fff;
      border-bottom 1px solid #e5e5e5;
      .swiper-container{
        height 100%;
        img{
          height 100%;
        }
      }
    }
    .goods-des{
      padding .15rem;
      background #fff;
      p{
        font-size .16rem;
        color #333;
        line-height .24rem;
        text-align justify;
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        word-break: break-all;
        overflow: hidden;
      }
      .goods-price{
        margin-top .15rem;
        span{
          color #d74a45;
          font-size .18rem;
        }
        .origina-priece{
          margin-left .1rem;
          font-size .14rem;
          color #999;
        }
      }
      .promotion-detail{
        display -webkit-flex;
        display flex;
        margin-top .15rem;
        div{
          font-size .12rem;
          color #999;
          span{
            display inline-block;
            padding 0 .05rem;
            height .2rem;
            line-height .2rem;
            text-align center;
            border-radius 2px;
            border 1px solid #d74a45;
            color #d74a45;
            font-size .12rem;
            margin-left .1rem;
            margin-bottom .1rem;
          }
          .discount-span{
            width auto;
            border none;
            color #666;
            margin-left 0;
          }
        }
        .promotion-tit{
          height .22rem;
          line-height .22rem;
        }
        .discount-tit{
          width .4rem;
          height .2rem;
          line-height .2rem;
          border 1px solid #d74a45;
          border-radius 2px;
          color #d74a45;
          text-align center;
          margin-right .1rem;
        }
        .promotion-con{
          flex 1;
          height .22rem;
          line-height .22rem;
          font-size .12rem;
          color #666;
        }
        .promotion-more{
          font-size .26rem;
          line-height .1rem;
        }
      }
    }
    .goods-transport{
      margin-top .1rem;
      padding .15rem;
      background #fff;
      .one-line{
        margin-bottom .2rem;
        &:last-child{
          margin-bottom 0;
        }
        span{
          line-height 1.27;
          font-size .14rem;
        }
        .sp1{
          color #999;
          margin-right .1rem;
        }
        .sp2{
          color #333;
        }
        .sp3{
          float right;
          font-size .12rem;
          color #ccc;
        }
        .sp4{
          font-size .14rem;
          color #d94a45;
          i{
            font-size .12rem;
            font-style normal;
            margin-left .05rem;
          }
        }
      }
    }
    .goods-spec{
      margin-top .1rem;
      padding .15rem;
      background #fff;
      ul{
        overflow hidden;
        li{
          margin-top .05rem;
          overflow hidden;
          div{
            float left;
          }
          .spec-name{
            width .5rem;
            height .3rem;
            line-height .3rem;
            text-align right;
            font-size .12rem;
            color #999;
            margin .1rem .1rem 0 0;
            overflow hidden;
          }
          .con-spec{
            width calc(100% - .6rem);
            float left;
            span{
              display inline-block;
              height .28rem;
              line-height .28rem;
              border 1px solid #999;
              padding 0 .1rem;
              margin .1rem .1rem 0 0;
              font-size .14rem;
              color #333;
              border-radius 2px;
            }
            .specActive{
              color #d74a45;
              border-color #d74a45;}
          }
        }
        li:first-child{
          margin-top 0;
        }
        li:last-child{
          span{
            margin-right 0;
            border-radius 0;
            padding 0;
            input{
              background none;
              width .3rem;
            }
          }
          span:nth-child(2){
            border-left none;
            border-right none;
            input{
              width .5rem;
              text-align center;
            }
          }
        }
      }
    }
    .goods-type{
      height .9rem;
      margin .1rem 0;
      background #fff;
      ul{
        height 100%;
        overflow hidden;
        li{
          width 33.33%;
          height 100%;
          float left;
          display flex;
          justify-content center;
          align-items center;
          div{
            text-align center;
            width 100%;
            border-right 1px solid #e5e5e5;
            p{
              line-height 1.27;
            }
            .p1{
              font-size .16rem;
              color #333;
            }
            .p2{
              font-size .12rem;
              color #999;
              margin-top .06rem;
            }
          }
        }
        li:last-child{
          div{
            border-right none;
          }
        }
      }
    }
    .goods-spcpic{
      width 100%;
      padding 0 .1rem;
      box-sizing border-box;
      overflow hidden;
      p{
        width 100%;
        overflow hidden;
        color: red;
        img{
          width 100%;
          display block;
        }
      }
      img{
        width 100%;
        display block;
      }
    }
    .comment{
      overflow hidden;
      padding .15rem .15rem .12rem .15rem;
      border-bottom 1px solid #e5e5e5;
      .user-info{
        overflow hidden;
        div{
          float left;
          height .4rem;
          line-height .4rem;
        }
        .pic{
          width .4rem;
          border-radius 50%;
          margin-right .1rem;
          overflow hidden;
          img{
            width 100%;
          }
        }
        .pho{
          font-size .12rem;
          color #999;
          margin-right .15rem;
        }
        .star{
          i{
            color #ff8800;
            margin-right .04rem;
          }
        }
      }
      .comment-con{
        font-size .14rem;
        color #333;
        text-align justify;
        line-height .24rem;
        margin-top .08rem;
      }
      .time{
        margin-top .15rem;
        .time-con{
          float left;
          font-size .12rem;
          color #999;
        }
        .thumps{
          float right;
          i{
            font-style normal;
          }
          i:nth-child(1){
            font-size .14rem;
            //color #4c88ff;
          }
          i:nth-child(2){
            font-size .12rem;
            //color #4c88ff;
            margin-left .06rem;
          }
        }
      }
    }
  }
  .promotion-popup{
    width 100%;
    height 100%;
    position fixed;
    left 0;
    top 0;
    z-index 10;
    background rgba(0,0,0,0.2);
    overflow scroll;
    -webkit-overflow-scrolling: touch;
  }
  .popup-con{
    width 100%;
    background #fff;
    position absolute;
    left 0;
    bottom 0;
    z-index 11;
    .popup-tit{
      width 100%;
      height .45rem;
      line-height .45rem;
      text-align center;
      font-size .16rem;
      color #333;
      border-bottom 1px solid #e5e5e5;
      position relative;
      span{
        position absolute;
        right .15rem;
        top 50%;
        transform translateY(-50%);
        color #999;
      }
    }
    .popup-list{
      padding-bottom .15rem;
      overflow hidden;
      .coupon-info-nodata{
        padding-bottom .2rem;
        p{
          text-align center;
          color #999;
          &:first-child{
            i{
              font-size .8rem;
            }
          }
        }
      }
      .coupon-type-list{
        padding 0 .15rem;
        overflow hidden;
        position relative;
        &:first-child::after{
          content: "";
          position absolute;
          left 0;
          bottom: 0;
          width 100%;
          height: 1px;
          background #e5e5e5;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
      .coupon-tit{
        height .45rem;
        line-height .45rem;
        font-size .14rem;
        color #333;
      }
      .coupon-info{
        height .75rem;
        display flex;
        display -webkit-flex ;
        margin-bottom .15rem;
        .coupon{
          width 1rem;
          height 100%;
          background #ffcc33;
          position relative;
          div{
            position absolute;
            left 50%;
            top 50%;
            transform translate(-50%,-50%);
            -webkit-transform translate(-50%,-50%);
            span{
              color #fff;
            }
            span:first-child{
              font-size .18rem;
            }
            span:last-child{
              font-size .5rem;
            }
          }
        }
        .condition{
          flex 1;
          margin-left .1rem;
          p{
            line-height 1.27;
            margin-top .18rem;
            font-size .12rem;
          }
          p:first-child{
            color #666;
          }
          p:last-child{
            color #999;
          }
        }
        .receive{
          width .6rem;
          height .25rem;
          line-height .25rem;
          text-align center;
          font-size .12rem;
          color #fff;
          background #ffcc33;
          border-radius .2rem;
          position relative;
          top 50%;
          margin-top -.125rem;
        }
      }
    }
  }
  .discount-detail{
    padding .2rem .15rem 1.2rem .15rem;
    display flex;
    .discount-flag{
      width .4rem;
      height .2rem;
      line-height .2rem;
      border 1px solid #d74a45;
      border-radius 2px;
      color #d74a45;
      text-align center;
      margin-right .1rem;
    }
    .discount-labal{
      flex 1;
      span{
        font-size .12rem;
        color #666;
      }
    }
  }
</style>
