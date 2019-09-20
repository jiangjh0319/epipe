<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#fd545c'
        title="公务接待" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入标题"  v-model="receptionTitle" />
                </div>
                  <div>
                    <span class="title">经办人</span>
                    <input placeholder="请输入申请人"  v-model="userName" disabled/>
                </div>
                <div class="bor_bottom">
                    <span class="title">经办部门</span>
                    <input placeholder="请输入所属部门"  v-model="departmentName" disabled/>
                </div>
            </div>
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">来宾单位</span>
                    <input style="color:#666" v-model="visitorCompany" placeholder="请输入来访单位详细名称"/>
                </div>

                 <div class="bor_bottom choose" >
                     <span class="title">随行人员</span>
                     <input style="color:#666" v-model="visitors" placeholder="请输入随行人员名称"/>
                </div>
                 <div class="bor_bottom choose" @click="getTime">
                     <span class="title">到访时间</span>
                    <p>
                        <span class="nullValue">{{visitDate}}</span> 
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <router-link :to="{ path:'/option', query: {indexs:visitTrafficWay,type:'reception',color:'#fd545c'}}" tag="div" class="bor_bottom choose">
                          <span class="title">到访交通工具</span>
                        <p>
                            <span class="nullValue">{{visitTrafficName}}</span>
                                <svg class="icon icon-back" aria-hidden="false">
                                        <use xlink:href="#icon-right"></use>
                                </svg>
                        </p>
                 </router-link>
                <div class="bor_bottom">
                    <span class="title">接待等级</span>
                    <input style="color:#666" v-model="receptionLevel" placeholder="请输入接待等级"/>
                </div>
                <div style="padding:0 0.15rem;">
                    <p class="title">来访目的</p>
                    <textarea v-model.trim="visitGoal" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入来访目的,限定1000字">

                    </textarea>
                    <div class="record_box">
                            <span>{{textNum}}/1000</span>
                    </div>
                </div>

            </div>


            <div class="styles" style="padding:0 0.15rem;">
                <div class="bor_bottom">
                    <span class="title">预算总费用</span>
                    <input style="color:#666" v-model="totalBudget" placeholder="请填写预算总费用"/>
                </div>
                 <div class="bor_bottom">
                    <span class="title">住宿</span>
                    <input style="color:#666" v-model="hotelBudget" placeholder="请填写所需住宿费"/>
                </div>
                 <div class="bor_bottom">
                    <span class="title">餐饮 <a @click="toLink" style="font-size:0.12rem;color:#609ef7">客餐菜单标准</a></span>
                    <input style="color:#666;width:1.5rem" v-model="foodBudget" placeholder="请填写所需餐饮费"/>
                </div>
                 <div class="bor_bottom">
                    <span class="title">其他</span>
                    <input style="color:#666" v-model="otherBudget" placeholder="请填写其他费用"/>
                </div>
            </div>

            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#fd545c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 7
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#fd545c"
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
    if(that.receptionTitle== ''){
        that.$toast('文件标题不能为空')
    }else if(that.receptionTitle.length>100 ||that.receptionTitle.length<2){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }else if(that.visitTrafficWay == -1){
        that.$toast('请选择到访交通方式')
    }else if(that.visitDate == '请选择到访日期'){
        that.$toast('请选择到访日期')
    }else if(!that.totalBudget){
        that.$toast('预算总金额不能为空')
    }else if(that.visitors==''){
        that.$toast('随行人员不能为空')
    }
    else if(isNaN(that.totalBudget)){
        that.$toast('预算总金额必须为数字')
    }else if(that.hotelBudget&&isNaN(that.hotelBudget)){
        that.$toast('住宿费必须为数字')
    }else if(that.otherBudget&&isNaN(that.otherBudget)){
        that.$toast('其他费用必须为数字')
    }else if(that.foodBudget&&isNaN(that.foodBudget)){
        that.$toast('餐饮费必须为数字')
    }else if(that.visitorCompany == ''){
        that.$toast('请输入来访单位')
    }else if(that.visitorCompany.length<6||that.visitorCompany.length>50){
        that.$toast('来访单位不能少于6个或超过50个字符')
    }else if(that.receptionLevel.length<2||that.receptionLevel.length>30){
        that.$toast('接待等级不能少于2个或超过30个字符')
    }
    else if(that.visitGoal == ''){
        that.$toast('来访目的不能为空')
    }else if(that.visitGoal.length>1000||that.visitGoal.length<6){
        that.$toast('来访目的不能少于6个或超过1000字符')
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{
        let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/reception/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    receptionTitle:that.receptionTitle,//标题
                    visitGoal:that.visitGoal, 
                    visitTrafficWay : that.visitTrafficWay,
                    visitorCompany:that.visitorCompany,
                    visitDate:that.visitDate,
                    totalBudget :that.totalBudget,
                    visitors:that.visitors,
                    hotelBudget:that.hotelBudget,
                    otherBudget:that.otherBudget,
                    foodBudget:that.foodBudget,
                    receptionLevel:that.receptionLevel,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    auditCompanyIds,
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
                                    if(that.$route.query.receptionId){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                                },700)
                            }else{
                                that.$toast('提交成功！')
                                window.location.href = "epipe://?&mark=workUpdate";
                                setTimeout(()=>{
                                    window.location.href = "epipe://?&mark=submitReception&_id="+res.data.b.receptionApplyId;
                                    
                                },500)
                            }
                            localStorage.removeItem('visitorApply')
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
                receptionTitle : '', // 标题
                departmentName : '',//用印部门
                visitDate:'请选择到访日期', //付款日期
                userName : '',//
                visitorCompany:'',//来访公司名
                visitGoal : '',//用印说明
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                totalBudget:'',
                hotelBudget:'',
                visitors:'',
                receptionLevel:'', //接待等级
                visitTrafficWay:-1,
                visitTrafficName:'请选择到访交通工具',
                peerArr: [], //同行人员
                isShow:false,
                otherBudget:'',
                foodBudget:''
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
        ...mapMutations(['change_man','approver_man',]),
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
        toLink(){
            this.$router.push({path:'/menu'})
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.receptionApplyId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('visitorApply',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('visitorApply')
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
                    that.visitDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                }
            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
        },
         watch:{
            visitGoal : function(){
                if(this.visitGoal.length>1000){
                    this.$toast("最多输入1000字~")
                    this.visitGoal = this.visitGoal.slice(0,1000)
                    return
                }
                this.textNum = this.visitGoal.length
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
          },
           nameFor:function(arr){ //同行人员姓名格式化
           console.log(arr)
                if(!arr||!arr.length) return '请选择同行人员'
              var str = '';
              for(let i = 0;i<arr.length;i++){

                  if(i>2){
                      return str.slice(0,-1)+'...';
                  }
                    str+= arr[i].name+','
              }
              return str.slice(0,-1)
          }
        },
        activated(){
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
         },
         created() {
             if(localStorage.getItem('visitorApply')){
                let visitorApplydata = JSON.parse(localStorage.getItem('visitorApply'))
                for(let key in visitorApplydata){
                    this.$data[key] = visitorApplydata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.visitTrafficWay = res.index;
                this.visitTrafficName = res.name;
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

            if(this.$route.query.receptionId){
                    this.axios.get('/work/reception/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            receptionApplyId:this.$route.query.receptionId
                        }
                    }).then(function(res){ 
                    let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.receptionApplyId;
                        }
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.receptionTitle = data.receptionTitle;
                        that.visitTrafficWay = data.visitTrafficWayCode
                        that.visitTrafficName = data.visitTrafficWay
                        that.receptionLevel = data.receptionLevel
                        that.visitGoal = data.visitGoal;
                        that.visitors = data.visitors;
                        that.visitDate = data.visitDate;
                        that.totalBudget = data.totalBudget;
                        that.foodBudget = data.foodBudget;
                        that.hotelBudget = data.hotelBudget;
                        that.otherBudget = data.otherBudget;
                        that.visitorCompany=data.visitorCompany;
                        that.textNum = data.visitGoal.length
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
                 line-height 0.44rem;
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
