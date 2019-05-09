<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#f80'
        title="付款" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-model="payTitle" />
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
                    <span class="title">付款金额</span>
                    <input style="color:#666" v-model="payAmount" placeholder="请输入付款金额"/>
                </div>
                <router-link :to="{ path:'/option', query: {indexs:payType,type:'payApply',color:'#f80'}}"  class="bor_bottom choose" tag="div">
                    <span class="title">付款方式</span>
                    <p>
                        <span class="nullValue">{{payName}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
                 <div class="bor_bottom choose" @click="getTime">
                     <span class="title">付款日期</span>
                    <p>
                        <span class="nullValue">{{payDate}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                 <div class="bor_bottom">
                    <span class="title">收款人全称</span>
                    <input style="color:#666" v-model="receiverName" placeholder="请输入收款人全称"/>
                </div>
                 <div class="bor_bottom">
                    <span class="title">银行账户</span>
                    <input style="color:#666" v-model="bankAcount" placeholder="请输入银行账户"/>
                </div>
                 <div class="bor_bottom">
                    <span class="title">开户行</span>
                    <input style="color:#666" v-model="bankName" placeholder="请输入开户行"/>
                </div>
           
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">付款事由</p>
                <textarea v-model.trim="payReason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入付款事由,限定1000字">

                </textarea>
                <div class="record_box">
                        <span>{{textNum}}/1000</span>
                </div>
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#f80"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 10
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#f80"
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
    if(that.payTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.payTitle.length>100 ||that.payTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.payType == -1){
        that.$toast('请选择付款方式')
    }else if(that.payDate == '请选择付款日期'){
        that.$toast('请选择付款日期')
    }else if(that.payAmount == ''){
        that.$toast('请输入付款金额')
    }else if(isNaN(that.payAmount)){
        that.$toast('付款金额为数字')
    }else if(that.payAmount.length>8){
        that.$toast('付款金额不能大于8位数')
    }else if(that.receiverName == ''){
        that.$toast('请输入收款人姓名')
    }else if(that.receiverName.length<2||that.receiverName>30){
        that.$toast('收款人不能低于2个或超过30个字符')
    }else if(that.bankName == ''){
        that.$toast('请输入开户行')
    }else if(!reg.test(that.bankName)){
        that.$toast('开户行必须为中文')
    }else if(that.bankName.length<4||that.bankName.length>30){
        that.$toast('开户行不能少于4个或超过30个字符')
    }else if(that.bankAcount == ''){
        that.$toast('请输入银行账户')
    }else if(!rule.test(that.bankAcount)){
        that.$toast('银行账户必须为数字字母')
    }else if(that.bankAcount.length<2||that.bankAcount.length>20){
        that.$toast('银行账户不能少于2个或超过20个字符')
    }else if(that.payReason == ''){
        that.$toast('付款事由不能为空')
    }else if(that.payReason.length>1000||that.payReason.length<6){
        that.$toast('付款事由不能少于6个或超过1000字符')
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{
        
        let approver_id = '',chosed_id = ''
        chosed_id = that.Util.people(that.isDraft,that.chosed_list,1).slice(1)
        approver_id = that.Util.people(that.isDraft,that.approver_list,2).slice(1)

        let fileObj = {},params={}
        fileObj = that.Util.fileFo(that.accessory)
        // let contDesc = that.payReason.replace(/\n|\r\n/g,"<br>")
        // https://blog.csdn.net/xiaobao5214/article/details/68923023/
        that.axios({
                method:"post",
                url:"/work/pay/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    payTitle:that.payTitle,//标题
                    payReason:that.payReason, //付款说明
                    payType : that.payType,//付款方式
                    payAmount:that.payAmount, //付款金额
                    bankName:that.bankName,
                    payDate:that.payDate,//付款时间
                    bankAcount:that.bankAcount,
                    receiverName:that.receiverName, //收款人
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
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
        // that.axios.post('/work/pay/save' + encodeURI(that.Service.queryString({
        //   Id :that.id, // id
        //   payTitle:that.payTitle,//标题
        //   payReason:that.payReason, //付款说明
        //   payType : that.payType,//付款方式
        //   payAmount:that.payAmount, //付款金额
        //   bankName:that.bankName,
        //   payDate:that.payDate,//付款时间
        //   bankAcount:that.bankAcount,
        //   receiverName:that.receiverName, //收款人
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
                        if(that.$route.query.payApplyId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitPayApply&_id="+res.data.b.payApplyId;
                        
                    },500)
                }
                localStorage.removeItem('payApply')
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
                payTitle : '', // 标题
                departmentName : '',//用印部门
                payAmount : '', //付款金额
                payDate:'请选择付款日期', //付款日期
                userName : '',//用印承办人
                receiverName:'',//收款人
                bankAcount:'', //银行账户
                bankName:'',//开户行
                payReason : '',//用印说明
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                payType:-1,
                payName:'请选择付款方式',
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
            if(this.$route.query.payApplyId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('payApply',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('payApply')
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
            payReason : function(){
                if(this.payReason.length>1000){
                    this.$toast("最多输入1000字~")
                    this.payReason = this.payReason.slice(0,1000)
                    return
                }
                this.textNum = this.payReason.length
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
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('payApply')){
                let payApplydata = JSON.parse(localStorage.getItem('payApply'))
                for(let key in payApplydata){
                    this.$data[key] = payApplydata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.payType = res.index;
                this.payName = res.name;
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

            if(this.$route.query.payApplyId){
                    this.axios.get('/work/pay/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            payApplyId:this.$route.query.payApplyId
                        }
                    }).then(function(res){ 
                     let data = res.data.b;
                       that.id = data.payApplyId;
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.payTitle = data.payTitle;
                        that.payAmount = data.payAmount;
                        that.payType = data.payTypeCode
                        that.payName = data.payType;
                        that.receiverName = data.receiverName
                        that.payReason = data.payReason;
                        that.payDate = data.payDate;
                        that.bankAcount = data.bankAcount;
                        that.bankName=data.bankName;
                        that.textNum = data.payReason.length
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
