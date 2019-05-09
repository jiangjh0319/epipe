<template>
  <div class="order-item">
    <div class="list-item">
      <div class="store-item">
        <div class="item-sup">
          <div class="store">{{obj.storeName}}</div>
          <div class="status" v-if="!obj.returnGoodsState && !obj.returnRefundState">{{obj.orderState | handleStatus}}</div>
          <div class="status" v-else>{{statusTitle}}</div>
        </div>
        <div class="item-sub">
          <div v-for="(item,index) in obj.orderGoodsList" :key="index">
            <div class="item-row" >
              <div class="goods-picture">
                <img :src="imgPrefix + item.goodsImage" alt="">
              </div>
              <div class="goods-details">
                <div class="goods-desc">
                  <p class="desc-title">{{item.goodsName}}</p>
                  <p class="desc-sub" v-html="item.specInfo"></p>
                </div>
                <div class="goods-price">
                  <p class="price">￥{{item.goodsPayPrice}}</p>
                  <p class="number">x{{item.goodsNum}}</p>
                  <p class="link-comment" v-if="obj.orderState === 50" @click.stop.prevent="linkToComment(item.recId)">评价</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrapper goods-price" >实付金额：￥{{obj.orderAmount}}</div>
      <div class="btn-wrapper" v-show="showBtn" v-if="obj.orderState === 0">
        <div class="btn btn-pay">订单详情</div>
      </div>
      <div class="btn-wrapper" v-show="showBtn" v-else-if="obj.orderState === 10">
          <div class="btn">订单详情</div>
          <div class="btn" @click.stop.prevent="cancleOrder">取消订单</div>
          <div class="btn btn-pay" @click.stop.prevent="wepay">微信支付</div>
          <div class="btn btn-pay" @click.stop.prevent="submitzfb"  v-if="isNotApp">支付宝支付</div>
      </div>
      <div class="btn-wrapper" v-show="showBtn" v-else-if="obj.orderState === 20">
        <div class="btn" @click.stop.prevent="refund" v-if="!obj.returnRefundState && !obj.returnGoodsState">申请退款</div>
        <div class="btn">订单详情</div>
        <div class="btn btn-pay btn-scale" v-if="obj.returnRefundState === 3" @click.stop.prevent="againRefund">重新申请退款</div>
        <div class="btn btn-pay" v-else-if="obj.returnGoodsState === 2 && !obj.returnRefundState" @click.stop.prevent="refund">申请退款</div>
        <div class="btn btn-pay btn-scale" v-else-if="obj.returnGoodsState === 3" @click.stop.prevent="againReturn">重新申请退货</div>
      </div>
      <div class="btn-wrapper" v-show="showBtn" v-else-if="obj.orderState === 40">
        <div class="btn">订单详情</div>
        <div class="btn" @click.stop.prevent="returnGoods" v-if="!obj.returnRefundState && !obj.returnGoodsState">申请退货</div>
        <div class="btn btn-pay" @click.stop.prevent="confirmReceipt" v-if="!obj.returnRefundState && !obj.returnGoodsState">确认收货</div>
        <div class="btn btn-pay btn-scale" v-if="obj.returnRefundState === 3" @click.stop.prevent="againRefund">重新申请退款</div>
        <div class="btn btn-pay" v-else-if="obj.returnGoodsState === 2 && !obj.returnRefundState" @click.stop.prevent="refund">申请退款</div>
        <div class="btn btn-pay btn-scale" v-else-if="obj.returnGoodsState === 3" @click.stop.prevent="againReturn">重新申请退货</div>
      </div>
      <div class="btn-wrapper" v-show="showBtn" v-else-if="obj.orderState === 50">
        <div class="btn" @click.stop.prevent="returnGoods" v-if="!obj.returnRefundState && !obj.returnGoodsState">申请退货</div>
        <div class="btn">订单详情</div>
        <div class="btn btn-pay btn-scale" v-if="obj.returnRefundState === 3" @click.stop.prevent="againRefund">重新申请退款</div>
        <div class="btn btn-pay" v-else-if="obj.returnGoodsState === 2 && !obj.returnRefundState" @click.stop.prevent="refund">申请退款</div>
        <div class="btn btn-pay btn-scale" v-else-if="obj.returnGoodsState === 3" @click.stop.prevent="againReturn">重新申请退货</div>
      </div>
      <div class="btn-wrapper" v-show="showBtn" v-else>
        <div class="btn">订单详情</div>
        <div class="btn" @click.stop.prevent="cancleOrder">取消订单</div>
        <div class="btn btn-pay" @click.stop.prevent="wepay">立即下单</div>
      </div>
    </div>
    <div class="dialog" v-if="showDialog" @touchmove.prevent>
      <div class="dialog_box">
        <div class="dialog-title">
          请确认微信支付是否已完成
        </div>
        <div class="dialog-cont" @click="go_payDetails">
          已完成支付
        </div>
        <div class="dialog-rests" @click="go_payDetails">
          支付遇到问题,重新支付
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "OrderItem",
    props:{
      obj:{
        required: true,
      },
      imgPrefix:{
        required: true,
      },
      showBtn:{
        default: true,
      }
    },
    data(){
      return{
        statusTitle: "",
        isNotApp:false,
        token:'',
	      showDialog:false,
	      orderSn:''
      }
    },
    filters:{
      handleStatus(state){
        switch (state){
          case 0:
            return "已取消";
            break;
          case 10:
            return "待付款";
            break;
          case 20:
            return "已付款";
            break;
          case 40:
            return "已发货";
            break;
          case 50:
            return "已完成";
            break;
        }
      }
    },
    mounted(){
      if(this.obj.returnRefundState){
        switch (this.obj.returnRefundState){
          case 1:
            this.statusTitle = "申请退款中";
            break;
          case 2:
            this.statusTitle = "审核通过";
            break;
          case 3:
            this.statusTitle = "审核不通过";
            break;
          case 4:
            this.statusTitle = "退款完成";
            break;
        }
      }else{
        switch (this.obj.returnGoodsState){
          case 1:
            this.statusTitle = "申请退货中";
            break;
          case 2:
            this.statusTitle = "审核通过";
            break;
          case 3:
            this.statusTitle = "审核不通过";
            break;
        }
      }
    },
    methods:{
      /*微信支付*/
      wepay(){
        this.axios.post(this.baseURL.mall + "/m/my/"+ (this.isNotApp ? 'h5_wxpay_order' : (this.mallType.type === "2c" ? "getCodeByOrderListOrDetail" : "h52bWXPay")) + this.Service.queryString({
          token: this.mallToken.getToken(),
          orderSn: this.obj.orderSn
        })).then(res =>{
          if(res.data.h.code === 200){
	          if(this.isNotApp){
		          let data={};
		          this.orderSn=res.data.b.orderSn;
		          data.orderSn=res.data.b.orderSn;
		          data.imgPrefix=this.imgPrefix;
		          console.log(data);
		          data=JSON.stringify(data);
		          console.log(data);
		          window.location.href = "epipe://?&mark=weChatPay&data="+data+"&url="+res.data.b.orderStr+ '&redirect_url='+location.href;
		          setTimeout(()=>{
			          this.showDialog = true;
		          },3500);
	          }else{
		          window.location.href = res.data.b;
	          }
          }else  if(res.data.h.code === 50 || res.data.h.code === 30){
	          if(this.isApp.state){
		          window.location.href = "epipe://?&mark=login";
	          }else{
		          this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
	          }
          }else{
            this.$alert(res.data.h.msg);
          }
        })
      },
      //支付宝支付
      submitzfb(){
	      this.axios.post(this.baseURL.mall + "/m/my/appAlipayByOrder" + this.Service.queryString({
		      token: this.mallToken.getToken(),
		      orderSn: this.obj.orderSn
	      })).then(res =>{
		      if(res.data.h.code === 200){
			      let data={};
			      data.orderSn=res.data.b.orderSn;
			      data.imgPrefix=this.imgPrefix;
			      console.log(data);
			      data=JSON.stringify(data);
			      console.log(data);
			      window.location.href = "epipe://?&mark=aliPay&data="+data+"&url="+res.data.b.orderStr;
		      }else if(res.data.h.code === 50 || res.data.h.code === 30){
			      if(this.isApp.state){
				      window.location.href = "epipe://?&mark=login";
			      }else{
				      this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
			      }
		      }
	      })
      },
	    go_payDetails(){
		    this.$router.replace({path:'/orderdetails',query:{orderSn:this.orderSn,imgPrefix:this.imgPrefix}})
	    },
      /*申请退款*/
      refund(){
        console.log(this.obj.orderId);
        this.$confirm("确定要申请退款").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/applyRefund" + this.Service.queryString({
            token: this.mallToken.getToken(),
            orderId: this.obj.orderId
          })).then(res =>{
            console.log("申请退款",res);
            if(res.data.h.code === 200){
              this.$toast("申请成功");
              this.$router.replace("refundlist");
            }else  if(res.data.h.code === 50 || res.data.h.code === 30){
	            if(this.isApp.state){
		            window.location.href = "epipe://?&mark=login";
	            }else{
		            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
	            }
            }else{
              this.$toast(res.data.h.msg);
            }
          });
        }).catch(() =>{
          console.log("取消操作");
        })
      },
      /*申请退货*/
      returnGoods(){
        console.log(this.obj.orderId);
        this.$confirm("确定要申请退货").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/applyGoodsReturn" + this.Service.queryString({
            token: this.mallToken.getToken(),
            orderId: this.obj.orderId
          })).then(res =>{
            console.log("申请退货",res);
            if(res.data.h.code === 200){
              this.$toast("申请成功");
              this.$router.replace("returnlist");
            }else  if(res.data.h.code === 50 || res.data.h.code === 30){
	            if(this.isApp.state){
		            window.location.href = "epipe://?&mark=login";
	            }else{
		            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
	            }
            }else{
              this.$toast(res.data.h.msg);
            }
          });
        }).catch(() =>{
          console.log("取消操作");
        })
      },
      /*重新申请退款*/
      againRefund(){
        this.axios.post(this.baseURL.mall + "/m/my/applyRefund" + this.Service.queryString({
          token: this.mallToken.getToken(),
          orderId: this.obj.orderId
        })).then(res =>{
          console.log("重新申请退款",res);
          if(res.data){
            this.$toast("申请成功");
            this.$emit("childCall",1);
          }else{
            this.$toast("申请失败");
          }
        });
      },
      /*重新申请退货*/
      againReturn(){
        this.axios.post(this.baseURL.mall + "/m/my/applyAgain4Goods" + this.Service.queryString({
          token: this.mallToken.getToken(),
          orderId: this.obj.orderId
        })).then(res =>{
          console.log("重新申请退货",res);
          if(res.data){
            this.$toast("申请成功");
            this.$emit("childCall",1);
          }else{
            this.$toast("申请失败");
          }
        });
      },
      /*取消订单*/
      cancleOrder(){
        this.$confirm("确定要取消订单?").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/orderCancel" + this.Service.queryString({
            token: this.mallToken.getToken(),
            orderSn: this.obj.orderSn
          })).then(res =>{
            console.log("取消订单",res);
            if(res.data.h.code === 200){
              this.$router.push({
                path: '/orderdetails',
                query: {
                  orderSn: this.obj.orderSn,
                  imgPrefix: this.imgPrefix
                }
              })
            }
          })
        }).catch(() =>{
          console.log("failed");
        });
      },
      /*确认收货*/
      confirmReceipt(){
	      this.$confirm("确定要确认收货?").then(() =>{
		      this.axios.post(this.baseURL.mall + "/m/my/orderConfirm" + this.Service.queryString({
			      token: this.mallToken.getToken(),
			      orderId: this.obj.orderId
		      })).then(res =>{
			      console.log("确认收货",res);
			      if(res.data.h.code === 200){
				      this.$toast("已确认收货");
				      this.$emit("childCall",4);
			      }else{
				      this.$toast(res.data.h.msg);
			      }
		      });
        })
      },
      /*跳转评价*/
      linkToComment(id){
        console.log(id);
        this.$router.push({path: 'goodscomment',query:{id:id}});
      },
      /*跳转商品*/
      linkItem(){
        console.log("111111");
//        this.$router.push({path:'/goodsdetail',query:{goodsId: item.goodsId}});
      },
    },
    created(){
	    if(this.isApp.state){
		    this.isNotApp=true;
	    }
	    this.token=this.mallToken.getToken();
    }
  }
