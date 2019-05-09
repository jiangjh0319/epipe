<template>
    <div>
    <TopHead
        native='native'
        title='e缴费'
    ></TopHead>
      <div class="main">

          <payHead :billData="datas" :companyName="payerCompanyName" num=3></payHead>

           <div v-if="!resData" class="no-res-content">
              <h3>暂无缴费记录</h3>
          </div>

          <div v-if="resData" class="record-content">
              <div>
                  <div class="record-item" v-for="(item,index) in datas" :key="index">
                      <p class="record-item-title">{{item.date}}</p>
                      <div class="border-box">
                        <div class="record-item-infor" v-for="(child,num) in item.list" :key="num" @click="go_infor(child.orderNo)">
                            <div class="record-dot"></div>
                            <div class="record-detail">
                                <h4>{{child.receiverCompanyName}}</h4>
                                <p>{{child.payTime}}</p>
                            </div>
                            <div class="record-infor-price">
                                <span>-{{child.orderAmount}}</span> 元
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
                    <infinite-loading  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                        <span slot="no-more" class="no-more">
                        暂无更多加载
                        </span>
                        <span slot="no-results" class="no-results">
                        暂无更多加载
                        </span>
                    </infinite-loading>
              <div>
              </div>

          </div>

      </div>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
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
            InfiniteLoading
        },
        created(){
            
            if(localStorage.getItem('payRecord')){
                this.datas =  JSON.parse(localStorage.getItem('payRecord'))
            }
        },

        mounted() {
            this.payerCompanyName = this.$route.query.payerCompanyName;
            let that = this;
            this.axios('/epay/record/list').then(res=>{

                if(res.data.h.code==200){
                    that.datas = res.data.b.data;
                     if(res.data.b.data.length){
                       that.resData = true;
                     }
                    localStorage.setItem('payRecord',JSON.stringify(res.data.b.data))

                }else{
                    that.$toast(res.data.h.msg)
                }
            })
        },

        methods:{
            go_pay(){
                this.$router.replace({path:'/pay'})
            },
            go_infor(id){
                this.$router.push({path:'/payParticulars',query:{orderNo:id}})
            },
            onInfinite(){
                let that = this;
                //供需
                this.axios.get('/epay/record/list',{
                    params:{
                        pageNo:this.pageNo+1,
                    }
                }).then(function(res){

                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                    that.pageNo++;
                                    that.datas.concat(res.data.b.data)
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);

                    }).catch(function (error) {
                        console.log(error);
                    });
                    
                }
        }
    }
</script>

<style scoped lang="stylus">

        .main{
            margin-top 0.44rem;
        }


        .record-content{
            margin-top 0.25rem;
        }


        .record-item{

            &-title{
                height 0.4rem;
                line-height 0.4rem;
                font-size 0.16rem;
                color:#666;
                text-indent 0.15rem;
            }

            .border-box{
                padding 0 0.15rem;
                background-color #fff;
            }

            &-infor{
                // height 0.75rem;
                display  flex;
                border-bottom 0.01rem solid #ebebeb
            }

            &-infor:nth-last-child(1){
                border-bottom:none;
            }

            .record-infor-date{
                font-size 0.15rem;
                color:#999;
                margin-left 0.12rem;
            }

            .record-infor-price{
                float right;
                color #fd545c;
                font-size 0.12rem;
                align-self: center;

                span{
                    font-weight bold;
                    font-size 0.16rem;
                }
            }

            .record-detail{
                padding 0.15rem 0;
                flex 1

                h4{
                    font-size 0.15rem;
                    margin-bottom 0.1rem;
                }

                p{
                    font-size 0.12rem;
                    color #999;
                }
            }

            .record-dot{
                width 0.05rem;
                height 0.05rem;
                background-color #609ef7;
                border-radius 50%;
                align-self: center;
                margin-right 0.1rem;
            }

        }

         .no-res-content{
                text-align center

                h3{
                    margin-top 1.5rem;
                    font-size 0.16rem;
                    color:#666;
                }
            }

</style>