<template>
    <div>
    <TopHead
        native='native'
        title='e缴费'
      ></TopHead>
      <div class="main">
          
          <payHead :billData="billData" :companyName="payerCompanyName" num=1></payHead>
          
          <div v-if="!resData" class="no-res-content">
              <h3>暂无代缴费用</h3>
          </div>

          <div class="bill-content" v-if="resData">
              <div>
                  <div class="bill-item"  v-for="(item,index) in billData.list" :key="index">
                    <div class="bill-item-company" >
                    {{item.receiverCompanyName}}
                    </div >
                        <div v-for="(value,num) in item.details" :key="num" class="bill-item-child">
                            <div class="bill-bg" >
                                <div class="bill-item-title">
                                    <h4>{{value.type}}</h4>
                                </div>
                                <div class="bill-item-infor" v-for="(c,i) in value.list" :key="i" @click="go_payDetails(value.typecode,c.payPeriod,item.receiverCompanyId,value.type)">
                                    <svg style="font-size: 0.24rem" class="icon" aria-hidden="false" v-if="value.typecode==1">
                                        <use xlink:href="#icon-reshui"></use>
                                    </svg>
                                    <svg style="font-size: 0.24rem" class="icon" aria-hidden="false" v-else-if="value.typecode==2">
                                        <use xlink:href="#icon-lengshui"></use>
                                    </svg>
                                    <svg style="font-size: 0.24rem" class="icon" aria-hidden="false" v-else-if="value.typecode==3">
                                        <use xlink:href="#icon-dianfei"></use>
                                    </svg>
                                    <svg style="font-size: 0.24rem" class="icon" aria-hidden="false" v-else-if="value.typecode==4">
                                        <use xlink:href="#icon-fangzu"></use>
                                    </svg>
                                    <svg style="font-size: 0.24rem" class="icon" aria-hidden="false" v-else-if="value.typecode==5">
                                        <use xlink:href="#icon-wuyefei"></use>
                                    </svg>
                                    <span class="bill-infor-date">{{c.payPeriod | dateFor}}</span>
                                    <span class="bill-infor-price"> <b>{{c.amount}}</b> 元</span>
                                </div>
                            </div>
                        </div>
                    
                        <div class="bill-foot">
                            <div class="bill-foot-price">
                                总计 : <span> {{item.totalAmount}} <b style="font-size:0.14rem;">元</b></span>
                            </div>
                            <div class="bill-foot-btn" @click="go_pay(item.receiverCompanyId)">立即付款</div>
                        </div>
                  </div>
              </div>

              <div>
              </div>

          </div>

      </div>
    </div>
</template>

<script>
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import payHead  from '../../../components/payHead.vue'  //pay头部
    export default {
        data() {
            return {
                billData:[],
                resData:false,
                payerCompanyName:' '
            }
        },

        components: {
            TopHead,
            payHead
        },
        created() {
            if(localStorage.getItem('payData')){
                this.billData =  JSON.parse(localStorage.getItem('payData'))
            }
        },

        mounted() {
            let that = this;
            this.axios('/epay/unpay/list').then(res=>{

                if(res.data.b.list.length){
                    that.resData = true;
                }
                that.billData = res.data.b;
                that.payerCompanyName = res.data.b.payerCompanyName
                localStorage.setItem('payData',JSON.stringify(res.data.b))
            })
        },
        methods:{
            go_payDetails(type,date,id,typeName){
                this.$router.push({path:'/payDetails',query:{type,date,id,typeName}})
            },
            go_pay(id){
                this.$router.push({path:'/immediatePay',query:{id}})
            }
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

        

        .bill-content,.no-res-content{
            margin-top 0.35rem;
        }

        .no-res-content{
            text-align center

            h3{
                margin-top 1.5rem;
                font-size 0.16rem;
                color:#666;
            }
        }

        .bill-item{
            margin-bottom 0.1rem;

            &-title{
                height 0.4rem;
                line-height 0.4rem;
                border-bottom 0.01rem solid #e6e6e6;

                h4{
                    font-size 0.15rem;
                    color #333
                }
            }

            .bill-bg{
                padding-left 0.15rem;
                background-color #fff;
            }

            &-child{
                margin-bottom 0.1rem;
                background-color #fff;
            }

            &-infor{
                height 0.48rem;
                line-height 0.48rem;
                padding-right 0.15rem;
                overflow: hidden;
            }

            .bill-infor-date{
                font-size 0.15rem;
                color:#999;
                margin-left 0.12rem;
            }

            .bill-infor-price{
                float right;
                color #fd545c;
                font-size 0.12rem;

                b{
                    font-size 0.16rem;
                }
            }

        }

        .bill-item-company{
            border-left 0.03rem solid #609ef7
            font-size 0.16rem;
            text-indent 0.12rem;
            margin 0.10rem 0;      
       }

       .bill-foot{
           padding 0.2rem 0.15rem;
           margin-top 0.15rem;
           background-color #fff;


           &-price{
               text-align right;
               font-size 0.17rem;
               margin-bottom 0.2rem;

               span{
                   color #fd545c
               }
           }

           &-btn{
              color #fff;
              width 100%;
              text-align center;
              line-height 0.5rem;
              height 0.5rem;
              font-size 0.17rem;
              background-color #609ef6;
              border-radius 0.04rem;
           }
       }

</style>