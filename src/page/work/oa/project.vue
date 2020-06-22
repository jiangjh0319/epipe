<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#0fc37c'
        title="项目立项" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-bind:disabled="isHr"  style="color:#666"  v-model="projectTitle" />
                </div>
                  <div>
                    <span class="title">立项申请人</span>
                    <input placeholder="请输入申请人"  v-model="userName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">所属部门</span>
                    <input placeholder="请输入所属部门"  v-model="departmentName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">项目编号</span>
                    <input style="color:#666" v-bind:disabled="isHr" v-model="projectNo" placeholder="请输入项目编号"/>
                </div>
                 <div class="bor_bottom choose" @click="getTime(0)">
                     <span class="title">申请时间</span>
                    <p>
                        <span class="nullValue">{{applyDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom">
                    <span class="title">项目名称</span>
                    <input style="color:#666" v-bind:disabled="isHr" v-model="projectName" placeholder="请输入项目名称"/>
                </div>
                
                <div class="bor_bottom">
                    <span class="title">预估金额(元)</span>
                    <input style="color:#666" v-bind:disabled="isHr" v-model="projectBudget" placeholder="请输入项目预估金额"/>
                </div>
                 <div class="bor_bottom choose" @click="getTime(1)">
                     <span class="title">立项时间</span>
                    <p>
                        <span class="nullValue">{{buildDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom">
                    <span class="title">项目周期</span>
                    <input style="color:#666" v-bind:disabled="isHr" v-model="projectDate" placeholder="请输入项目周期"/>
                </div>
                 <div class="bor_bottom choose" @click="to_principal()" v-if="isHr">
                     <span class="title">第二负责人</span>
                    <p>
                        <span class="nullValue">{{principal?principal.name:'请选择'}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom">
                    <span class="title">单位联系人</span>
                    <input style="color:#666" v-bind:disabled="isHr" v-model="connectionName" placeholder="请输入单位联系人"/>
                </div>
           
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">项目背景</p>
                <textarea v-model.trim="projectBackground" v-bind:disabled="isHr" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入项目背景,限定1000字">

                </textarea>
                <div class="record_box">
                        <span>{{textCount}}/1000</span>
                </div>
            </div>
            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">项目需求概述</p>
                <textarea v-model.trim="description" v-bind:disabled="isHr" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入项目需求概述,限定1000字">

                </textarea>
                <div class="record_box">
                        <span>{{textNum}}/1000</span>
                </div>
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <!-- <ApproverMan 
                :has_journal="!has_journal"
                color="#0fc37c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 12
            ></ApproverMan> -->
            
            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=12
            ></ApproMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#0fc37c"
                :data_list=chosed_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :types = '2'
                :isGroup = true
                :showAdd="showCopy"
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
    if(that.projectTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.projectTitle.length>100 ||that.projectTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.projectNo == ''){
	    that.$toast('项目编号不能为空')
    }else if(that.projectNo.length>30){
	    that.$toast('项目编号不能超过30字符')
    }else if(that.projectName == ''){
	    that.$toast('项目名称不能为空')
    }else if(that.projectName.length>30){
	    that.$toast('项目名称不能超过30字符')
    }else if(that.applyDate == '请选择申请日期'){
        that.$toast('请选择申请日期')
    }else if(that.buildDate == '请选择立项日期'){
        that.$toast('请选择立项日期')
    }else if(that.projectBudget==''){
        that.$toast('项目预估金额不能为空')
    }else if(isNaN(that.projectBudget)){
        that.$toast('项目预估金额必须为数字')
    }else if((that.projectBudget+'').length>7){
        that.$toast('项目预估金额不能超过7位数')
    }else if(that.projectDate==''){
	    that.$toast('项目周期不能为空')
    }else if(that.projectDate.length>30){
	    that.$toast('项目周期不能超过30个字符')
    }else if(that.connectionName==''){
	    that.$toast('项目单位联系人不能为空')
    }else if(that.connectionName.length>30){
	    that.$toast('项目单位联系人不能超过30个字符')
    }else if(that.projectBackground == ''){
        that.$toast('项目背景不能为空')
    }else if(that.projectBackground.length>1000||that.projectBackground.length<6){
        that.$toast('项目背景不能少于6个或超过1000字符')
    }else if(that.description == ''){
        that.$toast('项目需求概述不能为空')
    }else if(that.description.length>1000||that.description.length<6){
        that.$toast('项目需求概述不能少于6个或超过1000字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'userId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)
        that.axios({
                method:"post",
                url:"/work/project/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    projectTitle:that.projectTitle,//申请主题
                    description:that.description, //申请原因
                    projectBackground:that.projectBackground,
	                applyDate: that.applyDate,  //
                    buildDate: that.buildDate,  //
                    connectionName:that.connectionName,
                    projectName:that.projectName,
                    projectBudget:that.projectBudget,
                    projectNo:that.projectNo,
                    projectDate:that.projectDate,
                    connectNameSec:that.principal.userId?that.principal.userId:'',
                    urls : fileObj.urlStr, //附件
                    fileNames:fileObj.fileNameStr, 
                    fileSizes:fileObj.fileSizeStr,
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    auditUserIds:params.userIdsStr, //审批人
                    auditCompanyIds:params.companyIdsStr,
                    applyLinkIds:that.applyLinkIds,
                    linkAuditNum:params.numStr,
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
                                    if(that.$route.query.project){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                                },700)
                            }else{
                                that.$toast('提交成功！')
                                window.location.href = "epipe://?&mark=workUpdate";
                                setTimeout(()=>{
                                    window.location.href = "epipe://?&mark=submitProject&_id="+res.data.b.projectApplyId;
                                    
                                },500)
                            }
                            that.change_man([])
                            that.approver_man([])
                            localStorage.removeItem('project')
                        }
                 })
    }
}

import {mapState, mapMutations} from 'vuex';
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
// import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import ApproMan  from '../../../components/oa/approver_template.vue'    
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id:'',
                projectTitle: '', // 标题
                userName : '',//用车人
                projectDate:'',
                projectNo:'',
                projectBackground:'',
                projectBudget:'',
                connectionName:'',
                projectName:'',
                applyDate:'请选择申请日期',
                buildDate:'请选择立项日期',
                description : '',//用车理由
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                isShow:false,
                textNum: 0,
                textCount:0,
                addressListIndex:-1,
                linkAuditNum:'',
                showCopy:0,
                applyLinkIds:'',

                isHr:false,
                principal:{name:'请选择'},
                allApprovers:[],
            }
        },
        components: {
            WorkButton,
            CopeMan,
            ApproMan,
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
            if(!this.Util.isUpdate(this.$data,this.oldData)){
                 window.location.href = "epipe://?&mark=history_back"
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.projectId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('project',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('project')
            window.location.href = "epipe://?&mark=history_back"
        },
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
            let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            let flag = this.allApprovers[index].remarks=='0'?'1':null;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#0fc37c',amount:flag,num:1,showGroup,}})

        },
        del_poeple(index,num){
            this.allApprovers[index].auditers.splice(num,1 )
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
        to_principal(){
            this.addressListIndex = -1;

            let arr = []
            if(this.principal.name!='请选择'){
                arr.push(this.principal)
            }
            this.approver_man(arr)
            this.$router.push({path: 'imchoices', query: {bgcolor:'#0fc37c',num:1,amount:1}})
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
            if(this.isHr&&num==1) return 
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
                    if(that.buildDate!='请选择立项日期'){
                        let endDate = that.tiemF(that.buildDate)
                        if(date.getTime()>endDate.getTime()||date.getTime()==endDate.getTime()){
                            that.$toast('申请时间不能大于等于立项时间')
                        }else{
                           that.applyDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                        }
                    }else{
                        that.applyDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }
                }else{            
                    if(that.applyDate!='请选择申请日期'){
                        let beginDate = that.tiemF(that.applyDate);
                        if(date.getTime()<beginDate.getTime()||date.getTime()==beginDate.getTime()){
                            that.$toast('立项时间不能小于等于申请时间')
                        }else{
                            that.buildDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }
                    }else{
                        that.buildDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }  
                }

                }
            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
        },
         watch:{
	          description : function(){
                if(this.description.length>1000){
                    this.$toast("最多输入1000字~")
                    this.description = this.description.slice(0,1000)
                    return
                }
                this.textNum = this.description.length
            },
            projectBackground:function(){
                if(this.projectBackground.length>1000){
                    this.$toast("最多输入1000字~")
                    this.projectBackground = this.projectBackground.slice(0,1000)
                    return
                }
                this.textCount = this.projectBackground.length
            }
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }else{
                if(this.principal.name=='请选择'){
                    this.principal = this.approver_man_state[0]?this.approver_man_state[this.approver_man_state.length-1]:this.principal;
                }
            }
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('project')){
                let projectdata = JSON.parse(localStorage.getItem('project'))
                for(let key in projectdata){
                    this.$data[key] = projectdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

             this.axios.get('/process/apply/enter?req=14').then((res)=>{
                let data = res.data.b;

                this.allApprovers = this.Util.approverDataInit(data.links);
                this.linkAuditNum = data.linkAuditNum;
                this.applyLinkIds = data.applyLinkIds;
                this.showCopy = data.approvalReceiverFlag=='1'?false:true;
                if(data.receivers.length>0){
                        this.chosed_list = data.receivers
                        this.change_man(this.chosed_list);
                }
            })

            this.oldData = JSON.parse(JSON.stringify(this.$data))

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

            this.axios.post('/user/current/userinfo').then(function(res){
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })

            if(this.$route.query.projectId){
                  this.axios.get('/work/project/info',{
                    params:{
                        type:that.$route.query.resubmit,
	                    projectApplyId:this.$route.query.projectId
                    }
                }).then(function(res){
                   let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.projectApplyId;
                       }
                      that.isDraftFlag = 1;
                      that.accessoryFor(data)
                      that.projectTitle = data.projectTitle;
                      that.projectNo = data.projectNo;
                      that.projectBackground = data.projectBackground;
                      that.connectionName = data.connectionName;
                      that.projectDate = data.projectDate;
                      that.projectBudget = data.projectBudget;
                      that.projectName = data.projectName;
                      that.principal = data.connectSecName?{name:data.connectSecName,userId:data.connectSecId}:{name:'请选择'}
                      that.description = data.description;
                      that.applyDate = data.applyDate.slice(0,-9);
                      that.isHr = data.isFromHr==1?true:false;
                      that.buildDate = data.buildDate.slice(0,-9);;
                      that.textNum = data.description.length
                      that.textCount = data.projectBackground.length;
                      that.chosed_list = data.receivers;
                      that.change_man(that.chosed_list);
                      that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
                    return
            }
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

    .accessory{

        li{
            display:flex;
            margin-bottom 0.1rem;
            padding-left 0.15rem;
         }

        img{
            width 0.34rem;
            height 0.34rem;
            margin-right 0.1rem;
        }


        .accessory-cont{
            flex 1;

            p{
                width 2.4rem;
                font-size 0.14rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            span{
                font-size 0.13rem;
                color #666
            }
        }

        .accessory-delete{
            width 0.3rem;
            text-align right;  
        }
    }

    .add-btn{
        display flex;
        padding-left:0.15rem;

        div{
            height:0.33rem;
            display: table;
            margin-left:0.1rem;
        }

        p{
            font-size:0.12rem;
            color:#999;
            display: table-cell;  
            vertical-align: middle; 
            word-wrap: break-word;
            word-break: break-all;
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
