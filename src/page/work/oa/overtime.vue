<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#fd545c'
        title="加班" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group" style="margin-bottom:0;">
        
                 <div class="bor_bottom choose" @click="getTime(0)">
                     <span class="title">开始时间</span>
                    <p>
                        <span class="nullValue">{{beginTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom choose" @click="getTime(1)">
                     <span class="title">结束时间</span>
                    <p>
                        <span class="nullValue">{{endTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom choose">
                     <span class="title">时长</span>
                    <input v-model="duration" placeholder="请输入时长">
                </div>
            </div>
                <p id="info">按小时统计</p>


            <div class="styles input_group">
                <router-link :to="{ path:'/option', query: {indexs:isLegalHoliday,type:'overtime',color:'#fd545c'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">是否法定假日</span>
                    <p>
                        <span class="nullValue">{{isLegalHoliday | isDay}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <div class="bor_bottom choose">
                     <span class="title">加班核算方式</span>
                    <p>
                        <span class="nullValue">{{accountType}}</span>
                    </p>
                </div>
                
            </div>

            <div class="styles input_group">

                <div class="bor_bottom">
                    <p class="title">加班原因</p>
                    <textarea v-model.trim="reason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入加班原因,限定1000字">

                    </textarea>
                    <div class="record_box">
                            <span>{{textNum}}/1000</span>
                    </div>
                </div>
           
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#fd545c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 0
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#fd545c"
                :data_list=chosed_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :types = '2'
                :isGroup = true
            ></CopeMan>
        </div>
        <WorkButton
            v-if="!has_journal"
            v-on:left_click="save_btn"
            v-on:right_click="submit_btn"
            left_title="存草稿"
            right_title="提交"
            noSvg = true
            bgcolor="#fd545c"
        ></WorkButton>
          <Dialog
            lfText="保存"
            rgText="不保存"
            content="保存此次编辑?"
            v-on:lfClick="lf_click"
            v-on:rgClick="rg_click"
            v-show="isShow"
            >
        </Dialog>

    </section>
</template>

<script>
let reg = /^[\u4e00-\u9fa5]+$/;
var regs =/^[1-9]+\d*$/;
let rule = /^[A-Za-z0-9]+$/;
let save_leave = (index,text,that) =>{
    if(that.beginTime == '请选择开始时间'){
        that.$toast('请选择开始时间')
    }else if(that.endTime == '请选择结束时间'){
        that.$toast('请选择结束时间')
    }else if(that.duration==""){
        that.$toast('请输入加班时间')
    }
    else if(that.reason.length>1000||that.reason.length<6){
        that.$toast('加班原因不能少于6个或超过1000字符')
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{
        
       
         let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/overtime/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    reason:that.reason, //加班原因
                    beginTime:that.beginTime,
                    endTime:that.endTime,
                    isLegalHoliday:that.isLegalHoliday,
                    accountType:that.accountTypeCode,
                    duration:that.duration,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    auditCompanyIds,
                    receiverCompanyIds,
                    draftFlag : index, //草稿还是发送
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res)=>{
            if(res.data.h.code!=200){
                that.$toast(res.data.h.msg)
            }else if(res.data.h.code == 200){
                if(index){

                    that.$toast('已保存至草稿箱!')
                    setTimeout(()=>{
                        if(that.$route.query.overtimeId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitOvertime&_id="+res.data.b.overTimeApplyId;
                        
                    },500)
                }
                localStorage.removeItem('overtime')
            }
      })
    }
}

import {mapState, mapMutations} from 'vuex';
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗


export default {
        data(){
            return{
                id:'',
                beginTime:'请选择开始时间',
                endTime:'请选择结束时间',
                isLegalHoliday:-1,
                accountType:"申请调休",
                duration:'',
                accountTypeCode:1,
                reason:'',
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                isShow:false,
            }
        },
        components: {
            WorkButton,
            CopeMan,
            ApproverMan,
            TopHead,
            Accessory,
            Dialog
        },
        methods:{
        ...mapMutations(['change_man','approver_man']),
        save_btn(){ //保存草稿
           save_leave(1, "存入草稿成功", this)
        },
        submit_btn(){ //提交
        console.log(111)
           save_leave(0, "提交成功", this)
        },
         history_back_click(){
            if(!this.Util.isUpdate(this.$data,this.oldData)){
                 window.location.href = "epipe://?&mark=history_back"
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.overtimeId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('overtime',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('overtime')
            window.location.href = "epipe://?&mark=history_back"
        },
        addAccessory:function(){
            window.location.href = "epipe://?&mark=addAccessory"
        },
        deleteFile:function(index){  //删除附件

            this.accessory.splice(index,1)
        },
        go_fildDetails: function (url) { //查看图片详情
                let that = this;
                let obj = {index_num: 0, data:[url],type:0}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
        },
        remove_item: function (itme, index,typess) {   //删除
            if(typess){
                this.approver_list.splice(index, 1);
                this.approver_man(this.approver_list)
            }else{
                this.chosed_list.splice(index, 1);
                this.change_man(this.chosed_list)
            }
        },
        isImg:function(str){
                 //判断是否是图片 - strFilter必须是小写列举
                var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
                if(str.indexOf(".")>-1){
                    var p = str.lastIndexOf(".");
                    var strPostfix=str.substring(p,str.length) + '|';        
                    strPostfix = strPostfix.toLowerCase();
                    if(strFilter.indexOf(strPostfix)>-1){
                        return true;
                    }
                }        
                return false;   
            },
        accessoryFor:function(data){
              if(!data.accessory||data.accessory.url==null) return false;
               var urlArr = data.accessory.url.split('|')
               var fileSizeArr = data.accessory.fileSize.split('|')
               var fileNameArr = data.accessory.fileName.split('|')
                for(let i=0;i<urlArr.length;i++){
                    this.accessory.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i]
                    })
                }

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
                           that.getHours();
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
                            that.getHours();
                        }
                    }else{
                        that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }  
                }
            }
        },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
             getHours(){
                 
                let bTime = this.Util.timeFo(this.beginTime)
                let eTime = this.Util.timeFo(this.endTime)
                let time = eTime.getTime() - bTime.getTime()

                this.duration = parseFloat(time/(1000*60*60)).toFixed(1)
             }
        },
         watch:{
            reason : function(){
                if(this.reason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.reason = this.reason.slice(0,1000)
                    return
                }
                this.textNum = this.reason.length
            },
        },
        filters:{
          fileSize:function(value){
              value = value-0
            if(value<5500){
                value = value/1024
                return value.toFixed(2)+'kb';
            }
            value = value/1024/1024
            return value.toFixed(2)+'mb';
          },
          isDay:function(value){

              if(value==-1) return '请选择'
              return value?'是':'否'
          }
        },
        activated(){
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('overtime')){
                let overtimedata = JSON.parse(localStorage.getItem('overtime'))
                for(let key in overtimedata){
                    this.$data[key] = overtimedata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.isLegalHoliday = res.index;
            })
         },
        mounted(){
            let that = this;

                window["epipe_camera_callback"] = (url,fileSize,fileName) => {
                    var obj = {
                            url,
                            fileSize,
                            fileName
                    }
                    that.isImg(url)?obj.isImg=true:obj.isImg=false;
                    that.accessory.push(obj)
                }

            console.log(this.$route.query.overtimeId)

            if(this.$route.query.overtimeId){
                    this.axios.get('/work/overtime/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            overTimeApplyId:this.$route.query.overtimeId
                        }
                    }).then(function(res){ 
                        let data = res.data.b;
                        that.id = data.overTimeApplyId;
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.beginTime = data.beginTime
                        that.endTime = data.endTime
                        that.accountTypeCode = data.accountTypeCode
                        that.reason = data.reason;
                        that.duration = data.duration;
                        that.isLegalHoliday = data.legalHoliday
                        that.textNum = data.reason.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.approver_list = data.auditers;
                        that.approver_man(that.approver_list);
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
            }
        },
        beforeDestroy() {
            eventBus.$off('leaveType');
        },
        computed: mapState(["chosed_man_state","approver_man_state"])
        
}
</script>


