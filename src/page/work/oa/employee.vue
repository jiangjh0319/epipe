<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#609df6'
        title="人员需求" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-model="employeeTitle" />
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
                    <span class="title">招聘岗位</span>
                    <input style="color:#666" v-model="position" placeholder="请输入招聘岗位名称"/>
                </div>
                <div class="bor_bottom">
                    <span class="title">需求人数</span>
                    <input style="color:#666" v-model="num" placeholder="请输入需求人数"/>
                </div>
    
                 <div class="bor_bottom choose" @click="getTime(0)">
                     <span class="title">希望到岗日期</span>
                    <p>
                        <span class="nullValue">{{arrivalDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">申请理由</p>
                <textarea v-model.trim="employeeReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入申请理由,限定1000字">

                </textarea>
                <div class="record_box">
                        <span>{{textNum}}/1000</span>
                </div>
            </div>
            <p class="content-title">应聘条件</p>

            <div class="styles input_group">
                <router-link :to="{ path:'/option', query: {indexs:sex,type:'sex',color:'#609df6'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">性别</span>
                    <p>
                        <span class="nullValue">{{sexType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <router-link :to="{ path:'/option', query: {indexs:marriage,type:'marriage',color:'#609df6'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">婚姻</span>
                    <p>
                        <span class="nullValue">{{marriageType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <div class="bor_bottom">
                    <span class="title">年龄</span>
                    <input placeholder="请输入年龄范围"  v-model="age" />
                </div>
                <!-- <div class="bor_bottom">
                    <span class="title">学历</span>
                    <input placeholder="请输入学历要求"  v-model="education" />
                </div> -->
                <router-link :to="{ path:'/option', query: {indexs:education,type:'education',title:'学历类型',color:'#609df6',getType:1}}"  class="bor_bottom choose" tag="div">
                    <span class="title">学历</span>
                    <p>
                        <span class="nullValue">{{educationName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <div class="bor_bottom">
                    <span class="title">专业</span>
                    <input placeholder="请输入专业要求"  v-model="major" />
                </div>
                <div class="bor_bottom">
                    <span class="title">职业资格证</span>
                    <input placeholder="请输入详细职业资格证要求"  v-model="qualifications" />
                </div>
                <div class="bor_bottom">
                    <span class="title">计算机</span>
                    <input placeholder="请输入计算机水平要求"  v-model="computerLevel" />
                </div>
                <div class="bor_bottom">
                    <span class="title">外语水平</span>
                    <input placeholder="请输入外语水平要求"  v-model="foreignLevel" />
                </div>
                <div class="bor_bottom">
                    <span class="title">经验与技能</span>
                    <input placeholder="请输入经验与技能要求"  v-model="skill" />
                </div>
                <div class="bor_bottom">
                    <span class="title">公文写作</span>
                    <input placeholder="请输入公文写作能力要求"  v-model="writings" />
                </div>
                <div class="bor_bottom">
                    <span class="title">必要条件</span>
                    <input placeholder="请输入必要条件"  v-model="condition" />
                </div>
                <div class="bor_bottom">
                    <span class="title">优先录用</span>
                    <input placeholder="请输入优先录用要求"  v-model="priority" />
                </div>
                <div class="bor_bottom">
                    <span class="title">其他要求</span>
                    <input placeholder="请输入其他要求"  v-model="other" />
                </div>
            </div>
            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">工作职责</p>
                <textarea v-model.trim="responsibility" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入详细工作职责">

                </textarea>
                <div class="record_box">
                        <span>{{responsibilityNum}}/1000</span>
                </div>
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#609df6"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 9
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
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
    if(that.employeeTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.employeeTitle.length>100 ||that.employeeTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.arrivalDate == '请选择到岗日期'){
        that.$toast('请选择到岗日期')
    }else if(that.num==''){
        that.$toast('需求人数不能为空')
    }else if(isNaN(that.num)){
        that.$toast('需求人数为数字')
    }else if(that.num>10){
        that.$toast('需求人数不能超过10个')
    }else if(that.position == ''){
        that.$toast('请输入岗位名称')
    }else if(that.position.length<6||that.position>30){
        that.$toast('岗位名称不能低于6个或超过30个字符')
    }else if(that.employeeReason == ''){
        that.$toast('申请理由不能为空')
    }else if(that.sex==-1){
        that.$toast('请选择性别')
    }else if(that.marriage==-1){
        that.$toast('请选择婚姻状况')
    }else if(that.age==''){
        that.$toast('请输入年龄要求')
    }else if(that.age.length>30){
        that.$toast('年龄不能超过30个字符')
    }else if(that.educationName=='请选择'){
        that.$toast('请选择学历要求')
    }else if(that.age.length>30){
        that.$toast('学历内容不能超过30个字符')
    }else if(that.major==''){
        that.$toast('请输入专业要求')
    }else if(that.major.length>30){
        that.$toast('专业要求内容不能超过30个字符')
    }else if(that.foreignLevel.length>30){
        that.$toast('外语水平内容不能超过30字符')
    }else if(that.computerLevel.length>30){
        that.$toast('计算机要求内容不能超过30字符')
    }else if(that.qualifications.length>30){
        that.$toast('职业资格证内容不能超过30字符')
    }else if(that.writings.length>30){
        that.$toast('公文写作能力内容不能超过30字符')
    }else if(that.skill==''){
        that.$toast('请输入经验与技能要求')
    }else if(that.skill.length>100){
        that.$toast('经验与技能文字不能超过100字符')
    }else if(that.condition==''){
        that.$toast('必要条件不能为空')
    }else if(that.condition.length>30){
        that.$toast('必要条件内容不能超过30字符')
    }else if(that.priority.length>30){
        that.$toast('优先录用内容不能超过30字符')
    }else if(that.other.length>500){
        that.$toast('其他要求内容不能超过500字符')
    }else if(that.responsibility.length>1000||that.responsibility.length<1){
        that.$toast('工作职责不能少于1个或超过1000字符')
    }else if(that.employeeReason.length>1000||that.employeeReason.length<6){
        that.$toast('申请理由不能少于6个或超过1000字符')
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{
        // let chosed_id = '';  //抄送人
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

        let approver_id = '',chosed_id = ''
        chosed_id = that.Util.people(that.isDraft,that.chosed_list,1).slice(1)
        approver_id = that.Util.people(that.isDraft,that.approver_list,2).slice(1)

        let fileObj = {},params={}
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/employee/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    employeeTitle:that.employeeTitle,//标题
                    employeeReason:that.employeeReason, //申请理由
                    position:that.position, //招聘岗位
                    num:that.num, //招聘人数
                    arrivalDate:that.arrivalDate,//到岗时间

                    sex:that.sex,//性别
                    marriage:that.marriage,//婚姻
                    age:that.age,//年龄
                    education:that.education, //学历
                    major:that.major,//专业
                    qualifications:that.qualifications,//证书
                    computerLevel:that.computerLevel,//计算机水平
                    foreignLevel:that.foreignLevel, //外语水平
                    skill:that.skill,//特殊技能
                    writings:that.writings, //写作
                    condition:that.condition, //必要条件
                    priority:that.priority, //优先录用
                    other:that.other, //其他要求
                    responsibility:that.responsibility, //工作职责

                    urls : fileObj.urlStr, //附件
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
                                    if(that.$route.query.employeeId){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                                },700)
                            }else{
                                that.$toast('提交成功！')
                                window.location.href = "epipe://?&mark=workUpdate";
                                setTimeout(()=>{
                                    window.location.href = "epipe://?&mark=submitEmployee&_id="+res.data.b.employeeApplyId;
                                    
                                },500)
                            }
                            localStorage.removeItem('employee')
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
                employeeTitle : '', // 标题
                departmentName : '',//用印部门
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
                sex:-1,//性别
                sexType:'请选择',//性别
                marriage:-1,//婚姻
                marriageType:'请选择',//婚姻
                age:'',//年龄
                education:'', //学历
                educationName:'请选择',
                major:'',//专业
                qualifications:'',//证书
                computerLevel:'',//计算机水平
                foreignLevel:'', //外语水平
                skill:'',//特殊技能
                writings:'', //写作
                condition:'', //必要条件
                priority:'', //优先录用
                other:'', //其他要求
                responsibility:'', //工作职责
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
            if(this.$route.query.employeeApplyId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('employee',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('employee')
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
        },
         watch:{
            employeeReason : function(){
                if(this.employeeReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.employeeReason = this.employeeReason.slice(0,1000)
                    return
                }
                this.textNum = this.employeeReason.length
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
            console.log(11)
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('employee')){
                let employeedata = JSON.parse(localStorage.getItem('employee'))
                for(let key in employeedata){
                    this.$data[key] = employeedata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                if(res.type=='sex'){
                    this.sex = res.index
                    this.sexType = res.name
                }else if(res.type=='education'){
                    this.education = res.index
                    this.educationName = res.name 
                }else{
                    this.marriage = res.index
                    this.marriageType = res.name
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

            this.axios.get('/user/info').then(function(res){
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })

            if(this.$route.query.employeeId){
                  this.axios.get('/work/employee/info',{
                    params:{
                        type:that.$route.query.resubmit,
                        employeeApplyId:this.$route.query.employeeId
                    }
                }).then(function(res){
                   let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.employeeApplyId;
                        }
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.employeeTitle = data.employeeTitle;
                        that.position = data.position;
                        that.num = data.num;
                        that.employeeReason = data.employeeReason;
                        that.arrivalDate = data.arrivalDate;
                        that.sex = data.sexCode//性别
                        that.sexType = data.sex//性别
                        that.marriage= data.marriageCode//婚姻
                        that.marriageType= data.marriage//婚姻
                        that.age= data.age//年龄
                        that.education= data.educationCode //学历
                        that.educationName= data.education //学历
                        that.major= data.major//专业
                        that.qualifications= data.qualifications//证书
                        that.computerLevel= data.computerLevel//计算机水平
                        that.foreignLevel= data.foreignLevel //外语水平
                        that.skill= data.skill//特殊技能
                        that.writings= data.writings //写作
                        that.condition= data.condition //必要条件
                        that.priority= data.priority //优先录用
                        that.other= data.other //其他要求
                        that.responsibility= data.responsibility //工作职责

                        that.textNum = data.employeeReason.length
                        that.responsibilityNum = data.responsibility.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.approver_list = data.auditers;
                        that.approver_man(that.approver_list);
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
                    return
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

    

</style>
