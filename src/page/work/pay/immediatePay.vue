<template>
    <div>
         <TopHead
            mark="mark"
            title='立即缴费'
            v-on:history_back="histroy_click_back"
         ></TopHead>
         <section class="main">
             <div class="company-infor">
                 <div>缴费人 : <span>{{payDatas.baseInfo.payerName}}</span> </div>
                 <div>公司编号 : <span>{{payDatas.baseInfo.payerCompanyNo}}</span></div>
                 <div>公司名称 ：<span>{{payDatas.baseInfo.payerCompanyName}}</span></div>
                 <div>费用单号 : <span v-text="payDatas.baseInfo.orderNo?payDatas.baseInfo.orderNo:payDatas.orderNo"></span> </div>
             </div>
             
             <div class="detailedList">
                 <div class="detailedList-title">
                    <h4>缴费清单</h4>
                 </div>
                 <div class="detailedList-item" v-for="item in payDatas.list" :key="item.anount">
                     <span class="de-date">{{item.payPeriod | dateFor }}</span>
                     <span class="de-type">{{item.type}}</span>
                     <span class="de-price">{{item.amount}}元</span>
                </div>
                 <div class="detailedList-count">
                     总计 : {{payDatas.totalAmount?payDatas.totalAmount:payDatas.baseInfo.orderAmount}} 元
                 </div>
             </div>

             <div class="payment">
                 <div class="payment-title">选择支付方式</div>
                 <div class="payment-item" @click="payType=1" v-if="payTypeStr.indexOf('1')>-1">
                     <div style="margin-right:0.12rem">
                         <svg style="font-size: 0.34rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-weixinzhifu"></use>
                         </svg>
                     </div>
                     <div class="pay-name">
                         <p>微信支付</p>
                         <span>使用微信支付,安全便捷</span>
                     </div>
                     <div style="align-self: center;" >
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="payType==1">
                            <use xlink:href="#icon-xuanzhong"></use>
                         </svg>
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-else>
                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                         </svg>
                     </div>
                 </div>
                 <div class="payment-item" @click="payType=2" v-if="payTypeStr.indexOf('2')>-1">
                     <div style="margin-right:0.12rem">
                         <svg style="font-size: 0.34rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-zhifubaozhifu"></use>
                    </svg>
                     </div>
                     <div class="pay-name">
                         <p>支付宝</p>
                         <span>支持有支付宝、网银的用户使用</span>
                     </div>
                     <div style="align-self: center;">
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="payType==2">
                            <use xlink:href="#icon-xuanzhong"></use>
                         </svg>
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-else>
                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                         </svg>
                     </div>
                 </div>
                 <div class="payment-item" @click="payType=3">
                     <div style="margin-right:0.12rem">
                         <svg style="font-size: 0.34rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yinlianzhifu"></use>
                    </svg>
                     </div>
                     <div class="pay-name">
                         <p>银联支付</p>
                         <span>中国银联在线支付服务</span>
                     </div>
                     <div style="align-self: center;">
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="payType==3">
                            <use xlink:href="#icon-xuanzhong"></use>
                         </svg>
                         <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-else>
                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                         </svg>
                     </div>
                 </div>
             </div>
             <div style="height:1rem;">

             </div>
             
             <div class="foot">
                 <span>总计 : {{payDatas.totalAmount?payDatas.totalAmount:payDatas.baseInfo.orderAmount}} 元</span>
                 <a class="pay-btn" @click="pay">支付</a>
             </div>
         </section>
         <div class="dialog" v-if="showDialog" @touchmove.prevent>
             <div class="dialog_box">
                <div class="dialog-title">
                    请确认微信支付是否已完成
                </div>
                <div class="dialog-cont" @click="go_payDetails">
                    已完成支付
                </div>
                <div class="dialog-rests" @click="pay_defeated()">
                    支付遇到问题,重新支付
                </div>
             </div>
         </div>
         <div class="dialog" v-if="backDialog" @touchmove.prevent>
            <div class="dialog_box">
                <div class="dialog_main">
                <h4>确认要退出付款？</h4>
                <p>您的费项付款单在15分钟内未支付将被取消，请尽快完成支付 </p>
                </div>
                <div class="dialog_btn">
                    <a style="color:#609ef7" class="continue" @click="backDialog=false">继续支付</a>
                    <a @click="go_back">确认离开</a>
                </div>
            </div>
         </div>
    </div>
</template>

