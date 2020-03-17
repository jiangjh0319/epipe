<template>
    <section class="reimburse">
        <TopHead
        mark='mark'
        bgcolor = '#0fc37c'
        :title='title'
        v-on:history_back="history_back_click"
         ></TopHead>
         <div style="height:0.59rem"></div>
        <div class="base-content">
            <div class="content">
              <div class="modle_styl" v-for="(item,index) in listData" :key="index">
                  <div class="row_styl">
                        <p>{{item.name}}</p>
                        <div class="datetime">{{item.submit_time}}</div>

                  </div>
                  <div class="interview">
                      <span class="pin">评价：</span><p class="jia">{{item.notes}}</p>
                  </div>
                  <div class="conclusion">
                      <span class="pin">结论：</span><span class="jia">{{item.conclusion}}</span>
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
                title:'面试评价',
                listData:[
                    
                ]
            }
        },
        
        components:{
            TopHead,
        },
        methods :{
        ...mapMutations(['change_man','approver_man']),
        history_back_click:function(){
                    // if(location.href.indexOf('goWork=0')>0){
                    //     window.location.href = "epipe://?&mark=history_back"
                    //     return
                    // }
                    // window.location.href = "epipe://?&mark=goWork"
                    history.back();
            },
        },
        created() {
            this.axios.get('work/interview/evaluation?interviewApplyId='+this.$route.query.id).then((res)=>{
                console.log(res)
                this.listData = res.data.b.data;
            })
        }
 
    }
</script>

<style scoped lang="stylus">

        .contractDescTitle{
            color:#666;
            font-size:0.15rem;
        }

        .newList{

            position relative;

            svg{
                position absolute;
                left 0.32rem;
                top -0.05rem;
            }
        }

        .reasonImg{
            overflow hidden;
            margin-top 0.1rem;
            height:0.32rem;

            li{
                float left;
                width 0.32rem;
                height 0.32rem;
                margin-right 0.1rem;
            }

            img{
                width:100%;
                height:100%;
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

            .dialog_box{
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
            }

            .dialog_content{
                height 1rem;
                line-height 1rem;
                color #333;
                border-bottom 0.01rem solid #e6e6e6;
            }

            .dialog_btn{
                height 0.5rem;
                line-height 0.5rem;
                display flex;

                a{
                    flex  1;
                    touch-action:none;
                    cursor:pointer;
                }
            }

             .dialog_option{
                height 0.4rem;
                line-height 0.4rem;
                position relative;
                font-size:0.16rem;
            }

            .dialog_border{
                border 1px solid #f5f5f5
            }

            .confirm_btn{
                color #609df6;
            }
            .cancel_btn{
                ciolor #666;
            }
        }

        .content{
            padding 0 0.15rem;
            .modle_styl{
                background-color #fff;
                margin-bottom: 0.15rem;
                position relative;
                .row_styl{
                    display flex;
                    flex-direction column;
                    padding-left:0.15rem;
                    padding-top:0.1rem;

                    .header_img{
                        width 0.4rem;
                        height 0.4rem;
                        border-radius 50%;
                        margin-top 0.1rem;
                        margin-left 0.2rem;
                    }
                    p{
                        font-size 0.16rem;
                        font-weight 800;
                        color #333;
                        margin-bottom 0.1rem;
                        
                    }
                }
                .interview{
                    margin-left 0.15rem;
                    margin-top 0.1rem;
                    display flex;
                    .pin{
                        color #609EF7;
                        font-size 0.15rem;
                        font-weight 900;
                        width 0.45rem;
                    }
                    .jia{
                        flex 1;
                        padding-left: 0.16rem;
                        padding-right: 0.16rem;
                        font-size 0.14rem;
                        color:#666666;
                        
                    }
                }
                .conclusion{
                    margin-left 0.15rem;
                    margin-top 0.1rem;
                    padding-bottom 0.1rem;
                    .pin{
                        color #609EF7;
                        font-size 0.15rem;
                        font-weight 900;
                    }
                    .jia{
                        margin-left 0.16rem;
                        font-size 0.14rem;
                        color:#666666;
                    }
                }
                .datetime{
                    font-size 0.12rem;
                    color #999999;
                }
            }
        }

        .content_head{
            display flex;

            img{
                margin-right 0.1rem;
            }

            .nameTl{
                font-size 0.15rem;
                color #333;
                line-height 1em;
                margin-bottom 0.1rem;
            }

            .res{
                line-height 1em;
                font-size 0.14rem; 
                color #fd545c;               
            }

            .consent{
                 line-height 1em;
                font-size 0.14rem; 
                    color:#0fc37c;
                }

            .careOf{
                line-height 1em;
                font-size 0.14rem; 
                color:#f80;
            }
        }

        .infor{

            .infor-box{
                display flex;
                line-height:0.2rem;
                font-size 0.15rem;
                margin-bottom 0.03rem;
            }

            span{
                color #666;
                margin-right 0.15rem;
            }

            p{
                flex 1;
                color #333;
                width:2.4rem;
                word-wrap:break-word;
                word-break: break-all;
                text-align:left;
            }
        }


    .foot-box{
        height:0.55rem;
    }

    body{
        background-color:#f80;
    }

    .reimburseCount{
        margin-bottom:0.05rem;
        color:#609ef7;
    }



</style>
