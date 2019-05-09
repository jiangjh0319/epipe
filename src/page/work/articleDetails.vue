<template>
    <div>

        <div class="article">
            <h2>{{datas.title}}</h2>
            <div class="infor">
                <p>
                    部门:{{datas.companyName}}
                </p>
                <p>
                    发布人:{{datas.createBy}}
                </p>
                <p>
                    <span>发布时间:{{datas.createDate}}</span>
                    <span style="float:right;">阅读次数:{{datas.readTimes}}</span>
                </p>
            </div>
            <div v-html="count" class="content">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                datas:[],
                count:'',
            }
        },
        created() {
            let that = this;
            this.axios.get('/wall/article/info',{
                params:{
                    articleId:that.$route.query.id,
                }
            }).then(res=>{
                that.datas = res.data.b;
                that.count = that.Util.Count_format( res.data.b.richContent);
            })
        },
        methods:{

        },
        mounted(){
            
        },
        
    }
</script>

<style scoped lang="stylus">

    .article{
        padding 0 0.15rem;
    }

    .content{

        img{
            max-width 100%;
            height auto;
            margin 0 auto ;
        }
    }

    .infor{
        font-size 0.12rem;
        color #999;
        line-height 0.24rem;
        margin-bottom 0.3rem;
    }

    h2{
        text-align center;
        font-size 0.21rem;
        line-height 0.25rem;
        color #333;
        padding  0.25rem 0;
    }

</style>