<style lang="stylus" scoped>

  #info{
    color #999;
    text-indent:0.1rem;
    margin 0.05rem 0 0.15rem 0;
  }

    .content{
        margin-top 0.59rem;
        margin-bottom 0.3rem;
        padding 0 0.15rem;

         .styles{
            margin-bottom 0.15rem;
             -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
             box-shadow 0 0 0.2rem rgba(238,65,54,.1);
             background-color #fff;
             overflow hidden

             input{
                 box-sizing border-box
                 float right;
                 width 2.1rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
                 text-align right;
                 padding-right 0.15rem;
             }
             input::-webkit-input-placeholder{
                 font-size:0.13rem;
                 color:#666;
             }

             textarea{
                 width 100%;
                 height 1.2rem;
                 line-height 0.2rem;
                border none;
                resize none;
                outline none;
                color #666;
                font-size 0.15rem;
                word-wrap: break-word;
                word-break: break-all
             }

             .title{
                 line-height 0.44rem;
                 font-size 0.15rem;
                 color #333;
                 font-weight:bold;
             }
        }
    }



    .input_group>div{
        overflow hidden;
        padding 0 0.15rem;
    }

    input[disabled],input:disabled,input.disabled{  
    color: #666;  
    -webkit-text-fill-color:#666;  
    -webkit-opacity:1;  
    opacity: 1;
    background-color:#fff;
    } 

    .choose{
         p{
            float:right;
            line-height 0.44rem;
        }
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

    .record_box{
        overflow hidden;
        margin-bottom 0.08rem;
        font-size 0.12rem;


        span{
            float right;
            color: rgb(96, 158, 247);
        }
    }

    .nullValue{
        color:#666;
    }

    

</style>
