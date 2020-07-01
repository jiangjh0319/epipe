<template>
   <div>
    <van-nav-bar
    title="档案列表"
    left-arrow
    @click-left="onClickLeft"
    />
    <!-- <van-search
        v-model="search"
        show-action
        label=""
        placeholder="请输入档案名称"
        >
        <template #action>
            <div @click="hanlderSearch">搜索</div>
        </template>
        </van-search> -->

    <van-search
        v-model="search"
        shape="round"
        background="#fff"
        placeholder="请输入档案名称搜索"
        @input="hanlderSearch"
    />
    <div class="main" v-if="isShow">
        <div class="content" v-for="(item,index) in datasList" :key="index">
            <div class="row_sty">
                <!-- <img src="../../../assets/avatar.png" class="img_s"> -->
                <div>
                    <van-radio-group v-model="ListeRadio">
                        <van-radio :name="index" @click="selecet(item)"></van-radio>
                    </van-radio-group>
                </div>
                <div class="style_1">档案名称：{{item.name}}</div>
            </div>
            <div class="style_cont">
                <div>档案编号：{{item.no}}</div>
                 <div>档案类型：{{item.dossierTypeName}}</div>
                  <div>所属公司：{{item.belongCompanyName}}</div>
                   <div>档案保管员：{{item.managerName}}</div>
                    <div>档案位置：{{item.dossierLocationName}}</div>
                     <div >时间：{{item.dossierDate|sliceDate}}</div>
            </div>
        </div>
    </div>
    <div>
        <van-empty v-if="!isShow" description="暂无数据" />
    </div>
   </div>
</template>

<script>

export default {
    data(){
        return {
            isShow:true,
            ListeRadio:'',
            search:'',
            datasList:[],
            newData:[],
            oldlist:[],
        }
    },
    filters:{
        sliceDate(val){
            return val.slice(0,10)
        }
    },
    computed:{
        datasList(){
          console.log(this.search,'手指')
          var search = this.search;
          var searchVal  = '';//搜索后的数据
            if (search) {
                searchVal = this.newData.filter(function(product) {
                return Object.keys(product).some(function(key) {
			    //搜索所有的内容
                return String(product[key]).toLowerCase().indexOf(search) > -1;
			    //只搜索问题内容（某一个key）
                return String(product['questions']).toLowerCase().indexOf(search)>-1;
                })
                })
		            return searchAftVal;
                }
            
        }
    },

    methods:{
        onClickLeft(){
            history.back();
        },
        init(){
            this.axios.get("work/dossierBorrowApply/token?pageNo=1&pageSize=10").then(res=>{
            if(res.data.h.code==200){
            // console.log(res.data.b.b.dataList,'档案名称')
            let newArr = res.data.b.b.dataList;
            if(newArr.length==0){
                // this.columns.push('暂无数据')
                this.isShow = true;
            }else{
                this.datasList = newArr;
                this.newData = newArr;
                // for(let val of this.newArr){
                //     // console.log(val,'val')
                //     // this.columns.push(val.name)
                //     // this.archNameIds.push(val.id)
                // }
            }
            }else{
                this.$toast(res.data.h.msg)
            }

            })
        },
        selecet(item){
            // console.log(item)
            // this.$router.push({path:'/archAplly'})
            history.back()
            this.$store.commit('archr_list',item)
        },
        hanlderSearch(value){
          console.log(this.search,'手指')
          var search = this.search;
          var searchVal  = '';//搜索后的数据
            if (search) {
                searchVal = this.newData.filter(function(product) {
                return Object.keys(product).some(function(key) {
			    //搜索所有的内容
                return String(product[key]).toLowerCase().indexOf(search) > -1;
			    //只搜索问题内容（某一个key）
                return String(product['name']).toLowerCase().indexOf(search)>-1;
                })
                })
                console.log(searchVal,'搜索数据')
                this.datasList = searchVal;
            }else{
                this.datasList = this.newData;
            }
     
    }
        
    },
    created(){
        this.init();
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
     justify-content start;
     justify-items center;
     padding-top 0.2rem;
     padding-bottom 0.1rem;
     margin-left 0.15rem;
    .img_s{
        width 0.4rem;
        height  0.4rem;
        margin-left 0.15rem;s
    }
    .style_1{
        font-size 0.15rem;
        color #323233;
        font-weight 700;
        padding-left  0.15rem;
        // margin-right 0.4rem;
    }
    }
    .style_cont{
        padding-left 0.5rem;
        div {
            padding-bottom 0.1rem;
        }
    }
    }
}
</style>
