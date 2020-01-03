<template>
    <div class="main">
        <div class="title">
            <h4>审批人</h4>
            <span>(审批人)</span>
            <a @click="isShowGuide=true">添加指引</a>
        </div>
        <div class="app_list">
            <div class="app_list_item" v-for="(item,index) in approver_list" :key="index">
                <i></i>
                <div class="approver_info">
                    <div class="approver_info_type">
                        <p>审批人</p>
                        <span>{{item.auditers.length}}人审批</span>
                    </div>
                    <div class="people_list">
                        <div v-for="(child,num) in item.auditers" :key="child.id" class="people_list_item">
                            <div class="people_list_user">
                                <svg  class="icon" aria-hidden="false" v-if="item.approvalUserType==3" @click="del(index,num)">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                                <img :src="child.profileImg"/>
                                <span class="omit">{{child.name}}</span>
                            </div>
                            <img src="../../assets/left.png"/>

                            <!-- <img v-if="1" src="../../assets/add.png"/>
                            <img v-else-if="2" src="../../assets/xie.png"/> -->
                        </div>
                        <div class="no_people" v-if="item.approvalUserType!=3&&!item.auditers.length">
                            <p v-if="item.approvalUserType==1">
                                {{item.quartersName}}
                            </p>
                            <p v-else>
                                主管
                            </p>
                            <span v-if="item.approvalUserScope==2">未找到审批人将自动通过</span>
                            <span v-else>未找到审批人将转交管理员</span>
                        </div>
                        <div v-if="item.approvalUserType==3&&(item.auditers.length<1||isMore)" @click="add_people(index)">
                            <div class="approver_info_people_item">
                                <img src="../../assets/add_people.png"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="guide" v-if="isShowGuide" @touchmove.prevent @click="isShowGuide=false">
            <div class="guide_content">
                <div class="guide-title">
                    请参考以下流程添加审批人
                </div>
                <div style="margin-bottom:0.2rem;overflow:hidden">
                    <div class="guide_item" v-for="(item,index) in guideData[hintType]" :key="index">
                    <svg style="font-size: 0.4rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-shenpiliuchengtouxiang"></use>
                    </svg>
                    <p>{{item}}</p>
                    <span v-if="index==guideData[hintType].length-1&item=='人事行政部门'">(抄送)</span>
                    <div class="guide_arrows">
                        <svg style="font-size: 0.12rem" class="icon" aria-hidden="false" v-if="index!=guideData[hintType].length-1">
                            <use xlink:href="#icon-jiantou1"></use>
                        </svg>
                    </div>
                    </div>
                </div>
            

                <div class="guide_btn">
                    <a @click="isShowGuide=false">知道了</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                 isShowGuide:false,
                    guideData:[
                    ['发起人','部门负责人','人事行政部门','总经理','人事行政部门'],// 
                    ['发起人','部门负责人','财务管理中心','总经理','人事行政部门'],
                    ['发起人','部门负责人','财务管理中心','法务部','总经理','董事办'],
                    ['发起人','相关领导1','相关领导2','相关领导3','公司领导','董事办'],
                    ['发起人','部门负责人','总经理','人事行政部门'],
                    ['发起人','部门负责人','财务管理中心','法务部','用印管理部门','总经理','董事办'],
                    ['发起人','部门负责人','综合管理中心','财务管理中心','总经理','董事办'],//离职
                    ['发起人','部门负责人','总经理','综合管理中心','董事办'], //接待
                    ['发起人','部门负责人','综合管理中心','总经理','人事行政部门'], //补卡
                    ['发起人','部门负责人','综合管理中心','总经理','董事办'],//用人 转正
                    ['发起人','部门负责人','财务管理中心','总经理','董事办'],//付款 借款
                    ['发起人','部门负责人','综合管理中心'],//用车
                    ['发起人','部门负责人','研发中心负责人','总经理','董事办'],//项目立项
                    ['发起人','部门负责人','接收部门负责人','人事行政部门','总经理','人事行政部门'],// 

                    ]
            }
        },
        props:['approver_list','hintType','isMore'],
        methods:{
            del(index,num){
                this.$emit('del_poeple',index,num)

            },
            add_people(index){
                this.$emit('address',index)
                // this.$router.push({path: 'imchoices', query: {bgcolor:this.color,num:1}})
            }
        }
    }
</script>

<style lang="stylus" scoped>

