<template>
  <div class="order-wrapper">
    <section class="section-item">
      <p class="line">
        <span class="line-title">询价单状态：</span>
        <span class="line-content line-status">{{objData.sellerEnsure | filterStatus}} </span>
      </p>
      <p class="line">
        <span class="line-title">询价单编号：</span>
        <span class="line-content">{{objData.inquirySn}}</span>
      </p>
      <p class="line">
        <span class="line-title">询价时间：</span>
        <span class="line-content">{{objData.createTimeStr}}</span>
      </p>
      <p class="line" v-if="objData.ensureTimeStr">
        <span class="line-title">卖家报价时间：</span>
        <span class="line-content">{{objData.ensureTimeStr}}</span>
      </p>
      <p class="line" v-if="objData.inquiryAmount">
        <span class="line-title">报价：</span>
        <span class="line-content">{{objData.inquiryAmount}}元</span>
      </p>
      <p class="line" v-if="objData.expirationTimeStr">
        <span class="line-title">支付截止时间：</span>
        <span class="line-content">{{objData.expirationTimeStr}}</span>
      </p>
      <p class="line" v-if="objData.buyerConfirmTimeStr">
        <span class="line-title">确认报价时间：</span>
        <span class="line-content">{{objData.buyerConfirmTimeStr}}</span>
      </p>
      <p class="line" v-if="objData.buyerCanleTimeStr">
        <span class="line-title">取消时间：</span>
        <span class="line-content">{{objData.buyerCanleTimeStr}}</span>
      </p>
      <div class="btn-wrapper" v-if="objData.sellerEnsure == 0">
        <div class="btn btn-cancel" @click="handleCancel">取消询价单</div>
      </div>
      <div class="btn-wrapper" v-if="objData.sellerEnsure == 1">
        <div class="btn btn-cancel" @click="handleCancel">取消询价单</div>
        <div class="btn btn-comment" @click="confirmPrice">确认报价</div>
      </div>
    </section>
    <section>
      <inquiry-order-item :obj="objData" :imgPrefix="imgPrefix" :showBtn="false" @click.native="linkItem"></inquiry-order-item>
    </section>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
	const FooterTab = () => import("../../../components/mall/FooterTab.vue");
	const InquiryOrderItem = () => import("../../../components/mall/InquiryOrderItem.vue");
	export default {
		name: "InquiryOrderDetails",
		components:{
			FooterTab,
			InquiryOrderItem
		},
		data(){
			return{
				objData: {},
				imgPrefix: this.$route.query.imgPrefix,
				inquiryId: this.$route.query.inquiryId,
				token: this.$route.query.token || this.mallToken.getToken()
			}
		},
		created(){
			document.title="询价单详情";
			this.getData();
		},
		filters:{
			filterStr(str){
				if(str){
					return str.replace(/,/g,"");
				}
			},
			filterStatus(state){
				switch (state){
					case '0':
						return "卖家报价";
						break;
					case '1':
						return "买家确认";
						break;
					case '2':
						return "已下单";
						break;
					case '3':
						return "已取消";
						break;
					case '4':
						return "已取消";
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
				this.axios.post(this.baseURL.mall + "/m/my/inquiryDetail" + this.Service.queryString({
					token: this.token,
					inquiryId: this.inquiryId
				})).then(res =>{
					console.log("询价单详情",res);
					if(res.data.h.code === 200){
						this.objData = res.data.b.inquiryOrder;
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
			/*取消询价单*/
			handleCancel(){
				this.$confirm("确定要取消询价单?").then(() =>{
					this.axios.post(this.baseURL.mall + "/m/my/cancelInquiry" + this.Service.queryString({
						token: this.token,
						inquiryId: this.inquiryId
					})).then(res =>{
						console.log("取消询价单",res);
						if(res.data.h.code === 200){
							this.$toast("取消成功");
							location.reload();
						}
					})
				});
			},
			//确认报价
			confirmPrice(){
				this.$confirm("确定要确认报价?").then(() =>{
					this.axios.post(this.baseURL.mall + "/m/my/inquiry2Order" + this.Service.queryString({
						token: this.token,
						inquiryId: this.inquiryId
					})).then(res =>{
						console.log("确定报价",res);
						if(res.data.h.code === 200){
							this.$toast("确认报价成功");
							this.$router.push({
								path: '/orderdetails',
								query: {
									orderSn: res.data.b.orderSn,
									imgPrefix: this.imgPrefix
								}
							})
						}
					})
				}).catch(() =>{
					console.log("failed");
				});
			}
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
</style>
