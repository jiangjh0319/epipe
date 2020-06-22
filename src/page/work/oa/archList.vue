<template>
   <div>
    <van-nav-bar
    title="代办事宜"
    left-arrow
    @click-left="onClickLeft"
    />
    <div class="main">
        <div class="content" v-for="(item,index) in datasList" :key="index">
            <div class="row_sty">
                <img src="../../../assets/avatar.png" class="img_s">
                <div class="style_1">{{item.name}}</div>
                <div>{{item.time}}</div>
            </div>
            <div class="style_cont">
                <div>档案编号：{{item.num}}</div>
                 <div>档案类型：{{item.type}}</div>
                  <div>所属公司：{{item.company}}</div>
                   <div>档案保管员：{{item.admin}}</div>
            </div>
        </div>
    </div>
   </div>
</template>

<script>

export default {
    data(){
        return {
            datasList:[
                {
                    name:'美的合同档案',
                    time:'2020-5-18',
                    num:'Ygdjd1245',
                    type:'合同类',
                    company:'深圳前海优管信息技术有限公司',
                    admin:'李四'
                },
                {
                    name:'美的合同档案',
                    time:'2020-5-16',
                    num:'Ygdjd1245',
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
    width 95%;
    background-color #fff;
    margin:0.1rem auto;
    .row_sty{
     display flex;
     justify-content space-around;
     justify-items center;
     padding-top 0.2rem;
    .img_s{
        width 0.4rem;
        height  0.4rem;
        margin-left 0.15rem;s
    }
    .style_1{
        font-size 0.16rem;
        color #323233;
        font-weight 500;
        padding-right 0.9rem;
    }
    }
    .style_cont{
        padding-left 0.78rem;
        div {
            padding-bottom 0.1rem;
        }
    }
    }
}
</style>
