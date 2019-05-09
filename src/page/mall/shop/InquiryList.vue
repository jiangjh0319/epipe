<template>
  <div>
    <div class="order-menu">
      <router-link tag="div" :to="{path:'/inquirylist'}" class="menu-item menu-active">待询价</router-link>
      <router-link tag="div" :to="{path:'MyInquiryOrder'}" class="menu-item">询价单</router-link>
      <router-link tag="div" :to="{path:'MyInquiryOrder',query:{state:1}}" class="menu-item">卖家报价</router-link>
      <router-link tag="div" :to="{path:'MyInquiryOrder',query:{state:2}}" class="menu-item">买家确认</router-link>
      <router-link tag="div" :to="{path:'MyInquiryOrder',query:{state:3}}" class="menu-item">已下单</router-link>
      <router-link tag="div" :to="{path:'MyInquiryOrder',query:{state:4}}" class="menu-item">已取消</router-link>
    </div>
    <div v-if="shopList.length>0" class="shop-cart">
      <div class="hea-ope" @click="listOperate">{{operate}}</div>
      <div class="one-shop" v-for="(obj,index1) in shopList" :key="index1">
        <div class="seller-shop-name">
          <i class="iconfont" :class="obj.checked ? 'icon-xuanzhong1 select-d74a45' : 'icon-weixuan select-ccc' "  @click="chooseShopGoods(index1)"></i>{{obj.storeName}}
          <!--<input type="checkbox" name="oneStroe" v-model="obj.checked" @click="chooseShopGoods(index1)"/>-->
        </div>
        <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" v-for="(item,index) in obj.list" :key="index">
          <div class="shop-goods" >
            <div class="goods-ope">
              <i class="iconfont" :class="item.checked ? 'icon-xuanzhong1 select-d74a45' : 'icon-weixuan select-ccc'" @click.stop.prevent="chooseOne(index1,index)"></i>
              <!--<input type="checkbox" name="one" v-model="item.checked" @click.stop.prevent="chooseOne(index1,index)"/>-->
            </div>
            <div class="goods-pho"><img :src="imgPrefix+item.goodsImages" alt=""></div>
            <div class="goods-class">
              <P class="p1">{{item.goodsName}}</P>
              <P class="p2" v-if="item.specInfo!==''" v-html="item.specInfo"></P>
              <P class="p2" v-if="item.specInfo===''">无具体规格</P>
              <section class="price-num">
                <section class="price" v-if="item.priceNegotiable === 0"><i>￥</i>{{item.goodsPrice}}
                  <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                </section>
                <section class="price" v-if="item.priceNegotiable === 1">待询价
                  <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                  <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                </section>
                <section class="original-price" v-if="item.goodsOriginalPrice">￥{{item.goodsOriginalPrice}}</section>
                <section class="num">
                  <span @click.stop.prevent="reduce(index1,index)"><i class="iconfont icon-jian"></i></span>
                  <span><input type="text" v-model="item.goodsNum" @click.stop.prevent="" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                               onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" @blur.stop.prevent="blur(index1,index,Number(item.goodsNum))"></span>
                  <span @click.stop.prevent="add(index1,index)"><i class="iconfont icon-jia1"></i></span>
                </section>
              </section>
            </div>
          </div>
        </router-link>
      </div>
      <div class="settlement">
        <div class="sel-all" >
          <div>
            <i class="iconfont" :class="allChecked ? 'icon-xuanzhong1 select-d74a45' : 'icon-weixuan select-ccc' " @click="chooseAllGoods"></i>
            <!--<input type="checkbox" name="all" v-model="allChecked" @click="chooseAllGoods"/>-->
          </div>
          <div>全选</div>
        </div>
        <div class="tot-price" v-if="showIndex==0">
          <div class="tot-price-btn" @click="settlement">去询价<i>({{selGoodsNum}}件)</i></div>
          <!--<div class="tot-price-num">总计：<i>￥{{totalPrice}}</i></div>-->
        </div>
        <div class="tot-price" v-if="showIndex==1">
          <div class="manage-shops" @click="delect">删除</div>
          <div class="manage-shops" @click="addToCollection">移入收藏</div>
        </div>
      </div>
    </div>
    <div v-else class="noShopListData">
      <div class="noIcon"><img src="../../../assets/shopIcon.png" alt=""></div>
      <p>哎呦，您的询价单空空如也～</p>
      <div class="goToShop"><a href="#/mallhome">去逛逛</a></div>
    </div>
    <footer-tab :category="3" ref="footertab"></footer-tab>
  </div>
