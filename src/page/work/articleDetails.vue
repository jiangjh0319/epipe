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

            <div class="file">
                <p>查看附件</p>
                <div v-for="(item,index) in file" :key="index" @click="seeFile(item,fileName[index])">
                    <svg class="icon" aria-hidden="false" style="width:0.20rem;height:0.20rem;color:#609df6">
                        <use xlink:href="#icon-cloud-document"></use>
                    </svg>
                    <span>{{fileName[index]}}</span>
                </div>
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
                file:[],
                fileName:[],
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
                this.file = that.datas.attachUrl.split(',')
                this.fileName = that.datas.attachFilenames.split(',')
                that.count = that.Util.Count_format( res.data.b.richContent);
            })
        },
        methods:{
            seeFile(url,fileName){
                 let obj = {index_num: 0, data:[url],type:0,name:fileName,size:20}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            }
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

    .file{
        margin-top 0.15rem;

        .title{
            font-size 0.17rem;
        }

        >div{
            margin 0.1rem 0;
        }
    }

</style>