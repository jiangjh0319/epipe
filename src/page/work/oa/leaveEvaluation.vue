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
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">直属领导</div>
                        <div class="name_s">{{superleadName}}</div>
                    </div>
                     <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">导师意见</div>
                        <div class="name_s_a">{{superleadComment}}</div>
                    </div>
                </div>
                <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">监交人</div>
                        <div class="name_s">{{monitorName}}</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">监交人意见</div>
                        <div class="name_s_a">{{monitorComment}}</div>
                    </div>
                </div>
                 <div class="two_style">
                    <div class="dao_s">
                        <div class="sex_s">HR</div>
                        <div class="name_s">{{hrName}}</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">HR建议</div>
                        <div class="name_s_a">{{hrComment}}</div>
                    </div>
                    <div class="opinionTime">
                        <div class="levtime">建议离职日期</div><div class="levtime">{{hrSuggestDismTime}}</div>
                    </div>
                </div>
                <div class="row_m">
                    交接信息明细
                </div>
                <div class="two_style" v-for="(item,index) in listDatas" :key="index">
                    <div class="dao_s">
                        <div class="sex_s">工作项</div>
                        <div class="name_s">{{item.handovertitle}}</div>
                    </div>
                    <div class="line_s"></div>
                    <div class="opinion">
                        <div class="sex_s_a">交接明细</div>
                        <div class="name_s_a">{{item.handoverdetail}}</div>
                    </div>
                    <div class="opinion_Info">
                        <div class="levtime">交接人</div><div class="levtime_in">{{item.handoverpersonname}}</div>
                    </div>
                    <div class="opinion_Info">
                        <div class="levtime">交接日期</div><div class="levtime_in">{{item.handovertime}}</div>
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
                title:'',
                superleadName:'',//直属领导
                monitorName:'',//监交人
                hrName:'',//hr
                superleadComment:'',
                monitorComment:'',
                hrComment:'',
                hrSuggestDismTime:'',
                listDatas:[]
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
                    // history.back();
            },
        },
        created() {
            console.log(this.$route.query.dataList)
            let dimissionApplyId = this.$route.query.dataList.dimissionApplyId;
            this.title = this.$route.query.dataList.username+'离职评价及办理';
            this.axios.post('/work//dimission/hrsys/comment?dimissionApplyId='+ dimissionApplyId + '&type=1').then(res=>{
                // this.axios.post('/work//dimission/hrsys/comment?dimissionApplyId=83e1704131e311ea98024ccc6ac12eca&type=1').then(res=>{
                if(res.data.h.code==200){
                    console.log(res.data.b)
                    this.superleadName =res.data.b.superleadName;
                     this.monitorName =res.data.b.monitorName;
                      this.hrName =res.data.b.hrName;
                       this.superleadComment =res.data.b.superleadComment;
                        this.monitorComment =res.data.b.monitorComment;
                         this.hrComment =res.data.b.hrComment;
                          this.hrSuggestDismTime =res.data.b.hrSuggestDismTime;
                          this.listDatas = res.data.b.handOverList;

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
               .one_s{
                   padding-top 0.1rem;
                   padding-left 0.15rem;

               }
               .two_s{
                    padding-top 0.1rem;
                    padding-left 0.15rem;
                    padding-bottom 0.1rem;
               }
           }
           .two_style{
               width 100%;
               background-color #fff;
               margin-top 0.1rem;
               margin-bottom: 0.1rem;
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
                       padding-right 0.2rem;
                       padding-top 0.1rem;
                       color #666;
                       font-size 0.14rem;
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
                       padding-right 0.2rem;
                       padding-bottom 0.1rem;
                       color #666;
                   }
               }
               .opinionTime{
                   display flex;
                   padding-bottom 0.2rem;
                   padding-top: 0.1rem;
                    .levtime{
                        padding-left 0.15rem;
                        font-size 0.16rem;
                        color:#333;
                    }
               }
               .opinion_Info{
                    display flex;
                    justify-content space-between;
                    padding-bottom 0.2rem;
                    .levtime{
                        padding-left 0.15rem;
                    }
                    .levtime_in{
                        padding-right: 0.3rem;
                    }
               }
                .line_s{
                   width 92%;
                   height 1px;
                   background-color #F4F4F4;
                   margin 0.1rem auto;
               }
           }
           .row_m{
               margin-top 0.2rem;
               color #609DF6;
               margin-bottom 0.1rem;
           }
           .info_detail{
               height 3rem;
               background-color #fff;
           }
            
        }
    body{
        background-color:#f80;
    }


</style>
