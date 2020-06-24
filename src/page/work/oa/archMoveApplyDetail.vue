<template>
    <section class="trip">
        <TopHead
        mark='mark'
        bgcolor = '#609df6'
        :title=title
        v-on:history_back="history_back_click"
         ></TopHead>
         <div class="base-content">
        <div class="content">
            <div class="styles">
                <div class="content_head">
                    <img class="imgHead" :src="dataObj.profileImg" @click="go_user(dataObj.userId)">
                    <div>
                        <p class="nameTl">{{dataObj.username}}</p>
                        <p class="res">{{leaveType |oa_details_status}}</p>
                        <p class="res" v-if="leaveType==3||leaveType==4">等待{{dataObj.auditUserName}}的{{dataObj | awaits}}</p>

                    </div>
                </div>
            </div>
            <div class="styles infor">
                <div class="infor-box">
                    <span>移交编号</span>
                    <p>{{dataObj.dossierTransferNo}}</p>
                </div>
                <div class="infor-box">
                    <span>移交名称</span>
                    <p>{{dataObj.transferName}}</p>
                </div>
                <div class="infor-box">
                    <span>借阅原因</span>
                    <p>{{dataObj.transferReason}}</p>
                </div>
                <div class="infor-box">
                    <span>移交日期</span>
                    <p>{{dataObj.transferDate}}</p>
                </div>
            </div>
            
            <div v-for="(item,index) in dataObj.dmInfo" :key="index">
                <div class="tripCount" v-if="dataObj.dmInfo.length>1" >档案明细 {{index+1}}</div>

                <div class="styles infor" >
                    <!-- <div class="infor-box">
                        <span>公出地点</span>
                        <p @click="goAddress(index)"> 
                            <svg class="icon icon-back" aria-hidden="false" style="color:#609df6">
                                <use xlink:href="#icon-location1"></use>
                            </svg>
                            {{item.destination}}</p>
                    </div> -->
                    <div class="infor-box">
                        <span>档案名称</span>
                        <p>{{item.dossier}}</p>
                    </div>
                    <div class="infor-box">
                        <span>档案编号</span>
                        <p>{{item.dossierNo}}</p>
                    </div>
                    <div class="infor-box">
                        <span>档案管理员</span>
                        <p>{{item.handleUser}} </p>
                    </div>
                    <div class="infor-box">
                        <span>档案位置</span>
                        <p>{{item.oldDossierLocation}}</p>
                    </div>
                </div>
            </div>

            <div class="styles" v-if="dataObj.tripReason!=null">
                <div class="infor-box">
                    <span class="contractDescTitle">出差事由</span>
                    <p style="margin-top:0.1rem;" v-html="dataObj.tripReason?dataObj.tripReason:''"></p>
                </div>
            </div>

             <Accessory  :accessory='accessory'>

            </Accessory>

             <Approver
            :datas = dataObj
            :endIndex = endIndex
             :refuseIndex = refuseIndex
             >
            </Approver>

            <Copy
             :dataObj = dataObj
             :newCopy = newCopy
             v-on:remove = "removeCopy"
             color="#609df6"
            >
            </Copy>

            <div class="foot-box">
            </div>
        </div>
        </div>

         <OaBtn
            :dataObj = dataObj
            :leaveType = leaveType
            v-on:consent="consent"
            v-on:refuse="refuse"
            v-on:more='moreBtn'
            v-on:revocation="isDialog=true"
            v-on:resubmit="resubmit"
            v-on:urge="isBackout=true"
            v-on:print="print"
            >
        </OaBtn>

        <div style="width:100%;height:0.15rem;background-color:#fff"></div>

        <div class="dialog" v-show="isDialog" @touchmove.prevent>
            <div class="dialog_box">
                <div class="dialog_content">确认撤销申请？</div>
                <div class="dialog_btn">
                    <a class="confirm_btn" @click="revocation()">确定</a>
                    <a class="cancel_btn" @click="isDialog=false">取消</a>
                </div>
            </div>
        </div>
        <MoreBtn
          v-show="isShow"
          v-on:approveBack="approveBack"
          v-on:deliverTo="consent"
          v-on:revocation="revocation"
          v-on:urge="urge"
          v-on:isShow="isShow=!isShow"
          :myself="myself"
          v-on:print="print"
        >
        </MoreBtn>

         <Dialog
            lfText="确认"
            rgText="取消"
            content="是否提醒审批人审批？"
            v-on:lfClick="urge"
            v-on:rgClick="isBackout=false"
            v-show="isBackout"
            >
        </Dialog>
          
    </section>
