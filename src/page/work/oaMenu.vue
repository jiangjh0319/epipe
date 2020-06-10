<template>
    <div>
         <TopHead
        native='native'
        bgcolor = '#42a653'
        :title='title'
         ></TopHead>
         <div style="height:0.54rem;"></div>
         <section class="main">
             <div class="main-ul" v-for="(item,index) in data" :key="index" >
                 <p class="item-title"><i></i> <span> {{item.categoryName}} </span></p>
                 <div class="main_list">
                    <div class="main-li"  v-for="(el,ins) in item.myApplyModels" :key="ins" @click="open_oa(el)" >
                        <div>
                            <img :src="el.approvalIcon"/>
                        </div>
                        <p>{{el.approvalName}}</p>
                    </div>
                </div>
            </div>
            <div class="main-ul">

            </div>
         </section>

         
    </div>
</template>

<script>
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                title:'审批表单',
                data:[],
            }
        },
        components:{
            TopHead
        },
        mounted() {
            this.axios.get(' /process/apply/list').then(res=>{
                this.data = res.data.b.data;
            })
        },
        methods:{
          open_oa(item){
                 window.location.href = "epipe://?&mark=oaForm&_id="+item.approvalFormId;
          }
        }
    }
</script>

<style scoped lang="stylus">

    .main{
    }

    .main-ul{
        background-color #fff;
        margin 0 0.15rem;
        margin-bottom 0.15rem;
    }
    

    .main_list{
        display flex;
        flex-wrap wrap;

    }

    .main-li{
        width:25%;
        text-align center
        margin-bottom 0.20rem;

        img{
            width:0.27rem;
            height:0.27rem;
        }

        p{
            margin-top 0.05rem;
        }
    }

    .item-title{
            overflow hidden
            padding 0.1rem;

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

</style>