<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                payDatas:null,
                payType:1, 
                payHref:'',
                showDialog:false,
                backDialog:false,
                payTypeStr:'',//支付方式
                orderNo:'',
            }
        },
        components: {
            TopHead
        },
        created(){
            if(this.$route.query.orderNo){
                this.payDetails()
            }else{
                this.createPay()
            }
        },
        methods:{

            pay(){ //支付
                let that = this;
                let data = {};
                data.orderSn = this.orderNo;
				data=JSON.stringify(data);
                this.axios.post('/epay/order/pay'+this.Service.queryString({
                        payType:that.payType,
                        orderNo:that.orderNo,
                })).then(res=>{
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                            return;
                        }

                        if(that.payType==3){
                           window.location.href = "epipe://?&mark=unionpayUrl&data="+data+'&url='+res.data.b.payParams
                        return
                        }
                        else if(!res.data.b.payParams.mwebUrl){
				            window.location.href = "epipe://?&mark=aliPay&data="+data+"&url="+res.data.b.payParams;
                            return
                        }   
                        window.location.href = "epipe://?&mark=payUrl&url="+res.data.b.payParams.mwebUrl+'&redirect_url='+location.href;
                        
                        setTimeout(()=>{
                            that.showDialog = true;
                        },3500)
                })
            },
            go_back(){
                history.back()
            },
            go_payDetails(){
                this.$router.replace({path:'/payParticulars',query:{orderNo:this.orderNo,payFinish:true}})
            },
            pay_defeated(){
                let that = this;
                this.axios.get('/epay/record/detail',{
                params:{
                    orderNo:this.orderNo,
                }
                }).then(res=>{
                     if(res.data.h.code==200){
                        this.$router.replace({path:'/payParticulars',query:{orderNo:this.payDatas.orderNo,payFinish:true}})
                     }else{
                          that.$toast(res.data.h.msg)
                        setTimeout(()=>{
                                history.back();
                            },1500)
                        return;
                     }
                })
            },
            createPay(){
                let that = this;
                this.axios.get('/epay/order/create',{
                    params:{
                        receiverCompanyId:this.$route.query.id,
                        type:this.$route.query.type,
                        payPeriod:this.$route.query.date
                    }
                }).then(res=>{
                    if(res.data.h.code==200){
                        that.payDatas = res.data.b;
                        that.payTypeStr = that.payDatas.payType
                        that.orderNo = that.payDatas.orderNo
                    }else{
                        that.$toast(res.data.h.msg)
                        setTimeout(()=>{
                                history.back();
                            },1500)
                        return;
                    }
                })
            },
            payDetails(){
                let that = this;
                this.axios.get('/epay/record/detail',{
                    params:{
                        orderNo:this.$route.query.orderNo,
                        type:1,
                    }
                }).then(res=>{
                    if(res.data.h.code==200){
                        that.payDatas = res.data.b;
                        that.payTypeStr = that.payDatas.baseInfo.payType
                        that.orderNo = that.payDatas.baseInfo.orderNo
                    }else{
                        that.$toast(res.data.h.msg)
                        setTimeout(()=>{
                                history.back();
                            },1500)
                        return;
                    }
                })
            },
            histroy_click_back(){
                this.backDialog = true;
            },
        },
        filters:{
            dateFor(value){
                return (value.replace(/\//g,'年')+'月').replace('-','月-')
            }
        }
    }
</script>

<style scoped lang="stylus">

        .main{
            margin-top 0.44rem;
        }

        .company-infor{
            background-color #fff;
            padding 0.1rem 0.15rem;
            color:#999;
            font-size 0.15rem;
            line-height 0.32rem;
            margin-bottom 0.1rem;

            span{
                float right ;
            }
        }

        .detailedList{
            background-color #fff;
            margin-bottom 0.1rem;
            
            &-title{
                text-align center
                height 0.48rem;
                line-height 0.48rem;
                border-bottom 0.01rem solid #ebebeb
            }

            &-item{
                display flex
                font-size 0.15rem;
                padding 0 0.15rem;
                height 0.48rem;
                line-height 0.48rem;
                border-bottom 0.01rem solid #ebebeb

                span{
                    display block
                }
            }

            &-count{
                font-size 0.17rem;
                text-align right;
                height 0.6rem;
                line-height 0.6rem;
                font-weight bold;
                padding-right 0.15rem;
            }

            &-item:nth-last-child(1){
                border none;
            }

            .de-price,.de-type{
                text-align right;
            }
            .de-date{
                width 1.85rem;
            }

            .de-price{
                width 0.9rem;
            }

            .de-type{
                padding-right 0.1rem;;
                flex 1;
            }

            h4{
                font-size 0.17rem;
                color #fd545c
                font-weight bold
                width 1.5rem;
                position relative
                margin 0 auto;
            }

            h4:after,h4:before{
                display block;
                position absolute;
                content ''
                width 0.2rem;
                height 0.01rem;
                background-color #fd545c
                top 0
                bottom 0
                margin auto 
            }

            h4:after{
                left 0;
            }

            h4:before{
                right 0; 
            }
        }

        .payment{
            background-color #fff;
            // margin-bottom 35rem;

            .payment-title{
                height 0.4rem;
                line-height 0.4rem;
                font-size 0.15rem;
                color:#0fc37c;
                padding 0 0.15rem;
                border-bottom 0.01rem solid #ebebeb
            }

            &-item{
                display flex;
                padding 0.2rem 0.15rem;
                border-bottom 0.01rem solid #ebebeb
            }

            &-item:nth-last-child(1){
                border-bottom none;
            }

            .pay-name{
                flex 1;

                p{
                    font-size 0.15rem;
                    font-weight bold;
                    line-height 1.1em;
                }

                span{
                    font-size 0.1rem;
                    color:#999;
                }
            }
        }

        .foot{
            position fixed;
            width 100%;
            bottom 0;
            height 0.49rem;
            line-height 0.49rem;
            text-align right
            font-size 0.17rem;
            background-color #fff;

            span{
                font-weight bold;
                margin-right 0.18rem;
            }
            
            .pay-btn{
                float right;
                width 1.2rem;
                text-align center;
                background-color #609ef7;
                color #fff;
                font-size 0.17rem;
                font-weight 600;
                letter-spacing 2px
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