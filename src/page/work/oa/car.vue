<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#0fc37c'
        title="用车" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-model="carTitle" />
                </div>
                  <div>
                    <span class="title">用车人</span>
                    <input placeholder="请输入申请人"  v-model="userName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">用车部门</span>
                    <input placeholder="请输入所属部门"  v-model="departmentName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">车辆类型</span>
                    <input style="color:#666" v-model="carType" placeholder="请输入所需车辆类型"/>
                </div>
                <div class="bor_bottom">
                    <span class="title">数量（辆）</span>
                    <input style="color:#666" v-model="carNum" placeholder="请输入车辆数量" type="number"/>
                </div>
    
                 <div class="bor_bottom choose" @click="getTime(0)">
                     <span class="title">用车时间</span>
                    <p>
                        <span class="nullValue">{{useDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                 <div class="bor_bottom choose" @click="getTime(1)">
                     <span class="title">返回时间</span>
                    <p>
                        <span class="nullValue">{{returnDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="bor_bottom">
                    <span class="title">随行人员</span>
                    <input style="color:#666" v-model="followPerson" placeholder="请输入随行人员(多个用逗号隔开)"/>
                </div>
           
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">用车事由</p>
                <textarea v-model.trim="carReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入用车事由,限定1000字">

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
                type = 11
            ></ApproverMan> -->

            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=11
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
    if(that.carTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.carTitle.length>100 ||that.carTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.carType == ''){
	    that.$toast('车辆类型不能为空')
    }else if(that.carNum == ''){
	    that.$toast('车辆数量不能为空')
    }else if(!regs.test(that.carNum)){
	    that.$toast('车辆数量不能为0')
    }else if(that.useDate == '请选择使用日期'){
        that.$toast('请选择使用日期')
    }else if(that.returnDate == '请选择返回日期'){
        that.$toast('请选择返回日期')
    }else if(that.followPerson==''){
	    that.$toast('随行人员不能为空')
    }else if(that.followPerson.length>30){
	    that.$toast('随行人员不能超过30个字符')
    }else if(that.carReason == ''){
        that.$toast('用车事由不能为空')
    }else if(that.carReason.length>1000||that.carReason.length<6){
        that.$toast('用车事由不能少于6个或超过1000字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)

        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/car/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    carTitle:that.carTitle,//申请主题
	                carReason:that.carReason, //申请原因
	                carType: that.carType,  //车型
                    carNum: that.carNum,  //用车数量
	                beginTime: that.useDate,  //使用时间
                    endTime: that.returnDate,  //返还时间
	                peerNames: that.followPerson.replace(',','|'),  //同行人员姓名
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
                                    if(that.$route.query.carId){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                                },700)
                            }else{
                                that.$toast('提交成功！')
                                window.location.href = "epipe://?&mark=workUpdate";
                                setTimeout(()=>{
                                    window.location.href = "epipe://?&mark=submitCar&_id="+res.data.b.carApplyId;
                                    
                                },500)
                            }
                            localStorage.removeItem('carApply')
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
	            carTitle : '', // 标题
	            userName : '',//用车人
                departmentName : '',//用车部门
	            carType: '',  //车辆类型
                carNum: '',  //数量
                useDate:'请选择使用日期',
                returnDate:'请选择返回日期',
                followPerson: '',  //随行人员
	            carReason : '',//用车理由
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                isShow:false,
                textNum: 0,
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
        lf_click(){
            this.isShow=false;
            if(this.$route.query.carId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('carApply',JSON.stringify(this.$data))
            }
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
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('carApply')
            window.location.href = "epipe://?&mark=history_back"
        },
        addAccessory:function(){
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
                    if(that.returnDate!='请选择返回日期'){
                        let endDate = that.tiemF(that.returnDate)
                        if(date.getTime()>endDate.getTime()||date.getTime()==endDate.getTime()){
                            that.$toast('开始时间不能大于等于结束时间')
                        }else{
                           that.useDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                        }
                    }else{
                        that.useDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }
                }else{            
                    if(that.useDate!='请选择使用日期'){
                        let beginDate = that.tiemF(that.useDate);
                        if(date.getTime()<beginDate.getTime()||date.getTime()==beginDate.getTime()){
                            that.$toast('归还时间不能小于等于使用时间')
                        }else{
                            that.returnDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                        }
                    }else{
                        that.returnDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
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
	          carReason : function(){
                if(this.carReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.carReason = this.carReason.slice(0,1000)
                    return
                }
                this.textNum = this.carReason.length
            }
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('carApply')){
                let carApplydata = JSON.parse(localStorage.getItem('carApply'))
                for(let key in carApplydata){
                    this.$data[key] = carApplydata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             this.axios.get('/process/apply/enter?req=12').then((res)=>{
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

            if(this.$route.query.carId){
                  this.axios.get('/work/car/info',{
                    params:{
                        type:that.$route.query.resubmit,
	                    carApplyId:this.$route.query.carId
                    }
                }).then(function(res){
                   let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.carApplyId;
                       }
                      that.isDraftFlag = 1;
                      that.accessoryFor(data)
                      that.carTitle = data.carTitle;
                      that.carType = data.carType;
                      that.carNum = data.carNum;
                      that.carReason = data.carReason;
                      that.useDate = data.beginTime;
                      that.returnDate = data.endTime;
                      that.followPerson = data.peerNames.replace('|',',');
                      that.textNum = data.carReason.length
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