.main{
    background-color #fff;
    padding 0.15rem;
}
.title{
    display flex;
    line-height 0.24rem;
    margin-bottom 0.15rem;

    i{
        display inline-block
        width 0.02rem;
        height 0.14rem;
        background-color #FFA136;
    }

    h4{
        font-size 18px;
        font-weight 600;
    }

    span{
        font-size 0.12rem;
        color:#ccc;
        margin 0 0.05rem;
    }

    a{
        font-size 0.12rem;
        color:#3297F9;
    }
}

.app_list{

    &_item{
        min-height 0.48rem;
        height auto;
        position relative;
        padding-left 0.15rem;

        >i{
            position absolute;
            left 0;
            top 0;
            bottom 0;
            margin auto;
            width 0.07rem;
            height 0.07rem;
            background-color #DCDEE0;
            border-radius 50%;
        }

        >div{
            min-height 0.48rem;
            border-bottom:0.01rem solid #F9F9F9;
            padding 0.1rem 0; 
        }

        &:after,&:before{
            position absolute;
            content '';
            height 50%;
            width 0.01rem;
            background-color #DCDEE0;
            left 0.03rem;
        }

        &:after{
            top:0;
        }

        &:before{
            bottom:0;
        }

        &:first-child:after,&:last-child:before{
            display none;
        }
    }
}

.approver_info{
    display flex;


    &_type{
        flex 1;

        p{
            color #333;
            font-weight 600;
        }

        span{
            color:#999;
            font-size 0.12rem;
        }
    }

    .people_list{
        flex 3;
        display flex;
        justify-content:flex-end;
        flex-wrap:wrap;

        &_item{
            display flex;
            margin-right:0.05rem;
            margin-bottom 0.05rem;

            >img{
                align-self: baseline;
                margin-top 0.06rem;
            }

            &:last-child{
                margin-right 0;

                >img{
                    display none;
                }
            }

            &:nth-child(4),&:nth-child(8),&:nth-child(12),&:nth-child(16),&:nth-child(20){
                margin-right 0;
            }

        }


        &_user{
            position relative
            font-size 0.12rem;
            color:#666;
            width 0.45rem;
            text-align center;

            img{
                display block;
                width:0.26rem;
                height:0.26rem;
                border-radius:50%;
                margin 0 auto;
                margin-bottom 0.02rem;
            }

            .icon{
                position absolute;
                font-size 0.1rem;
                top -0.05rem;
                right:0.05rem;
            }
        }
    }
}

.no_people{
    text-align right;
    padding-right:0.1rem;

    span{
        font-size 0.12rem;
        color:#999
    }
}

.approver_info_people_item{
    width:0.52rem;
    text-align center;

    img{
        width:0.26rem;
        height:0.26rem;
    }
}

.guide{
      position fixed;
      top:0;
      left:0;
      width 100%;
      height 100%;
      background-color rgba(0,0,0,0.3)
      z-index 3;
    }

    .guide_content{
          position absolute;
          top:50%;
          left:50%;
          // height 3rem;
          width 91%;
          background-color #fff;
          z-index 10
          transform: translate(-50%, -50%);
          padding-bottom 0.15rem;
    }

    .guide_item{
      position relative;
      width 33.33%;
      text-align center;

      span{
        font-size 0.12rem;
        color #999;
      }
    }

    .guide_item:nth-child(1),.guide_item:nth-child(2),.guide_item:nth-child(3){
        float left;
        padding-bottom 0.35rem;

        .guide_arrows{
          position absolute;
          right -6px;
          top 0.1rem;
        }
    }

    .guide_item:nth-child(3) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 0.2rem;
        height 0.12rem;
        bottom -0.5rem;
        left 0;
        right 0;
        margin auto ;
    }


    .guide_item:nth-child(4),.guide_item:nth-child(5),.guide_item:nth-child(6){
        float right;
        .guide_arrows{
          position absolute;
          left -6px;
          top 0.1rem;
          transform rotate(180deg)
        }
    }

     .guide_item:nth-child(6){
        padding-bottom 0.35rem;
     }

    .guide_item:nth-child(6) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 0.2rem;
        height 0.12rem;
        bottom -0.5rem;
        left 0;
        right 0;
        margin auto ;
    }

    .guide-title{
       height 0.4rem;
       line-height 0.4rem;
       padding-left 0.15rem;
       font-size 0.13rem;
       color #666;
       border 1px solid #e6e6e6;
       margin-bottom 0.15rem;
    }

    .guide_btn{
         clear both

        a{
          display block;
          width 1.2rem;
          height 0.35rem;
          line-height 0.35rem;
          background-color #f80
          color #fff;
          text-align center
          border-radius 0.04rem;
          margin 0 auto ;
        }
    }

    .omit{
        display block;
        width 0.46rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }


</style>