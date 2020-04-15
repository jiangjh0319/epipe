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
                    <div class="one_s"><span>申请转正类型</span><span style="margin-left:1.7rem">{{processType}}</span></div>
                    <div class="line_s"></div>
                    <div class="two_s"><span>申请转正日期</span><span style="margin-left:1.4rem">{{applyTime}}</span></div>
                </div>
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">导师姓名</div>
                        <div class="name_s">{{superleadname}}</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">导师意见</div>
                        <div class="name_s_a">{{superleadcomment}}</div>
                    </div>
                </div>
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">HR姓名</div>
                        <div class="name_s">{{hrname}}</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">HR意见</div>
                        <div class="name_s_a">{{hrcomment}}</div>
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
                hrname:'',
                hrcomment:'',
                superleadname:'',
                superleadcomment:'',
                processType:'',
                applyTime:''
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
            let regularApplyId =this.$route.query.dataObj.regularApplyId;
           this.axios.post('/work/regular/hrsys/comment?regularApplyId='+regularApplyId).then(res=>{
            //    this.axios.post('/work/regular/hrsys/comment?regularApplyId=069e74e0345211ea98024ccc6ac12eca').then(res=>{
               if(res.data.h.code==200){
                 console.log(res.data.b)
                this.hrname = res.data.b.hrname;
                this.hrcomment = res.data.b.hrcomment;
                this.superleadname = res.data.b.superleadname;
                this.superleadcomment = res.data.b.superleadcomment;
                this.processType = res.data.b.processDetailType;
                this.applyTime = res.data.b.applyTime.slice(0,10);
               }else{
                   this.$toast(res.data.h.msg)
               }
           })
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
                       padding-bottom: 0.1rem;
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
                     padding-bottom 0.1rem;
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
