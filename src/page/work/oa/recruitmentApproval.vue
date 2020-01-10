<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#609df6'
        title="招聘审批" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title"><span class="required">*</span>招聘职位</span>
                    <input placeholder="请输入招聘职位"  v-model="position" disabled />
                </div>
                <div class="bor_bottom">
                    <span class="title">所属部门</span>
                    <input placeholder="请输入所属部门"  v-model="departmentName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title"><span class="required">*</span>候选人名称</span>
                    <input placeholder="请输入候选人名称"  v-model="candidateName" disabled />
                </div>

                <div class="bor_bottom">
                    <span class="title"><span class="required">*</span>工作年限</span>
                    <input placeholder="请输入工作年限"  v-model="workYear" disabled />
                </div>
                <div class="bor_bottom">
                    <span class="title"><span class="required">*</span>学历</span>
                    <input placeholder="请输入学历"  v-model="educationFormal" disabled />
                </div>
                <div class="bor_bottom">
                    <span class="title"><span class="required">*</span>毕业院校</span>
                    <input placeholder="请输入毕业院校"  v-model="college" disabled />
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title"><span class="required"></span>电话</span>
                    <input placeholder="请输入电话"  v-model="telephone" disabled />
                </div>

                <div class="bor_bottom">
                    <span class="title"><span class="required"></span>邮箱</span>
                    <input placeholder="请输入邮箱"  v-model="email" disabled />
                </div>
                <div class="bor_bottom">
                    <span class="title"><span class="required"></span>面试时间</span>
                    <input placeholder="请输入面试时间"  v-model="interviewTime" disabled />
                </div>
            </div>

            <div class="styles input_group">
                <div class="bor_bottom" @click="handlerTointerviewDetail">
                    <span class="title">面试评价</span>
                    <span class="interviewDetial">查看面试评价详情</span>
                    <svg class="icon icon-back" aria-hidden="false" style="position:absolute;right:0.15rem;top:0.17rem;">
                        <use xlink:href="#icon-right"></use>
                    </svg>
                </div>
            </div>
            <div class="styles" style="padding:0 0.15rem;">
                <p class="title"><span class="required"></span>备注：</p>
                <textarea v-model.trim="remark" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入备注,限定1000字">

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
                color="#609df6"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 9
            ></ApproverMan> -->


            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=6
              :isMore=true
            ></ApproMan>

            <CopeMan 
                :has_journal="!showCopy"
                :showAdd="showCopy"
                color="#609df6"
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
    // if(that.approvalPosition== ''){
    //     that.$toast('文件标题不能为空')
    // }
    // else if(that.approvalPosition.length>100 ||that.approvalPosition.length<2){
    //     that.$toast('文件标题不能低于2个或超过100个字符')
    // }
    // else if(that.arrivalDate == '请选择到岗日期'){
    //     that.$toast('请选择到岗日期')
    // }else if(that.num==''){
    //     that.$toast('需求人数不能为空')
    // }else if(isNaN(that.num)){
    //     that.$toast('需求人数为数字')
    // }else if(that.education==''){
    //     that.$toast('请选择学历')
    // }else if(that.jobExperience==''){
    //     that.$toast('请选择工作经验')
    // }else if(that.highestEducation==''){
    //     that.$toast('请选择最高学历毕业学校')
    // }
    // else if(that.num>10){
    //     that.$toast('需求人数不能超过10个')
    // }else if(that.position == ''){
    //     that.$toast('请输入岗位名称')
    // }else if(that.position.length<2||that.position>30){
    //     that.$toast('岗位名称不能低于2个或超过30个字符')
    // }else if(that.isNew==-1){
    //     that.$toast('请选择是否新增')
    // }else if(that.responsibility==''){
    //     that.$toast('工作职责不能为空')
    // }else if(that.responsibility.length>1000){
    //     that.$toast('工作职责不能超过1000字')
    // }else if(that.remark == ''){
    //     that.$toast('申请理由不能为空')
    // }else if(that.major.length>30){
    //     that.$toast('专业要求内容不能超过30个字符')
    // }else if(that.remark.length>1000||that.remark.length<6){
    //     that.$toast('申请理由不能少于6个或超过1000字符')
    // }else 
    if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else if(that.remark.length>1000||that.remark.length<6){
        that.$toast('备注不能少于6个或超过1000字符')
    }
    else{


        let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')
        params = that.Util.approverFormat(that.allApprovers)

        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"work/interview/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    remark:that.remark.replace(/\n/g, '<br/>'), //申请理由
                    position:that.position, //招聘岗位
                    department:that.departmentName,//所属部门
                    candidateName:that.candidateName,//候选人名称
                    workingLife:that.workYear,//工作年限
                    education:that.educationFormal,//学历
                    university:that.college,//毕业院校
                    phone:that.telephone,//电话
                    email:that.email,//邮箱
                    interviewTime:that.interviewTime,
                    // num:that.num, //招聘人数
                    // arrivalDate:that.arrivalDate,//到岗时间

                    // sex:that.sex,//性别
                    // marriage:that.marriage,//婚姻
                    // age:that.age,//年龄
                    // jobExperience:that.jobExperience,
                    // isNew:that.isNew,
                    // highestEducation:that.highestEducation,
                    // education:that.education, //学历
                    // major:that.major,//专业
                    // qualifications:that.qualifications,//证书
                    // computerLevel:that.computerLevel,//计算机水平
                    // foreignLevel:that.foreignLevel, //外语水平
                    // skill:that.skill,//特殊技能
                    // writings:that.writings, //写作
                    // priority:that.priority, //优先录用
                    // responsibility:that.responsibility.replace(/\n/g, '<br/>'), //工作职责

                    urls : fileObj.urlStr, //附件
                    fileNames:fileObj.fileNameStr, 
                    fileSizes:fileObj.fileSizeStr,
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    auditUserIds:params.userIdsStr, //审批人
                    auditCompanyIds:params.companyIdsStr,
                    applyLinkIds:params.applyLinkIdsStr,
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
                                    if(that.$route.query.employeeId){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                                },700)
                            }else{
                                that.$toast('提交成功！')
                                window.location.href = "epipe://?&mark=workUpdate";
                                console.log('成功数据',res.data.b)
                                setTimeout(()=>{
                                    window.location.href = "epipe://?&mark=submitEmployee&_id="+res.data.b.employeeApplyId;
                                    
                                },500)
                            }
                            localStorage.removeItem('recruitmentApprova')
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
                approvalPosition : '', // 招聘职位
                departmentName : '',//所属部门
                candidateName: '',  //候选人名称
                workYear:'',//工作年限
                educationFormal:'',//学历
                college:'',//毕业学院
                telephone:'',//电话
                email:'',//邮箱
                interviewTime:'',//面试时间
                remark:'',//备注

                position : '', //招聘岗位
                num:'',//招聘人数
                arrivalDate:'请选择到岗日期', //到岗日期
                returnDate:'请选择预计归还日期', //
                userName : '',//用印承办人
                employeeReason : '',//申请理由
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                isShow:false,
                textNum:0,
                responsibilityNum:0,
                sex:'',//性别
                sexType:'请选择',//性别
                marriage:'',//婚姻
                marriageType:'请选择',//婚姻
                age:'',//年龄
                ageName:'请选择',//年龄
                isNew:-1,
                isComplie:-1,//编制序号
                isComplieName:'请选择',
                isNewName:'请选择',
                highestEducation:'',
                highestEducationName:'请选择',
                jobExperience:'',
                jobExperienceName:'请选择',
                education:'', //学历
                educationName:'请选择',
                major:'',//专业
                qualifications:'',//证书
                computerLevel:'',//计算机水平
                foreignLevel:'', //外语水平
                skill:'',//特殊技能
                writings:'', //写作
                priority:'', //优先录用
                responsibility:'', //工作职责
                addressListIndex:-1,
                showCopy:0,
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
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
             let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#609df6',num:1,amount:1,showGroup,}})

        },
        del_poeple(index,num){
            this.allApprovers[index].auditers.splice(num,1 )
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.recruitmentApprovaId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('recruitmentApprova',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('recruitmentApprova')
            window.location.href = "epipe://?&mark=history_back"
        },
        addAccessory:function(){
            window.location.href = "epipe://?&mark=addAccessory"
        },
        go_push(indexs,type,title){
            console.log(indexs,type,title)
            this.$router.push({path:'/option', query: {indexs,type,color:'#609df6',title,getType:1}})

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
        getTime(){ //获取原生时间
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
                    that.arrivalDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                }
            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
            moreSelect(){
                let params = {
                    qualifications:this.qualifications,
                    computerLevel:this.computerLevel,
                    foreignLevel:this.foreignLevel,
                    skill:this.skill,
                    writings:this.writings,
                    condition:this.condition,
                    priority:this.priority
                }

                this.$router.push({path:'/more_employee',query:params})
            },
            handlerTointerviewDetail(){
                this.$router.push({path:'/interviewDetail'})
            }
        },
         watch:{
            remark : function(){
                if(this.remark.length>1000){
                    this.$toast("最多输入1000字~")
                    this.remark = this.remark.slice(0,1000)
                    return
                }
                this.textNum = this.remark.length
            },
            responsibility : function(){
                if(this.responsibility.length>1000){
                    this.$toast("最多输入1000字~")
                    this.responsibility = this.responsibility.slice(0,1000)
                    return
                }
                this.responsibilityNum = this.responsibility.length
            }
        },
        activated(){
             if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('recruitmentApprova')){
                let employeedata = JSON.parse(localStorage.getItem('recruitmentApprova'))
                for(let key in employeedata){
                    this.$data[key] = employeedata[key]
                }
                console.log('ppoo',this.$data.approver_list)
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                console.log(res)
                if(res.type=='sex'){
                    this.sex = res.index
                    this.sexType = res.name
                }else if(res.type=='education'){
                    this.education = res.index
                    this.educationName = res.name 
                }else if(res.type=='age'){
                    this.age = res.index
                    this.ageName = res.name
                }else if(res.type=='isNew'){
                    this.isNew = res.index
                    this.isNewName = res.name
                }else if(res.type=='jobExperience'){
                    this.jobExperience = res.index
                    this.jobExperienceName = res.name
                }else if(res.type=='highestEducation'){
                    this.highestEducation = res.index
                    this.highestEducationName = res.name
                }else if(res.type=='marriage'){
                    this.marriage = res.index
                    this.marriageType = res.name
                }else{
                    let obj = JSON.parse(res.name)
                    for(let key in obj){
                        this[key] = obj[key]
                    }
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

           this.axios.get('/process/apply/enter?req=22').then((res)=>{
                let data = res.data.b;

                this.allApprovers = data.links;
                this.showCopy = data.approvalReceiverFlag=='1'?false:true;
                if(data.receivers.length>0){
                        this.chosed_list = data.receivers
                        this.change_man(this.chosed_list);
                }
            })

            // if(this.$route.query.recruitmentApprovaId){
                  this.axios.get('work/interview/info',{
                    params:{
                        type:that.$route.query.resubmit,
                        // interviewId:this.$route.query.recruitmentApprovaId  
                        interviewId:'eba209c332bb11ea98024ccc6ac12eca'
                    }
                }).then(function(res){
                   let data = res.data.b;
                //    console.log('data',data)
                       if(!that.$route.query.resubmit){
                                that.id = data.interviewId;
                        }
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.position = data.position;//招聘职位
                        that.departmentName = data.department;//所属部门
                        that.candidateName = data.candidateName;//候选人名称
                        that.workYear = data.workingLife;//工作年限
                        that.educationFormal = data.education;//学历
                        that.college = data.university;//毕业院校
                        that.telephone = data.phone;//电话
                        that.email = data.email;//邮箱
                        that.interviewTime = data.interviewTime;//面试时间
                        // that.remark = data.remark.replace(/<br\/>/g,'\n')//备注



                        // that.arrivalDate = data.arrivalDate.slice(0,-8);
                        // that.sex = data.sexCode//性别
                        // that.sexType = data.sex//性别
                        // that.marriage= data.marriageCode//婚姻
                        // that.marriageType= data.marriage//婚姻
                        // that.age= data.ageCode//年龄
                        // that.ageName = data.age
                        // that.highestEducation = data.highestEducationCode
                        // that.highestEducationName = data.highestEducation
                        // that.jobExperience = data.jobExperienceCode
                        // that.jobExperienceName = data.jobExperience
                        // that.education= data.educationCode //学历
                        // that.educationName= data.education //学历
                        // that.isNew = data.isNewCode
                        // that.isNewName = data.isNew
                        // that.major= data.major//专业
                        // that.qualifications= data.qualifications//证书
                        // that.computerLevel= data.computerLevel//计算机水平
                        // that.foreignLevel= data.foreignLevel //外语水平
                        // that.skill= data.skill//特殊技能
                        // that.writings= data.writings //写作
                        // that.priority= data.priority //优先录用
                        // that.responsibility= data.responsibility.replace(/<br\/>/g,'\n') //工作职责

                        // that.textNum = data.remark.length
                        // that.responsibilityNum = data.responsibility.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.allApprovers = data.links;
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
                    return
            // }
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
            //  -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
            //  box-shadow 0 0 0.2rem rgba(238,65,54,.1);
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
             .interviewDetial{
                 margin-left 0.5rem;
                 color #609DF6;
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

    .content-title{
        margin-bottom:0.05rem;
        color #609ef7
    }

    .required{
        color:#fd545c;
    }

    

</style>
