<template>
    <div>
        <TopHead
        bgcolor='#609ef7'
        title="会议提醒" 
        v-on:history_back="history_back_click"
        :is_relative_approva="is_relative_approva"
        v-on:show_edit='collect'
        ></TopHead>

        <div class="content">
            <div class="input_box">
                <div class="group" style="padding-right:0.15rem;">
                    <span class="title">会议主题</span>
                    <input style="color:#666" v-model="title" maxlength="50" placeholder="请输入会议主题"/>
                </div>
            </div>

            <div class="input_box">
                <div class="bor_bottom group" @click="getTime(0)">
                    <span class="title">开始时间</span>
                    <div class="icon_input">
                        <input style="color:#666" v-model="beginTime" disabled/>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </div>
                </div>
                <div class="bor_bottom group"  @click="getTime(1)">
                    <span class="title">结束时间</span>
                    <div class="icon_input">
                        <input style="color:#666" v-model="endTime" disabled/>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </div>
                </div>
                <div class="bor_bottom group" style="padding-right:0.15rem;">
                    <span class="title">会议地址</span>
                    <input style="color:#666" v-model="address" maxlength="20" placeholder="请输入会议地址"/>
                </div>
            </div>

            <div class="input_box">
                <div class=" group" style="padding:0.15rem 0;">
                   <p>会议介绍<span style="color:#999;font-size:0.13rem;"></span></p>
                    <textarea name="" v-model="content" maxlength="200"  cols="30" rows="10" placeholder="可输入会议内容介绍"></textarea>
                </div>
            </div>

            <div class="input_box" >
                <div class="group">
                    <span class="title">提醒时间</span>
                    <div class="icon_input" @click="go_select">
                        <input style="color:#666" v-model="remindTimeName" disabled/>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="input_box" style="padding:0">
                <Accessory :accessory="accessory"></Accessory>
            </div>

            <!-- <div class="input_box" style="padding:0"> -->
                <ApproverMan 
                has_journal="true"
                color="#609ef7"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 10
                title="参会人"
                minTitle='请添加参会人员'
                ></ApproverMan>


        </div>

    </div>
</template>

