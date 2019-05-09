<template>
    <section>
        <TopHead
        :bgcolor=color
        title='报销类别'
        mark='mark'
        v-on:history_back='history_back'
        ></TopHead>
        <div class="main">
         
            <ul class="list">
                <li v-for="(item,index) in data" @click="clickEvent(item.value,item.key)" :key="index">
                    <div class="li">
                        <span>
                        {{item.key}} 
                        </span>
                        <svg class="icon icon-back" aria-hidden="false" v-if="item.value==indexs">
                            <use xlink:href="#icon-xuanzhong1"></use>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>

import {mapState, mapMutations} from 'vuex';
import TopHead  from '../../../components/topheader.vue'  //header导航栏
export default {
        data(){
            return{
            indexs : -1,
            data : [],
            num:0,

         }
        },
        components : {
            TopHead
        },
        methods : { 
            ...mapMutations([
                'remburseData',
            ]),         
            clickEvent(index,name){
                let obj = {
                    index:this.num,
                    value:{
                        type:index,
                        typeName:name,
                    }
                }
                this.remburseData(obj)
                window.history.back(-1);
            },
            history_back:function(){
                window.history.back(-1);
            }
        },
        mounted : function(){
            this.num = this.$route.query.indexs
            this.indexs = this.reimburse[this.num].type;
            let that = this;
            this.title = '报销类别';
            this.color = this.$route.query.color
            this.axios.get('/work/reimburse/type').then(function(res){
                if(res.data.h.code =200 ) that.data = res.data.b;
            })
        },
        computed: mapState(['reimburse'])  

}
</script>


<style lang="stylus" scoped>
    .main{
        margin-top 0.59rem;
        padding 0 0.15rem;
    }

    .list{
         -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        box-shadow 0 0 0.2rem rgba(238,65,54,.1);
        background-color #fff;
    }

    li{
        height 0.43rem;
        line-height 0.43rem;
        font-size 0.15rem;
        padding-left 0.15rem;
        color #333;

        svg{
            float right;
            margin-top 0.14rem;
            margin-right 0.15rem;
        }
    }

    .li{
        border-bottom 1px solid  #e6e6e6;        
    }
</style>
