<template>
    <section>
        <TopHead
        mark='mark'
        bgcolor = '#609df6'
        title="用印" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">标题</span>
                    <input placeholder="请输入标题" style="backgound-color:#f80"  v-model="stampApplyTitle" />
                </div>
                <div class="bor_bottom">
                    <span class="title">用印部门</span>
                    <input placeholder="请输入用印部门"  v-model="departmentName" disabled/>
                </div>
                 <div>
                    <span class="title">用印承办人</span>
                    <input placeholder="请输入用印承办人"  v-model="userName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件名称</span>
                    <input style="color:#666" v-model="stampFileName" placeholder="请输入文件名称"/>
                </div>
                <router-link :to="{ path:'/option', query: {indexs:fileTypeIndex,type:'stamp_fileCategory',color:'#609df6'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">文件类别</span>
                    <p>
                        <span class="nullValue">{{fileTypeName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                <div class="bor_bottom">
                    <span class="title">文件数量</span>
                    <input placeholder="请输入文件数量"  v-model="fileQuantity" />
                </div>
                <router-link class="choose" tag="div" :to="{ path:'/option', query: {indexs:sealNameIndex,type:'stamp_sealName',color:'#609df6'}}">
                    <span class="title">印章名称</span>
                    <p>
                        <span class="nullValue">{{sealName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">用印说明</p>
                <textarea v-model.trim="stampApplyReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入用印说明,限定1000字">

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
                type = 5
            ></ApproverMan> -->

            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=5
            ></ApproMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#609df6"
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
var regs =/^[1-9]+\d*$/;
let save_leave = (index,text,that) =>{
    if(that.stampApplyTitle== ''){
        that.$toast('标题不能为空')
    }else if(that.stampApplyTitle.length>100 ||that.stampApplyTitle.length<2){
        that.$toast('标题不能低于2个或超过100个字符')
    }else if( that.stampFileName.length>100 || that.stampFileName.length<6){
        that.$toast('文件名称不能低于6个或超过100个字符')
    }else if(that.fileTypeIndex == -1){
        that.$toast('请选择文件类别')
    }else if(that.sealNameIndex == -1){
        that.$toast('请选择印章名称')
    }else if(that.fileQuantity==''){
        that.$toast('请输入用印文件数量')
    }else if(!(regs.test(that.fileQuantity)) || !(that.fileQuantity-0>0 && that.fileQuantity-0<100)){
        that.$toast('文件数量请输入1-99的整数')
    }
    else if(that.stampApplyReason==''){
        that.$toast('用印说明不能为空')
    }else if(that.stampApplyReason.length>1000||that.stampApplyReason.length<6){
        that.$toast('用印说明不能低于6个或超过1000字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
      
        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)
        // let contDesc = that.stampApplyReason.replace(/\n|\r\n/g,"<br>")
        // https://blog.csdn.net/xiaobao5214/article/details/68923023/
         that.axios({
                method:"post",
                url:"/work/stamp/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    stampApplyTitle:that.stampApplyTitle,//标题
                    stampApplyReason:that.stampApplyReason, //用印说明
                    stampFileName:that.stampFileName, //文件名称
                    sealName : that.sealNameIndex, //印章名称
                    fileCategory : that.fileTypeIndex,//文件类别
                    fileQuantity : that.fileQuantity, //文件数量
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
        // that.axios.post('/work/stamp/save' + encodeURI(that.Service.queryString({
        //   Id :that.id, // id
        //   stampApplyTitle:that.stampApplyTitle,//标题
        //   stampApplyReason:that.stampApplyReason, //用印说明
        //   stampFileName:that.stampFileName, //文件名称
        //   sealName : that.sealNameIndex, //印章名称
        //   fileCategory : that.fileTypeIndex,//文件类别
        //   fileQuantity : that.fileQuantity, //文件数量
        //   urls : urlStr, //附件
        //   fileNames:fileNameStr, 
        //   fileSizes:fileSizeStr,
        //   auditUserIds: approver_id, //审批人
        //   receiverIds: chosed_id, //抄送人
        //   draftFlag : index, //草稿还是发送
        // }))).then(function (res){
            if(res.data.h.code!=200){
                that.$toast(res.data.h.msg)
            }else if(res.data.h.code == 200){
                if(index){

                    that.$toast('已保存至草稿箱!')
                    setTimeout(()=>{
                          if(that.$route.query.stampId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitStamp&_id="+res.data.b.stampId;
                    },500)
                }

                localStorage.removeItem('stamp')

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
                stampApplyTitle : '', // 标题
                departmentName : '',//用印部门
                stampFileName : '', //文件名称
                userName : '',//用印承办人
                fileQuantity : '', //文件数量
                stampApplyReason : '',//用印说明
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                isShow:false,
                native : 'native',
                textNum : 0,
                fileTypeIndex:-1,
                fileTypeName:'请选择文件类别',
                sealNameIndex : -1 ,
                sealName:'请选择印章名称',
                oldData:null,
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
            Dialog,
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
            if(this.$route.query.stampId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                 localStorage.setItem('stamp',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"            
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('stamp')
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
            let that = this;
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
            stampApplyReason : function(){
                if(this.stampApplyReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.stampApplyReason = this.stampApplyReason.slice(0,1000)
                    return
                }
                this.textNum = this.stampApplyReason.length
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
           if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
         },
         created() {
            
            if(localStorage.getItem('stamp')){
                let stampdata = JSON.parse(localStorage.getItem('stamp'))
                for(let key in stampdata){
                    this.$data[key] = stampdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

             this.axios.get('/process/apply/enter?req=5').then((res)=>{
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
                if(res.type=='stamp_fileCategory'){
                    this.fileTypeIndex = res.index;
                    this.fileTypeName = res.name;
                }else{
                    this.sealNameIndex = res.index;
                    this.sealName = res.name;
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

            this.axios.post('/user/current/userinfo').then(function(res){
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))

            })

            if(this.$route.query.stampId){
                   this.axios.get('/work/stamp/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            stampId:this.$route.query.stampId
                        }
                    }).then(function(res){ //   console.log(res.data.b.data)
                       let data = res.data.b;
                       if(!that.$route.query.resubmit){
                            that.id = data.stampId;
                        }
                       that.isDraftFlag = 1;
                       that.native = 'mark';
                        that.accessoryFor(data)
                        that.stampApplyTitle = data.stampApplyTitle;
                        that.stampFileName = data.fileName;
                        that.fileTypeName = data.fileCategory;
                        that.fileTypeIndex = data.fileCategoryCode
                        that.fileQuantity = data.fileQuqntity
                        that.sealName = data.sealName
                        that.sealNameIndex = data.sealNameCode
                        that.stampApplyReason = data.stampApplyReason;
                        that.textNum = data.stampApplyReason.length;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
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
