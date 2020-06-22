<template>
   <div>
    <van-nav-bar
    title="档案查看"
    left-arrow
    @click-left="onClickLeft"
    />
    <div class="main">
        <form action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
                @search="onSearch"
                @cancel="onCancel"
            />
        </form>
        <div class="content">
            <p>合同类 </p> <p> > </p> <p> 销售合同</p>
        </div>
        <div class="con_style">
            <div class="style_1" v-for="(item,index) in datasList" :key="index">
                    <div class="row_s"><p class="row_0">{{item.name}}</p><div class="style_2">{{item.status}}</div></div>
                    <div class="row_s"><p class="row_1">档案类型：</p>{{item.type}}</div>
                    <div class="row_s"><p class="row_1">所属公司：</p>{{item.company}}</div>
                    <div class="row_s"><p class="row_1">档案管理员：</p>{{item.admin}}</div>
                    <div class="row_s"><p class="row_1">存放位置:</p>{{item.place}}</div>
                    
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
                        status:'已入档'
                    },
                    {
                        name:'销售合同扫描件档案',
                        type:'合同类',
                        company:'深圳前海优管信息技术有限公司',
                        admin:'刘亦菲',
                        place:'华翰科技A座10楼1号档案库房A区域1号柜子/3层',
                        status:'借阅中'
                    },
                    {
                        name:'销售合同扫描件档案',
                        type:'合同类',
                        company:'深圳前海优管信息技术有限公司',
                        admin:'刘亦菲',
                        place:'华翰科技A座10楼1号档案库房A区域1号柜子/4层',
                        status:'已入档'
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
               width 0.9rem;
               padding-bottom 0.08rem;
           }
           .style_2{
               padding-top: 0.1rem;
               padding-right: 0.2rem;
               padding-bottom: 0.15rem;
               padding-left 1.4rem;
           }
        }
       }
       
   }
}
</style>
