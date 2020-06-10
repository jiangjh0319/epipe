<template>
    <div>
          <TopHead
            mark = 'mark'
            bgcolor = '#609EF7'
            :title="pageTitle" 
            v-on:history_back="history_back_click"
         ></TopHead>
        <div style="height:0.59rem;"></div>
         <div class="main">
            <div class="main_top">
                <div class="people_info">
                    <img :src="info.photo"/>
                    <div>
                        <p>{{info.employee}}</p>
                        <span>{{info.position}}</span>
                    </div>
                </div>
                <div class="score"  style="display:flex;">
                    <p>自评得分 <span>{{info.self_score}}</span></p>
                </div>
                <div class="score" style="padding-top:0.1rem;">
                    <p>绩效等级 <span>{{info.level}}</span></p>
                    <a>直属领导最终评分</a>
                </div>
            </div>  

            <div class="evaluate">
                <p class="evaluate_title">领导评价</p>
                <div class="evaluate_list">
                    <div class="evaluate_list_li">   
                        <div class="leadership">
                            <p>{{info.leader}}</p>
                            <span>直属领导</span>
                        </div>
                        <div class="evaluate_info">
                            <p>等级：{{info.level}}  <span>{{info.performance_time}}</span></p>
                            <div style="text-align: justify;">
                                {{info.notes}}
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div class="summarize">
                <p class="summarize_title">上月工作总结</p>
                <div class="summarize_list">
                    <div class="summarize_list_li" v-for="(item,index) in info.summary" :key="index">
                        <span>{{index+1}}</span>
                        <div v-if="item.work_name">
                            <span>工作目标</span>
                            <p>{{item.work_name}}</p>
                        </div>
                        <div v-if="item.project">
                            <span>所属项目</span>
                            <p>{{item.project}}</p>
                        </div>
                         <div v-if="item.result">
                            <span>实际达成结果</span>
                            <p>{{item.result}}</p>
                        </div>
                         <div v-if="item.undone">
                            <span>未完成原因</span>
                            <p>{{item.undone}}</p>
                        </div>
                         <div v-if="item.plan_weight">
                            <span>计划权重</span>
                            <p>{{item.plan_weight}}</p>
                        </div>
                         <div v-if="item.actual_weight">
                            <span>实际权重</span>
                            <p>{{item.actual_weight}}</p>
                        </div>
                         <div v-if="item.self_score">
                            <span>自评得分</span>
                            <p>{{item.self_score}}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="summarize">
                <p class="summarize_title">下月工作计划</p>
                <div class="summarize_list">
                    <div class="summarize_list_li" v-for="(item,index) in info.plan" :key="index">
                        <span>{{index+1}}</span>
                        <div v-if="item.work_name">
                            <span>工作目标</span>
                            <p>{{item.work_name}}</p>
                        </div>
                        <div v-if="item.project">
                            <span>所属项目</span>
                            <p>{{item.project}}</p>
                        </div>
                         <div v-if="item.result">
                            <span>实际达成结果</span>
                            <p>{{item.result}}</p>
                        </div>
                         <div v-if="item.undone">
                            <span>未完成原因</span>
                            <p>{{item.undone}}</p>
                        </div>
                         <div v-if="item.plan_weight">
                            <span>计划权重</span>
                            <p>{{item.plan_weight}}</p>
                        </div>
                         <div v-if="item.actual_weight">
                            <span>实际权重</span>
                            <p>{{item.actual_weight}}</p>
                        </div>
                         <div v-if="item.self_score">
                            <span>自评得分</span>
                            <p>{{item.self_score}}</p>
                        </div>
                    </div>
                </div>

            </div>


         </div>
    </div>
</template>

<script>
import TopHead  from '../../../components/topheader.vue'  //header导航栏

export default {
    data(){
        return {
            id:'',
            info:{},
            pageTitle:'绩效详情',

        }
    },
    components:{
        TopHead,
    },
    methods:{
        history_back_click(){
            history.back()
        },
        getData(){
            this.axios.get('/work/performanceApply/info',{
                        params:{

                            performanceId:this.id,
                        }
                    }).then((res)=>{ 
                     let data = res.data.b;
                         this.info = data.performanceApplyHr.result.data[this.$route.query.index];
                         this.pageTitle = this.info.employee +'的绩效详情'
                    })
        }
    },
    created(){
        this.id = this.$route.query.id
        this.getData();
    }
}
</script>


<style scoped lang="stylus">

 

    .evaluate_title,.summarize_title{
        color #808080;
        font-weight:600;
        margin-bottom 0.1rem;
    }

    .main{
        padding 0 0.15rem;
        padding-bottom 0.3rem;
    }


    .people_info{
        display flex;
        height 0.7rem;
        align-items:center;

        img{
            width:0.38rem;
            height:0.38rem;
            border-radius:50%;
            margin-right:0.1rem;
        }

        p{
            font-size:0.18rem;
        }

        span{
            color:#999;
            font-size:0.14rem;
        }
    }

    .score{
        min-height 0.49rem;
        //  flex-direction:column;
        align-items:center; 

        span{
            font-weight:600;
            color:333;
            font-size:0.18rem;
            float right;
        }

        p{
            font-size:0.16rem;
            flex 1;
        }

        a{
            font-size:0.12rem;
            color:#609EF7;
        }
    }

    .main_top{
        background-color #fff;
        margin-bottom 0.15rem;

        >div{
            border-bottom:0.01rem solid #ebebeb;
            padding 0 0.15rem;
        }
    }


    //评价
    .evaluate{
        margin-bottom 0.15rem;

        &_title{
            color #808080;
            font-weight:600;
            margin-bottom 0.1rem;
        }

        &_list{
            background-color #fff;
            padding 0.15rem;


            &_li{
                display flex;

                .leadership{
                    width:0.6rem;
                    margin-right 0.05rem;

                    p{
                        color #609EF7;
                        font-size:0.16rem;
                        font-weight:600;
                        margin-bottom 0.1rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }

                    span{
                        color:#666666;
                        font-size:0.12rem;
                        
                    }
                }

                .evaluate_info{
                    flex:1;

                    p{
                        font-size:0.16rem;
                        font-weight:600;
                        margin-bottom 0.1rem;
                    }

                    span{
                        float right;
                        color:#999;
                        font-size:0.12rem;
                    }
                }

            }
        }
        
    }

    .summarize{
        margin-bottom 0.1rem;

        &_list{
            background-color #fff;
            padding 0 0.15rem;



            &_li{
                position relative;
                padding-top 0.15rem;
                border-bottom 0.01rem solid #ebebeb;

                >span{
                    width 0.18rem;
                    height:0.18rem;
                    background-color:#609EF7;
                    position absolute;
                    left -0.05rem;
                    border-radius 50%;
                    color #fff;
                    text-align center;
                    line-height 0.18rem;
                    font-size 0.12rem;
                }

                &:after{
                    content '';
                    position absolute;
                    top 0.3rem;
                    left 0.04rem;
                    width 0.01rem;
                    height 100%;
                    background-color #609EF7;
                }

                &:last-child{

                    &:after{
                        display none;
                    }
                }

                >div{
                    display flex;
                    margin-bottom 0.1rem;
                    padding-left 0.20rem;

                    span{
                        font-size:0.14rem;
                        width 0.9rem;
                    }

                    p{
                        flex 1;
                        color #666;
                        text-align right;
                    }
                }
            }
        }
    }

</style>