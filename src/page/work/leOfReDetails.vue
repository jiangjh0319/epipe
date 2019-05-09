<template>
    <section>
        <TopHead
        mark='mark'
        bgcolor = '#f80'
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
                    <span>主&emsp;&emsp;题</span>
                    <p>{{dataObj.theme}}</p>
                </div>
          
                <div class="infor-box">
                    <span>请示内容</span>
                    <p v-html="dataObj.content"></p>
                </div>
                
            </div>

            <AccessoryList :accessory='accessory'>

            </AccessoryList>

            <Approver
             :dataObj = dataObj
             :refuseIndex = refuseIndex
             :newAppr = newAppr
             v-on:removeApp = "removeApp"
             color='#f80'
             :amount='amount'
             >
            </Approver>

            <Copy
             color='#f80'
             :dataObj = dataObj
             :newCopy = newCopy
             v-on:remove = "removeCopy"
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
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    import CopeMan  from '../../components/worknews/copy_man.vue'    //抄送人
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
                titleColor:'#fd545c',
                titleType :'no',
                refuseSvgIndex:-1,
                mark :'marks',
                accessory:[],
                letterId:'',
                newCopy:[],
                newAppr:[],
                isShow: false,
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
            ...mapMutations(['change_man',"approver_man"]),
            refuse:function(){
                 this.$router.push({path:'/opinion',query:{id:this.dataObj.letterId,typeName:'leOfRe',applyType:1,color:'#ff8800'}})
            },
            history_back_click:function(){
                    if(location.href.indexOf('goWork=0')>0){
                        window.location.href = "epipe://?&mark=history_back"
                        return
                    }
                    window.location.href = "epipe://?&mark=goWork"
            },
            consent:function(){
               let that = this;
               let copyStr =  this.appAndCopy(this.newCopy)
               let apprStr = this.appAndCopy(this.newAppr,'auditUserId')

                this.$router.push({path:'/opinion',query:{id:this.dataObj.letterId,receiverIds:copyStr,auditerIds:apprStr,color:'#ff8800',typeName:'leOfRe',applyType:1,pageType:'consent'}})
            },
            deliverTo(){ //转交
                let newApprStr = this.appAndCopy(this.newAppr,'auditUserId')
                let newCopy = this.appAndCopy(this.newCopy)
                this.$router.push({path:'/imchoices',query:{id:this.dataObj.letterId,receiverIds:newCopy,bgcolor:'#f80',careOf:true,typeName:'leOfRe',applyType:1,auditerIds:newApprStr,num:1}})
            },
            print(){//打印
                window.location.href = "epipe://?&mark=print&url="+location.href;
            },
            approveBack(){ // 退回
                 this.$router.push({path:'/approveBack',query:{id:this.dataObj.letterId,typeName:'leOfRe',applyType:1,color:'#f80'}})
            },
            resubmit(){ //再次提交
                 this.$router.replace({path:'/letterOfRequest',query:{letterId:this.dataObj.letterId,resubmit:true}})
            },
            urge(){ //催办
                    this.isBackout=false;
                    let that = this;
                    this.axios.post('/work/audit'+this.Service.queryString({
                            applyId:this.dataObj.letterId,
                            type:6,
                            applyType:1,
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
             moreBtn(){
                this.isShow = true;
		        this.$forceUpdate();
            },
            revocation:function(){
                let that = this;
                    this.axios.post('/work/audit'+this.Service.queryString({
                        applyId:this.dataObj.letterId,
                        type:1,
                        applyType:1,
                    })).then(function(res){
                        if(res.data.h.code!=200){
                            that.$toast(res.data.h.msg)
                        }else if(res.data.h.code==200){
                                window.location.href = "epipe://?&mark=workUpdate";
                            that.$toast('撤销成功！')
                            window.location.href = "epipe://?&mark=workUpdate";
                            setTimeout(()=>{
                                //   location.reload()
                                window.location.href = "epipe://?&mark=leOfReDetails&_id="+that.dataObj.letterId+'&data='+JSON.stringify({text:1});;
                                
                            },500)    
                        }
                })
            },
            go_fildDetails: function (url) { //查看图片详情
                let that = this;
                let obj = {index_num: 0, data:[url],type:0}
                window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
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
            go_imchoice:function(num){
                this.$router.push({path: 'imchoices', query: {bgcolor:this.color,num:num}})
            },
            removeCopy:function(index){
                this.newCopy.splice(index, 1);
                this.change_man(this.newCopy)
            },
            removeApp:function(index){
                this.newAppr.splice(index, 1);
                this.approver_man(this.newAppr)
            },
             go_user(id){
                window.location.href = "epipe://?&mark=userinfo&_id="+id;
            },
            // computed: mapState(["chosed_man_state","approver_man_state"])
        },
        mounted:function(){
            let that = this;
            this.letterId = this.$route.query.letterId;
            let pusthId = this.$route.query.pushId
            this.axios.get('/work/letter/info?letterId='+this.letterId+'&pushId='+pusthId).then(function(res){
                that.dataObj = res.data.b.data[0]
                that.accessory = that.accessoryFors(that.dataObj.accessory)
                that.title = that.dataObj.username+'的请示函'
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

                    if(that.dataObj.auditers[that.dataObj.auditers.length-1].status == 1){ // 已同意
                        that.leaveType = '1';
                        return;
                    }

                    if(that.dataObj.auditStatus == '3'){ //已经撤销
                        that.leaveType = '2'
                        return;
                    }
            })

        },
        activated(){
            this.newCopy = this.chosed_man_state
            this.newAppr = this.approver_man_state;
         },
        filters:{
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

        .content{
            margin-top 0.59rem;
            padding 0 0.15rem;
             overflow: scroll;
            margin-bottom 0.5rem;

            .styles{
                padding 0.15rem;
                margin-bottom 0.15rem;
              -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
                 box-shadow 0 0 0.2rem rgba(255,136,0,.1);
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

        .approve{

            .approve_list{
                display flex;
            
                img{
                    margin-right 0.1rem;
                }
            }

            .approve_inf{
                flex 1;
                line-height 0.37rem;
                font-size 0.14rem;

                span:first-child{
                    float left;
                    font-size 0.15rem;
                    color #333;
                    width:0.7rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

                span:last-child{
                    float right;
                    color #666;
                    width:1.25rem;
                    height:100%;
                }

                .refause{
                    color:#fd545c;
                }

                .consent{
                    color:#0fc37c;
                }

                .careOf{
                    color:#f80;
                }
            }

            .icon-back{
                transform rotate(90deg)
                margin 0.1rem;
            }

            p{
                margin-bottom 0.15rem;
            }

            .reason{
                font-szie 0.14rem;
                color #666;
                line-height 0.2rem;
                margin 0.1rem 0;
                word-wrap:break-word;
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

        }

        .copy{

            .list{
                overflow hidden;

                img{
                    display block;
                    margin 0 auto;
                    margin-bottom 0.1rem;
                }
            }

            .list li:nth-child(5),.list li:nth-child(10),
            .list li:nth-child(15),.list li:nth-child(20),
            .list li:nth-child(25),.list li:nth-child(30){
                    margin-right:0;
            }
            
            .list_item{
                float left;
                font-size 0.13rem;
                color #333;
                text-align center;
                margin 0 0.12rem;
                margin-top 0.15rem;

                span{
                    display inline-block
                    width 0.4rem;
                    height:0.15rem;
                    line-height 0.15rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .btn_box{
            position fixed;
            width:100%;
            bottom 0px;
            box-sizing border-box;

            .btn_box_content{
            background-color #fff;
            display flex;
            text-align center;
            }

            .revocation_btn:after{
                display block;
                content '';
                position absolute;
                height 1px;
                width 200%;
                top 0;
                left -50%;
                transform scale(0.5);
                background-color #ccc;
                z-index 5
            }
            
            .revocation_btn{
                position relative;
                width:100%;
                text-align:center;
                height 0.5rem;
                font-size 0.18rem;
                color #666;
                line-height 0.5rem;
                letter-spacing 0.05rem;
                background-color #fff;
            }

            .consent_btn,.refuse_btn,.deliver_btn{
                flex 1;
                height 0.5rem;
                color #fff; 
                line-height 0.5rem;
                font-size 0.18rem;
                text-align center
            }

            .consent_btn{
                background-color: #0fc37c;
                border:1px solid #0fc37c;
            }

            .refuse_btn{
                position relative;
                margin-right 0
                border 1px solid #fd545c;
                background-color:#fd545c;
            }

            .deliver_btn{
                background-color:#609ef7;
                border:1px solid #609ef7;
            }
        }

        .accessory{

            li{
                display:flex;
                margin-bottom 0.1rem;
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

      .newList{
            position relative;

            svg{
                position absolute;
                left 0.32rem;
                top -0.05rem;
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
 .accessory li:last-child{
        margin-bottom:0;
    }
</style>