</template>
<script>
	import FooterTab from "../../../components/mall/FooterTab.vue";
	export  default{
		components:{
			FooterTab,
		},
		data: function () {
			return {
				allChecked:false,
				operate:'编辑商品',
				showIndex:0,
				shopList:[],    // 购物车列表
				imgPrefix:'',   //图片前缀
				cartIds:[],
				goodsIds:[],
				selGoodsNum:0,
				totalPrice:0,
			}
		},
		methods:{
			listOperate(){
				if(this.showIndex===0){
					this.operate='完成';
					this.showIndex=1;
				}else{
					this.operate='编辑商品';
					this.showIndex=0;
					this.getCartList();
				}
			},
			//购买商品加减
			add(i,j){
				/* this.selGoodsNum=0;
         this.totalPrice=0;*/
				this.shopList[i].list[j].goodsNum++;
				if(this.shopList[i].list[j].checked){
					this.totalPrice+=this.shopList[i].list[j].goodsPrice
				}
				this.axios.post(this.baseURL.mall + "/m/cart/mergeInquiryGoodsQuantity"+this.Service.queryString({
					isApp:this.isApp.state,
					token:this.mallToken.getToken(),
					cartId:this.shopList[i].list[j].cartId,
					specId:this.shopList[i].list[j].specId,
					count:this.shopList[i].list[j].goodsNum
				})).then(res=>{
					console.log("修改购物车",res);
					if(res.data.h.code==200){
						this.getCartList();
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
			reduce(i,j){
				/*        this.selGoodsNum=0;
                this.totalPrice=0;*/
				if(this.shopList[i].list[j].goodsNum!==1){
					this.shopList[i].list[j].goodsNum--;
					if(this.shopList[i].list[j].checked){
						this.totalPrice-=this.shopList[i].list[j].goodsPrice
					}
				}
				this.axios.post(this.baseURL.mall + "/m/cart/mergeInquiryGoodsQuantity"+this.Service.queryString({
					isApp:this.isApp.state,
					token:this.mallToken.getToken(),
					cartId:this.shopList[i].list[j].cartId,
					specId:this.shopList[i].list[j].specId,
					count:this.shopList[i].list[j].goodsNum
				})).then(res=>{
					console.log("修改购物车",res);
					if(res.data.h.code==200){
						this.getCartList();
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
			//输入框失去焦点
			blur(i,j,value){
				console.log(i,j,value);
				if(value===this.shopList[i].list[j].goodsNum){
					return false;
				}else if(value==0 || value==''){
					value=1;
				}
				this.axios.post(this.baseURL.mall + "/m/cart/mergeInquiryGoodsQuantity"+this.Service.queryString({
					isApp:this.isApp.state,
					token:this.mallToken.getToken(),
					cartId:this.shopList[i].list[j].cartId,
					specId:this.shopList[i].list[j].specId,
					count:value
				})).then(res=>{
					console.log("修改购物车",res);
					if(res.data.h.code==200){
						this.getCartList();
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
			//获取购物车列表信息
			getCartList(){
				this.axios.post(this.baseURL.mall + "/m/cart/myInquiryList"+this.Service.queryString({
					//isApp:this.isApp.state,
					token:this.mallToken.getToken()
				})).then(res=>{
					console.log('购物车信息',res);
					if(res.data.h.code==200){
						let shopList=res.data.b.cartVoList;
						for(let i=0;i<shopList.length;i++){
							shopList[i].checked=false;
							for(let j=0;j<shopList[i].list.length;j++){
								shopList[i].list[j].checked=false;
							}
						}
						this.shopList=shopList;
						console.log(this.shopList);
						this.imgPrefix=res.data.b.imgPrefix;
						this.isChooseAll();
						this.reset();
					}else  if(res.data.h.code === 50 || res.data.h.code === 30){
						if(this.isApp.state){
							window.location.href = "epipe://?&mark=login";
						}else{
							this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
						}
					}
				})
			},
			// 全部商品全选
			chooseAllGoods () {
				let flag = true;
				if ( this.allChecked ) {
					flag = false;
				}
				for ( let i = 0, len = this.shopList.length; i < len; i++ ) {
					this.shopList[i].checked = flag;
					let list = this.shopList[i].list;
					for ( let k = 0, len1 = list.length; k < len1; k++ ) {
						list[k].checked = flag;
						if ( this.allChecked ) {
							this.goodsIds.splice(this.goodsIds.indexOf(list[k].goodsId),1);
							this.cartIds.splice(this.cartIds.indexOf(list[k].cartId),1);
							this.selGoodsNum-=list[k].goodsNum;
							this.totalPrice-=list[k].goodsNum*list[k].goodsPrice;
						}else{
							if(this.goodsIds.indexOf(list[k].goodsId)==-1){
								this.goodsIds.push(list[k].goodsId);
							}
							if(this.cartIds.indexOf(list[k].cartId)==-1){
								this.cartIds.push(list[k].cartId);
								this.selGoodsNum+=list[k].goodsNum;
								this.totalPrice+=list[k].goodsNum*list[k].goodsPrice;
							}
						}
					}
				}
				console.log("goodsIds:",this.goodsIds);
				console.log("cartIds:",this.cartIds);
				
				this.allChecked = !this.allChecked;
			},
			
			// 每个店铺全选
			chooseShopGoods ( index1) {
				let list = this.shopList[index1].list,
					len = list.length;
				if ( this.shopList[index1].checked ) {
					for (let i = 0; i < len; i++ ) {
						list[i].checked = false;
						this.goodsIds.splice(this.goodsIds.indexOf(list[i].goodsId),1);
						this.cartIds.splice(this.cartIds.indexOf(list[i].cartId),1);
						this.selGoodsNum-=list[i].goodsNum;
						this.totalPrice-=list[i].goodsNum*list[i].goodsPrice;
					}
					console.log("goodsIds:",this.goodsIds);
					console.log("cartIds:",this.cartIds);
				} else {
					for (let i = 0; i < len; i++ ) {
						list[i].checked = true;
						if(this.goodsIds.indexOf(list[i].goodsId)==-1){
							this.goodsIds.push(list[i].goodsId);
						}
						if(this.cartIds.indexOf(list[i].cartId)==-1){
							this.cartIds.push(list[i].cartId);
							this.selGoodsNum+=list[i].goodsNum;
							this.totalPrice+=list[i].goodsNum*list[i].goodsPrice;
						}
					}
					console.log("goodsIds:",this.goodsIds);
					console.log("cartIds:",this.cartIds);
				}
				this.shopList[index1].checked = !this.shopList[index1].checked;
				
				// 判断是否选择所有商品的全选
				this.isChooseAll();
			},
			
			// 单个选择
			chooseOne ( index1, index) {
				let list = this.shopList[index1].list,
					len = list.length;
				if ( list[index].checked ) {
					this.shopList[index1].checked = false;
					this.allChecked = false;
					list[index].checked = !list[index].checked;
					this.goodsIds.splice(this.goodsIds.indexOf(list[index].goodsId),1);
					console.log("goodsIds:",this.goodsIds);
					this.cartIds.splice(this.cartIds.indexOf(list[index].cartId),1);
					console.log("cartIds:",this.cartIds);
					this.selGoodsNum-=list[index].goodsNum;
					this.totalPrice-=list[index].goodsNum*list[index].goodsPrice;
				} else {
					list[index].checked = !list[index].checked;
					if(this.goodsIds.indexOf(list[index].goodsId)==-1){
						this.goodsIds.push(list[index].goodsId);
					}
					console.log("goodsIds:",this.goodsIds);
					this.cartIds.push(list[index].cartId);
					console.log("cartIds:",this.cartIds);
					this.selGoodsNum+=list[index].goodsNum;
					this.totalPrice+=list[index].goodsNum*list[index].goodsPrice;
					// 判断是否选择当前店铺的全选
					let flag = true;
					for (let i = 0; i < len; i++ ) {
						if ( list[i].checked == false ) {
							flag = false;
							break;
						}
					}
					flag == true ? this.shopList[index1].checked = true : this.shopList[index1].checked = false;
				}
				// 判断是否选择所有商品的全选
				this.isChooseAll();
			},
			// 判断是否选择所有商品的全选
			isChooseAll () {
				let flag1 = true;
				for ( let i = 0, len = this.shopList.length; i < len; i++ ) {
					if ( this.shopList[i].checked == false ) {
						flag1 = false;
						break;
					}
				}
				flag1 == true ? this.allChecked = true : this.allChecked = false;
			},
			//删除
			delect(){
				if(this.cartIds.length==0){
					this.$toast("未选择要删除的商品");
					return false;
				}
				this.$confirm('确认要删除吗?').then(()=>{
					this.axios.post(this.baseURL.mall + "/m/cart/deleteCartItems"+this.Service.queryString({
						token:this.mallToken.getToken(),
						cartIds:this.cartIds.join(',')
					})).then(res=>{
						console.log(res);
						if(res.data.h.code==200){
							this.$toast("删除成功");
							this.$refs.footertab.getGoodsNumber();
							this.getCartList();
							this.reset();
						}else{
							this.$toast(res.data.h.msg);
						}
					})
				}).catch(()=>{
					this.getCartList();
					this.reset();
				})
			},
			//移入收藏夹
			addToCollection(){
				if(this.goodsIds.length==0){
					this.$toast("未选择要收藏的商品");
					return false;
				}
				this.axios.post(this.baseURL.mall + "/m/favorite/collectGoods"+this.Service.queryString({
					token:this.mallToken.getToken(),
					goodsIds:this.goodsIds.join(',')
				})).then(res=>{
					console.log(res);
					if(res.data.h.code==200){
						this.$toast("移入收藏夹成功");
						this.getCartList();
						this.reset();
					}else{
						this.$toast(res.data.h.msg);
					}
				})
			},
			//重置未选择状态
			reset(){
				this.cartIds=[];
				this.goodsIds=[];
				this.selGoodsNum=0;
				this.totalPrice=0;
			},
			//结算
			settlement(){
				this.axios.post(this.baseURL.mall + "/m/cart/confirmInquiry"+this.Service.queryString({
					token:this.mallToken.getToken(),
					cartIds:this.cartIds.join(',')
				})).then(res=>{
					console.log(res);
					if(res.data.h.code==200){
						localStorage.setItem("settleOrder",JSON.stringify(res.data.b));
						if(localStorage.getItem("settleOrder")){
							this.$router.push({path:'/ConfirmOrder'});
						}
					}else{
						this.$toast(res.data.h.msg);
					}
				})
			}
		},
		created(){
			document.title="购物车";
			this.getCartList();
		}
	}
</script>
<style lang="stylus" scoped>
  borderBottom(borderColor= #e9e9e9,borderWidth= 1px){
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: borderWidth;
    background: borderColor;
    transform: scaleY(0.5);
    transform-origin: center;
  }
  .order-menu{
    z-index 9;
    box-sizing border-box;
    position fixed;
    top 0;
    left 0;
    display flex;
    align-items center;
    width 100%;
    height 50px;
    padding-left 0.1rem;
    line-height 50px;
    background white;
  }
  .order-menu::after{
    borderBottom();
  }
  .menu-item{
    flex: 1;
    height inherit;
    text-align center;
    font-size 13px;
    color #666;
  }
  .menu-active{
    position relative;
    color: #ff8800;
    &::after{
      borderBottom(#ff8800,3px);
    }
  }
  .shop-cart{
    overflow hidden;
    margin-top .95rem;
    padding-bottom calc(.6rem + 50px);
    .hea-ope{
      height .45rem;
      line-height .45rem;
      background #fff;
      color #ff8800;
      text-align right;
      padding-right .15rem;
      font-size .14rem;
      position fixed;
      left 0;
      top .5rem;
      z-index 2;
      width 100%;
      box-sizing border-box;
    }
    .hea-ope:after{
      content: "";
      position absolute;
      left 0;
      bottom 0;
      width 100%;
      height 1px;
      background #e5e5e5;
      transform scaleY(0.5);
    }
    .one-shop{
      margin-top .1rem;
      background #fff;
      .seller-shop-name{
        height .45rem;
        line-height .45rem;
        font-size .16rem;
        color #333;
        position relative;
        input{
          position absolute;
          width .24rem;
          height 100%;
          left .1rem;
          top 0;
          z-index 10;
          opacity 0;
        }
        i{
          margin 0 .1rem;
          font-size .24rem;
          vertical-align middle;
        }
      }
      .seller-shop-name:after{
        content: "";
        position absolute;
        left 0;
        bottom 0;
        width 100%;
        height 1px;
        background #e5e5e5;
        transform scaleY(0.5);
      }
      .shop-goods{
        overflow hidden;
        height 1.35rem;
        position relative;
        div{
          float left;
          margin-right .1rem;
        }
        .goods-ope{
          margin-left .1rem;
          margin-top .43rem;
          position relative;
          input{
            position absolute;
            width 100%;
            height 100%;
            left 0;
            top 0;
            z-index 10;
            opacity 0;
          }
          i{
            font-size .24rem;
          }
        }
        .goods-pho{
          width .8rem;
          height .8rem;
          margin-top .15rem;
          img{
            display block;
            width 100%;
            position relative;
            top 50%;
            transform translateY(-50%);
          }
        }
        .goods-class{
          margin-right 0;
          padding-right .1rem;
          box-sizing border-box;
          width calc(100% - 1.34rem);
          margin-top .15rem;
          .p1{
            font-size .14rem;
            color #333;
            line-height .2rem;
            height .4rem;
            overflow hidden;
            word-break break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .p2{
            font-size .14rem;
            color #999;
            margin-top .08rem;
            height .2rem;
            overflow hidden;
            word-break break-all;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .price-num{
            overflow hidden;
            height .3rem;
            line-height: .3rem;
            margin-top .1rem;
            .price{
              float left;
              color #d74a45;
              font-size .16rem;
              position relative;
              i{
                font-style normal;
                font-size .12rem;
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
                top .06rem;
                right -0.28rem;
                margin-right 0;
              }
            }
            .original-price{
              float left;
              margin-left .1rem;
              color #999;
              text-decoration line-through;
              font-size .14rem;
            }
            .num{
              font-size 0;
              float right;
              span{
                display inline-block;
                width .29rem;
                height .29rem;
                border-radius 2px;
                background #f7f7f7;
                text-align center;
                line-height .29rem;
                margin-right .01rem;
                i{
                  color #666;
                }
              }
              span:nth-child(2){
                width .49rem;
              }
              span:last-child{
                margin-right 0;
              }
              input{
                width 100%;
                height .29rem;
                border-radius 2px;
                text-align center;
                background #f7f7f7;
                color #999;
              }
              input:focus{
                outline none;
              }
            }
          }
        }
      }
      .shop-goods:after{
        content: "";
        position absolute;
        left 0;
        bottom 0;
        width 100%;
        height 1px;
        background #e5e5e5;
        transform scaleY(0.5);
      }
      .shop-goods:last-child:after{
        height 0;
      }
    }
    .settlement{
      width 100%;
      height .49rem;
      background #fff;
      position fixed;
      bottom 49px;
      z-index 11;
      .sel-all{
        float left;
        text-align center;
        margin-left .1rem;
        position relative;
        top 50%;
        transform translateY(-50%);
        div:first-child{
          position relative;
          input {
            position absolute;
            width 100%;
            height 100%;
            left 0;
            top 0;
            display inline-block;
            z-index 10;
            opacity 0;
          }
          i{
            font-size .24rem;
          }
        }
        div:last-child{
          font-size .12rem;
          color #999;
        }
      }
      .tot-price{
        float right;
        height 100%;
        div{
          float right;
        }
        .tot-price-btn{
          width 1.2rem;
          height 100%;
          line-height .49rem;
          text-align center;
          background #d74a45;
          color #fff;
          font-size .15rem;
          i{
            font-size .12rem;
            font-style normal;
          }
        }
        .tot-price-num{
          margin-right .12rem;
          height 100%;
          line-height .49rem;
          text-align center;
          font-size .16rem;
          font-weight bold;
          color #333;
          i{
            font-style normal;
            font-weight normal;
            color #d74a45;
          }
        }
        .manage-shops{
          width .75rem;
          height .3rem;
          line-height .3rem;
          text-align center;
          font-size .14rem;
          color #fff;
          border-radius 2px;
          margin-right .1rem;
          position relative;
          top 50%;
          transform translateY(-50%);
        }
        .manage-shops:first-child{
          background #ff8800;
        }
        .manage-shops:last-child{
          background #999;
        }
      }
    }
    .settlement:after{
      content: "";
      position absolute;
      left 0;
      top 0;
      width 100%;
      height 1px;
      background #e5e5e5;
      transform scaleY(0.5);
    }
  }
  .select-ccc{
    color #ccc;
  }
  .select-d74a45{
    color #d74a45;
  }
  .noShopListData{
    margin-top 1rem;
    text-align center;
    .noIcon{
      width 1.3rem;
      height .95rem;
      margin 0 auto;
      img{
        width 100%;
      }
    }
    p{
      color #333;
      font-size .14rem;
      margin-top .3rem;
    }
    .goToShop{
      width 1rem;
      height .3rem;
      line-height .3rem;
      text-align  center;
      position relative;
      margin .3rem auto;
      a{
        display block;
        width 100%;
        height 100%;
        font-size .12rem;
        color #666;
        position absolute;
        z-index 2;
      }
    }
    .goToShop::after{
      content: "";
      position absolute;
      left 0;
      top 0;
      z-index 1;
      width 200%;
      height 200%;
      border: 1px solid #e5e5e5;
      transform scale(0.5);
      transform-origin 0 0;
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .shop-cart .settlement{
      bottom: 83px;
    }
  }
</style>
