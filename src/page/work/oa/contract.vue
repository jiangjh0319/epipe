<template>
    <section>
        <TopHead
        mark='mark'
        bgcolor = '#fd545c'
        title="合同审批" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">合同名称</span>
                    <input placeholder="请输入合同名称"  v-model="contractName" />
                </div>
                <div>
                    <span class="title">合同编号</span>
                    <input placeholder="请输入合同编号"  v-model="contractNoInput" />
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">送审单位</span>
                    <input style="color:#666;width:2.1rem;" v-model="applyCompanyName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">项目责任人</span>
                    <input  placeholder="请输入项目负责人" v-model="userName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">使用单位</span>
                    <input placeholder="请输入使用单位"  v-model="receiveCompanyName" />
                </div>
                <div>
                    <span class="title">使用单位责任人</span>
                    <input placeholder="请输入单位负责人"  v-model="receiveName" />
                </div>
            </div>

            <div class="styles input_group">
                <div>
                    <span class="title">合同标的</span>
                    <input placeholder="请输入合同标的" v-model="contractObj"/>
                </div>
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">合同要点说明</p>
                <textarea v-model.trim="contractDesc" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入合同要点内容,限定1000字">

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
                color="#fd545c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 2
            ></ApproverMan> -->
            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=2
              :isMore=true
            ></ApproMan>

            <CopeMan 
                :has_journal="!showCopy"
                color="#fd545c"
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
let reg = /[\u4e00-\u9fa5]/g;
let regs = /[0-9]/;
let save_leave = (index,text,that) =>{
    if(that.contractName== ''){
        that.$toast('合同名称不能为空')
    }else if(that.contractName.length>100||that.contractName.length<2){
        that.$toast('合同名称不能低于2个或超过100个字符')
    }else if(that.receiveCompanyName==''){
        that.$toast('使用单位名称不能为空')
    }else if(that.receiveName==''){
        that.$toast('使用责任人名称不能为空')
    }else if(regs.test(that.receiveName)){
        that.$toast('使用责任人名称不能有数字')
    }else if(that.receiveName.length<2||that.receiveName.length>12){
        that.$toast('使用责任人名称不能低于2个或超过12个字符')
    }
    else if(that.receiveCompanyName.length>64||that.receiveCompanyName.length<6){
        that.$toast('使用单位名称不能低于6个或超过64个字符')
    }else if(reg.test(that.contractNoInput)){
        that.$toast('合同编号不能含有中文')
    }else if(that.contractDesc==''){
        that.$toast('合同要点详情不能为空')
    }else if(that.contractDesc.length>1000){
        that.$toast('合同要点详情不能超过1000字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
      
        let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/contract/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    contractName:that.contractName,//合同名称
                    contractNoInput:that.contractNoInput, //合同编号
                    applyCompany:that.applyCompanyName,//送审单位名称
                    applyUserName:that.userName, //项目责任人
                    receiveCompany:that.receiveCompanyName, //使用单位名称
                    reveiveUserName:that.receiveName, //使用单位负责人
                    contractDesc:that.contractDesc.replace(/\n/g, '<br/>'), //合同要点说明
                    contractObj:that.contractObj, //合同标的
                    url : fileObj.urlStr, //附件
                    fileName:fileObj.fileNameStr, 
                    fileSize:fileObj.fileSizeStr,
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
                            if(that.$route.query.contractId){
                                window.location.href = "epipe://?&mark=goWork"
                            }else{
                                window.location.href = "epipe://?&mark=history_back" 
                            }
                        },700)
                    }else{
                        that.$toast('提交成功！')
                        window.location.href = "epipe://?&mark=workUpdate";
                        setTimeout(()=>{
                            window.location.href = "epipe://?&mark=submitContract&_id="+res.data.b.contractId;
                        },500)
                    }
                    localStorage.removeItem('contract')
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
                contractName:'', //合同名称
                contractNoInput:'', //合同编号
                applyCompanyName:'',//送审单位
                userName:'',//项目负责人
                receiveCompanyName:'',//使用单位
                receiveName:'',//使用责任人
                contractObj:'', //合同标的
                contractDesc:'',//合同要点说明
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[],
                isDraftFlag:0, //判断是不是草稿
                isShow:false,
                textNum:0,
                oldData:null,
                addressListIndex:-1,
                showCopy:0,
                showGroup:false,
                applyLinkIds:'',
                allApprovers:[],
                linkAuditNum:'',
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
            this.$router.push({path: 'imchoices', query: {bgcolor:'#fd545c',num:1,amount:1,showGroup,}})

        },
        del_poeple(index,num){
            this.allApprovers[index].auditers.splice(num,1 )
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.contractId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('contract',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('contract')
            window.location.href = "epipe://?&mark=history_back"
        },
        addAccessory:function(){
            let that = this;
            window.location.href = "epipe://?&mark=addAccessory"
        },
        deleteFile:function(index){  //删除附件
            this.accessory.splice(index,1)
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
            contractDesc : function(){
                this.textNum = this.contractDesc.length
            }
        },
        created(){
             if(localStorage.getItem('contract')){
                let contractdata = JSON.parse(localStorage.getItem('contract'))
                for(let key in contractdata){
                    this.$data[key] = contractdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
             this.oldData = JSON.parse(JSON.stringify(this.$data))

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
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
         },
        mounted(){

            window["epipe_camera_callback"] = (url,fileSize,fileName) => {
                var obj = {
                        url,
                        fileSize,
                        fileName
                }
                that.isImg(url)?obj.isImg=true:obj.isImg=false;
                that.accessory.push(obj)
            }

            let that = this;

            this.axios.get('/process/apply/enter?req=2').then((res)=>{
                let data = res.data.b;

                this.allApprovers = data.links;
                this.linkAuditNum = data.linkAuditNum;
                this.applyLinkIds = data.applyLinkIds;
                this.showCopy = data.approvalReceiverFlag=='1'?false:true;
                if(data.receivers.length>0){
                        this.chosed_list = data.receivers
                        this.change_man(this.chosed_list);
                }
            })

            this.axios.post('/user/current/userinfo').then(function(res){
                that.applyCompanyName = res.data.b.organName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })

            if(this.$route.query.contractId){
                    this.axios.get('/work/contract/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            contractId:this.$route.query.contractId
                        }
                    }).then(function(res){ 
                     let data = res.data.b.data[0];
                       if(!that.$route.query.resubmit){
                            that.id = data.contractId;
                        }
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.contractName = data.contractName;
                        that.contractNoInput = data.contractNoInput;
                        that.applyCompanyName = data.applyCompanyName;
                        that.applyUserName = data.userName;
                        that.receiveCompanyName = data.receiveCompanyName;
                        that.receiveName = data.receiveName;
                        that.chosed_list = data.receivers;
                        that.contractObj = data.contractObj;
                        that.contractDesc = data.contractDesc.replace(/<br\/>/g,'\n');
                        that.chosed_list = data.receivers;
                        that.textNum = that.contractDesc.length
                        that.change_man(that.chosed_list);
                        that.allApprovers = data.links;

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
                 width 2rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
                 text-align right;
                 padding-right 0.15rem;
                 color:#666;
             }
             input::-webkit-input-placeholder{
                 font-size:0.13rem;
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

</style>
