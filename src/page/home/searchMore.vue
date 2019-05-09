<template>
    <div>
         <TopHead
        mark='mark'
        bgcolor = '#0fc37c'
        :title=title
        v-on:history_back="history_back_click"
         ></TopHead>
         <div class="main">
            <div class="head">
                <span>
                    {{type | typeFor}}
                </span>
            </div>
            <div class="cont">
                <div v-for="item in searchData" :key="item.resId" v-html="item.resTitle" @click="go_newsdetail(item)"></div>
            </div>
        </div>
        <infinite-loading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more">
                暂无更多加载
            </span>
            <span slot="no-results">
                暂无结果
            </span>
        </infinite-loading>
    </div>
</template>

<script>
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    import InfiniteLoading from 'vue-infinite-loading';
    import Util from '../../js/Util.js'
    export default {
        data() {
            return {
                title:'1',
                searchData:[],
                type:1,
            }
        },
        created() {
               let that = this;
            this.type = this.$route.query.type            
            this.title = this.$route.query.keyWord

            this.axios.get('/content/searchMore',{
                params:{
                keyWord:this.$route.query.keyWord,
                type:this.$route.query.type
                }
            }).then(function(res){
                that.searchData = res.data.b;
            })

        },

        mounted() {
        },
        methods:{
            history_back_click(){
                if(this.$route.query.h5){
                    history.back()

                }else{
                     window.location.href = "epipe://?&mark=history_back"
                }
            },
            go_newsdetail(item){
                let title = Util.Title_format(item.resTitle)
                let obj = {};
                obj.title = title;
                obj.imageUrl = item.converImgUrl;
                obj.text = Util.Title_format(item.summary);
                let data = JSON.stringify(obj)
                window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&_id=" + item.resId+'TTTTTT&data='+data;
            },
            onInfinite(){ //上拉加载更多
                let that = this;
                if(that.searchData.length<10){
                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return
                }
                setTimeout(()=>{
                    that.axios.get('/content/searchMore', {
                    params: {
                        lastId:that.searchData[(that.searchData.length) - 1].resId,
                        keyWord:that.$route.query.keyWord,
                        type:that.$route.query.type
                    }
                    }).then(function (data) {
                    setTimeout(() => {
                        if (data.data.b.length == 0) { 
                            that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                        } else if (data.data.b) {
                            that.searchData = that.searchData.concat(data.data.b)
                            that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        }
                    }, 100);
                    }).catch(function (error) {
                    console.log(error);
                    });
            },200)

            }
        },
        filters:{
            typeFor(value){

                return value==1?'优管专题':value==2?'招标':'展会'
            }
        },
         components:{
            TopHead,
            InfiniteLoading
        },
    }
</script>

<style scoped lang="stylus">

.main{
    margin-top 0.59rem;
    background-color #fff
    padding 0 0.15rem;
}


.head{
         height 0.4rem;
        line-height 0.4rem;
        font-size  0.14rem;
        color:#666;
        border-bottom:0.01rem solid #ddd;

        span:nth-child(2){
            float right;
            color:#999;
        }
}

.cont{

    div{
        height 0.4rem;
        line-height 0.4rem;
        color: #333;
        font-size:0.16rem;
        overflow hidden;
        text-overflow:ellipsis;
        white-space:nowrap;   
        border-bottom:0.01rem solid #ddd;

    }
}

    .cont div:nth-last-child(1){
        border none
    }


</style>