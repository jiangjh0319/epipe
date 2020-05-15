<template>
    <section>
        
        <TopHead
        mark = 'mark'
        bgcolor='#609df6'
        title="出差" 
        v-on:history_back="history_back_click"
         ></TopHead>


        <div class="content">
            <div class="styles input_group">
                <div class="">
                    <span class="title">标题</span>
                    <input placeholder="请输入标题"  v-model="tripTitle" />
                </div>      
            </div>

            <EvectionTemp v-for="(item,index) in datas"
             :datas = datas
             :index = index
             :peerArr = peerArr[index]?peerArr[index]:[]
             @removePeerArr="removePeerArr"
             :key="index">

            </EvectionTemp>

            <div class="addDiv styles" @click="addEvection" v-if="datas.length<10">
                + 增加行程明细
            </div>

            <div class="styles" style="padding:0 0.15rem;">
                <p class="title">出差事由</p>
                <textarea v-model.trim="contractDesc" maxlength="1000" name="" id="" cols="30" rows="10" placeholder="请输入出差事由,限定1000字">

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
                type= 1
            ></ApproverMan> -->

            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=1
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
let regs = /[0-9]/;
let save_leave = (index,text,that) =>{
    if(that.tripTitle==''){
        that.$toast('标题不能为空')
    }
    else if(that.tripTitle.length<2||that.tripTitle.length>100){
        that.$toast('公出事由内容不能低于2个或超过100个字符')
    }else if(that.contractDesc&&that.contractDesc.length>1000){
        that.$toast('出差事由不能超过1000字')
    }
    else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{

        let array = [];
        for(let i = 0 ; i<that.datas.length ; i++){

                if( that.datas[i].destination=='请选择出差地点'){
                    that.$toast('出差地点不能为空')
                    return
                }else if(that.datas[i].beginTime=='请选择开始时间'){
                    that.$toast('请选择开始时间')
                    return

                }else if(that.datas[i].endTime=='请选择结束时间'){
                    that.$toast('请选择结束时间')
                    return
                }else if(that.datas[i].tripDuration==''||that.datas[i].tripDuration*10%5!=0){
                    that.$toast('请输入正确的请假天数')
                    return;
                }

                let peerNames='',peerUserIds='';
                if(that.peerArr[i]){
                    
                    for(let j = 0 ; j<that.peerArr[i].length;j++){
                        peerNames+=that.peerArr[i][j].name+'|';
                        peerUserIds+=that.peerArr[i][j].userId+'|'
                    }

                    that.datas[i].peerNames = peerNames.slice(0,-1)
                    that.datas[i].peerUserIds = peerUserIds.slice(0,-1)
                }
        }

        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}, approver = {}

        receiverIds = that.Util.getIds(that.chosed_list,'userId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        approver = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)

        fileObj = that.Util.fileFo(that.accessory)

         params = {
             Id : that.id, // id
            urls : fileObj.urlStr, //附件
            tripTitle:that.tripTitle, //标题
            tripReason:that.contractDesc.replace(/\n/g, '<br/>'),//出差事由
            fileNames : fileObj.fileNameStr, //文件名称 
            fileSizes : fileObj.fileSizeStr, //文件大小
            receiverIds, //抄送人
            receiverCompanyIds,
            auditUserIds:approver.userIdsStr, //审批人
            auditCompanyIds:approver.companyIdsStr,
            applyLinkIds:that.applyLinkIds,
            linkAuditNum:approver.numStr,
            draftFlag : index, //草稿还是发送
        }

        that.datas.forEach((item,index)=>{

            params['tripList['+index+'].destination'] = item.destination
            params['tripList['+index+'].detailAddress'] = item.detailAddress
            params['tripList['+index+'].lon'] = item.lon
            params['tripList['+index+'].lat'] = item.lat
            params['tripList['+index+'].beginTime'] = item.beginTime
            params['tripList['+index+'].endTime'] = item.endTime
            params['tripList['+index+'].tripDuration'] = item.tripDuration
            params['tripList['+index+'].peerNames'] = item.peerNames
            params['tripList['+index+'].peerUserIds'] = item.peerUserIds

        })

        // that.axios.post('/work/trip/save' + that.Service.queryString(params)).then(function (res){
            that.axios({
                method:"post",
                url:"/work/trip/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:params,
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
                                if(that.$route.query.tripId){
                                    window.location.href = "epipe://?&mark=goWork"
                                }else{
                                    window.location.href = "epipe://?&mark=history_back" 
                                }
                            },500)
                        }else{
                            that.$toast('提交成功!')
                            window.location.href = "epipe://?&mark=workUpdate";
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=submitTrip&_id="+res.data.b.tripId;
                            },500)
                        }
                    that.change_man([])
                    that.approver_man([])
                    localStorage.removeItem('trip')
                }
            })
            }
        }
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import EvectionTemp  from '../../../components/worknews/evectionTemplate.vue'    //出差行程组件
// import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import ApproMan  from '../../../components/oa/approver_template.vue'    
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id : '',
                tripTitle : '', //标题
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[], //附件
                isDraftFlag : 0, //判断是不是草稿
                contractDesc:'', //附加内容
                peer : '',
                isShow:false,
                textNum : 0,
                peerArr: [[]], //同行人员
                datas:[{
                    destination:'请选择出差地点', //出差地点
                    detailAddress:'',//出差地点详细地址
                    beginTime : '请选择开始时间', //开始时间
                    endTime : '请选择结束时间',  //结束时间
                    lon : '', //经度
                    lat : '', //纬度
                    tripDuration :'', // 出差天数
                }],
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
            EvectionTemp,
            Dialog
        },
        methods:{
        ...mapMutations(['change_man','approver_man',"peerData_man",'peerArrs_man']),
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
            if(this.$route.query.tripId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                 localStorage.setItem('trip',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back" 
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('trip')
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
        peerFor:function(name,id,index){
            let nameArr= name.split('|')
            let idArr = id.split('|')
            let arr =[];
            nameArr.forEach((item,index)=>{
                arr.push({
                    name : nameArr[index],
                    userId : idArr[index],
                })
            })

            this.peerArr[index] = arr;
            // return arr;
        },
        tiemF(timeStr){
            timeStr+=':00';
            timeStr = timeStr.split(/[- : \/]/);
            return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
        },
        addEvection(){ //添加行程明细
           this.datas.push({
                    destination:'请选择出差地点', //出差地点
                    detailAddress:'',//出差地点详细地址
                    beginTime : '请选择开始时间', //开始时间
                    endTime : '请选择结束时间',  //结束时间
                    lon : '', //经度
                    lat : '', //纬度
                    tripDuration :'', // 出差天数
                });
        },
        removePeerArr(index){
                this.peerArr.splice(index,1)
                this.peerArrs_man(this.peerArr)
            }
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
      
        },
        created(){
             if(localStorage.getItem('trip')){
                let tripdata = JSON.parse(localStorage.getItem('trip'))
                for(let key in tripdata){
                    this.$data[key] = tripdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
                this.peerArrs_man(this.$data.peerArr)
            }

             this.axios.get('/process/apply/enter?req=4').then((res)=>{
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
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
            this.peerArr = this.peer_man_state
		    this.$forceUpdate();
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
            if(this.$route.query.tripId){
                 this.axios.get('/work/trip/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            tripId:this.$route.query.tripId
                        }
                    }).then(function(res){ ///   console.log(res.data.b.data)
                       let data = res.data.b;
                       if(!that.$route.query.resubmit){
                             that.id = data.tripId;
                        }
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.tripTitle = data.tripTitle;
                        that.contractDesc = data.tripReason.replace(/<br\/>/g,'\n') ;
                        that.textNum = data.tripReason.length;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);

                        for(let i =0;i<data.tripList.length;i++){
                            that.datas[i] = {
                                 beginTime : data.tripList[i].beginTime,
                                 endTime : data.tripList[i].endTime,
                                 lon : data.tripList[i].lon,
                                 lat : data.tripList[i].lat,
                                 destination : data.tripList[i].destination,
                                 tripDuration : data.tripList[i].tripDuration,
                            }
                            that.peerFor(data.tripList[i].peerNames,data.tripList[i].peerUserIds,i)
                        }
                    })
                    return
            }
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
                 color:#999;
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
            //  -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
            //  box-shadow 0 0 0.2rem rgba(238,65,54,.1);
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

    .addDiv{
        height:0.44rem;
        text-align:center;
        line-height:0.44rem;
        font-size:0.16rem;
        color: #609df6;
        font-weight: 600;
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
