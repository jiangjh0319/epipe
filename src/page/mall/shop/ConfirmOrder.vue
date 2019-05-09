<template>
  <div class="confirm-order">
    <router-link to="ReceivingAdress" tag="div" class="receiving-info">
      <div v-for="(obj,i) in addressList" :key="i" v-if="addressList.length>0 && i==0">
        <p class="p1">
          <span>{{obj.trueName}}</span>
          <span>{{obj.mobPhone}}</span>
        </p>
        <p class="p2">{{obj.areaInfo}}{{obj.address}}</p>
      </div>
      <div v-if="addressList.length==0">请选择收货地址</div>
      <div>
        <i class="iconfont icon-jinru"></i>
      </div>
     </router-link>
    <div class="line"></div>
    <div class="order-list">
      <div class="settleOneStroe" v-for="(obj,i) in cartList" :key="i">
        <div class="shop-name">{{obj.storeName}}</div>
        <div class="goods-info" v-for="(item,j) in obj.list" :key="j">
          <div class="goods-pho">
            <img :src="imgPrefix+item.goodsImages" >
          </div>
          <div class="goods-coninfo">
            <div class="info">
              <p class="p1">{{item.goodsName}}</p>
              <p class="p2" v-html="item.specInfo"></p>
            </div>
            <div class="price-num">
              <div class="price" v-if="item.priceNegotiable === 0">
                <span>￥</span><span>{{item.goodsPrice}}</span>
                <div class="promotion-flag" v-if="item.promotionType === 'YH'">券</div>
                <div class="promotion-flag" v-if="item.promotionType === 'ZK'">折</div>
                <div class="promotion-flag" v-if="item.promotionType === 'TG'">团</div>
              </div>
              <div class="price" v-if="item.priceNegotiable === 1"><span>待询价</span></div>
              <div class="num">
                <span>x</span><span>{{item.goodsNum}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="invoice-info invoice-info-first" v-if="cartList[0].list[0].priceNegotiable === 0">
      <div>配送服务</div>
      <div>快递运输</div>
    </div>
    <div class="invoice-info invoice-info-first">
      <a href="#/Invoice">
        <div>发票信息</div>
        <div>{{invoiceType}}<i class="iconfont icon-jinru"></i></div>
      </a>
    </div>
    <div class="invoice-info" v-if="cartList[0].list[0].priceNegotiable === 1">
      <div>运输方式</div>
      <div>{{importWay}}</div>
    </div>
    <div class="invoice-info import-way-div" v-if="cartList[0].list[0].priceNegotiable === 1">
      <div class="import-way"><i class="iconfont" :class="buyerReceive ? 'icon-xuanzhong1 select-d74a45' : 'icon-weixuan select-ccc' "  @click="chioceImportWay(1)"></i><span>买家自提</span></div>
      <div><input type="text" placeholder="请选择提货日期" v-model="calendarTime.selectedDateBuy" @click="dateSelect(1)" readonly ></div>
    </div>
    <div class="invoice-info import-way-div import-way-div-last" v-if="cartList[0].list[0].priceNegotiable === 1">
      <div class="import-way"><i class="iconfont" :class="sellerSend ? 'icon-xuanzhong1 select-d74a45' : 'icon-weixuan select-ccc' "  @click="chioceImportWay(2)"></i><span>卖家发货</span></div>
      <div><input type="text" placeholder="请选择您希望送达的日期" v-model="calendarTime.selectedDateSell" @click="dateSelect(2)" readonly></div>
    </div>
    <calendar v-model="calendarTime.calendarShow" @change="dateChange" :min-date="calendarTime.minDate"></calendar>
    <div class="invoice-info" v-if="cartList[0].list[0].priceNegotiable === 0">
      <div>折扣优惠</div>
      <div>￥{{priceInfo.promoAmount}}<i class="iconfont icon-jinru" v-if="priceInfo.promoAmount !== 0"></i></div>
    </div>
    <div class="invoice-info coupon-price invoice-info-first" v-if="cartList[0].list[0].priceNegotiable === 0">
      <div>优惠券</div>
      <div>￥{{priceInfo.couponAmount}}<i class="iconfont icon-jinru" v-if="priceInfo.couponAmount !== 0"></i></div>
    </div>
    <div class="total-price" v-if="cartList[0].list[0].priceNegotiable === 0">
      <div><span>商品金额</span><span>￥{{priceInfo.goodsAmount}}</span></div>
      <div><span>运　　费</span><span>￥{{priceInfo.transportAmount}}</span></div>
      <div><span>优　　惠</span><span>￥{{priceInfo.discount}}</span></div>
      <div><span></span><span><i>付款金额：</i>￥{{priceInfo.goodsTotalPrice}}</span></div>
    </div>
    <div class="wx-pay" @click="submitPayWx"  v-if="cartList[0].list[0].priceNegotiable === 0"><div>微信支付</div></div>
    <div class="wx-pay" @click="inquirySubmit"  v-if="cartList[0].list[0].priceNegotiable === 1"><div>提交询价单</div></div>
    <div class="wx-pay zfb-pay" @click="submitPayZfb" v-if="isNotApp && cartList[0].list[0].priceNegotiable === 0"><div>支付宝支付</div></div>
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
    data:function () {
      return{
	      formUrl:'',
	      token:'',
	      addressId:'',
	      orderSn:'',
	      showDialog:false,
	      backDialog:false,
	      imgPrefix:'',   //图片地址前缀
	      cartList:'',    //结算订单列表
	      addressList:'', //收件地址
        priceInfo:'',       //付款信息
	      invoiceType:'不开发票',
	      cartIds:[],
	      openInv:0,
	      invoiceId:'',
	      isNotApp:false,
	      importWay:'',
	      buyerReceive: false,
        sellerSend: false,
	      pickUpTime:'',
	      calendarTime: {
		      calendarShow: false,
		      minDate: new Date(),
		      selectedDateBuy: '',
		      selectedDateSell: ''
	      },
      }
    },
    methods:{
      getSettlement(){
        let settleOrder=JSON.parse(localStorage.getItem("settleOrder"));
        this.imgPrefix=settleOrder.imgPrefix;
        this.cartList=settleOrder.cartVoList;
        for(let i=0;i<this.cartList.length;i++){
          for(let j=0;j<this.cartList[i].list.length;j++){
            this.cartIds.push(this.cartList[i].list[j].cartId);
          }
        }
        this.priceInfo=settleOrder.map;
        console.log(this.cartList);
        this.axios.post(this.baseURL.mall + "/m/my/queryUserAddress"+this.Service.queryString({
          token:this.mallToken.getToken(),
        })).then(res=>{
          //console.log(res);
          if(res.data.h.code==200){
            this.addressList=res.data.b;
            //this.addressId=this.addressList[0].addressId;
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
      submitPayZfb(){
	      if(this.addressList.length>0){
		      this.axios.post(this.baseURL.mall + "/m/my/appAlipay"+this.Service.queryString({
			      token:this.mallToken.getToken(),
			      cartIds:this.cartIds.join(','),
			      addressId:this.addressList[0].addressId,
			      openInv:this.openInv,
			      invoiceId:this.invoiceId
		      })).then(res=>{
			      console.log('支付宝',res);
			      if(res.data.h.code === 200){
				      let data={};
				      data.orderSn=res.data.b.orderSn;
				      data.imgPrefix=this.imgPrefix;
				      console.log(data);
				      data=JSON.stringify(data);
				      console.log(data);
				      window.location.href = "epipe://?&mark=aliPay&data="+data+"&url="+res.data.b.orderStr;
			      }else if(res.data.h.code === 30 || res.data.h.code === 50){
				      if(this.isApp.state){
					      window.location.href = "epipe://?&mark=login";
				      }else{
					      this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
				      }
			      }
		      })
        }else{
		      this.$toast('请选择收货地址');
        }
      },
      submitPayWx(){
        //alert(this.openInv);
        //console.log(this.addressList);
        if(this.addressList.length>0){
	        this.axios.post(this.baseURL.mall + "/m/my/"+(this.isNotApp ? 'h5_wxpay' : (this.mallType.type === "2c" ? "getCode" : "h52bWXPay"))+this.Service.queryString({
		        token:this.mallToken.getToken(),
		        cartIds:this.cartIds.join(','),
		        addressId:this.addressList[0].addressId,
		        openInv:this.openInv,
		        invoiceId:this.invoiceId
	        })).then(res=>{
		        console.log(res);
		        if(res.data.h.code==200) {
//            localStorage.removeItem('invoiceListArr');
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
	              },3500)
              }else{
	              window.location.href = res.data.b;
              }
		        }else if(res.data.h.code === 30 || res.data.h.code === 50){
			        if(this.isApp.state){
				        window.location.href = "epipe://?&mark=login";
			        }else{
				        this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
			        }
		        }
	        })
        }else{
	        this.$toast('请选择收货地址');
        }
      },
	    go_payDetails(){
		    this.$router.replace({path:'/orderdetails',query:{orderSn:this.orderSn,imgPrefix:this.imgPrefix}})
	    },
      queryInvoice(){
        this.axios.post(this.baseURL.mall + "/m/my/queryInvoice"+this.Service.queryString({
          token:this.mallToken.getToken()
        })).then(res=>{
          console.log('发票信息',res);
          if(res.data.h.code==200){
            if(res.data.b){
              localStorage.setItem("setInvoiceId",res.data.b.invId);
              let dataInvoice=res.data.b;
              this.invoiceId=dataInvoice.invId;
              if(dataInvoice.invState==2){
                this.invoiceType='普通发票 个人';
                this.openInv=1;
              }else if(dataInvoice.invState==1 && dataInvoice.invRecProvince==''){
                this.invoiceType='普通发票 公司';
                this.openInv=1;
              }else if(dataInvoice.invState==1 && dataInvoice.invRecProvince!=''){
                this.invoiceType='增值税专用发票';
                this.openInv=1;
              }else if(dataInvoice.invState==''){
                this.openInv=0;
                this.invoiceType='不开发票';
              }
            }else{
              localStorage.setItem("setInvoiceId",'');
              this.openInv=0;
              this.invoiceId='';
            }
          }
        })
      },
	    dateSelect(type){
      	if( this.buyerReceive == false && type == 1){
		      this.$toast('请先选中对应的运输方式');
      		return false;
        }
		    if( this.sellerSend == false && type == 2){
			    this.$toast('请先选中对应的运输方式');
			    return false;
		    }
      	this.calendarTime.calendarShow = true;
      },
      dateChange(date, formatDate) {
	    	if(this.buyerReceive == true){
			    this.calendarTime.selectedDateBuy = formatDate;
        }else if(this.sellerSend == true){
			    this.calendarTime.selectedDateSell = formatDate;
        }
        this.pickUpTime = formatDate;
      },
	    chioceImportWay(type){
	    	if(type == 1 && this.buyerReceive == false){
	    		this.buyerReceive = true;
	    		this.sellerSend = false;
	    		this.importWay = '买家自提';
			    this.calendarTime.selectedDateSell = '';
        }else if(type == 2 && this.sellerSend == false){
			    this.buyerReceive = false;
			    this.sellerSend = true;
			    this.importWay = '卖家发货';
			    this.calendarTime.selectedDateBuy = '';
        }
      },
	    inquirySubmit(){
	    	if(!this.buyerReceive && !this.sellerSend){
	    		this.$toast('请选择运输方式');
	    		return false;
        }
        if(this.pickUpTime == ''){
	        this.$toast('请选择对应日期');
	        return false;
        }
        if(this.sellerSend && this.addressList.length == 0){
        	this.$toast('请选择收货地址');
        	return false;
        }
		    this.axios.post(this.baseURL.mall + "/m/cart/submitInquiry"+this.Service.queryString({
			    token:this.mallToken.getToken(),
			    cartIds:this.cartIds.join(','),
			    addressId:this.addressList.length>0 ? this.addressList[0].addressId : '',
			    openInv:this.openInv,
			    invoiceId:this.invoiceId,
			    transportWay: this.buyerReceive ? 1 : 2,
			    pickUpTime: this.pickUpTime
		    })).then(res=>{
			    console.log('询价单',res);
			    if(res.data.h.code == 200){
			    	this.$toast('提交询价单成功');
				    this.$router.push({path:'/MyInquiryOrder'});
          }else{
			    	this.$toast(res.data.b.msg);
          }
		    })
      }
    },
    created(){
	    document.title="确认订单";
	    if(this.isApp.state){
		    this.isNotApp=true;
	    }
	    this.token=this.mallToken.getToken();
	    this.formUrl=this.baseURL.mall+"/m/my/h5Alipay";
	    this.getSettlement();
	    this.queryInvoice();
    }
  }
</script>
<style lang="stylus" scoped>
  input{
    -webkit-appearance: none;
    outline none;
    background transparent;
  }
  .confirm-order{
    overflow hidden;
    -webkit-overflow-scrolling:tocuh;
    .receiving-info{
      display flex;
      justify-content space-between;
      align-items baseline;
      padding .15rem .1rem;
      background #fff;
      a{
        display block;
        width 100%;
        height 100%;
      }
      div{
        height 100%;
      }
      div:first-child{
        p{
          font-size .15rem;
          color #333;
          line-height 1.27;
        }
        .p1{
          span{
            font-weight bold;
          }
        }
        .p2{
        }
      }
      div:last-child{
        width 15px;
        i{
          color #ccc;
          font-size .12rem;
          line-height .35rem;
        }
      }
    }
    .line{
      width 100%;
      height .05rem;
      background url("../../../assets/recive-line.png") repeat-x;
      background-size auto 100%;
      background-color #fff;
    }
    .order-list{
      .settleOneStroe{
        overflow hidden;
        width 100%;
      }
      .shop-name{
        height .45rem;
        line-height .45rem;
        padding-left .1rem;
        font-size .14rem;
        color: #333;
        border-bottom 1px solid #e5e5e5;
        font-weight bold;
        margin-top .1rem;
        background #fff;
      }
      .goods-info{
        padding .15rem .1rem;
        overflow hidden;
        border-bottom 1px solid #e5e5e5;
        background #fff;
        .goods-pho{
          width .7rem;
          height .7rem;
          float left;
          overflow hidden;
          margin-right .2rem;
          img{
            width 100%;
            height 100%;
          }
        }
        .goods-coninfo{
          margin-left .9rem;
          .info{
            p{
              font-size .12rem;
            }
            .p1{
              color #333;
              line-height .2rem;
              text-align justify;
            }
            .p2{
              color #999;
              margin-top .06rem;
            }
          }
          .price-num{
            overflow hidden;
            margin-top .2rem;
            .price{
              float left;
              color #d74a45;
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
              span:first-child{
                font-size .12rem;
              }
              span:last-child{
                font-size .16rem;
              }
            }
            .num{
              float right;
              color #999;
              margin-right .1rem;
              span:first-child{
                font-size .14rem;
              }
              span:last-child{
                font-size .15rem;
              }
            }
          }
        }
      }
      .goods-info:last-child{
        border-bottom none;
      }
    }
    .invoice-info{
      margin-top .1rem;
      background #fff;
      overflow hidden;
      border-bottom 1px solid #e5e5e5;
      height .45rem;
      a{
        display block;
        width 100%;
        height 100%;
      }
      div{
        height .45rem;
        line-height .45rem;
        padding 0 .1rem;
        i{
          font-size .12rem;
          color #ccc;
        }
        .select-ccc{
          color #ccc;
        }
        .select-d74a45{
          color #d74a45;
        }
        input{
          height .3rem;
          padding-left .1rem;
          width 2.2rem;
          color #333;
          background #f2f2f5 ;
          &::-webkit-input-placeholder{
            color #ccc;
          }
        }
      }
      .import-way{
        font-size .14rem!important;
        line-height .45rem;
        i{
          font-size .18rem;
          margin-right .1rem;
          vertical-align middle;
        }
        span{
          vertical-align middle;
        }
      }
      div:first-child{
        float left;
        font-size .16rem;
        color #333;
      }
      div:last-child{
        float right;
        font-size .12rem;
        color #333;
      }
    }
    .invoice-info-first{
      border-bottom none;
    }
    .import-way-div{
      margin-top 0;
    }
    .import-way-div-last{
      border-bottom none;
    }
    .coupon-price{
      margin-top 0;
    }
    .total-price{
      margin-top .1rem;
      background #fff;
      padding 0 .1rem;
      overflow hidden;
      div{
        margin-top .15rem;
        overflow hidden;
        span:first-child{
          float left;
          font-size .16rem;
          color #333;
        }
        span:last-child{
          float right;
          font-size .16rem;
          color #d74a45;
          font-weight bold;
        }
        i{
          font-style normal;
          color #333;
          font-weight bold;
        }
      }
    }
    .wx-pay{
      padding .25rem .1rem;
      background #fff;
      div,input{
          width 100%;
          height .45rem;
          line-height .45rem;
          text-align center;
          color #fff;
          font-size .16rem;
          background #54b736;
          border-radius 4px;
      }
    }
    .zfb-pay{
      padding-top 0;
    }
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
