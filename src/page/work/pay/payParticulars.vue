<template>
    <div>
        <TopHead
            title='缴费详情'
            mark="mark"
            v-on:history_back="history_back_click"
         ></TopHead>
         <div class="main">
             <div class="pay-box">
                 <h4 v-text="payData.baseInfo.receiverCompanyName" ></h4>
                 <span><b> -{{payData.baseInfo.orderAmount}}</b> 元</span>
                 <p>{{payData.baseInfo.payStatus | payStatusFor}}</p>
             </div>
             <div class="pay-infor">
                 <div>
                     支付方式  <span>{{payData.baseInfo.payType | typeFor}}</span>
                 </div>
                 <div v-if="payData.baseInfo.payRemarks">
                     支付留言  <span>{{payData.baseInfo.payRemarks}}</span>
                 </div>
                 <div>
                     转账时间  <span>{{payData.baseInfo.payTime}}</span>
                 </div>
                 <div>
                     交易流水号 <span>{{payData.baseInfo.tradeNo}}</span>
                 </div>
                 <div>
                     转账单号  <span>{{payData.baseInfo.orderNo}}</span>
                 </div>
             </div>
             <div class="pay-details">
                 <div class="pay-details-title">
                     缴费清单
                 </div>
                 <div class="pay-details-item" v-for="item in payData.list" :key="item.amount" @click="go_payDetails(item.typecode,item.payPeriod,payData.baseInfo.receiverCompanyId,item.type,payData.baseInfo.orderNo)">
                     <span class="pay-type">{{item.type}}</span>
                     <span class="pay-date">{{item.payPeriod | dateFor}}</span>
                     <span class="pay-price">{{item.amount}}元</span>
                 </div>
             </div>
         </div>
    </div>
</template>

<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return{
                payData:{},
            }
        },
        components: {
            TopHead
        },
        created() {
            let that = this;
            this.axios.get('/epay/record/detail',{
                params:{
                    orderNo:this.$route.query.orderNo,
                }
            }).then(res=>{
                that.payData = res.data.b;
            })
        },
        mounted(){

        },
        methods:{
            go_payDetails(type,date,id,typeName,orderNo){
                this.$router.push({path:'/payDetails',query:{type,date,id,typeName,orderNo,isfinally:true}})
            },
            history_back_click(){

                if(this.$route.query.payFinish){
                    this.$router.replace({path:'/pay',query:{}})
                    return
                }
                 window.history.back()
            }
        },
        filters:{
            typeFor(value){ //支付方式
                switch(value)
                {
                case '1':
                    return '微信支付';
                case '2':
                    return '支付宝支付';
                case '3':
                    return '银联支付'
                }
            },
            dateFor(value){
                return (value.replace(/\//g,'年')+'月').replace('-','月-')
            },
            payStatusFor(value){
                switch(value)
                {
                case '0':
                    return '待支付';
                case '1':
                    return '支付完成';
                case '2':
                    return '支付失败'
                }
            }
        }
    }
</script>

<style scoped lang="stylus">

        .main{
            margin-top 0.44rem;
        }

        .pay-box{
            text-align center;
            background-color #fff;
            padding-top 0.15rem;
            padding-bottom 0.1rem;

            h4{
                font-size 0.17rem;
                font-weight bold;
                margin-bottom 0.15rem;
            }

            span{
                font-size 0.12rem;
                color #fd545c;

                b{
                    font-size 0.24rem;
                    font-weight bold;
                }
            }

            p{
                font-size 0.15rem;
                color:#999
                margin-top 0.15rem;

            }

        }

        .pay-details{
            background-color #fff;
            font-size 0.15rem;

            &-title,&-item{
                line-height 0.48rem;
                border-bottom 0.01rem solid #ebebeb
                padding 0 0.15rem;
            }

            &-title{
                color #fd545c;
            }

            &-item{
                display flex;

                .pay-date{
                    flex 1;
                    text-align center;
                }

                .pay-type{
                    width 0.7rem;
                }

                .pay-price{
                    text-align right;
                }
            }

            &-item:nth-last-child(1){
                border none;
            }
        }

        .pay-infor{
            margin-bottom 0.1rem;
            background-color #fff;
            padding 0.1rem 0.15rem;
            color #999;
            line-height 0.28rem;
            font-size 0.15rem;

            span{
                float right 
            }
        }   
</style>