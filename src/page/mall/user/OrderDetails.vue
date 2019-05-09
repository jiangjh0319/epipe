<template>
  <div class="order-wrapper">
    <section class="section-item">
      <p class="line">
        <span class="line-title">订单状态:</span>
        <span class="line-content line-status" v-if="!objData.returnGoodsState && !objData.returnRefundState">{{objData.orderState | filterStatus}} </span>
        <span class="line-content line-status" v-else>{{statusTitle}}</span>
      </p>
      <p class="line">
        <span class="line-title">订单编号:</span>
        <span class="line-content">{{objData.orderId}}</span>
      </p>
      <p class="line">
        <span class="line-title">下单时间:</span>
        <span class="line-content">{{objData.createTimeStr}}</span>
      </p>
      <!--<div class="btn-wrapper" v-if="objData.orderState === 0">-->
        <!--<div class="btn btn-repay">重新下单</div>-->
      <!--</div>-->
      <div class="btn-wrapper" v-if="objData.orderState === 10">
        <div class="btn btn-cancel" @click="handleCancel">取消订单</div>
        <div class="btn btn-pay" @click="wepay">微信支付</div>
        <div class="btn btn-pay" @click="submitzfb" v-if="isNotApp">支付宝支付</div>
      </div>
      <div class="btn-wrapper" v-else-if="objData.orderState === 20">
        <div class="btn btn-refund" @click="refund" v-if="!objData.returnGoodsState && !objData.returnRefundState">申请退款</div>
        <div class="btn btn-refund" @click="againRefund" v-else-if="objData.returnRefundState === 3">重新申请退款</div>
        <div class="btn btn-return" @click="againReturn" v-else-if="objData.returnGoodsState === 3">重新申请退货</div>
      </div>
      <div class="btn-wrapper" v-else-if="objData.orderState === 40">
        <div class="btn btn-return" @click="goodsReturn" v-if="!objData.returnGoodsState && !objData.returnRefundState">申请退货</div>
        <div class="btn btn-comment" @click="confirmReceipt" v-if="!objData.returnGoodsState && !objData.returnRefundState">确认收货</div>
        <div class="btn btn-return" @click="againReturn" v-else-if="objData.returnGoodsState === 3">重新申请退货</div>
      </div>
      <div class="btn-wrapper" v-else-if="objData.orderState === 50">
        <div class="btn btn-return" @click="goodsReturn" v-if="objData.returnGoodsState === 2 && !objData.returnRefundState">申请退款</div>
        <div class="btn btn-return" @click="againReturn" v-else-if="objData.returnGoodsState === 3">重新申请退货</div>
      </div>
    </section>
    <section class="section-item">
      <div class="sup">
        <p class="line">
          <span class="line-title">实付金额:</span>
          <span class="line-content line-price">￥{{objData.orderAmount}}</span>
        </p>
        <p class="line">
          <span class="line-title" v-if="!objData.transportWay || objData.transportWay == 2">收货地址:</span>
          <span class="line-title" v-if="objData.transportWay && objData.transportWay == 1">提货地址:</span>
          <span class="line-content" v-if="objData.address">{{objData.address.areaInfo | filterStr}}{{objData.address.address}}</span>
        </p>
        <p class="line" v-if="!objData.transportWay || objData.transportWay == 2">
          <span class="line-title">收货人:</span>
          <span class="line-content" v-if="objData.address">{{objData.address.trueName}}&emsp;{{objData.address.mobPhone | filterPhone}}</span>
        </p>
      </div>
      <div class="sub">
        <p class="line">
          <span class="line-title">发票类型:</span>
          <span class="line-content line-price" v-if="invoice[1]">{{invoice[0]}}/{{invoice[1]}}</span>
          <span class="line-content line-price" v-else>{{invoice[0]}}</span>
        </p>
        <div v-if="invoice != '不开发票'">
          <p class="line" v-if="orderInvoice.invTitle">
            <span class="line-title">发票抬头:</span>
            <span class="line-content">{{orderInvoice.invTitle}}</span>
          </p>
          <p class="line" v-if="!orderInvoice.invRegBname">
            <span class="line-title">发票内容:</span>
            <span class="line-content">{{orderInvoice.invContent}}</span>
          </p>
        </div>
        <div v-if="orderInvoice.invRegBname">
          <p class="line">
            <span class="line-title">单位名称:</span>
            <span class="line-content">{{orderInvoice.invCompany}}</span>
          </p>
          <p class="line">
            <span class="line-title">纳税人识别号:</span>
            <span class="line-content">{{orderInvoice.invCode}}</span>
          </p>
          <p class="line">
            <span class="line-title">注册地址:</span>
            <span class="line-content">{{orderInvoice.invRegAddr}}</span>
          </p>
          <p class="line">
            <span class="line-title">注册电话:</span>
            <span class="line-content">{{orderInvoice.invRegPhone}}</span>
          </p>
          <p class="line">
            <span class="line-title">开户银行:</span>
            <span class="line-content">{{orderInvoice.invRegBname}}</span>
          </p>
          <p class="line">
            <span class="line-title">银行账号:</span>
            <span class="line-content">{{orderInvoice.invRegBaccount}}</span>
          </p>
          <p class="line">
            <span class="line-title">发票内容:</span>
            <span class="line-content">{{orderInvoice.invContent}}</span>
          </p>
          <p class="line">
            <span class="line-title">收票人:</span>
            <span class="line-content">{{orderInvoice.invRecName}}</span>
          </p>
          <p class="line">
            <span class="line-title">收票人手机:</span>
            <span class="line-content">{{orderInvoice.invRecMobphone}}</span>
          </p>
          <p class="line">
            <span class="line-title">地址:</span>
            <span class="line-content">{{orderInvoice.invRecProvince}}{{orderInvoice.invGotoAddr}}</span>
          </p>
        </div>
      </div>
    </section>
    <section>
      <order-item :obj="objData" :imgPrefix="imgPrefix" :showBtn="false" @click.native="linkItem"></order-item>
    </section>
    <section class="section-item section-price">
      <div class="price-line">
        <span class="price-title">商品金额</span>
        <span class="price-amount">￥{{objData.goodsAmount}}</span>
      </div>
      <div class="price-line">
        <span class="price-title">运费</span>
        <span class="price-amount">+￥{{objData.shippingFee}}</span>
      </div>
      <div class="price-line">
        <span class="price-title">优惠</span>
        <span class="price-amount">-￥{{objData.discount}}</span>
      </div>
      <div class="price-sub"><span class="sub-title">实付金额:</span><span class="price-amount">￥{{objData.orderAmount}}</span></div>
      <div class="price-sub price-sub-refound" v-if="objData.returnRefundState"><span class="sub-title">退款金额:</span><span class="price-amount">￥{{refundAmount}}</span></div>
    </section>
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
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const OrderItem = () => import("../../../components/mall/OrderItem.vue");
  export default {
    name: "OrderDetails",
    components:{
      FooterTab,
      OrderItem
    },
    data(){
      return{
        objData: {},
        imgPrefix: this.$route.query.imgPrefix,
        orderSn: this.$route.query.orderSn,
        token: this.$route.query.token || this.mallToken.getToken(),
        orderInvoice: {},
        invoice: {},
        statusTitle: "",
        isNotApp:false,
        formUrl:'',
	      showDialog:false,
	      refundAmount:''
      }
    },
    created(){
      document.title="订单详情";
      //this.orderSn = this.$route.query.orderSn;
      //this.$alert(window.location.href);
      this.getData();
      if(this.isApp.state){
        this.isNotApp=true;
      }
      this.formUrl=this.baseURL.mall+"/m/my/h5AlipayByOrderListOrDetail";
    },
    filters:{
      filterStr(str){
        if(str){
          return str.replace(/,/g,"");
        }
      },
      filterStatus(state){
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
      },
      filterPhone(phone){
        phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return phone;
      },
    },
    methods:{
      /*获取数据*/
      getData(){
        this.axios.post(this.baseURL.mall + "/m/my/detail" + this.Service.queryString({
          token: this.token,
          orderSn: this.orderSn
        })).then(res =>{
          console.log("订单详情",res);
          if(res.data.h.code === 200){
            this.objData = res.data.b.order;
            this.refundAmount = res.data.b.refundAmount;
            this.invoice = res.data.b.order.invoice.split("&nbsp;&nbsp;");
            if(res.data.b.orderInvoice){
              this.orderInvoice = res.data.b.orderInvoice;
              }
	            if(this.objData.returnRefundState){
		            switch (this.objData.returnRefundState){
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
              switch (this.objData.returnGoodsState){
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
          }else  if(res.data.h.code === 50 || res.data.h.code === 30){
	          if(this.isApp.state){
		          this.$toast('登录过期');
		          window.location.href = "epipe://?&mark=login";
	          }else{
		          this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
	          }
          }else{
	          this.$toast(res.data.h.msg);
          }
        }).catch(err =>{
          console.log(err);
        })
      },
      /*取消订单*/
      handleCancel(){
        this.$confirm("确定要取消订单?").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/orderCancel" + this.Service.queryString({
            token: this.token,
            orderSn: this.orderSn
          })).then(res =>{
            console.log("取消订单",res);
            if(res.data.h.code === 200){
              location.reload();
            }
          })
        });
      },
      /*微信支付*/
      wepay(){
        this.axios.post(this.baseURL.mall + "/m/my/"+ (this.isNotApp ? 'h5_wxpay_order' : (this.mallType.type === "2c" ? "getCodeByOrderListOrDetail" : "h52bWXPay")) + this.Service.queryString({
          token: this.token,
          orderSn: this.orderSn
        })).then(res =>{
          if(res.data.h.code === 200){
	          if(this.isNotApp){
		          let data={};
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
          }else{
            this.$alert(res.data.h.msg);
          }
        })
      },
	    //支付宝支付
	    submitzfb(){
		    this.axios.post(this.baseURL.mall + "/m/my/appAlipayByOrder" + this.Service.queryString({
			    token: this.token,
			    orderSn: this.orderSn
		    })).then(res =>{
			    if(res.data.h.code === 200){
				    let data={};
				    data.orderSn=res.data.b.orderSn;
				    data.imgPrefix=this.imgPrefix;
				    console.log(data);
				    data=JSON.stringify(data);
				    console.log(data);
				    window.location.href = "epipe://?&mark=aliPay&data="+data+"&url="+res.data.b.orderStr;
			    }
		    })
	    },
	    go_payDetails(){
		    this.showDialog = false;
		    this.getData();
	    },
      /*申请退货*/
      goodsReturn(){
        this.$confirm("确定要申请退货?").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/applyGoodsReturn" + this.Service.queryString({
            token: this.token,
            orderId: this.objData.orderId
          })).then(res =>{
            console.log("申请退货",res);
            if(res.data.h.code === 200){
              this.$toast("申请成功");
              this.$router.replace("returnlist");
            }else{
              this.$toast(res.data.h.msg);
            }
          })
        }).catch(() =>{
          console.log("取消退款");
        })
      },
      /*申请退款*/
      refund(){
        this.$confirm("确定要申请退款?").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/applyRefund" + this.Service.queryString({
            token: this.token,
            orderId: this.objData.orderId
          })).then(res =>{
            console.log("申请退款",res);
            if(res.data.h.code === 200){
              this.$toast("申请成功");
              this.$router.replace("refundlist");
            }else{
              this.$toast(res.data.h.msg);
            }
          })
        }).catch(() =>{
          console.log("取消退款");
        })
      },
      /*确认收货*/
      confirmReceipt(){
        this.axios.post(this.baseURL.mall + "/m/my/orderConfirm" + this.Service.queryString({
          token: this.token,
          orderId: this.objData.orderId
        })).then(res =>{
          console.log("确认收货",res);
          if(res.data.h.code === 200){
            this.$toast("已确认收货");
            window.location.reload();
          }
        })
      },
      /*重新申请退款*/
      againRefund(){
        this.axios.post(this.baseURL.mall + "/m/my/applyRefund" + this.Service.queryString({
          token: this.mallToken.getToken(),
          orderId: this.objData.orderId
        })).then(res =>{
          console.log("重新申请退款",res);
          if(res.data){
            this.$toast("申请成功");
            this.$router.go(-1);
          }else{
            this.$toast("申请失败");
          }
        });
      },
      /*重新申请退货*/
      againReturn(){
        this.axios.post(this.baseURL.mall + "/m/my/applyAgain4Goods" + this.Service.queryString({
          token: this.mallToken.getToken(),
          orderId: this.objData.orderId
        })).then(res =>{
          console.log("重新申请退货",res);
          if(res.data){
            this.$toast("申请成功");
            this.$router.go(-1);
          }else{
            this.$toast("申请失败");
          }
        });
      },
    }
  }
