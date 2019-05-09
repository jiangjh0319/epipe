<template>
    <section @click.prevent>
        <TopHead
        mark='mark'
        bgcolor = '#609df6'
        :title=title
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles">
                <div class="content_head">
                    <img class="imgHead" :src="dataObj.profileImg" @click="go_user(dataObj.userId)">
                    <div>
                        <p class="nameTl">{{dataObj.username}}</p>
                        <p  :class="leaveType==2?'careOf':leaveType==0?'res':'consent'" class="res" >{{leaveType |details}}</p>
                        <p class="res" v-if="leaveType==3||leaveType==4">{{'等待'+dataObj.auditUserName+'的审批'}}</p>
                    </div>
                </div>
            </div>
            <div class="styles infor">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.stampApplyTitle}}</p>
                </div>
            </div>
            <div class="styles infor">
                <div class="infor-box">
                    <span >用印部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>用印承办人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>文件名称</span>
                    <p class="line1">{{dataObj.fileName}}</p>
                </div>
                <div class="infor-box">
                    <span>文件类别</span>
                    <p>{{dataObj.fileCategory}}</p>
                </div>
                <div class="infor-box">
                    <span >文件数量</span>
                    <p>{{dataObj.fileQuqntity}} </p>
                </div>
                <div class="infor-box">
                    <span >印章名称</span>
                    <p>{{dataObj.sealName}}</p>
                </div>
            </div>

            <div class="styles">
                 <div class="">
                    <p class="h4">用印说明</p>
                    <p class="explain" v-html="dataObj.stampApplyReason"> 
                    </p>
                    
                </div>

            </div>

            <AccessoryList v-if="accessory" :accessory='accessory'>
            </AccessoryList>

            <Approver
             :dataObj = dataObj
             :refuseIndex = refuseIndex
             :newAppr = newAppr
             v-on:removeApp = "removeApp"
             color="#609df6"
             :amount='amount'
             >
            </Approver>

            <Copy
             :dataObj = dataObj
             :newCopy = newCopy
             v-on:remove = "removeCopy"
             color="#609df6"
            >
            </Copy>

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
          v-on:deliverTo="deliverTo"
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
    import {mapState, mapMutations} from 'vuex';
    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import AccessoryList  from '../../../components/oa/accessoryList.vue'  //附件
    import Approver  from '../../../components/oa/approverDetails.vue'  // 审批人
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
                accessory:[],
                titleColor:'#609df6',
                newCopy:[], //新增抄送人
                newAppr:[], //新增审批人
                titleType :'no',
                refuseSvgIndex:-1,
                mark :'marks',
                title:'',
                newCopy:[],
                newAppr:[],
                isShow:false,
                isBackout:false,
                amount:0,

            }
        },

        components:{
            TopHead,
            AccessoryList,
            Approver,
            Copy,
            OaBtn,
            MoreBtn,
            Dialog
        },
        methods :{
        ...mapMutations(['change_man','approver_man']),
            revocation:function(){  //撤销
                let that = this;
                let id = this.dataObj.stampId;
                  this.axios.post('/work/audit'+this.Service.queryString({
                            applyId:this.dataObj.stampId,
                            type:1,
                            applyType:5,
                        })).then(function(res){
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                        }else{
                            window.location.href = "epipe://?&mark=workUpdate";
                            that.$toast('撤销成功！')
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=stampDetails&_id="+that.dataObj.stampId+'&data='+JSON.stringify({text:1});;
                            },500)   
                        } 
                });
            },
             go_imchoice:function(num){
                this.$router.push({path: 'imchoices', query: {bgcolor:'#609df6',num:num}})
            },
            refuse(){  //拒绝
                this.$router.push({path:'/opinion',query:{id:this.dataObj.stampId,typeName:'stamp',applyType:5,color:'#609df6'}})
            },
             removeCopy:function(index){
                this.newCopy.splice(index, 1);
                this.change_man(this.newCopy)
            },
            removeApp:function(index){
                this.newAppr.splice(index, 1);
                this.approver_man(this.newAppr)
            },
             print(){//打印
                window.location.href = "epipe://?&mark=print&url="+location.href;
            },
            consent(){ //同意
                let that = this;
                let copyStr =  this.appAndCopy(this.newCopy);
                let apprStr = this.appAndCopy(this.newAppr,'auditUserId');
                this.$router.push({path:'/opinion',query:{id:this.dataObj.stampId,receiverIds:copyStr,auditerIds:apprStr,color:'#609df6',typeName:'stamp',applyType:5,pageType:'consent'}})
            },
            approveBack(){ //退回
                 this.$router.push({path:'/approveBack',query:{id:this.dataObj.stampId,typeName:'stamp',applyType:5,color:"#609df6"}})
            },
             deliverTo(){ //转交
                let newApprStr = this.appAndCopy(this.newAppr,'auditUserId')
                let newCopy = this.appAndCopy(this.newCopy)
                this.$router.push({path:'/imchoices',query:{id:this.dataObj.stampId,receiverIds:newCopy,bgcolor:'#609df6',careOf:true,typeName:'stamp',applyType:5,auditerIds:newApprStr,num:1}})
            },
            resubmit(){ //再次提交
                this.$router.replace({path:'/stamp',query:{stampId:this.dataObj.stampId,resubmit:1}})
            },
            urge(){ //催办
                this.isBackout = false;
                let that = this;
                this.axios.post('/work/audit'+this.Service.queryString({
                    applyId:this.dataObj.stampId,
                    type:6,
                    applyType:5,
                })).then(function(res){
                    if(res.data.h.code==200){
                        that.$toast('催办成功!')
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
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
             go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
            },
            go_imgdetail: function (index) { //查看图片详情
                let that = this;
                let obj = {index_num: index, data: that.dataObj.images,type:0}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
             },
            moreBtn(){ //更多
                this.isShow = true;
                this.$forceUpdate();
            },
            go_fildDetails: function (url) { //附件
                let that = this;
                let obj = {index_num: 0, data:[url],type:0}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
            },
             history_back_click(){
                  if(location.href.indexOf('goWork=0')>0){
                        window.location.href = "epipe://?&mark=history_back"
                        return
                    }
                window.location.href = "epipe://?&mark=goWork";
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
        },
        mounted:function(){
            let that = this;
            let stampId = this.$route.query.stampId
            let pusthId = this.$route.query.pushId
            this.axios.get('/work/stamp/info?stampId='+stampId+'&pushId='+pusthId).then(function(res){
                if(res.data.h.code === 200){
                    that.dataObj = res.data.b;
                    that.title = that.dataObj.username+'的用印审批';
                    that.accessory = that.accessoryFors(that.dataObj.accessory)
                    let arr=[];
                    for(let i =0;i<that.dataObj.auditers.length;i++){            
                        if(that.dataObj.auditers[i].status=='2'){
                            that.leaveType = '0';  //已经拒绝
                        }

                         if(that.dataObj.auditers[i].status=='00'){
                            arr.push(that.dataObj.auditers[i])
                        }else{
                            that.amount++;
                        }
                        
                        if(that.dataObj.auditers[i].accessory!=null){
                            that.dataObj.auditers[i].accessory = that.accessoryFors(that.dataObj.auditers[i].accessory)
                        }
                    }

                    that.newAppr = arr
                    that.approver_man(arr)

                    if(that.dataObj.userId==that.dataObj.auditUserId){
                        that.myself=true;
                         if(that.dataObj.auditStatus==0&&that.dataObj.myselfApply!='00'){
                            that.dataObj.myselfApply="0"
                        }
                    }

                     if(that.dataObj.auditStatus=='4'){
                            that.leaveType='5'
                            return;
                    }   

                    
                    if(that.dataObj.auditStatus == '3'){ //已经撤销
                        that.leaveType = '2'
                        that.refuseIndex = -2
                        return;
                    }
                    
                    if(that.dataObj.auditers[that.dataObj.auditers.length-1].status == 1){ // 已同意
                        that.leaveType = '1';
                        return;
                    }
                }
            })

        },
        activated(){
            this.newCopy = this.chosed_man_state;
            this.newAppr = this.approver_man_state;
         },
        filters:{
            dayNum : function(value){
                    if(!value) return;
                  return  value.indexOf('.5')>-1?Number(value).toFixed(1):parseInt(value)
            },
            stateName: function(value){
                    return value=='0'?'审批中':value=='1'?'已同意':value=='2'?'已拒绝':'';
            },
            timeStrSlice:function(value){
                return value?value.slice(0,-3):value;
            },
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
        },
        computed: mapState(["chosed_man_state","approver_man_state"])
    }
</script>

<style scoped lang="stylus">

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

        section {
            overflow-y hidden;
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

            .confirm_btn{
                color #0fc37c;
            }
            .cancel_btn{
                ciolor #666;
            }
        }
        .careOf{
            color:#f80
        }

        .content{
            margin-top 0.59rem;
            margin-bottom 0.7rem;
            padding 0 0.15rem;

            .styles{
                padding 0.15rem;
                margin-bottom 0.15rem;
                -webkit-box-shadow: 0 0 0.2rem rgba(96,157,246,.1);    
                box-shadow 0 0 0.2rem rgba(96,157,246,.1);
                background-color #fff;

                .h4{
                    color: #666;
                    margin-right: 0.15rem;
                    margin-bottom:0.1rem;
                }

                .explain{
                    word-wrap: break-word;
                    word-break: break-all;
                }
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


        .approve,.copy{

            .title{
                font-size 0.15rem;
                corlor #333;

                span{
                    font-size 0.13rem;
                    color #999;
                }
            }
        }


         .infor{

            .infor-box{
                display flex;
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


    .line1{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>