</template>

<script>
    import $ from "jquery";
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import Accessory  from '../../../components/oa/accessoryList.vue'  // 附件
    import Approver  from '../../../components/oa/approver_details_template.vue'  // 审批人
    import Copy  from '../../../components/oa/copyDetails.vue'  // 抄送人
    import OaBtn  from '../../../components/oa/oa_btn.vue'  // 动作按钮
    import MoreBtn  from '../../../components/oa/more_btn.vue'  // 更多弹窗
    import Dialog  from '../../../components/oa/dialog.vue'    //弹窗
    
    export default {
        data(){
            return{
                dataObj: {},
                isDialog : false,
                btnType : 0,
                refuseIndex :-1, //拒绝截止下标
                leaveType : '3', //请假状态
                newStatus :'',
                titleColor:'#fd545c',
                titleType :'no',
                refuseSvgIndex:-1,
                mark :'marks',
                accessory:[],
                tripId:'',
                newCopy:[], //新增抄送人
                newAppr:[], //新增审批人
                isShow:false,
                title:'',
                isBackout:false,
                amount:0,
                endIndex:999,

            }
        },
        
        components:{
            TopHead,
            Accessory,
            Approver,
            Copy,
            OaBtn,
            MoreBtn,
            Dialog
        },
        methods :{
        ...mapMutations(['change_man','approver_man']),
            refuse:function(){
                 this.$router.push({path:'/opinion',query:{id:this.dataObj.dossierTransferApplyId,typeName:'archMoveApply',applyType:28,color:'#609df6'}})
            },
            history_back_click:function(){
                    if(location.href.indexOf('goWork=0')>0){
                        window.location.href = "epipe://?&mark=history_back"
                        return
                    }
                    window.location.href = "epipe://?&mark=goWork"
            },
            deliverTo(){ //转交
                let newApprStr = this.appAndCopy(this.newAppr,'auditUserId')
                let copyStr = this.appAndCopy(this.newCopy)
                this.$router.push({path:'/imchoices',query:{id:this.dataObj.dossierTransferApplyId,receiverIds:copyStr,bgcolor:'#609df6', careOf:true,typeName:'archMoveApply',applyType:28,auditerIds:newApprStr,num:1}})
            },
            approveBack(){ //退回
                 this.$router.push({path:'/approveBack',query:{id:this.dataObj.dossierTransferApplyId,typeName:'archMoveApply',applyType:28,color:'#609df6'}})
            },
            resubmit(){ //再次提交
                this.$router.replace({path:'/archMoveApply',query:{tripId:this.dataObj.dossierTransferApplyId,resubmit:1}})
            },
            urge(){ //催办
                this.isBackout = false;
                let that = this;
                this.axios.post('/work/audit'+this.Service.queryString({
                    applyId:this.dataObj.dossierTransferApplyId,
                    type:6,
                    applyType:28,
                })).then(function(res){
                    if(res.data.h.code==200){
                        that.$toast('催办成功!')
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            },
            print(){//打印
                window.location.href = "epipe://?&mark=print&url="+location.href;
            },
            consent:function(type){ //同意
                let that = this,receiverIds='',auditerIds='',receiverCompanyId="",auditCompanyId="",url='',params={};

                if(type==2){
                auditerIds = this.Util.deliverIds(this.dataObj.links,'userId')
                auditCompanyId = this.Util.deliverIds(this.dataObj.links,'companyId')
                }
                receiverIds = this.Util.getIds(this.newCopy,'userId')
                receiverCompanyId = this.Util.getIds(this.newCopy,'companyId')
                url = type!=2?'/opinion':'/imchoices';

                params={id:this.dataObj.dossierTransferApplyId,receiverIds,auditerIds,receiverCompanyId,auditCompanyId,
                color:'#609df6',applyType:28,typeName:'archMoveApply',pageType:type,careOf:true,num:1}

                this.$router.push({path:url,query:params})
            },
            moreBtn(){
                this.isShow = true;
		        this.$forceUpdate();
            },
           appAndCopy:function(arr,type){
                if(!type) type='userId'
                let str = '';
                for(let i=0;i<arr.length;i++){
                        let obj = arr[i]
                        str = str + "|" + obj[type]
                }
                return str.slice(1);
            },
            revocation:function(){
                let that = this;
                this.isDialog = false;
                this.axios.post('/work/audit'+this.Service.queryString({
                    applyId:this.dataObj.dossierTransferApplyId,
                    type:1,
                    applyType:28,
                })).then(function(res){
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                        }else{
                            window.location.href = "epipe://?&mark=workUpdate";
                            that.$toast('撤销成功！')
          
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=tripDetails&_id="+that.dataObj.dossierTransferApplyId+'&data='+JSON.stringify({text:1});;
                            },500)     
                        } 
                    })
            },
            goAddress:function(index){ //公出地点跳转
                 this.$router.push({path:'/addressMap',query:{
                     lon:this.dataObj.tripList[index].lon,
                     lat:this.dataObj.tripList[index].lat,
                     outsideAddress:this.dataObj.tripList[index].destination,
                     detailAdress:this.dataObj.tripList[index].detailAddress,
                     bgColor:'#609df6'
                     }})
            },
            go_fildDetails: function (url) { //查看图片详情
                let that = this;
                let obj = {index_num: 0, data:[url],type:0}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
             accessoryFors:function(datas){
                 console.log(datas)
               if(!datas||datas.url==null) return false
               let urlArr = datas.url.split('|')
               let fileSizeArr = datas.fileSize.split('|')
               let fileNameArr = datas.fileName.split('|')
               let arrs = [];
                for(let i=0;i<urlArr.length;i++){
                    let bool = this.Util.isImg(urlArr[i])
                    arrs.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i],
                        isImg: bool,
                    })
                }
                return arrs
            },
            go_imchoice:function(num){
                this.$router.push({path: 'imchoices', query: {bgcolor:'#609df6',num:num}})
            },
             removeCopy:function(index){
                this.newCopy.splice(index, 1);
                this.change_man(this.newCopy)
            },
            removeApp:function(index){
                this.newAppr.splice(index,1)
                this.change_man(this.newCopy)
            },
             go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
            },
            // computed: mapState(["chosed_man_state","approver_man_state"])
        },
        created() {
            console.log(5555)
        },
        mounted:function(){

            let that = this;
            let archMoveApplyId = this.$route.query.archMoveApplyId;
            console.log(archMoveApplyId,'id')
            let pusthId = this.$route.query.pushId

            this.axios.get('work/dossierTransferApply/info?dossierTransferApplyId='+archMoveApplyId+'&pushId='+pusthId+'&type=1').then((res)=>{
                that.dataObj = res.data.b;
                console.log(that.dataObj,'data')
                that.accessory = that.accessoryFors(that.dataObj.accessory)
                that.title = that.dataObj.username+'的档案移交申请'
          
              let arr=  that.dataObj.links, newArr = [];

                    arr.forEach(item=>{
                        for(let i =0;i<item.auditers.length;i++){
                            if(item.auditers[i].accessory!=null){
                                    item.auditers[i].accessory = that.accessoryFors(item.auditers[i].accessory)
                            }
                        }
                    })

                    for(let i=0;i<arr.length;i++){
                        let ar = JSON.parse(JSON.stringify(arr[i]))
                        ar.auditers = [];
                        let data = arr[i].auditers;

                        if(arr[i].admins&&arr[i].admins.length){
                            let flow = arr[i]
                            flow.auditers = arr[i].admins;
                            flow.admins = [];
                            flow.linkType = 4;
                            arr.splice(i,0,flow)
                        }


                        data.forEach(item=>{
                            if(item.status!=='00'&&item.status!='0'){
                                item.flow = true;
                                newArr.push(item)
                            }else{
                                item.hide = true;
                                ar.auditers.push(item)
                            }

                            if(item.status=='0'){

                                ar.status = '0'
                            }
                        })

                        if(ar.auditers.length==1&&ar.auditers[0].status=='0'){
                            ar.auditers[0].flow = true
                            newArr.push(ar.auditers[0])
                        }else if(ar.auditers.length>0){
                            newArr.push(ar)
                        }

                        if(!arr[i].auditers.length&&(arr[i].approvalUserType==1||arr[i].approvalUserType==2)&&arr[i].approvalUserScope==2){
                            newArr.push(ar)
                        }
                        
                    }

                    for (let i = 0; i < newArr.length; i++) {

                        if(newArr[i].status&&newArr[i].status=='2'){
                            this.endIndex = i;
                            this.leaveType = '0';  //已经拒绝
                            
                        }
                    }
                    that.dataObj.links = newArr;

                    if(that.dataObj.auditUserId.indexOf(that.dataObj.userId)>-1&&that.dataObj.myselfApply!=1){
                        that.myself=true;
                        if(that.dataObj.auditStatus==0&&that.dataObj.myselfApply!='00'){
                            that.dataObj.myselfApply="0"
                        }
                    }

                     for (let i = 0; i <  this.dataObj.links.length; i++) {

                        if( this.dataObj.links[i].status&& this.dataObj.links[i].status=='2'){
                                this.endIndex = i;
                                this.leaveType = '0';  //已经拒绝
                            }
                    }

                    if(that.dataObj.auditStatus=='4'){
                        that.leaveType='5'
                        return;
                    }

                    if(that.dataObj.links[that.dataObj.links.length-1].status == 1){ // 已同意
                        that.leaveType = '1';
                        return;
                    }
                    if(that.dataObj.links[that.dataObj.links.length-1].status == 5){ // 已评论
                        that.leaveType = '6';
                        return;
                    }

                    if(that.dataObj.auditStatus == '3'){ //已经撤销
                        that.leaveType = '2'
                        return;
                    }
            })

        },
        activated(){
            this.newCopy = this.chosed_man_state;
            this.newAppr = this.approver_man_state;
         },
        filters:{
            details:function(value){
    
                if(value == '1'){
                    return '已同意'
                }else if(value =='0'){
                    return '已拒绝'
                }else if(value=='2'){
                    return '已撤销'
                }else if(value =='5'){
                    return '已退回'
                }
            },
            stateName: function(value){
                    return value=='0'?'审批中':value=='1'?'已同意':value=='2'?'已拒绝':'';
            },
            nameFor:function(value){
                if(!value) return ''
                let arr = value.split('|')
                return arr.join(',')
            },
          
        },
        computed: mapState(["chosed_man_state","approver_man_state"])
    }
