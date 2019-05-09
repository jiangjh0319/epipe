<template>
    <div>
        <TopHead
        mark = "mark"
        bgcolor='#609ef7'
        title="日程详情" 
        v-on:history_back="history_back_click"
        :is_relative_approva="is_relative_approva"
        v-on:show_edit='collect'
        ></TopHead>

        <div style="height:0.59rem;"></div>

        <div class="content">
            <div class="infor">
                <div class="infor-box">
                    <span>开始时间 :</span>
                    <p>{{data.beginTime}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间 :</span>
                    <p>{{data.endTime}}</p>
                </div>
                <div class="infor-box">
                    <span>提醒时间 :</span>
                    <p>{{data.remindTime}}</p>
                </div>
                <div class="infor-box">
                    <span>日程内容 :</span>
                    <p>{{data.content}}</p>
                </div>
            </div>
            <div>
                <Accessory :accessory='accessory'>

                </Accessory>
            </div>

            <div style="margin:0 0.15rem;">
                <Copy
                :dataObj = data
                :newCopy = []
                v-on:remove = "removeCopy"
                color="#609df6"
                title="协作人"
                >
                </Copy>
            </div>
        </div>
    </div>
</template>

<script>

    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../../components/oa/accessoryList.vue'  // 附件
    import Copy  from '../../../components/oa/copyDetails.vue'  // 抄送人


    export default {
        data() {
            return {
                data:{},
                accessory:[],
            }
        },
        components:{
            TopHead,
            Accessory,
            Copy
        },
        mounted() {
            let that = this;
            this.axios.get('/agenda/schedule/info?scheduleId='+this.$route.query.id).then(res=>{
                that.data = res.data.b;
                that.file();
            })
        },
        filters:{
            time(value){
                return value.replace('-','年').replace('-','月')
            }
        },
        methods: {
            file(){
               var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"

                if(!this.data.urls) return
                var urlArr = this.data.urls.split('|')
                this.data.fileNames='24255.png'
                var fileSizeArr = this.data.fileSizes.split('|')
                var fileNameArr = this.data.fileNames.split('|')
                for(let i=0;i<urlArr.length;i++){
                    let obj = {
                        
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i]
                    
                    }

                    if(fileNameArr[i].indexOf(".")>-1){
                        var p = fileNameArr[i].lastIndexOf(".");
                        var strPostfix=fileNameArr[i].substring(p,fileNameArr[i].length) + '|';        
                        strPostfix = strPostfix.toLowerCase();
                        if(strFilter.indexOf(strPostfix)>-1){
                            obj.isImg = true
                        }
                    }
                    this.accessory.push(obj)
                }   
            },
            blurs(){

                return false;
            },
            history_back_click(){
                if(this.$route.query.back){
                    window.location.href = "epipe://?&mark=history_back"
                }else{
                    window.history.back()
                }
            },
        },

    }
</script>

<style lang="stylus" scoped>

    .content{
        font-size 0.15rem;
    }
    
    .infor{
        margin 0 0.15rem;
        background-color #fff;
        padding  0.15rem;
        margin-bottom 0.15rem;
    }

    .infor-box{
        display flex;
        line-height 0.25rem;

        span{
            display inline-block
            margin-right 0.1rem;
            // width 0.8rem;
        }

        p{
            flex 1;
        }
    }
</style>

