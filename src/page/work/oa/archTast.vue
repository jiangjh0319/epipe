<template>
   <div>
    <van-nav-bar
    title="我的档案上传任务"
    left-arrow
    @click-left="onClickLeft"
    />
    <div class="main">
        <van-tabs v-model="active">
            <van-tab title="待上传">
                <div class="content" v-for="(item,index) in datasList" :key="index">
                    <div class="row_sty">
                        <div class="style_1">{{item.name}}</div>
                        <div class="style_time">{{item.time}}</div>
                    </div>
                    <div class="style_cont">
                        <div>档案类型：{{item.type}}</div>
                        <div>所属公司：{{item.company}}</div>
                        <div>责任人员：{{item.peopel}}</div>
                        <div>档案管理员：{{item.admin}}</div>
                    </div>
                    <div class="btn">
                        上传档案
                    </div>
                </div>
            </van-tab>
            <van-tab title="已上传">
                <div class="content" v-for="(item,index) in datasList" :key="index">
                    <div class="row_sty">
                        <div class="style_1">{{item.name}}</div>
                        <div class="style_time">{{item.time}}</div>
                    </div>
                    <div class="style_cont">
                        <div>档案类型：{{item.type}}</div>
                        <div>所属公司：{{item.company}}</div>
                        <div>责任人员：{{item.peopel}}</div>
                        <div>档案管理员：{{item.admin}}</div>
                    </div>
                    <div class="btn">
                        上传档案
                    </div>
                </div>
            </van-tab>
            <van-tab title="已入档">
                <div class="content" v-for="(item,index) in datasList" :key="index">
                    <div class="row_sty">
                        <div class="style_1">{{item.name}}</div>
                        <div class="style_time">{{item.time}}</div>
                    </div>
                    <div class="style_cont">
                        <div>档案类型：{{item.type}}</div>
                        <div>所属公司：{{item.company}}</div>
                        <div>责任人员：{{item.peopel}}</div>
                        <div>档案管理员：{{item.admin}}</div>
                    </div>
                    <div class="btn">
                        上传档案
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
   </div>
</template>

<script>

export default {
    data(){
        return {
            active: 2,
            datasList:[
                {
                    name:'美的合同档案',
                    time:'2020-5-18',
                    peopel:'刘亦菲',
                    type:'合同类',
                    company:'深圳前海优管信息技术有限公司',
                    admin:'李四'
                },
                {
                    name:'美的合同档案',
                    time:'2020-5-16',
                    peopel:'刘亦菲55',
                    type:'合同类',
                    company:'深圳前海优管信息技术有限公司5撒大声地',
                    admin:'李5'
                }
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
    width 100%;
    background-color #fff;
    margin:0.1rem auto;
    position relative
    .row_sty{
     display flex;
     justify-content space-between;
     justify-items center;
     padding-top 0.15rem;
     padding-left 0.15rem;
     padding-right 0.15rem;

    .img_s{
        width 0.4rem;
        height  0.4rem;
        margin-left 0.15rem;s
    }
    .style_1{
        font-size 0.16rem;
        color #323233;
        font-weight 700;
        padding-right 0.9rem;
    }
    .style_time{
        font-size 0.12rem;
        color #999;
    }
    }
    .style_cont{
        padding-top 0.15rem;
        padding-left 0.15rem;
        padding-right 0.15rem;
        div {
            padding-bottom 0.1rem;
        }
    }
    .btn{
        width 0.8rem;
        height 0.3rem;
        background-color #609EF7;
        border-radius:2px;
        color #fff;
        text-align center;
        line-height 0.3rem;
        position absolute;
        right 0.15rem;
        bottom 0.15rem;
    }
    }
}
</style>
