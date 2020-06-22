<template>
    <div>
         <TopHead
            mark = 'mark'
            bgcolor = '#609ef7'
            title="员工列表" 
            v-on:history_back="history_back_click"
         ></TopHead>
         <div style="height:0.59rem;"></div>
         <div>
             <div class="list">
                 <div v-for="(item,index) in datas" class="item" :key="index" @click="to_info(index)">
                     <img :src="item.photo" alt="">
                     <div>
                     <p>{{item.name}}</p>
                    <span>{{item.position}}</span>
                     </div>
                 </div>
             </div>
         </div>
    </div>
</template>

<script>
import TopHead  from '../../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                datas:'',
            }
        },
        components:{
            TopHead,
        },
        created(){
            this.datas =JSON.parse(this.$route.query.data)
        },
        methods:{
            history_back_click(){
                history.back()
            },
            to_info(index){
                this.$router.push({path:'/performanceInfo',query:{index,id:this.$route.query.id}})

            }


        }

    }
</script>

<style lang="stylus" scoped>
    .list{
        background-color #fff;
    }


    .item{
        display flex;
        padding 0.15rem;
        border-bottom:0.01rem solid #ebebeb;

        img{
            width:0.38rem;
            height:0.38rem;
            border-raidus:50%;
            margin-right 0.1rem;
         }


        p{
            font-size:0.18rem;
        }


        span{
            font-size:0.14rem;
            color:#999;
        }
    }
</style>