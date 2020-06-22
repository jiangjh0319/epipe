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
            <p>深圳前海优管信息技术有限公司</p>
        </div>
        <div class="con_style">
            <van-cell-group v-for="(item,index) in datasList" :key="index">
                <van-field
                    v-model="item.num"
                    :label="item.title"
                    left-icon="description"
                    right-icon="arrow"
                    placeholder=""
                    disabled
                    input-align="right"
                    @click="hanlderInput(index,item.twoData)"
                />
            </van-cell-group>
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
                   title:'合同类',
                   num:'2',
                   twoData:[
                       {
                           title:'其它类',
                           num:'3'
                       }
                   ]
               },
               {
                   title:'用印类',
                   num:'15',
                    twoData:[
                       {
                           title:'人事类',
                           num:'6'
                       }
                   ]
               },
               {
                   title:'项目类',
                   num:'5'
               }
            ]
        }
    },
    methods:{
        onClickLeft(){

        },
        onSearch(val) {
            this.$toast(val);
        },
        onCancel() {
            this.$toast('取消');
        },
        hanlderInput(index,item){
            console.log(index)
            console.log(item)
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
   }
   .con_style{
       background-color #fff;
       margin-top 0.05rem
   }
}
</style>