</script>
<style lang="stylus" scoped>
    input{
        -webkit-appearance: none;
        outline none;
        background transparent;
    }
  borderBottom(borderColor= #e9e9e9,borderWidth= 1px){
    content "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height borderWidth;
    background borderColor;
    transform scaleY(0.5);
    transform-origin center;
  }
  .list-item{
    position relative;
    padding-left 0.1rem;
    margin-bottom 0.1rem;
    background white;
    &::after{
      borderBottom();
    }
  }
  .status-done{
    position relative;
    &::after{
      borderBottom();
    }
  }
  .store-item{
    position relative;
  }
  .item-sup{
    position relative;
    &::before{
      content: "";
      position: absolute;
      left: -0.1rem;
      top: 0;
      width: calc(100% + 0.1rem);
      height: 1px;
      background: #e9e9e9;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      -webkit-transform-origin: center;
      transform-origin: center;
    }
    &::after{
      borderBottom();
    }
    height 45px;
    padding-right 0.1rem;
    display flex;
    justify-content space-between;
    align-items center;
    .store{
      font-size 14px;
      font-weight bold;
      color #333;
    }
    .status{
      font-size 13px;
      color: #ff8800;
    }
  }
  .item-sub{
    position relative;
  }
  .item-row{
    display flex;
    padding 10px 0;
  }
  .goods-picture{
    width: 0.7rem;
    height: 0.7rem;
    margin-right 0.12rem;
    background #dedede;
    img{
      width: inherit;
      height: inherit;
    }
  }
  .goods-details{
    display flex;
    justify-content space-between;
    min-width 2.81rem;
  }
  .goods-desc{
    width 2.1rem;
    margin-right 0.18rem;
    .desc-title{
      line-height 20px;
      font-size 13px;
      color: #333;
      font-weight bold;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .desc-sub{
      line-height 1.3;
      font-size 13px;
      color: #999;
      margin-top 12px;
    }
  }
  .goods-price{
    padding-right 0.1rem;
    text-align right;
    p{
      line-height 20px;
      font-size 13px;
    }
    .price{
      color: #d74a45;
    }
    .number{
      color: #999;
    }
  }
  .btn-wrapper{
    position relative;
    padding-left 0.1rem;
    display flex;
    justify-content flex-end;
    height 50px;
    align-items center;
    &::before{
      content: "";
      position absolute;
      left 0;
      top 0;
      width 100%;
      height 1px;
      background #e9e9e9;
      transform scaleY(0.5);
      transform-origin center;
    }
  }
  .btn{
    min-width 75px;
    height 30px;
    margin-right 0.1rem;
    text-align center;
    line-height 30px;
    color: white;
    border-radius 2px;
    border: 1px solid #bfbfbf;
    background #bfbfbf;
  }
  .btn-scale{
    font-size 12px;
  }
  .btn-pay{
    border: 1px solid #d74a45;
    background #d74a45;
  }
  .link-comment{
    color: #ff8800;
    white-space nowrap;
    margin-top 5px;
  }
    .dialog{
      position fixed;
      width 100%;
      height 100%;
      top 0;
      z-index 5;
      font-size 0.18rem;
      background-color rgba(0,0,0,0.5)
  
      &_box{
        display flex;
        flex-direction:column;
        width 2.7rem;
        height 1.5rem;
        position absolute;
        left 0;
        right 0;
        top 0;
        bottom 0;
        margin auto;
        background #fff;
        text-align center;
        border-radius 0.08rem;
    
    
        >div{
          font-size 0.16rem;
        }
    
        .dialog-title{
          border-bottom 0.01rem solid #ccc;
          color #999
          line-height 0.45rem;
        }
    
        .dialog-cont{
          color #0fc37c
          margin  0.21rem 0
        }
    
      }
  
      &_btn{
        display flex;
        height 0.4rem;
        line-height 0.4rem;
    
        a{
          flex 1
        }
      }
  
      &_main{
        height 1.1rem;
        border-bottom 0.01rem solid #ebebeb
    
    
        p{
          padding 0 0.1rem;
        }
    
        h4{
          text-align left
          text-indent 0.15rem;
          margin 0.1rem 0;
          margin-bottom 0.15rem;
          font-size 0.16rem;
          font-weight bold
        }
      }
  
      .continue{
        border-right 0.01rem solid #ebebeb
      }
  
    }
</style>
