<template>
    <section>
        <TopHead
        mark="mark"
        bgcolor='#0fc37c'
        title="公出" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">公出事由</span>
                    <input placeholder="请输入公出事由"  v-model="outSideReason" />
                </div>      
                 <router-link :to="{ path:'/option', query: {indexs:outsideIndex,type:'outsign',color:'#0fc37c'}}" tag="div">
                    <div class="items">
                        公出类型
                        <p>
                            <span class="nullValue">{{outsideType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                        </p>
                    </div>
                 </router-link>
            </div>
            <div class="styles input_group">
                 <div class="items bor_bottom" @click="getTime(0)">
                    开始时间
                    <p >
                        <span class="nullValue">{{beginTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>

                <div class="items bor_bottom" @click="getTime(1)">
                    结束时间
                    <p >
                        <span class="nullValue">{{endTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="items bor_bottom" @click="getSite()" >
                    公出地点
                    <p style="text-align:right">
                        <span class="nullValue omit">{{address}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>

                <router-link tag="div" :to="{path:'/addressList',query:{bgcolor:'#0fc37c',peArrIndex:0,showGroup:true}}" class="items">
                    同行人员
                    <p >
                        <span class="nullValue">{{peerArr | nameFor }}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </router-link>
            </div>


            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">附加内容</p>
                <textarea v-model.trim="contractDesc" maxlength="1000" name="" id="" cols="30" rows="10" placeholder="请输入要点内容,限定1000字">

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
                type= 4
            ></ApproverMan> -->
            
             <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=4
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
let reg = /[\u4e00-\u9fa5]/g;
let regs = /[0-9]/;
let save_leave = (index,text,that) =>{
    if(that.outSideReason==''){
        that.$toast('公出事由不能为空')
    }
    else if(that.outSideReason.length<2||that.outSideReason.length>100){
        that.$toast('公出事由内容不能低于2个或超过100个字符')
    }else if(that.outsideIndex < 0 ){
        that.$toast('公出类型不能为空')
    }else if(that.beginTime == "请选择开始时间"){
        that.$toast('开始时间不能为空')
    }else if(that.endTime == '请结束开始时间'){
        that.$toast('结束时间不能为空')
    }else if(that.address == '请选择公出地点'){
        that.$toast('公出地点不能为空')
    }else if(that.contractDesc&&that.contractDesc.length>1000){
        that.$toast('附加内容不能超过1000字')
    }
    else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{

       let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)

        let peerNames='',peerUserIds='';

        for(let j = 0 ; j<that.peerArr.length;j++){
            peerNames+=that.peerArr[j].name+'|';
            peerUserIds+=that.peerArr[j].userId+'|'
        }

        let contDesc = that.contractDesc.replace(/\n/g, '<br/>')
        peerNames = peerNames.slice(0,-1)
        peerUserIds = peerUserIds.slice(0,-1)

        that.axios({
                method:"post",
                url:"/outsign/task/saves",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id : that.id, // id
                    url : fileObj.urlStr, //附件
                    fileName : fileObj.fileNameStr, //文件名称 
                    fileSize : fileObj.fileSizeStr, //文件大小
                    beginTime : that.beginTime, //开始时间
                    endTime : that.endTime, //结束时间
                    outSideReason:that.outSideReason.replace(/\n/g, '<br/>'),
                    applyContent : contDesc, //附加内容
                    outsideAddress: that.address, //公出地点
                    lon : that.lon, //经度
                    lat : that.lat, //纬度
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    auditUserIds:params.userIdsStr, //审批人
                    auditCompanyIds:params.companyIdsStr,
                    applyLinkIds:that.applyLinkIds,
                    linkAuditNum:params.numStr,
                    draftFlag : index, //草稿还是发送
                    peerNames: peerNames, //同行人员名称
                    peerUserIds: peerUserIds, //同行人员Id
                    outsideType:that.outsideIndex,
                    detailAddress:that.detailAddress,//详细地址
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
                         if(that.$route.query.outSideId){
                                window.location.href = "epipe://?&mark=goWork"
                            }else{
                                window.location.href = "epipe://?&mark=history_back" 
                            }
                    },500)
                }else{
                    that.$toast('提交成功!')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitOutside&_id="+res.data.b.outSideId;
                    },500)
                }
                 localStorage.removeItem('outside')

            }
      })
    }
}
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
// import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import ApproMan  from '../../../components/oa/approver_template.vue'    
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id : '',
                outSideReason:'',//公出事由
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[], //附件
                beginTime : '请选择开始时间', //开始时间
                endTime : '请选择结束时间',  //结束时间
                isDraftFlag : 0, //判断是不是草稿
                address : '请选择公出地点', //公出地点
                contractDesc:'', //附加内容
                lon : '',
                lat : '',
                peer : '',
                isShow:false,
                peerArr: [], //同行人员
                outsideIndex : '-1', //公出类型
                outsideType:'请选择公出类型',//公出类型
                detailAddress:'',
                textNum : 0,  //请假输入字数
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
        ...mapMutations(['change_man','approver_man',"peerData_man"]),
        save_btn(){ //保存草稿
           save_leave(1, "存入草稿成功", this)
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
            if(this.$route.query.outsideId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('outside',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('outside')
            window.location.href = "epipe://?&mark=history_back"
        },
        submit_btn(){ //提交
            save_leave(0, "提交成功", this)
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
                    if(that.endTime!='请选择结束时间'){
                        let endDate = that.tiemF(that.endTime)
                        if(date.getTime()>endDate.getTime()){
                            that.$toast('开始时间不能大于结束时间')
                        }else if(date.getTime()==endDate.getTime()){
                             that.$toast('开始时间不能等于结束时间')
                        }else{
                           that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                           that.getLeaveDay();
                        }
                    }else{
                        that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }
                }else{            
                    
                    if(that.beginTime!='请选择开始时间'){
                        let beginDate = that.tiemF(that.beginTime);
                        if(date.getTime()<beginDate.getTime()){
                            that.$toast('结束时间不能小于开始时间')
                        }else if(date.getTime()==beginDate.getTime()){
                             that.$toast('结束时间不能等于开始时间')
                        }else{
                            that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                            that.getLeaveDay();
                        }
                    }else{
                        that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }  
                }
            }
        },
        getSite:function(){
            let that = this;
            window["epipe_site_callback"] = (name,site,lon,lat) => {
                    name = !name?site:name;
                    that.address = name;
                    that.detailAddress = site;
                    that.lon =  lon;
                    that.lat = lat;
            }
            window.location.href = "epipe://?&mark=outsideAddress"
        },
        addAccessory:function(){
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
        accessoryFor:function(data){ //详情获得的附件数据格式化
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
        peerFor:function(name,id){
            let nameArr= name.split('|')
            let idArr = id.split('|')
            let arr =[];
            nameArr.forEach((item,index)=>{
                arr.push({
                    name : nameArr[index],
                    userId : idArr[index],
                })
            })
            this.peerArr = arr;
        },
        tiemF(timeStr){
            timeStr+=':00';
            timeStr = timeStr.split(/[- : \/]/);
            return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
            },
        },
         watch:{
            contractDesc : function(){
                if(this.contractDesc.length>1000){
                    this.$toast("最多输入1000字~")
                    this.contractDesc = this.contractDesc.slice(0,1000)
                    return
                }
                this.textNum = this.contractDesc.length
            }
        },
        filters:{
          fileSize:function(value){
                 value = value - 0
                var num =  parseInt(value)/1024/1024
                return num.toFixed(2)
          },
          nameFor:function(arr){ //同行人员姓名格式化

                if(!arr||!arr.length) return 
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
        created(){

             if(localStorage.getItem('outside')){
                let outsidedata = JSON.parse(localStorage.getItem('outside'))
                for(let key in outsidedata){
                    this.$data[key] = outsidedata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
                this.peerData_man({index:0,array:this.$data.peerArr})
            }

             this.axios.get('/process/apply/enter?req=3').then((res)=>{
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
                if(res.name=='') return
                this.outsideIndex = res.index;
                this.outsideType = res.name;
            })
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
            this.peerArr = this.peer_man_state[0]
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
            if(this.$route.query.outsideId){
                     this.axios.get('/outsign/task/infos',{
                        params:{
                            type:that.$route.query.resubmit,
                            outsideId:this.$route.query.outsideId
                        }
                    }).then(function(res){
                     let data = res.data.b.data[0];
                       if(!that.$route.query.resubmit){
                             that.id = data.outsideId;
                        }
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.outSideReason = data.outsideReason.replace(/\n/g, '<br/>');
                        that.lon = data.lon;
                        that.lat = data.lat;
                        that.beginTime = data.beginTime;
                        that.endTime = data.endTime;
                        that.detailAddress = data.detailAdress;
                        that.address = data.outsideAddress;
                        that.outsideType  = data.outsideType;
                        that.outsideIndex  = data.outsideValue
                        that.contractDesc = data.applyContent.replace(/\n/g, '<br/>')
                        that.textNum = that.contractDesc.length
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.peerFor(data.peerNames,data.peerUserIds)
                        that.peerData_man(that.peerArr)
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
                    return
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
    .omit{
        width:2.2rem;
        display:block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align:right;
        float:left;
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

    .items{
            height 0.44rem;
            line-height 0.44rem;
            font-size 0.15rem;
            color #333;
            font-weight bold;

            p{
                float right 
            }

            .nullValue{
                color #999;
                font-size 0.14rem;
            }
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
