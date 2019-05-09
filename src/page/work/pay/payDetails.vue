<template>
    <div>
        <TopHead
        title='立即付款'
        ></TopHead>
        <div class="main">
            <div class="pay-infor">
                <div>缴费人 : <span>{{payData.baseInfo.payerName }}</span> </div>
                <div>公司编号 : <span>{{payData.baseInfo.payerCompanyNo }}</span> </div>
                <div>公司名称 : <span>{{payData.baseInfo.payerCompanyName }}</span></div>
                <div>缴费月份 : <span>{{payData.baseInfo.payPeriod | dateFor}}</span></div>
            </div>
            <div class="pay-content">
                <div class="pay-title">
                    <h4>{{title}}</h4>
                </div>
                <div class="pay-list" v-for="item in payData.details" :key="item.location" @click="item.open=!item.open">
                    <div class="li-title"><i class="triangle" :id="item.open?'transform':''" v-if="payData.details.length>1"></i> {{item.location}} <span>总计 ： {{item.totalAmount}}元</span></div>
                    <payDetails :type="payType" :data='item' v-if="item.open||payData.details.length<2">  </payDetails>
                </div>
                <div class="count-price" v-if="payData.details.length>1">
                    总计 : <span> {{payData.baseInfo.amount}} <b style="font-size:0.14rem;">元</b></span>
                </div>
            </div>
              <div style="height:0.8rem;background-color:#f5f5f5">

            </div>
        </div>

        <div class="immediatePayment-btn" @click="go_pay(payData.baseInfo.receiverCompanyId,payData.baseInfo.payPeriod)" v-if="!isShowBtn">
            立即付款
        </div>
    </div>
</template>

<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import payDetails  from '../../../components/payDetailsTemplate.vue'  //
    export default {
        data() {
            return {
                isShow:true,
                payData:{
                    baseInfo:{
                        payerName:'',
                        payerCompanyNo:'',
                        payerCompanyName:'',
                        payPeriod:'',
                        },
                    details:[],
                },
                payType:0,
                title:'',
                isShowBtn:false,
            }
        },
        created(){
            let that = this;
            that.payType = this.$route.query.type;
            that.title = this.$route.query.typeName;
            that.isShowBtn = this.$route.query.isfinally;
            this.axios.get('/epay/unpay/detail',{
                params:{
                    receiverCompanyId:that.$route.query.id,
                    type:that.$route.query.type,
                    payPeriod:that.$route.query.date,
                    orderNo:that.$route.query.orderNo,
                    flag:that.$route.query.flag
                }
            }).then(res=>{
                if(res.data.h.code!=200){
                    that.$toast(res.data.h.msg)
                    that.isShowBtn = true;
                        setTimeout(()=>{
                            history.back();
                        },1500)
                    return;
                }

               let datas = res.data.b;
                    for(let i = 0; i<datas.details.length; i++){
                            datas.details[i].open = false;
                    }
                that.payData = datas;
            })
        },
        methods:{
            go_pay(id,date){
                this.$router.replace({path:'/immediatePay',query:{id,type:this.payType,date}})
            }
        },
         components: {
            TopHead,
            payDetails
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

    .count-price{
                line-height 0.55rem;
                text-align right;
               font-size 0.17rem;
               margin-bottom 0.2rem;
               font-weight bold

               span{
                    font-size 0.17rem;
                    font-weight bold
                   color #fd545c
               }
    }

    .immediatePayment-btn{
        position fixed;
        bottom 0;
        left 0;
        right 0;
        width 100%;
        height 0.45rem;
        line-height 0.45rem;
        text-align center;
        background-color #609ef7;
        color #fff;
        font-size 0.17rem;
    }

    .pay-infor{
        padding 0.1rem 0.15rem;
        line-height 0.3rem;
        background-color #609ef7
        color #fff;
        font-size 0.15rem;

        span{
            float right 
        }
    }

    .pay-content{
        background-color #fff
        padding 0 0.15rem;
    }

    .pay-title{
        height 0.48rem;
        line-height 0.48rem;
        text-align center;
        border-bottom 0.01rem solid #ebebeb

        h4{
            display inline-block
            padding 0 0.35rem;
            color:#fd545c;
            font-size 0.17rem;
            font-weight bold;
            position relative;
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

    .pay-list{
        border-bottom 0.01rem solid #ebebeb
    }

    .li-title{
        line-height 0.48rem;
        overflow hidden

    }
    .li-title,.li-title span{
        font-size 0.15rem;
        font-weight bold;

    }
    .li-title span{
        color #fd545c;
        float right
    }

    .triangle{
        display inline-block
        width 0
        height 0;
        border-top 0.07rem solid rgba(0,0,0,0);
        border-right 0.07rem solid  rgba(0,0,0,0);
        border-left 0.07rem solid #609ef7;
        border-bottom 0.07rem solid  rgba(0,0,0,0);
        transition all 0.15s;
        transform-origin: 30% center;
        transform translateY(2px)
    }

    #transform{
        transform rotate(90deg) translateX(2px)
    }

</style>