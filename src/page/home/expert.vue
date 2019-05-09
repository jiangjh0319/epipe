<template>
    <section>
        <TopHead
        bgcolor='#26afeb'
        title='专家库'
        v-on:history_back="history_back"
        native='native'
         ></TopHead>
        <div class="item topMargin" v-if="fameArr.length">
            <div class="item-title">
                <h2>著名专家</h2>
                <router-link class="more" :to="{path:'/expertList',query:{type: '著名专家'}}" tag="div">
                    更多<svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-into"></use>
                     </svg>
                </router-link>
            </div>
            <div class="item-content">
                <div class="cont" v-for="(item,index) in fameArr" v-if="index<2" @click="go_newsdetail(item)">
                        <img :src="item.coverImgUrl"/>                    
                    <h4 v-html="item.title"></h4>
                    <!-- <p>{{item.title}}</p> -->
                </div>
            </div>
        </div>
        <div class="item" v-if="consultArr.length">
            <div class="item-title">
                <h2>咨询专家</h2>
                <router-link class="more" tag="div" :to="{path:'/expertList',query:{type: '咨询专家'}}">
                    更多<svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-into"></use>
                     </svg>
                </router-link>
            </div>
            <div class="item-content">
                <div class="cont" v-for="(item,index) in consultArr" v-if="index<2" @click="go_newsdetail(item)">
                        <img :src="item.coverImgUrl"/>                    
                    <h4 v-html="item.title"></h4>
                    <!-- <p>{{item.title}}</p> -->
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Util from '../../js/Util.js'
import TopHead  from '../../components/topheader.vue'  //header导航栏
export default {
    data(){
        return{
            fameArr : [],
            consultArr : [],
        }        
    },
    methods:{
            go_newsdetail(item){
            let obj = {};
            obj.title = Util.Title_format(item.title );
            obj.imageUrl = item.coverImgUrl;
            obj.text = Util.Title_format(item.summary)
            let data = JSON.stringify(obj)
            window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&_id=" + item.id+'TTTTTT&data='+data;
            },
        },
    mounted(){

       let  that = this;
        function a(){
            return that.axios.get(that.Service.resource + '著名专家');
        } 
        function b(){
            return that.axios.get(that.Service.resource + '咨询专家');
        }
        this.axios.all([a(),b()]).then(this.axios.spread((a,b) =>{
            if(a.data.h.code === 200){
                that.fameArr = a.data.b;
                that.consultArr = b.data.b;
            }
        }))
    },
    components : {
            TopHead
        }
}
</script>

<style lang="stylus" scoped>

    .item{
        margin 0.15rem;
        margin-bottom 0;
        padding 0.15rem 0.1rem;
        background-color #fff;
        -webkit-box-shadow: 0 0 0.2rem rgba(38,175,235,0.1);    
        box-shadow 0 0 0.2rem rgba(38,175,235,0.1);
        border-radius  4px;
    }

    .item-title{
        height 0.29rem;

        h2{
            float left;
            width 49%;
            border-left 2px solid #26afeb;
            text-indent 0.08rem;
            font-size: 0.14rem;
            line-height 1em;
            color #333;
            font-weight bold;
        }

        p{
            font-size 0.14rem;
            color #999;
        }
    }
    .item-content{
        display flex;

        .cont{
            flex 1;
        }
        
        .cont:nth-child(2){
            padding-left 0.08rem;
        }

        img{
            display:block;
            width:1.575rem;
            height :1.575rem;
            border-radius 4px;
        }

        h4{
            font-size 0.15rem;
            width 1.575rem;
            color #333;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-top 0.1rem;
        }
    }
    .more{
            float right;
            width:20%;
            text-align:right;
            font-size 0.14rem;
            color #999;
        }

    .topMargin{
        margin-top:0.59rem;
    }

</style>
