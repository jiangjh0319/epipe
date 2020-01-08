<template>
    <section class="reimburse">
        <TopHead
        mark='mark'
        bgcolor = '#0fc37c'
        :title='title'
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="base-content">
            <div class="content">
                <div class="first_one">
                    <div class="one_s"><span>申请转正类型</span><span style="margin-left:1.7rem">提前转正</span></div>
                    <div class="line_s"></div>
                    <div class="two_s"><span>申请转正日期</span><span style="margin-left:1.6rem">2020-1-16</span></div>
                </div>
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">导师姓名</div>
                        <div class="name_s">黄陂</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">导师意见</div>
                        <div class="name_s_a">此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验能够支撑整个项目的进展工作反馈度比较高能够支撑整个项目的进展工作反馈度比较高。做过比较多的项目，能够支撑整个项目的进展工作反馈度比较高。</div>
                    </div>
                </div>
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">HR姓名</div>
                        <div class="name_s">黄陂</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">HR意见</div>
                        <div class="name_s_a">此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验能够支撑整个项目的进展工作反馈度比较高能够支撑整个项目的进展工作反馈度比较高。做过比较多的项目，能够支撑整个项目的进展工作反馈度比较高。</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import $ from "jquery";
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航
    export default {
        data(){
            return{
                mark :'marks',
                title:'转正明细及意见',
                listData:[
                    {name:'波尔本',pingjia:'此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验。做过比较多的项目，能够支撑整个项目的进展，工作反馈度比较高。',jielun:'建议复试'},
                    {name:'王宝山',pingjia:'此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验。做过比较多的项目，能够支撑整个项目的进展，工作反馈度比较高。',jielun:'建议复试'},
                    {name:'黄波',pingjia:'此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验。做过比较多的项目，能够支撑整个项目的进展，工作反馈度比较高。',jielun:'建议复试'},
                    {name:'谢丽',pingjia:'此候选人综合能力强，尤其在智慧城市方面有多年理论和实战经验。做过比较多的项目，能够支撑整个项目的进展，工作反馈度比较高。',jielun:'建议复试'}
                ]
            }
        },
        
        components:{
            TopHead,
        },
        methods :{
        ...mapMutations(['change_man','approver_man']),
        history_back_click:function(){
                    if(location.href.indexOf('goWork=0')>0){
                        window.location.href = "epipe://?&mark=history_back"
                        return
                    }
                    window.location.href = "epipe://?&mark=goWork"
            },
        },
        created() {

        }
 
    }
</script>

<style scoped lang="stylus">

        .content{
            margin-top 0.59rem;
            padding 0 0.15rem;
           .first_one{
               width 100%;
               background-color #fff;
               border-radius 0.06rem;
               .one_s{
                   padding-top 0.1rem;
                   padding-left 0.15rem;
                   padding-bottom 0.1rem;
               }
               .two_s{
                    padding-top 0.1rem;
                    padding-left 0.15rem;
                    padding-bottom 0.1rem;
               }
               .line_s{
                   width 89%;
                   height 1px;
                   background-color #F4F4F4;
                   margin 0 auto;
               }
           }
           .two_style{
               width 100%;
               background-color #fff;
               margin-top 0.1rem;
               border-radius 0.06rem;
               .dao_s{
                   display flex;
                   justify-content space-between;
                   .sex_s{
                       padding-left 0.15rem;
                       padding-top 0.1rem;
                       font-size 0.16rem;
                       color:#333;
                   }
                   .name_s{
                       padding-right 0.3rem;
                       padding-top 0.1rem;
                        color: #666666;
                       font-size: 0.14rem;
                   }
               }
               .opinion{
                    display flex;   
                    justify-content space-between;
                     .sex_s_a{
                     padding-left 0.15rem;
                     padding-top 0.1rem;
                     font-size 0.16rem;
                     color:#333;
                   }
                   .name_s_a{
                       width:65%;
                       padding-top 0.1rem;
                       padding-right 0.3rem;
                       padding-bottom 0.1rem;
                       color: #666666;
                       font-size: 0.14rem;
                   }
               }
               .line_s{
                   width 88%;
                   height 1px;
                   background-color #F4F4F4;
                   margin 0.1rem auto;
               }
           }
            
        }
    body{
        background-color:#f80;
    }


</style>