</script>
<style lang="stylus" scoped>
  border(borderColor= #e9e9e9,borderWidth= 1px){
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: borderWidth;
    background: borderColor;
    transform: scaleY(0.5);
    transform-origin: center;
  }
  .section-item{
    position relative;
    padding 9px 10px;
    margin-bottom 10px;
    background white;
    &::before{
      border();
      top 0;
    }
    &::after{
      border();
      bottom 0;
    }
  }
  .section-price{
    padding-bottom 49px;
  }
  .line{
    line-height 24px;
    font-size 13px;
    .line-title{
      display inline-block;
      min-width 5em;
      color: #999;
    }
    .line-content{
      color: #333;
    }
    .line-status{
      color: #ff8800;
    }
  }
  .btn-wrapper{
    display flex;
    justify-content center;
    width 3.55rem;
    height 0.45rem;
    margin-top 5px;
  }
  .btn{
    flex 1;
    height inherit;
    border-radius 4px;
    font-size 16px;
    color white;
    line-height 0.45rem;
    text-align center;
  }
  .btn:not(:last-child){
    margin-right 0.15rem;
  }
  .btn-cancel,.btn-return,.btn-refund{
    background #bfbfbf;
  }
  .btn-pay{
    background #54b736;
  }
  .btn-repay,.btn-comment{
    background #EA3B3D;
  }
  .sup{
    position relative;
    margin-bottom 10px;
    padding-bottom 9px;
    &::after{
      content: "";
      position absolute;
      left -10px;
      bottom: -10px;
      width calc(100% + 20px);
      height: 10px;
      background #F4F4F4;
    }
  }
  .sub{
    padding-top 9px;
  }
  .price-line{
    display flex;
    justify-content space-between;
    line-height 24px;
    font-size 13px;
  }
  .price-sub{
    display flex;
    justify-content flex-end;
    align-items center;
    margin-top 25px;
  }
  .price-sub-refound{
    margin-top 10px;
  }
  .price-title{
    color: #333;
  }
  .price-amount{
    color: #d74a45;
  }
  .sub-title{
    font-size 15px;
    font-weight bold;
    color: #333;
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
