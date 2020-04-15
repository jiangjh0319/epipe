<template>
    <div>
        <TopHead
            bgcolor = '#42a653'
            :title="title" 
         ></TopHead>
         <div style="height:0.48rem;"></div>
         <div>
             <div v-for="(item,index) in list" :key="index" class="list-li" @click="go_back(index)">
                <img :src='item.img' class="headImg"/>  <p>{{item.name}}  

                    <!-- <svg style="float:right;margin-top:0.15rem;" class="icon icon-back" aria-hidden="false" v-if="index==indexs">
                            <use xlink:href="#icon-xuanzhong"></use>
                        </svg> -->
                </p>
             </div>
         </div>
    </div>
</template>

<script>
import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                title:'',
                list:[],
                indexs:-1,
            }
        },
        components:{
            TopHead,
        },
        created(){
            this.title = this.$route.query.title;
            this.list =JSON.parse(this.$route.query.data);
            this.indexs = this.$route.query.index;
        },
        methods:{
            go_back(index){
                eventBus.$emit('approver',{
                    index,
                    approverIndex:this.$route.query.approverIndex,
                });
                window.history.back(-1);

            }
        }
    }
</script>

<style lang="stylus" scoped>
.list-li{
    display flex;
    height 0.48rem;
    line-height 0.48rem;
    border-bottom:0.01rem solid #ebebeb;
    padding 0 0.15rem;
    background-color #fff;

    p{
        flex 1;
    }
}

.headImg{
    width:0.36rem;
    height:0.36rem;
    border-radius:50%;
    margin-right:0.12rem;
    margin-top:0.06rem;
}



</style>