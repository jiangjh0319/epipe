<template>
    <div>
    <TopHead
        native='native'
        title='e缴费'
    ></TopHead>
      <div class="main">

          <payHead :billData="datas" :companyName="payerCompanyName"  num=2></payHead>

           <div v-if="!resData" class="no-res-content">
              <h3>暂无待付款内容</h3>
          </div>

          <div v-if="resData" class="record-content">
              <div>
                  <div class="bill-item"  v-for="(item) in datas" v-if="item.list.length && item.time>0" :key="item.orderNo">
                        <div  class="bill-item-child">
                            <div class="bill-bg" >
                                <div class="bill-item-title">
                                    <h4>{{item.receiverCompanyName}}

                                        <span style="color:red;float:right" >剩余{{item.time}}分钟</span>
                                    </h4>
                                </div>
                                <div class="bill-item-infor" v-for="(c,i) in item.list" :key="i" @click="go_payDetails(c.typecode,c.payPeriod,item.receiverCompanyId,c.type,item.orderNo)">
                                    <span class="bill-infor-date">{{c.payPeriod |dateFor}}</span>
                                    <span class="bill-infor-type">{{c.type}}</span>
                                    <span class="bill-infor-price"> <b>{{c.amount}}</b> 元</span>
                                </div>
                            </div>
                        </div>
                    
                        <div class="bill-foot">
                            <div class="bill-foot-price">
                                总计 : <span> {{item.totalAmount}} <b style="font-size:0.14rem;">元</b></span>
                            </div>
                            <div class="bill-foot-btn" @click="go_pay(item.orderNo)">立即付款</div>
                        </div>
                  </div>
              </div>
                    <!-- <infinite-loading  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                        <span slot="no-more" class="no-more">
                        暂无更多加载
                        </span>
                        <span slot="no-results" class="no-results">
                        暂无更多加载
                        </span>
                    </infinite-loading> -->
              <div>
              </div>

          </div>

      </div>
    </div>
</template>

<script>
    // import InfiniteLoading from 'vue-infinite-loading';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import payHead  from '../../../components/payHead.vue'  //pay头部

    export default {
        data() {
            return {
                datas:[],
                payerCompanyName:' ',
                pageNo:1,
                resData:false,
            }
        },

        components: {
            TopHead,
            payHead,
            // InfiniteLoading
        },
        created(){
            setTimeout(()=>{

            },2000)

        },

        mounted() {
            this.payerCompanyName = this.$route.query.payerCompanyName;
            let that = this;
            this.axios('/epay/order/unpay').then(res=>{
                if(res.data.h.code==200){
                    that.datas = res.data.b;
                     if(res.data.b.length){
                       that.resData = true;
                        that.countDown()
                     }
                }else{
                    that.$toast(res.data.h.msg)
                }
            })
        },

        methods:{
            go_pay(orderNo){
                this.$router.push({path:'/immediatePay',query:{orderNo}})
            },
            go_payDetails(type,date,id,typeName,orderNo){
                this.$router.push({path:'/payDetails',query:{type,date,id,typeName,isfinally:true,flag:1,orderNo}})
            },
            countDown(){
                let that = this;
                for(let i = 0; i<this.datas.length; i++){

                        this.interval(this.datas[i])
                        this.datas[i].key = setInterval(()=>{
                            that.interval(this.datas[i])
                        },50000)
                    }
            },
            interval(val){
                var timeStr = val.orderTime.replace(/-/g,'/')
                let old = new Date(timeStr)
                let news = new Date()
                val.time = 15 - Math.ceil(parseInt(news.getTime()-old.getTime())/1000/60)
                if(val.time<0){
                    clearInterval(val.key)
                }
                this.$forceUpdate();
            },
            beforeDestroy() {
                for(let i = 0; i<this.datas.length; i++){
                    clearInterval(this.datas[i].key)
                }
            },
            // onInfinite(){
            //     let that = this;
            //     //供需
            //     this.axios.get('/epay/order/unpay',{
            //         params:{
            //             pageNo:this.pageNo+1,
            //         }
            //     }).then(function(res){

            //             setTimeout(() => {
            //                     if (res.data.b.length == 0) {
            //                         that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            //                     } else if (res.data.b) {
            //                         that.pageNo++;
            //                         that.datas.concat(res.data.b)
            //                         that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            //                     }
            //             }, 200);

            //         }).catch(function (error) {
            //             console.log(error);
            //         });
                    
            //     }
        },
         filters:{
            dateFor(value){
                return (value.replace(/\//g,'年')+'月').replace('-','月-')
            },
            countDown(value){

            }
        }
    }
</script>

<style scoped lang="stylus">

        .main{
            margin-top 0.44rem;
        }

        

        .record-content{
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
                    color #333;
                    padding-right 0.15rem;
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
                display flex;
                height 0.48rem;
                line-height 0.48rem;
                padding-right 0.15rem;
                overflow: hidden;
            }

            .bill-infor-date{
                width 1.85rem;
                font-size 0.15rem;
                color:#999;
            }

            .bill-infor-type{
                flex 1
                text-align right 
                padding-right 0.1rem; 
                color:#999;
            }

            .bill-infor-price{
                text-align right 
                width 0.9rem;
                float right;
                color #fd545c;
                font-size 0.12rem;

                b{
                    font-size 0.16rem;
                }
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
        }

</style>