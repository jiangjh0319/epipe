<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#f80'
        title="员工调岗" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
        <div class="styles input_group">
                 <router-link tag="div" :to="{path:'/addressList',query:{bgcolor:'#f80',peArrIndex:0,back:true,showGroup:true}}" class="bor_bottom choose">
                    <span class="title" >姓&emsp;&emsp;名</span>
                    <p >
                        <span class="nullValue">{{applicant.name}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <div class="bor_bottom choose" >
                    <span class="title">工&emsp;&emsp;号</span>
                    <input v-model="applicant.no" placeholder="请输入工号"/>
                </div>
                <div class="bor_bottom choose" @click="department(0)">
                     <span class="title">所属部门</span>
                     <P>
                         <span class="nullValue">{{applicant.officeName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                     </p>
                </div>

                <div class="bor_bottom choose" >
                     <span class="title">岗位名称</span>
                    <input v-model="applicant.userPosition" placeholder="请输入岗位名称"/>
                </div>
                <div class="bor_bottom choose" @click="getTime(0)">
                     <span class="title">入职时间</span>
                    <P>
                         <span class="nullValue">{{applicant.hireDate|dateFor}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                     </p>

                </div>
            </div>

            <div class="styles input_group">

                <div class="bor_bottom">
                    <p class="title">调岗原因</p>
                    <textarea v-model.trim="reason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入调岗原因,限定1000字">

                    </textarea>
                    <div class="record_box">
                            <span>{{textNum}}/1000</span>
                    </div>
                </div>
            </div>

            <div class="styles input_group">
                <div class="bor_bottom choose" @click="department(1)">
                     <span class="title">调岗后部门</span>
                      <p>
                          <span class="nullValue">{{afterOffice}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                     </p>
                </div>
                <div class="bor_bottom choose" > 
                     <span class="title">调岗后岗位</span>
                    <input v-model="afterPosition" placeholder="请输入调岗后岗位">
                </div>
                <div class="bor_bottom choose" @click="getTime(1)">
                     <span class="title">调岗日期</span>
                     <p>
                          <span class="nullValue">{{changeDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                     </p>
                </div>
            </div>


            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <!-- <ApproverMan 
                :has_journal="!has_journal"
                color="#f80"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 13
            ></ApproverMan> -->
            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=13
            ></ApproMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#f80"
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

    if(that.applicant.name=='请选择'){
        that.$toast('请选择调岗员工')
    }else if(that.applicant.officeId<0){
        that.$toast('请选择调岗员工部门')
    }
    else if(that.applicant.hireDate=='请选择入职日期'||!that.applicant.hireDate){
        that.$toast('选择入职日期')
    }else if(that.applicant.userPosition&&that.applicant.userPosition.length>20){
        that.$toast('你输入的岗位名称不能超过20字')
    }else if(that.changeDate=="请选择调岗时间"){
        that.$toast('请选择调岗时间')
    }else if(that.afterPosition==''){
        that.$toast('请输入调岗后岗位')
    }else if(that.afterPosition.length>20){
        that.$toast('岗位名称不能超过20字')
    }else if(that.afterOfficeId<0){
        that.$toast('请选择调岗后部门')
    }else if(that.reason.length>1000||that.reason.length<6){
        that.$toast('调岗原因不能少于6个或超过1000字符')
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
                url:"/work/changeposition/save",
                headers:{
                    'Content-type': 'applicantion/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    reason:that.reason,
                    userId:that.applicant.userId,
                    name:that.applicant.name,
                    no:that.applicant.no,
                    exOfficeId:that.applicant.officeId,
                    exPosition:that.applicant.userPosition,
                    hireDate:that.applicant.hireDate,
                    afterOfficeId:that.afterOfficeId,
                    afterPosition:that.afterPosition,
                    changeDate:that.changeDate,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
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
                        if(that.$route.query.positionId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitPosition&_id="+res.data.b.positionApplyId;
                        
                    },500)
                }
                that.change_man([])
            that.approver_man([])
                localStorage.removeItem('position')
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
                applicant:{
                    name:'请选择',
                    no:'',
                    userPosition:'',
                    officeName:'请选择部门',
                    officeId:-1,
                    hireDate:'请选择入职时间'
                },

                reason:'',
                changeDate:'请选择调岗时间',
                afterPosition:'',
                afterOfficeId:-1,
                afterOffice:'请选择部门',
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                isShow:false,
                addressListIndex:-1,
                linkAuditNum:'',
                showCopy:0,
                applyLinkIds:'',
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
        ...mapMutations(['change_man','approver_man',"peerArrs_man"]),
        save_btn(){ //保存草稿
           save_leave(1, "存入草稿成功", this)
        },
        submit_btn(){ //提交
           save_leave(0, "提交成功", this)
        },
         history_back_click(){
            if(!this.Util.isUpdate()){
                 window.location.href = "epipe://?&mark=history_back"
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.positionId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('position',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('position')
            window.location.href = "epipe://?&mark=history_back"
        },
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
            let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            let flag = this.allApprovers[index].remarks=='0'?'1':null;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#f80',amount:flag,num:1,showGroup,}})

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
                    if(that.changeDate!='请选择调岗时间'){
                        let endDate = that.tiemF(that.changeDate)
                        if(date.getTime()>endDate.getTime()){
                            that.$toast('入职时间不能大于调岗时间')
                        }else if(date.getTime()==endDate.getTime()){
                            that.$toast('入职时间不能等于调岗时间')
                        }else{
                           that.applicant.hireDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                        }
                    }else{
                        that.applicant.hireDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }
                }else{            
                    if(that.applicant.hireDate!='请选择入职时间'){
                        let beginDate = that.tiemF(that.applicant.hireDate);
                        if(date.getTime()<beginDate.getTime()){
                            that.$toast('调岗时间不能小于入职时间')
                        }else if(date.getTime()==beginDate.getTime()){
                             that.$toast('调岗时间不能等于入职时间')
                        }else{
                            that.changeDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }
                    }else{
                        that.changeDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }  
                }
            }
        },
        tiemF(timeStr){ //传入原生的时间格式化
            timeStr+=':00';
            timeStr = timeStr.split(/[- : \/]/);
            return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
        },

        department(typeCode){//部门选择
            let type = "",index=-1

            if(this.applicant.name=='请选择'){
                this.$toast('请选择调岗员工姓名')
                return
            }

            if(this.applicant.officeName!=''&&typeCode==0) return

            index = typeCode==0?this.applicant.officeId:this.afterOfficeId
            type = typeCode==0?'exposition':'afterposition'

            this.$router.push({path:'/option',query:{indexs:index,type:type,color:'#f80',userId:this.applicant.userId}})

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
          dateFor(value){

              return value?value:'请选择入职日期'
          }
        },
        activated(){
           if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state

            if(this.peer_man_state[0].length){
                this.applicant = this.peer_man_state[0][0]
                this.peerArrs_man([[]])
            }

         },
         created() {
             if(localStorage.getItem('position')){
                let positiondata = JSON.parse(localStorage.getItem('position'))
                for(let key in positiondata){
                    this.$data[key] = positiondata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

             this.axios.get('/process/apply/enter?req=19').then((res)=>{
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

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                if(res.type=='exposition'){
                    this.applicant.officeName = res.name;
                    this.applicant.officeId = res.index
                }else{
                    this.afterOffice = res.name;
                    this.afterOfficeId = res.index
                }
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

            if(this.$route.query.positionId){
                    this.axios.get('/work/changeposition/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            positionApplyId:this.$route.query.positionId
                        }
                    }).then(function(res){ 
                        let data = res.data.b;
                        that.id = data.positionApplyId;
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.applicant.name = data.name
                        that.applicant.no = data.no
                        that.applicant.officeName = data.officeName
                        that.applicant.officeId = data.officeId
                        that.applicant.hireDate = data.hireDate.slice(0,-3);
                        that.applicant.userPosition = data.exPosition
                        that.reason = data.reason
                        that.changeDate = data.changeDate.slice(0,-3);
                        that.afterPosition = data.afterPosition
                        that.afterOffice = data.afterOfficeName
                        that.afterOfficeId = data.afterOfficeId

                        that.textNum = data.reason.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
            }
        },
        beforeDestroy() {
            eventBus.$off('leaveType');
        },
        computed: mapState(["chosed_man_state","approver_man_state","peer_man_state"])
        
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
                 color:#666;
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
