<template>
    <div>
        <TopHead
            :bgcolor = color
            :title ='title'
            :is_relative_approva="is_relative_approva"
            v-on:show_edit='collect'
        ></TopHead>
        <div style="margin-top:0.43rem">
            <ul class="list">
                <li v-if="collect.length" v-for="item in collect" :key="item.id" @click="go_collectArticle(item)">
                    <div class="svg">
                        <svg class="icon" aria-hidden="false" style="width:0.20rem;height:0.20rem;color:#609df6">
                            <use xlink:href="#icon-cloud-document"></use>
                        </svg>
                    </div>
                    <div class="text line1">
                        {{item.resTitle}}
                    </div>
                    <div class="look">
                        <svg class="icon" aria-hidden="false" style="width:0.14rem;height:0.14rem;">
                            <use xlink:href="#icon-yuedu"></use>
                        </svg>
                        {{item.clicks}}
                    </div>
                </li>

                <li v-if="datas.articleList.length" v-for="item in datas.articleList" class="article" :key="item.id" @click="go_article(item)">
                    <div class="svg">
                        <svg class="icon" aria-hidden="false" style="width:0.20rem;height:0.20rem;color:#609df6">
                            <use xlink:href="#icon-cloud-document"></use>
                        </svg>
                    </div>
                    <div class="text line1">
                        {{item.title}}
                    </div>
                    <div class="look">
                        <svg class="icon" aria-hidden="false" style="width:0.14rem;height:0.14rem;">
                            <use xlink:href="#icon-yuedu"></use>
                        </svg>
                        {{item.readTimes}}
                    </div>
                    <img v-if="!item.readFlag" src="../../assets/new.png">
                </li>

                <li v-if="datas.thirdCategories.length" v-for="item in datas.thirdCategories" :key="item.id" @click="go_articleorthirdcategory(item)">
                    <div class="svg">
                        <svg class="icon" aria-hidden="false" style="width:0.20rem;height:0.20rem;color:#609df6">
                            <use xlink:href="#icon-cloud-document"></use>
                        </svg>
                    </div>
                    <div class="text line1">
                        {{item.name}}
                        <span style="color:red" v-if="item.unread">({{item.unread}})</span>
                    </div>
                    <div class="look">
                        <svg class="icon" aria-hidden="false" style="width:0.14rem;height:0.14rem;">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </div>
                </li>
            </ul>

            <div v-if="show"  class="footLine" style="margin-top:2rem;font-size:0.16rem;">
                    <span style="width:auto">暂无内容</span>
                </div>
        </div>

    </div>
</template>

<script>
  import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                datas:[],
                title:'',
                collect:[],
                show:false,
            }
        },
        components:{
            TopHead,
        },
        created() {
            this.fetchData();
            // let that = this;
            // this.title = this.$route.query.title;
            
            // if(this.$route.query.isCollect){
            //     this.axios.get('/user/collect/list',{
            //         params:{
            //             collecType:'4',
            //         }
            //     }).then(res=>{
            //         that.collect = res.data.b;
            //     })

            //     return;
            // }

            // this.axios.get('/wall/articleorthirdcategory/list',{
            //     params:{
            //         categoryId:that.$route.query.id,
            //     }
            // }).then(res=>{
            //     that.datas = res.data.b;
            // })
        },  
        mounted() {
            
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },

        methods:{

            fetchData(){
                 let that = this;
                 this.show = false;
                this.title = this.$route.query.title;
                
                if(this.$route.query.isCollect){
                    this.axios.get('/user/collect/list',{
                        params:{
                            collecType:'4',
                            
                        }
                    }).then(res=>{
                        that.collect = res.data.b;
                        if(!that.collect.length) that.show = true;
                    })
                    return;
                }

                this.axios.get('/wall/articleorthirdcategory/list',{
                    params:{
                        categoryId:that.$route.query.id,
                    }
                }).then(res=>{
                    that.datas = res.data.b;
                    if(!that.datas.thirdCategories.length&&!that.datas.articleList.length) that.show = true;
                })
            },
            go_articleorthirdcategory(item){
                this.$router.push({path:'/companyWallList',query:{id:item.id,title:item.name}})
            },
            go_article(item){
                setTimeout(()=>{
                    item.readFlag = true;
                },200)
                if(item.type==3){
                    this.axios.get('/wall/article/info',{
                        params:{
                                articleId:item.id,
                            }
                        }).then(res=>{
                            let obj = {index_num: 0, data:[res.data.b.attachUrl],type:0,name:res.data.b.title}
                            window.location.href = "epipe://?&mark=articleDetails&title="+item.title+"&type=3&url="+res.data.b.attachUrl;
                        })
                }else if(item.type == 2){

                    this.axios.get('/wall/article/info',{
                        params:{
                                articleId:item.id,
                            }
                        }).then(res=>{
                            window.location.href = "epipe://?&mark=articleDetails&title="+item.title+"&type=2&url="+res.data.b.articleUrl;
                        })

                }else{
                    let data = JSON.stringify(item)
                    window.location.href = "epipe://?&mark=articleDetails&title="+item.title+'&type=1&_id='+item.id;

                }
            },
            go_collectArticle(item){
                    window.location.href = "epipe://?&mark=articleDetails&title="+item.resTitle+'&type=1&_id='+item.resId;

            }
        }
    }
</script>

<style scoped lang="stylus">

.article{
    position relative

    img{
        position absolute
        top:0;
        right:0;
        width:0.1rem;
        height:0.1rem;
    }
}

.line1{
        white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             width 90%;
    }


.footLine{
       height 0.13rem;
       font-size:0.13rem;
       position relative;
       text-align center;
       color #999;
       padding 0 0.15rem;
       margin-bottom:0.3rem;
       margin-top:0.25rem;

       span{
           position absolute;
           width:0.91rem;
           z-index 2;
           line-height 1em;
           left 0;
           right 0;
           margin auto;
           background-color #f5f5f5;
       }
    }

    .list{
        background-color #fff;
        padding-left 0.15rem;
        width 100%;
        box-sizing border-box;
        
        li{
            display flex;
            width 100%;
            height 0.6rem;
            line-height 0.6rem;
            font-size 0.15rem;
            color #333;
            position: relative;
            overflow hidden;
        }

        li:after{
            content: '';
            position: absolute;
            bottom: 0;
            background: #ccc;
            width: 100%;
            height: 1px;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
        }

        .svg{
            padding-right 0.02rem;

            svg{
                position relative
                top 0.02rem;
            }
        }

        .text{
           flex 1;
            white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
        }

        .look{
            min-width 0.45rem;
            color #999;
            font-size 0.12rem;
            text-align right;
            padding-right 0.15rem;
            padding-left 0.15rem;
        }
    }

</style>