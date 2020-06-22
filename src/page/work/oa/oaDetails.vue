<template>
    <div>
        <TopHead
        mark = 'mark'
        bgcolor = '#0fc37c'
        :title="title" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div style="height:0.49rem;" >
        </div>

        <div class="content">

            <div class="styles">
                <div class="content_head">
                    <img class="imgHead" :src="dataInfo.profileImg" @click="go_user(dataInfo.userId)">
                    <div>
                        <p class="nameTl">{{dataInfo.username}}</p>
                        <p :class="leaveType==2?'careOf':leaveType==0?'res':'consent'" v-if="leaveType!=''&leaveType!=3">{{leaveType |oa_details_status}}</p>
                        <p class="res" v-if="leaveType==3||leaveType==4">等待{{dataInfo.auditUserName}}的{{dataInfo | awaits}}</p>
                    </div>
                </div>
            </div>

            <div>
                <div class="styles infor">

                    <div v-for="item in dataInfo.list" :key="item.componentId" v-if="item.stringValue&&item.stringValue!=''">
                        <div class="infor-box" v-if="item.componentInfo.columnType!='9'">
                            <span>{{item.componentInfo.title}}</span>
                            <p>{{item.stringValue}}</p>
                        </div>
                        <div  v-if="item.componentInfo.columnType==9">
                            <p style="line-height:0.3rem;color:#666"> {{item.stringValue}}</p>
                        </div>
                        <div class="infor-box" v-if="item.componentInfo.columnType==7">
                            <span>{{item.componentInfo.secondTitle}}</span>
                            <p>{{item.secondStringValue}}</p>
                        </div>
                    </div>

                </div>
            </div>


            <AccessoryList :accessory='accessory'>
            </AccessoryList>

             <Approver
                :datas = dataInfo
                :endIndex = endIndex
                :refuseIndex = refuseIndex
             >
            </Approver>

            <Copy
             :dataObj = dataInfo
             :newCopy = newCopy
             v-on:remove = "removeCopy"
             color="#f80"

            > 
             </Copy> 
        </div>


        <OaBtn
            :dataObj = dataInfo
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
        <!-- <div style="width:100%;height:0.15rem;background-color:#fff"></div> -->

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


    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
    import AccessoryList  from '../../../components/oa/accessoryList.vue'  //附件
    import Approver  from '../../../components/oa/approver_details_template.vue'  // 审批人
    import Copy  from '../../../components/oa/copyDetails.vue'  // 抄送人

    import OaBtn  from '../../../components/oa/oa_btn.vue'  // 动作按钮
    import MoreBtn  from '../../../components/oa/more_btn.vue'  // 更多弹窗
    import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

    export default {
        data() {
            return {
                dataInfo:{},
                accessory:[],
                newCopy:[],


                refuseIndex :-1, //拒绝截止下标
                endIndex:999,
                leaveType:3,
                isDialog : false,
                isBackout:false,

                title:'',
                applyType:'',


            }
        },
        components: {
            TopHead,
            CopeMan,
            AccessoryList,
            Copy,
            Approver,
            OaBtn,
            MoreBtn,
            Dialog
        },
        mounted(){
            let applyId = this.$route.query.applyId?this.$route.query.applyId:'211741ad99a811ea88fa4ccc6ac12eca';
            this.axios.get('/process/apply/info?applyId='+applyId).then(res=>{
                this.dataInfo = res.data.b;

                this.accessory = this.accessoryFors(this.dataInfo.accessory)
                this.title = this.dataInfo.username+'的'+this.dataInfo.applyName;
               
                let arr=  this.dataInfo.links, newArr = [];

                    arr.forEach(item=>{
                        for(let i =0;i<item.auditers.length;i++){
                            if(item.auditers[i].accessory!=null){
                                    item.auditers[i].accessory = this.accessoryFors(item.auditers[i].accessory)
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
                    this.dataInfo.links = newArr;

                    if(this.dataInfo.auditUserId.indexOf(this.dataInfo.userId)>-1&&this.dataInfo.myselfApply!=1&&this.dataInfo.myselfApply!=3){
                        this.myself=true;
                        if(this.dataInfo.auditStatus==0&&this.dataInfo.myselfApply!='00'){
                            this.dataInfo.myselfApply="0"
                        }
                    }

                     for (let i = 0; i <  this.dataInfo.links.length; i++) {

                        if( this.dataInfo.links[i].status&& this.dataInfo.links[i].status=='2'){
                                this.endIndex = i;
                                this.leaveType = '0';  //已经拒绝
                            }
                    }

                    if(this.dataInfo.auditStatus=='4'){
                        this.leaveType='5'
                        return;
                    }

                    if(this.dataInfo.links[this.dataInfo.links.length-1].status == 1){ // 已同意
                        this.leaveType = '1';
                        return;
                    }
                    if(this.dataInfo.links[this.dataInfo.links.length-1].status == 5){ // 已评论
                        this.leaveType = '6';
                        return;
                    }

                    if(this.dataInfo.auditStatus == '3'){ //已经撤销
                        this.leaveType = '2'
                        return;
                    }
            })
        },
        methods: {
            ...mapMutations(['change_man','approver_man']),
            history_back_click(){
                window.location.href = "epipe://?&mark=history_back"
            },
            removeCopy(){
                this.newCopy.splice(index, 1);
                this.change_man(this.newCopy)
            },
            accessoryFors:function(datas){
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
            consent:function(type){//同意、转交
                let that = this,receiverIds='',auditerIds='',receiverCompanyId="",auditCompanyId="",url='',params={};
            console.log(this.dataInfo.links)
                if(type==2){
                auditerIds = this.Util.deliverIds(this.dataInfo.links,'userId')
                auditCompanyId = this.Util.deliverIds(this.dataInfo.links,'companyId')
                }
                receiverIds = this.Util.getIds(this.newCopy,'userId')
                receiverCompanyId = this.Util.getIds(this.newCopy,'companyId')
                url = type!=2?'/opinion':'/imchoices';


                params={id:this.dataInfo.applyId,receiverIds,auditerIds,receiverCompanyId,auditCompanyId,
                color:'#0fc37c',applyType:this.dataInfo.applyType,typeName:'MY_',pageType:type,careOf:true,num:1}
                  this.$router.push({path:url,query:params})

            },
            urge(){ //催办
                this.isBackout = false;
                let that = this;
                this.axios.post('/work/audit'+this.Service.queryString({
                        applyId:this.dataInfo.applyId,
                        type:6,
                        applyType:this.dataInfo.applyType,
                })).then(function(res){
                    if(res.data.h.code==200){
                        that.$toast('催办成功!')
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            },
            approveBack(){ //退回
                 this.$router.push({path:'/approveBack',query:{id:this.dataInfo.applyId,typeName:'MY_',applyType:this.dataInfo.applyType,color:'#0fc37c'}})
            },
            resubmit(){
                this.$router.replace({path:'/oaForm',query:{applyId:this.dataInfo.applyId,resubmit:1}})

            },
            revocation:function(){//撤销
                let that = this;
                this.isDialog = false;
                this.axios.post('/work/audit'+this.Service.queryString({
                    applyId:this.dataInfo.applyId,
                    type:1,
                    applyType:this.dataInfo.applyType,
                })).then(function(res){
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                        }else{
                            window.location.href = "epipe://?&mark=workUpdate";
                            that.$toast('撤销成功！')
          
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=oaDetails&_id="+that.dataInfo.applyId+'&data='+JSON.stringify({text:1});;
                            },500)     
                        } 
                    })
            },
            refuse:function(){
                 this.$router.push({path:'/opinion',query:{id:this.dataInfo.applyId,typeName:'',applyType:this.dataInfo.applyType,color:'#0fc37c'}})
            },
            moreBtn(){ //更多
                this.isShow = true;
                this.$forceUpdate();
            },
        },
        activated(){
            this.newCopy = this.chosed_man_state;
        },
        computed: mapState(["chosed_man_state","approver_man_state"])
    }
</script>

<style lang="stylus" scoped>

    .content{
        padding:0 0.15rem;
        padding-top:0.1rem;
        margin-bottom 0.8rem;

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

        .infor{

            .infor-box{
                display flex;
                line-height:0.2rem;
                font-size 0.15rem;
                margin-bottom 0.03rem;
            }

            span{
                width:0.8rem;
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
</style>