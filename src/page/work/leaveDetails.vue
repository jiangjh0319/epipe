<template>
    <section @click.prevent>
        <TopHead
        mark='mark'
        bgcolor = '#fd545c'
        :title=title
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles">
                <div class="content_head">
                    <img class="imgHead" :src="dataObj.profileImg" @click="go_user(dataObj.userId)">
                    <div>
                        <p class="nameTl">{{dataObj.username}}</p>
                        <p :class="leaveType==2?'careOf':leaveType==0?'res':'consent'" >{{leaveType |details}}</p>
                        <p class="res" v-if="leaveType==3||leaveType==4">{{'等待'+dataObj.auditName+'的审批'}}</p>
                    </div>
                </div>
            </div>
            <div class="styles infor">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >部&emsp;&emsp;门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>请假类型</span>
                    <p>{{dataObj.leaveType}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{dataObj.beginTime|timeStrSlice}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{dataObj.endTime |timeStrSlice}}</p>
                </div>
                <div class="infor-box">
                    <span >时&emsp;&emsp;长</span>
                    <p>{{dataObj.leaveDuration|dayNum}} 天</p>
                </div>
                <div class="infor-box">
                    <span>请假事由</span>
                    <p v-html="dataObj.reason"> 
                    </p>
                </div>
            </div>

            <AccessoryList :accessory='accessory'>

            </AccessoryList>

            <Approver
             :dataObj = dataObj
             :refuseIndex = refuseIndex
             :newAppr = newAppr
             v-on:removeApp = "removeApp"
             color ='#fd545c'
             :amount='amount'
             >
            </Approver>

            <Copy
             :dataObj = dataObj
             :newCopy = newCopy
             v-on:remove = "removeCopy"
             color='#fd545c'
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
          :myself='myself'
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
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    import AccessoryList  from '../../components/oa/accessoryList.vue'  //附件
    import Approver  from '../../components/oa/approverDetails.vue'  // 审批人
    import Copy  from '../../components/oa/copyDetails.vue'  // 抄送人
    import OaBtn  from '../../components/oa/oa_btn.vue'  // 动作按钮
    import MoreBtn  from '../../components/oa/more_btn.vue'  // 更多弹窗
    import Dialog  from '../../components/oa/dialog.vue'    //弹窗


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
                titleColor:'#fd545c',
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
                myself:false,
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
                let id = this.dataObj.leaveId;
                this.axios.post('/work/audit'+this.Service.queryString({
                            applyId:this.dataObj.leaveId,
                            type:1,
                            applyType:0,
                    })).then(function(res){
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                        }else{
                            window.location.href = "epipe://?&mark=workUpdate";
                            that.$toast('撤销成功！')
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=leaveDetails&_id="+that.dataObj.leaveId+'&data='+JSON.stringify({text:1});;
                            },500)   
                        } 
                });
            },
            refuse(){  //拒绝
                this.$router.push({path:'/opinion',query:{id:this.dataObj.leaveId,color:'#fd545c',applyType:0,typeName:'leave'}})
            },
             removeCopy:function(index){
                this.newCopy.splice(index, 1);
                this.change_man(this.newCopy)
            },
            removeApp:function(index){
                this.newAppr.splice(index, 1);
                this.approver_man(this.newAppr)
            },
            consent(){ //同意
                let that = this;
                let copyStr =  this.appAndCopy(this.newCopy);
                let apprStr = this.appAndCopy(this.newAppr,'auditUserId');
                this.$router.push({path:'/opinion',query:{id:this.dataObj.leaveId,receiverIds:copyStr,auditerIds:apprStr,color:'#fd545c',applyType:0,typeName:'leave',pageType:'consent'}})
            },
            resubmit(){
                 this.$router.replace({path:'/leave',query:{leaveId:this.dataObj.leaveId,resubmit:1}})
            },
            print(){//打印
                window.location.href = "epipe://?&mark=print&url="+location.href;
            },
            urge(){ //催办
                    this.isBackout=false;
                    let that = this;
                    this.axios.post('/work/audit'+this.Service.queryString({
                            applyId:this.dataObj.leaveId,
                            type:6,
                            applyType:0,
                    })).then(function(res){
                        if(res.data.h.code==200){
                            that.$toast('催办成功')
                        }else{
                            that.$toast(res.data.h.msg)
                        }
                    })
            },
            approveBack(){ //退回
                 this.$router.push({path:'/approveBack',query:{id:this.dataObj.leaveId,applyType:0,color:"#fd545c"}})
            },
             deliverTo(){ //转交
                let newApprStr = this.appAndCopy(this.newAppr,'auditUserId')
                let newCopy = this.appAndCopy(this.newCopy)
                this.$router.push({path:'/imchoices',query:{id:this.dataObj.leaveId,receiverIds:newCopy,careOf:true,applyType:0,typeName:'leave',auditerIds:newApprStr,num:1,bgcolor:'#fd545c'}})
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
            go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
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
            let leaveId = this.$route.query.leaveId
            let pusthId = this.$route.query.pushId
            this.axios.get('/work/leave/apply/info?leaveId='+leaveId+'&pushId='+pusthId).then(function(res){
                if(res.data.h.code == 200){
                    that.dataObj = res.data.b.data[0];
                    that.title = that.dataObj.username+'的请假审批';
                    that.accessory = that.accessoryFors(that.dataObj.accessory)
                    let arr = []
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
                        return;
                    }
                    
                    if(that.dataObj.auditers[that.dataObj.auditers.length-1].status == 1){ // 已同意
                        that.leaveType = '1';
                        return;
                    }

                }else{
                    that.$toast(res.data.h.msg)
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
                -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
                box-shadow 0 0 0.2rem rgba(238,65,54,.1);
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
            .reasons{
                position relative;
                padding-left 0.48rem;
                font-szie 0.14rem;
                color #666;
                min-height:0.2rem;
                line-height 0.2rem;
                margin 0.1rem 0;
                word-wrap:break-word;

                svg{
                    position:absolute;
                    top:0;
                    left:0.1rem;
                    bottom:0;
                    margin:auto !important;

                }
            }

        .newCopy{
            position relative;

            svg{
                position absolute;
                top:-0.07rem;
                right:-0.07rem;
            }
        }

        .newList{
            position relative;

            svg{
                position absolute;
                left 0.32rem;
                top -0.05rem;
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
                color #0fc37c;
            }
            .cancel_btn{
                ciolor #666;
            }
        }


</style>