</script>

<style scoped lang="stylus">

        .contractDescTitle{
            color:#666;
            font-size:0.15rem;
        }


        .reasonImg{
            overflow hidden;
            margin-top 0.1rem;
            height:0.32rem;

            li{
                float left;
                width 0.32rem;
                height 0.32rem;
                margin-right 0.1rem;
            }

            img{
                width:100%;
                height:100%;
            }
        }

        .dialog{
            position fixed;
            width 100%;
            height 100%;
            top 0;
            z-index 5;
            font-size 0.18rem;
            background-color rgba(0,0,0,0.5)

            .dialog_box{
                width 2.7rem;
                height 1.5rem;
                position absolute;
                left 0;
                right 0;
                top 0;
                bottom 0;
                margin auto;
                background #fff;
                text-align center;
            }

            .dialog_content{
                height 1rem;
                line-height 1rem;
                color #333;
                border-bottom 0.01rem solid #e6e6e6;
            }

            .dialog_btn{
                height 0.5rem;
                line-height 0.5rem;
                display flex;

                a{
                    flex  1;
                    touch-action:none;
                    cursor:pointer;
                }
            }

             .dialog_option{
                height 0.4rem;
                line-height 0.4rem;
                position relative;
                font-size:0.16rem;
            }

            .dialog_border{
                border 1px solid #f5f5f5
            }

            .confirm_btn{
                color #609df6;
            }
            .cancel_btn{
                ciolor #666;
            }
        }

        .content{
            margin-top 0.59rem;
            padding 0 0.15rem;
            // height: 6.4rem;
            // padding-bottom 0.5 rem;


            .styles{
                padding 0.15rem;
                margin-bottom 0.15rem;
              -webkit-box-shadow: 0 0 0.2rem rgba(96,157,246,.1);    
                 box-shadow 0 0 0.2rem rgba(96,157,264,.1);
                background-color #fff;
            }

            .imgHead{
                width 0.37rem;
                height 0.37rem;
                border-radius 50%; 
            }
        }

        .content_head{
            display flex;

            img{
                margin-right 0.1rem;
            }

            .nameTl{
                font-size 0.15rem;
                color #333;
                line-height 1em;
                margin-bottom 0.1rem;
            }

            .res{
                line-height 1em;
                font-size 0.14rem; 
                color #fd545c;               
            }

            .consent{
                 line-height 1em;
                font-size 0.14rem; 
                    color:#0fc37c;
                }

            .careOf{
                line-height 1em;
                font-size 0.14rem; 
                color:#f80;
            }
        }

        .infor{

            .infor-box{
                display flex;
                line-height:0.2rem;
                font-size 0.15rem;
                margin-bottom 0.03rem;
            }

            span{
                color #666;
                margin-right 0.15rem;
            }

            p{
                flex 1;
                color #333;
                width:2.4rem;
                word-wrap:break-word;
                word-break: break-all;
                text-align:left;
            }
        }


    .foot-box{
        height:0.55rem;
    }

    body{
        background-color:#f80;
    }

    .tripCount{
        margin-bottom:0.05rem;
        color:#609ef7;
    }

</style>