<script>

    function submit(that){
        if(that.title==''){
            that.$toast('会议主题不能为空')
        }else if(that.address==''){
            that.$toast('会议地址不能为空')
        }else if(that.address.length>20){
            that.$toast('会议地址超过20字')
        }else if(that.content.length>200){
            that.$toast('会议内容不能超过200字')
        }else if(that.beginTime=='请选择开始时间'){
            that.$toast('请选择开始时间')
        }else if(that.endTime=='请选择结束时间'){
            that.$toast('请选择结束时间')
        }else if(that.approver_list.length == 0){
            that.$toast('请选择参会人')
    }   else{

            let urlStr = '',fileSizeStr = '',fileNameStr = '';//附件

            for(let i=0;i<that.accessory.length;i++){
                urlStr+='|'+that.accessory[i].url;
                fileSizeStr+='|'+that.accessory[i].fileSize;
                fileNameStr+='|'+that.accessory[i].fileName;  
            }
            urlStr = urlStr.slice(1)
            fileSizeStr = fileSizeStr.slice(1)
            fileNameStr = fileNameStr.slice(1)

            let approver_id = ''
            for (let i = 0; i < that.approver_list.length; i++) {
                approver_id = approver_id + "|" + that.approver_list[i].userId
            }
            approver_id = approver_id.slice(1)


            that.axios.post('/agenda/meeting/add'+that.Service.queryString({
                content:that.content,
                beginTime:that.beginTime,
                endTime:that.endTime,
                remindTime:that.remindTime,
                urls:urlStr,
                title:that.title,
                address:that.address,
                fileNames:fileNameStr,
                fileSizes:fileSizeStr,
                receiverIds:approver_id
            })).then(res=>{

                if(res.data.h.code==200){
                    that.$toast('提交成功')
                    setTimeout(()=>{
                        // window.location.href = 'epipe://?&mark=meetingDetails&_id='+res.data.b.meetingId;
                         that.$router.replace({path:'/meetingDetails',query:{id:res.data.b.meetingId}})
                    },200)
                }else{
                    that.$toast(res.data.h.msg)
                }
            })          
        }
    }


    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
    import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
    import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人

    export default {
        data() {
            return {
                is_relative_approva:{title:'提交',isShow:true},
                accessory:[],

                endTime:'请选择结束时间',
                beginTime:'请选择开始时间',
                remindTime:1,
                remindTimeName:'提前五分钟',
                title:'',
                address:'',
                content:'',
                approver_list : [], //审批人
                datas:{},
            }
        },
        components:{
            TopHead,
            Accessory,
            ApproverMan
        },
        created() {
            eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.remindTime = res.index;
                this.remindTimeName = res.name;
            })

            this.datas  = JSON.parse(JSON.stringify(this.$data))
        },
        beforeRouteLeave(to, from, next) {
                // console.log(to,from,next)
                if (to.path == "/meetingDetails"||to.path=='/agenda') {
                         this.update();
                } else {
                }
                next();
            },
        methods: {
            ...mapMutations(['approver_man']),

            collect(){
                submit(this)
            },
            remove_item: function (itme, index,typess) {  
                    this.approver_list.splice(index, 1);
                    this.approver_man(this.approver_list)
            },
            update(){
                let oldData = this.datas;
                for(let key in this.$data){
                    this.$data[key] = oldData[key]
                }
                this.approver_man([])
            },
            go_select(){
                this.$router.push({path:'/option',query:{type:'remind',indexs:this.remindTime}})
            },
            history_back_click(){
                window.location.href = "epipe://?&mark=history_back"
            },
            getTime(num){ //获取原生时间
                let that = this;
                window.location.href = "epipe://?&mark=getLeaveTime";
                window["epipe_leavetime_callback"] = str => {
                        let flag = false; 
                        let date = null;
                    if(str.indexOf('/')>0){
                        flag = true;
                        date = that.tiemF(str)
                        str = str.split(/[- : \/]/);
                    }else{
                        date = new Date(str)
                    }
                    if(!num){
                        if(that.endTime!='请选择结束时间'){
                            let endDate = that.tiemF(that.endTime)
                            if(date.getTime()>endDate.getTime()){
                                that.$toast('开始时间不能大于结束时间')
                            }else if(date.getTime()==endDate.getTime()){
                                that.$toast('开始时间不能等于结束时间')
                            }else{
                            that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                            that.getLeaveDay();
                            }
                        }else{
                            that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }
                    }else{            
                        if(that.beginTime!='请选择开始时间'){
                            let beginDate = that.tiemF(that.beginTime);
                            if(date.getTime()<beginDate.getTime()){
                                that.$toast('结束时间不能小于开始时间')
                            }else if(date.getTime()==beginDate.getTime()){
                                that.$toast('结束时间不能等于开始时间')
                            }else{
                                that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                                that.getLeaveDay();
                            }
                        }else{
                            that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }  
                    }
                }
            },
            tiemF(timeStr){
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
            },
        },
        computed: mapState(["approver_man_state"]),
        activated(){
            this.approver_list = this.approver_man_state
         },
    }
</script>

<style scoped lang="stylus">

    .content{
        margin-top 0.59rem;
        padding 0 0.15rem;
        padding-bottom 0.2rem;
    }

    input[disabled],input:disabled,input.disabled{  
    color: #666;  
    -webkit-text-fill-color:#666;  
    -webkit-opacity:1;  
    opacity: 1;
    background-color:#fff;
    }

    .input_box{
        margin 0.15rem 0;
        background-color #fff;
        margin-bottom 0.15rem;
        // -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
        // box-shadow 0 0 0.2rem rgba(238,65,54,.1);
        background-color #fff;
        overflow hidden;
        padding 0 0.15rem;

        .icon{
            display block;
            float right;
            margin-left 0.05rem;
            margin-top 0.16rem;
        }

        .icon_input{
            display flex;
            float right;
            width 2.1rem;
        }

        input{
                 box-sizing border-box
                 float right;
                 width 2.1rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
                 text-align right;
        }

        input::-webkit-input-placeholder{
                 font-size:0.13rem;
                 color:#666;
        }

        input:disabled{
            background-color #fff
        }

        .title{
                 line-height 0.44rem;
                 font-size 0.15rem;
                 color #333;
                 font-weight:bold;
        }

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

    .group{
        overflow hidden
    }

    .bor_bottom{
        position:relative;

    }

    .bor_bottom:after{
        position:absolute;
        content:'';
        display:block;
        bottom : 0;
        left:0;
        height:0.01rem;
        width:100%;
        background-color:#f5f5f5;
    }
</style>