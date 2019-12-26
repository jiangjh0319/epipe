<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#f80'
        title="ERP权限异动" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div @click="choose_user">
                    <span class="title">姓名</span>
                    <input placeholder="请选择人员"  v-model="userInfo.name" disabled/>
                </div>
                <div>
                    <span class="title">部门</span>
                    <p @click="checkVal" v-if="userInfo.name==''">请选择</p>
                    <input placeholder="请输入部门" v-model="userInfo.officeName"  v-else  />
                </div>
                <div class="bor_bottom">
                    <span class="title">职位</span>
                    <input placeholder="请输入职位" v-model="userInfo.userPosition" />
                </div>
            </div>
            <div class="styles input_group">
                <router-link :to="{ path:'/option', query: {indexs:moveReasonCode,type:'moveReason',color:'#f80'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">异动原因</span>
                    <p>
                        <span class="nullValue">{{moveReason}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                 <router-link :to="{ path:'/option', query: {indexs:moveTypeCode,type:'moveType',color:'#f80'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">异动类型</span>
                    <p>
                        <span class="nullValue">{{moveType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                 <router-link :to="{ path:'/option', query: {indexs:wantPri,type:'wantPri',color:'#f80'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">需申请权限</span>
                    <p>
                        <span class="nullValue line1">{{wantPriName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">申请原因</p>
                <textarea v-model.trim="applyReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入申请原因,限定1000字">

                </textarea>
                <div class="record_box">
                        <span>{{textNum}}/1000</span>
                </div>
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=10
            ></ApproMan>

            <CopeMan 
                :has_journal="!showCopy"
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
    if(that.userInfo.name== ''){
        that.$toast('请选择人员')
    }else if(that.userInfo.officeName==''){
        that.$toast('请输入人员部门')
    }else if(that.userInfo.userPosition==''){
        that.$toast('请输入人员职位')
    }else if(that.moveReasonCode<0){
        that.$toast('请选择异动原因')
    }else if(that.moveTypeCode<0){
        that.$toast('请选择异动类型')
    }else if(that.wantPri==-1){
        that.$toast('请选择需申请权限')
    }else if(that.applyReason.length>1000){
        that.$toast('申请原因不能超过1000字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
         let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers)
        // auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        // auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')

        fileObj = that.Util.fileFo(that.accessory)
        // let contDesc = that.applyReason.replace(/\n|\r\n/g,"<br>")
        // https://blog.csdn.net/xiaobao5214/article/details/68923023/
        that.axios({
                method:"post",
                url:"/move/erpprimove/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    employeeName:that.userInfo.name,
                    employeeDept:that.userInfo.officeName,
                    position:that.userInfo.userPosition,
                    moveReason:that.moveReasonCode,
                    moveType:that.moveTypeCode,
                    wantPri:that.wantPri,
                    applyReason:that.applyReason,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    auditUserIds:params.userIdsStr, //审批人
                    auditCompanyIds:params.companyIdsStr,
                    applyLinkIds:params.applyLinkIdsStr,
                    linkAuditNum:params.numStr,
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
                        if(that.$route.query.erpPermissionId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submiterpPermission&_id="+res.data.b.erpPriMoveApplyId;
                        
                    },500)
                }
                localStorage.removeItem('erpPermission')
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
                userInfo:{name:'',officeName:'',userPosition:''},
                moveReasonCode:-1,//异动原因
                moveReason:'请选择',
                moveTypeCode:-1,//异动类型
                moveType:'请选择',
                applyReason:'',//申请原因
                wantPri:-1,
                wantPriName:'请选择',
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                allApprovers:[],
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                isShow:false,
                addressListIndex:-1,
                showCopy:0,
                
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

        choose_user(){//选择申请人
            this.addressListIndex = -1;
            this.approver_man([])
            this.$router.push({path: 'imchoices', query: {bgcolor:'#f80',num:1,amount:1}})
        },
        checkVal(){
            if(this.userInfo.name==''){
                this.$toast('请选择异动人员')
            }
            return false;
        },
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
            let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#f80',num:1,amount:1,showGroup,}})

        },
        del_poeple(index,num){
            this.allApprovers[index].auditers.splice(num,1 )
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.erpPermissionId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('erpPermission',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('erpPermission')
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
                    that.payDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                }
            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
        },
         watch:{
            applyReason : function(){
                if(this.applyReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.applyReason = this.applyReason.slice(0,1000)
                    return
                }
                this.textNum = this.applyReason.length
            }
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
            if(this.addressListIndex>-1){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }else{
                this.userInfo = this.approver_man_state[0]?this.approver_man_state[0]:this.userInfo;
            }
            this.chosed_list = this.chosed_man_state
         },
         created() {


             if(localStorage.getItem('erpPermission')){
                let erpPermissiondata = JSON.parse(localStorage.getItem('erpPermission'))
                for(let key in erpPermissiondata){
                    this.$data[key] = erpPermissiondata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                if(res.type=='moveReason'){
                    this.moveReasonCode = res.index
                    this.moveReason = res.name
                }else if(res.type=='wantPri'){
                    console.log(res)
                    this.wantPri = res.index
                    this.wantPriName = res.name
                }else{
                    this.moveTypeCode = res.index
                    this.moveType = res.name
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


            if(this.$route.query.erpPermissionId){
                    this.axios.get('move/erpprimove/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            erpprimoveApplyId:this.$route.query.erpPermissionId
                        }
                    }).then(function(res){ 
                     let data = res.data.b;
                       that.id = data.erpprimoveApplyId;
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.userInfo.name = data.applyName
                        that.userInfo.officeName = data.applyDept
                        that.userInfo.userPosition = data.position
                        that.moveReason = data.moveReason
                        that.moveReasonCode = data.moveReasonCode
                        that.moveType = data.moveType
                        that.moveTypeCode = data.moveTypeCode
                        that.wantPriName = data.wantPri
                        that.wantPri = data.wantPriCode.split(',').join('|')
                        that.applyReason = data.applyRason
                        that.textNum = data.applyRason.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.allApprovers = data.links;
                        // that.approver_list = data.auditers;
                        // that.approver_man(that.approver_list);
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
             -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
             box-shadow 0 0 0.2rem rgba(238,65,54,.1);
             background-color #fff;
             overflow hidden

             input,p{
                 box-sizing border-box
                 float right;
                 width 2.1rem;
                 height 0.44rem;
                 line-height:0.44rem;
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

   .line1{
            display:inline-block;
            width: 1.8rem;
            white-space: nowrap;
            overflow: hidden;
            line-height:1.1em;
            text-align:right;
            text-overflow: ellipsis;
       }

</style>
