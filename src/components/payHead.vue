<template>
    <div class="wall">
         <h2>{{companyName}}</h2>
              <div class="wall-tab">
                  <div  @click="go_pay" :class="num!=1?'color9':''">
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num==1">
                        <use xlink:href="#icon-jiaofeiqingdan"></use>
                    </svg>
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num!=1">
                        <use xlink:href="#icon-jiaofeiqingdan-weixuan"></use>
                    </svg>
                      费项清单
                  </div>
                  <div @click="go_payRecord" :class="num!=3?'color9':''" id="center_tab">
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num!=3">
                        <use xlink:href="#icon-jilu-weixuan"></use>
                    </svg>
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num==3">
                        <use xlink:href="#icon-jilu"></use>
                    </svg>
                      缴费记录
                  </div>
                  <div @click="go_waitPay" :class="num!=2?'color9':''"  >
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num!=2">
                        <use xlink:href="#icon-daijiaofei-weixuan"></use>
                    </svg>
                    <svg style="font-size: 0.20rem" class="icon" aria-hidden="false" v-if="num==2">
                        <use xlink:href="#icon-daijiaofei"></use>
                    </svg>
                      待付款
                  </div>
              </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show:false,
            }
        },
        created() {
        },
        methods:{
             go_payRecord(){
                 console.log(this._props.companyName)
                this.$router.replace({path:'/payRecord',query:{payerCompanyName:this._props.companyName}})
            },
             go_pay(){
                this.$router.replace({path:'/pay',query:{payerCompanyName:this._props.companyName}})
            },
            go_waitPay(){
                this.$router.replace({path:'/waitPay',query:{payerCompanyName:this._props.companyName}})
            }
        },

        props:['billData','num','companyName']
    }
</script>

<style scoped lang="stylus">

    .color9{
        color #999;
    }

    .wall{
            background-color #609ef7;
            color #fff;
            text-align center;
            border-top 1px solid #609ef7

            h2{
                font-size 0.17rem;
                height 0.22rem;
                margin-top 0.15rem;
            }

            &-tab{
                display flex;
                width 3.45rem;
                height 0.5rem;
                margin 0 auto;
                color #333;
                background-color #fff;
                border-top-left-radius  0.1rem;
                border-top-right-radius  0.1rem;
                position relative;
                bottom -0.25rem;

                >div{
                    flex 1;
                    font-size 0.16rem;
                    line-height 0.5rem;
                }

                svg{
                    position relative
                    top 0.02rem;
                }
            }
        }

    #center_tab{
        position relative;

        &:after,&:before{
            content ''
            display block;
            height 0.15rem;
            width 0.01rem;
            background-color #999
            position absolute
            top 0;
            bottom 0;
            margin auto 
        }

        &:after{
            left 0
        }

        &:before{
            right 0
        }
    }

</style>