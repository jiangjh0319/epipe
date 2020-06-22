<template>
   <div>
    <van-nav-bar
    title="档案详情"
    left-arrow
    @click-left="onClickLeft"
    />
    <div class="main">
        <div class="content">
            <p>借阅档案资料明细（1）</p>
        </div>
        <div class="con_style">
            <div class="style_1" v-for="(item,index) in datasList" :key="index">
                    <div class="row_s"><p class="row_0">{{item.name}}</p></div>
                    <div class="row_s"><p class="row_1">档案编号：</p>{{item.archNum}}</div>
                    <div class="row_s"><p class="row_1">档案日期：</p>{{item.archDate}}</div>
                    <div class="row_s"><p class="row_1">档案类型：</p>{{item.type}}</div>
                    <div class="row_s"><p class="row_1">保密等级：</p>{{item.leves}}</div>
                    <div class="row_s"><p class="row_1">保管年限：</p>{{item.yearlimuit}}</div>
                    <div class="row_s"><p class="row_1">保管截止日期：</p>{{item.endTime}}</div>
                    <div class="row_s"><p class="row_1">所属公司：</p>{{item.company}}</div>
                    <div class="row_s"><p class="row_1">档案管理员：</p>{{item.admin}}</div>
                    <div class="row_s"><p class="row_1">存放位置：</p>{{item.place}}</div>
                    <div class="row_s"><p class="row_1">存档状态：</p>{{item.status}}</div>
                    <div class="row_s"><p class="row_1">档案描述：</p>{{item.maosu}}</div>
            </div>
            <div class="style_2">资料明细</div>
            <div class="style_3">
                <div class="row_div">
                    <div >序号</div>
                    <div >资料名称</div>
                    <div >资料电子档</div>
                    <div >操作</div>
                </div>
                <div class="row_div" v-for="(item,index) in lists" :key="index">
                    <div>{{index+1}}</div>
                    <div class="dbubble-text">{{item.name}}</div>
                    <div class="dbubble-text">{{item.word}}</div>
                    <div>下载</div>
                </div>
            </div>
        </div>
    </div>
   </div>
</template>

<script>

export default {
    data(){
        return {
            value: '',
            datasList:[
                    {
                        name:'销售合同扫描件档案',
                        type:'合同类',
                        company:'深圳前海优管信息技术有限公司',
                        admin:'刘亦菲',
                        place:'华翰科技A座10楼1号档案库房A区域1号柜子/2层',
                        status:'已入档',
                        archNum:'YG20189790',
                        archDate:'2020-04-20',
                        leves:'公开',
                        yearlimuit:'1',
                        endTime:'2021-04-20',
                        maosu:'美的销售合同一式四份包含之合同电子审批截图',

                    },
            ],
            lists:[
                {
                    name:'美的销售合同盖章扫描件',
                    word:'美的销售合同盖章扫描件PDF',
                },
                {
                    name:'美的销售合同盖章扫描件1',
                    word:'美的销售合同盖章扫描件PDF',
                },
            ]
        }
    },
    methods:{
        onClickLeft(){

        }
    }
 
}
</script>

<style scoped lang="stylus">
.van-nav-bar {
    background-color: #609EF7;
  /deep/ .van-nav-bar__title {
    color: #fff;
    }
/deep/ .van-icon{
    color: #fff;
}   
}
.main{
   .content{
       padding-left 0.15rem;
       padding-top 0.2rem;
       font-size 0.15rem;
       color #609EF7;
       display flex;
   }
   .con_style{
       margin-top 0.05rem
       .style_1{
            background-color #fff;
            margin-bottom 0.2rem;
       .row_s{
           padding-left 0.15rem;
           display flex;
           margin-bottom 0.12rem;
            padding-right: 0.15rem;
           .row_0{
               padding-top 0.1rem;
               padding-right 0.2rem;
               padding-bottom 0.15rem;
               color #323233;
               font-size 0.15rem;
               font-family:PingFangSC-Medium,PingFang SC;
           }
           .row_1{
               font-size 0.14rem;
               color #666;
               width 1rem;
            //    padding-bottom 0.08rem;
           }
           .style_2{
               padding-top: 0.1rem;
               padding-right: 0.2rem;
               padding-bottom: 0.15rem;
               padding-left 1.4rem;
           }
        }
       }
       .style_2{
           font-size 0.15rem;
           color #609EF7;
           padding-left 0.15rem;
           margin-bottom 0.1rem;
       }
       .style_3{
           height 500px;
           background-color #fff;
           .row_div{
               display flex;
               justify-content space-between;
               div{
                   width 25%;
                //    height 0.36rem;
                   text-align center;
                   line-height 0.36rem;
                   background-color #8EBBFB;
                   color #fff;
               }
               .dbubble-text {
                display: inline-block;
                font-size: 0.14rem;
                line-height: 1.6;
                font-family: "微软雅黑";
                width: 0.94rem;
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                }
               }
       }
   }
}
</style>
