<template>
    <div>
        <TopHead
        mark="mark"
        bgcolor='#609ef7'
        :title="title" 
        v-on:history_back="history_back_click"
        :is_relative_approva="is_relative_approva"
        v-on:show_edit='collect'
         ></TopHead>

        <div class="memo_date">
            <span>{{day}}</span>
            &nbsp;
            <span>{{week}}</span>
            &nbsp;
            <span>{{time}}</span>
        </div>

        <div class="memo_content">
            <p>备忘内容</p>
            <textarea name="" v-if="isDetails" readonly  cols="30" rows="10" maxlength="5000" v-model="content" placeholder="这一刻想记点什么"></textarea>
            <textarea name="" v-else cols="30" rows="10" maxlength="5000" v-model="content" placeholder="这一刻想记点什么"></textarea>
        </div>

        <div v-if="!isDetails" class="memo_content" style="padding:0">
            <Accessory :accessory='accessory'>
            
            </Accessory>
        </div>
        <div v-if="isDetails" class="memo_content" style="padding:0">
            <AccessoryList :accessory="accessory">

            </AccessoryList>
        </div>

    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
    import AccessoryList  from '../../../components/oa/accessoryList.vue'  // 附件

    export default {
        data() {
            return {
                accessory:[],
                data:{},
                is_relative_approva:{title:'提交',isShow:true},
                content:'',
                day:'',
                week:'',
                time:'',
                title:'备忘',
                isDetails:false,
            }
        },
        components:{
            TopHead,
            Accessory,
            AccessoryList
        },  
        created() {
            this.getInfor()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'getInfor'
        },
        methods: {
            getInfor(){
                    if(this.$route.query.id){
                    this.isDetails = true;
                    this.title='备忘详情'
                    this.is_relative_approva.isShow = false;
                    let _this = this;
                    this.axios.get('/agenda/reminder/info?reminderId='+this.$route.query.id).then(res=>{
                        _this.content = res.data.b.remindContent;
                        _this.data = res.data.b;
                        _this.getDate(new Date(res.data.b.createTime.replace(/-/g,'/')))
                        _this.file();
                    })
                }else{
                    this.getDate(new Date())
                }
            },
            history_back_click(){
                if(this.$route.query.back){
                    window.location.href = "epipe://?&mark=history_back"
                }else{
                    window.history.back()
                }
            },
            getDate(date){
                let week = ['周日','周一','周二','周三','周四','周五','周六']
                this.day =  date.getMonth() + 1 +'月'+date.getDate()+'日'
                this.week = week[date.getDay()]
                this.time = this.zero(date.getHours())+':'+ this.zero( date.getMinutes())
            },
            collect(){

                let _this = this;

                if(this.content.length==''){
                    this.$toast('备忘内容不能为空')
                    return;
                }

                let urlStr = '',fileSizeStr = '',fileNameStr = '';//附件

                for(let i=0;i<_this.accessory.length;i++){
                    urlStr+='|'+_this.accessory[i].url;
                    fileSizeStr+='|'+_this.accessory[i].fileSize;
                    fileNameStr+='|'+_this.accessory[i].fileName;  
                }
                urlStr = urlStr.slice(1)
                fileSizeStr = fileSizeStr.slice(1)
                fileNameStr = fileNameStr.slice(1)

                this.axios.post('/agenda/reminder/add'+this.Service.queryString({
                        remindContent:_this.content,
                        urls:urlStr,
                        fileNfileNamesameStrs:fileSizeStr,
                        fileSizes:fileSizeStr,
                    
                })).then(res=>{
                    if(res.data.h.code==200){
                        _this.$toast('提交成功')
                        setTimeout(() => {
                            // window.location.href="epipe://?&mark=memo&_id="+res.data.b.reminderId;
                            _this.accessory = []
                            _this.$router.replace({path:'/memo',query:{id:res.data.b.reminderId}})
                        }, 200);
                    }else{
                        _this.$toast(res.data.h.msg)
                    }
                    
                })

            },
            zero(value){
                value+='';
               return value.length<2?'0'+value:value;
            },
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
            }
        },
    }
</script>

<style scoped lang="stylus">

    .memo_date{
        margin-top 0.44rem;
        font-size 0.15rem;
        text-align center;
        height 0.6rem;
        line-height 0.6rem;
    }

    textarea:disabled,textarea[disabled]{
        background-color #fff
        font-size 0.2rem;
    }

    .memo_content{
        margin 0.15rem;
        margin-top 0;
        background #fff;
        padding 0.15rem;

        p{
            margin-bottom 0.1rem;
            font-size 0.15rem;
            font-weight bold;
        }

        textarea{
             width 100%;
            height 100px;
            padding 0;
            font-size 0.14rem;
            color #333;
            line-height 0.2rem;
            border none;
            outline none;
            resize none;
            word-wrap: break-word;
            word-break:break-all
        }
    }

</style>