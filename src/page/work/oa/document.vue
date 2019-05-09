<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#609ef7'
        title="行文呈批" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-model="documentTitle" />
                </div>
                  <div>
                    <span class="title">申请人</span>
                    <input placeholder="请输入申请人"  v-model="userName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">所属部门</span>
                    <input placeholder="请输入所属部门"  v-model="departmentName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件编号</span>
                    <input style="color:#666" v-model="documentNo" placeholder="请输入文件编号"/>
                </div>
              
          
                <div class="bor_bottom">
                    <p class="title">主送</p>
                    <textarea v-model.trim="sendTo" name="" maxlength="200" id="" cols="30" rows="10" placeholder="请输入主送内容,限定200字">

                    </textarea>
                    <div class="record_box">
                            <span>{{sendLen}}/200</span>
                    </div>
                </div>
                <div  class="bor_bottom">
                    <p class="title">抄送</p>
                    <textarea v-model.trim="copyTo" name="" maxlength="200" id="" cols="30" rows="10" placeholder="请输入抄送,限定200字">

                    </textarea>

                    <div class="record_box">
                            <span>{{copyLen}}/200</span>
                    </div>
                </div>
                <div  class="bor_bottom">
                    <p class="title">事由</p>
                    <textarea v-model.trim="documentReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入事由,限定1000字">

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
                color="#609ef7"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 10
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#609ef7"
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
    if(that.documentTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.documentTitle.length>100 ||that.documentTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.documentNo == ''){
        that.$toast('请输入文件编号')
    }else if(that.documentNo.length>30 ){
        that.$toast('文件编号不能超过30个字符')
    }else if(that.sendTo.length>200||that.sendTo.length<1){
        that.$toast('主送内容不能少于1个或超过200字符')
    }else if(that.copyTo&&that.copyTo.length>200){
        that.$toast('抄送内容不能超过200字符')
    }else if(that.documentReason&&that.documentReason.length>1000){
        that.$toast('事由不能超过1000字符')
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{
        // let chosed_id = ''; //抄送人
        // if(!that.isDraftFlag){
        //     for (let i = 0; i < that.chosed_list.length; i++) {
        //         chosed_id  += "|" + that.chosed_list[i].userId
        //     }
        // }else{
        //     for (let i = 0; i < that.chosed_list.length; i++) {
        //         chosed_id += "|" + that.chosed_list[i].receiverId
        //     }
        // }
        // chosed_id = chosed_id.slice(1)

        // let approver_id = '' //审批人

        // if(!that.isDraftFlag){
        //     for (let i = 0; i < that.approver_list.length; i++) {
        //         approver_id  += "|" + that.approver_list[i].userId
        //     }
        // }else{
        //     for (let i = 0; i < that.approver_list.length; i++) {
        //         approver_id  += "|" + that.approver_list[i].auditUserId
        //     }
        // }
        // approver_id = approver_id.slice(1)
        // let urlStr = '',fileSizeStr = '',fileNameStr = '';
        // for(let i=0;i<that.accessory.length;i++){
        //     urlStr+='|'+that.accessory[i].url;
        //     fileSizeStr+='|'+that.accessory[i].fileSize;
        //     fileNameStr+='|'+that.accessory[i].fileName;  
        // }
        // urlStr = urlStr.slice(1)
        // fileSizeStr = fileSizeStr.slice(1)
        // fileNameStr = fileNameStr.slice(1)
        // let contDesc = that.documentReason.replace(/\n|\r\n/g,"<br>")
        // https://blog.csdn.net/xiaobao5214/article/details/68923023/

        let approver_id = '',chosed_id = ''
        chosed_id = that.Util.people(that.isDraft,that.chosed_list,1).slice(1)
        approver_id = that.Util.people(that.isDraft,that.approver_list,2).slice(1)

        let fileObj = {},params={}
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/document/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    documentTitle:that.documentTitle,//标题
                    urls : fileObj.urlStr, //附件

                    documentNo:that.documentNo,
                    sendTo:that.sendTo,
                    copyTo:that.copyTo,
                    documentReason:that.documentReason,
                    fileNames:fileObj.fileNameStr, 
                    fileSizes:fileObj.fileSizeStr,
                    auditUserIds: approver_id, //审批人
                    receiverIds: chosed_id, //抄送人
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
                        if(that.$route.query.documentId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitDocument&_id="+res.data.b.documentApplyId;
                        
                    },500)
                }
                localStorage.removeItem('documentApply')
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
                documentTitle : '', // 标题
                departmentName : '',//用印部门
                documentNo:'',
                sendTo:'',
                copyTo:'',
                documentReason:'',
                userName : '',//用印承办人
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                sendLen:0,
                copyLen:0,
                mealType:-1,
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
           save_leave(0, "提交成功", this)
        },
         history_back_click(){
            if(!this.isUpdate()){
                 window.location.href = "epipe://?&mark=history_back"
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.documentId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('documentApply',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('documentApply')
            window.location.href = "epipe://?&mark=history_back"
        },
        isUpdate(){
            let data = this.$data;
            for(let key in data){
               if(key=='approver_list'||key=='chosed_list'||key=='accessory'){
                    if(data[key].length!=this.oldData[key].length){
                        return true
                    }
                    for(let i=0;i<data[key].length;i++){

                        if(key!='accessory'&&data[key][i].auditUserId!=this.oldData[key][i].auditUserId){
                            return true
                        }else if(key=='accessory'&&data[key][i].url!=this.oldData[key][i].url){
                            return true
                        }
                    }
                }else if(key!='oldData'&&key!='approver_list'&&key!='chosed_list'&&key!='accessory'){
                    if(data[key]!=this.oldData[key]){
                            return true;
                    }
                }
            }
            return false
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
        },
         watch:{
            documentReason : function(){
                if(this.documentReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.documentReason = this.documentReason.slice(0,1000)
                    return
                }
                this.textNum = this.documentReason.length
            },
            sendTo:function(){
                if(this.sendTo.length>200){
                    this.$toast("最多输入200字~")
                    this.sendTo = this.sendTo.slice(0,200)
                    return
                }
                this.sendLen = this.sendTo.length
            },
            copyTo:function(){
                if(this.copyTo.length>200){
                    this.$toast("最多输入200字~")
                    this.copyTo = this.copyTo.slice(0,200)
                    return
                }
                this.copyLen = this.copyTo.length
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
          }  
        },
        activated(){
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('documentApply')){
                let documentApplydata = JSON.parse(localStorage.getItem('documentApply'))
                for(let key in documentApplydata){
                    this.$data[key] = documentApplydata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.mealType = res.index;
                this.mealTypeName = res.name;
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

            this.axios.get('/user/info').then(function(res){
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })

            if(this.$route.query.documentId){
                    this.axios.get('/work/document/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            documentApplyId:this.$route.query.documentId
                        }
                    }).then(function(res){ 
                        let data = res.data.b;
                        that.id = data.documentApplyId;
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.documentTitle = data.documentTitle;
                        that.documentNo = data.documentNo;
                        that.sendTo = data.sendTo;
                        that.copyTo = data.copyTo;
                        that.documentReason = data.documentReason;

                        that.textNum = data.documentReason.length
                        that.sendLen = data.sendTo.length
                        that.copyLen = data.copyTo.length
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
