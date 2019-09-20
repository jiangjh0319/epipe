<template>

    <div>
        <TopHead
            mark="mark"
            v-on:history_back="history_back"
            :bgcolor = color
            title = '公司墙'
            native = 'native'
            :is_relative_approva="is_relative_approva"
            v-on:show_edit='collect'
        ></TopHead>
        <div style="height:0.43rem"></div>
        <div class="banner">
            <img src="../../assets/companyWall.png"/>
        </div>
        <div class="main">
            <div style="margin-bottom:0.3rem;" v-if="commData.length">
                <div class="data_title">公共栏目</div>
                <div v-for="(item,index) in commData" v-if="item.secondCategory.length" :key="index" style="margin-bottom:0.15rem;background-color:#fff;">
                    <div class="title">
                        <i></i>
                        <span class="line1">{{item.firstCategory.name}}</span>
                    </div>
                    <div class="list">
                        <div class="list-li" v-for="(items,ind) in item.secondCategory" :key="ind" @click="go_articleorthirdcategory(items)">
                            <img :src="items.pic" style="width:0.27rem;height:0.27rem;"/>
                            {{items.name |textFor}}
                            <span style="color:red" v-if="items.unread">({{items.unread}})</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="data_title">公司栏目</div>
                <div v-for="(item,index) in companyData" v-if="item.secondCategory.length" :key="index" style="margin-bottom:0.15rem;background-color:#fff;">
                    <div class="title">
                        <i></i>
                        <span class="line1">{{item.firstCategory.name}}</span>
                    </div>
                    <div class="list">
                        <div class="list-li" v-for="(items,ind) in item.secondCategory" :key="ind" @click="go_articleorthirdcategory(items)">
                            <img :src="items.pic" style="width:0.27rem;height:0.27rem;"/>
                            {{items.name |textFor}}
                            <span style="color:red" v-if="items.unread">({{items.unread}})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return{
                list:[],
                commData:[],
                companyData:[],
                is_relative_approva:{title:'我的收藏',isShow:true}
            }
        },
        created() {
            let _this = this;
            this.axios.get('/wall/front/list').then(res=>{
                // _this.list = res.data.b;
                let arr = res.data.b;

                arr.forEach(item => {
                    if(item.firstCategory.commonFlag=='1'){
                        this.commData.push(item)
                    }else{
                        this.companyData.push(item)
                    }
                });
            })
        },
        mounted(){
            
        },
        components:{
            TopHead
        },
        methods:{

            go_articleorthirdcategory(item){
                this.$router.push({path:'/companyWallList',query:{id:item.id,title:item.name}})
            },

            collect(){
                this.$router.push({path:'/companyWallList',query:{id:'',title:'我的收藏',isCollect:true}})
            },
            history_back(){
                    window.location.href = "epipe://?&mark=workUpdate";

                setTimeout(()=>{
                    window.location.href = "epipe://?&mark=history_back";
                },200)
            }
        },
        filters:{
            textFor(value){
                return value.length>6?value.slice(0,8)+'...':value
            }
        }
    }
</script>

<style scoped lang="stylus">

    .data_title{
        padding 0.05rem 0.15rem;
        font-weight:600;
        font-size:0.17rem;
        margin-bottom:0.05rem;
    }
                         
    .banner{
        
        img{
            width 100%;
            height auto;
        }
    }

    .main{
        margin-top 0.15rem;
    }

    .line1{
        white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             width 90%;
    }

    .title{
         overflow hidden;
         padding 0.15rem;
         border-bottom 0.01rem solid #e6e6e6;

        i{
            float left
            width 0.03rem;
            height 0.16rem;
            background-color #f80;
            border-radius 0.03rem;
            margin-top 0.03rem;
            margin-right 0.06rem;
        }

        span{
            float left
            font-size 0.16rem;
            color #333
        }
    }

    .list{
        overflow hidden;
    }

    .list-li{
        box-sizing border-box;
        float left;
        height 1rem;
        line-height 1rem;
        width 50%;
        text-align center
        font-size 0.15rem;
        color #333;
        border-bottom 0.01rem solid #e6e6e6;
        border-right 0.01rem solid #e6e6e6;

        img{
            position relative
            top 0.07rem;
        }
    }

</style>