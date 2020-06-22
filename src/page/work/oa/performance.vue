<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#609ef7'
        title="绩效考核" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom choose" >
                    <span class="title">绩效周期</span>
                    <input v-model="date" disabled placeholder="请输入绩效周期"/>
                </div>
                <div class="bor_bottom choose" >
                    <span class="title">考核人数</span>
                    <input v-model="num" disabled placeholder="请输入考核人数"/>
                </div>
                <div class="bor_bottom choose performance">
                    <div class="performance_title">
                        考核员工
                        <span  @click="to_more_members">
                             
                                {{num}}人<svg style="width: 0.12rem;height: 0.12rem;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-right"></use>
                                </svg>
                            </span>
                    </div>
                    <div class="performanceList">
                        <div v-for="(el,ind) in peopleData" :key="ind" class="performanceList_item" @click="to_people_info(ind)"> 
                            <img  :src="el.photo"/>
                            <span>{{el.name}}</span>
                        </div>
                    </div>

                    <div v-if="peopleData.length>15" style="text-align:center;line-height:0.3rem;margin-bottom:0.1rem;" @click="to_more_members">查看全部成员</div>
                </div>

            </div>

            <div class="styles input_group">

                <div class="bor_bottom">
                    <p class="title">备注</p>
                    <textarea v-model.trim="reason" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入备注,限定1000字">

                    </textarea>
                    <div class="record_box">
                            <span>{{reason.length}}/1000</span>
                    </div>
                </div>
            </div>


            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
             <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=10
            ></ApproMan>

            <CopeMan 
                :has_journal="!showCopy"
                color="#f80"
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

let save_leave = (index,text,that) =>{
    if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'userId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/performanceApply/save1",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    Id :that.id, // id
                    performanceCycle:that.date, 
                    assessNum:that.num, 
                    remarks:that.reason, 
                    sequenceId:that.sequenceId,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
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
                        if(that.$route.query.performanceId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitPerformance&_id="+res.data.b.performanceApplyId;
                        
                    },500)
                }
                that.change_man([])
            that.approver_man([])
                localStorage.removeItem('performance')
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
                sequenceId:'',
                data:'',
                num:'',
                reason:'',
                chosed_list : [], //抄送人
                approver_list : [], //审批人
                accessory : [],
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                isShow:false,
                addressListIndex:-1,
                showCopy:0,
                applyLinkIds:'',
                allApprovers:[],
                linkAuditNum:'',
                peopleData:[],
                oldData:[],
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
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
            let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            let flag = this.allApprovers[index].remarks=='0'?'1':null;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#609ef7',amount:flag,num:1,showGroup,}})

        },
        del_poeple(index,num){
            this.allApprovers[index].auditers.splice(num,1 )
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.performanceId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('performance',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('performance')
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
                    that.payDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                }
            },
            to_more_members(){
                this.$router.push({path:'/performanceList',query:{data:JSON.stringify(this.peopleData),id:this.$route.query.performanceId}})
            },
            to_people_info(index){
                this.$router.push({path:'/performanceInfo',query:{index,id:this.$route.query.performanceId}})

            },
             tiemF(timeStr){ //传入原生的时间格式化
                timeStr+=':00';
                timeStr = timeStr.split(/[- : \/]/);
                return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
             },
        },
         watch:{
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
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            
            this.chosed_list = this.chosed_man_state?this.chosed_man_state:[];

         },
         created() {
             if(localStorage.getItem('performance')){
                let performancedata = JSON.parse(localStorage.getItem('performance'))
                for(let key in performancedata){
                    this.$data[key] = performancedata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)

            }

            this.oldData = JSON.parse(JSON.stringify(this.$data))

            eventBus.$on('approver', res =>{
                this.allApprovers[res.approverIndex].isSelect = false;
                this.allApprovers[res.approverIndex].index = res.index;
                this.$set(this.allApprovers[res.approverIndex].auditers,0,this.allApprovers[res.approverIndex].approvealList[res.index])
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

            this.axios.get('/process/apply/enter?req=24').then((res)=>{
                let data = res.data.b;

                this.allApprovers = this.Util.approverDataInit(data.links);
                this.linkAuditNum = data.linkAuditNum;
                this.applyLinkIds = data.applyLinkIds;
                this.showCopy = data.approvalReceiverFlag=='1'?false:true;
                if(data.receivers&&data.receivers.length>0){
                        this.chosed_list = data.receivers?data.receivers:[];
                        this.change_man(this.chosed_list);

                }
            })

            this.axios.post('/user/current/userinfo').then((res)=>{
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })

            if(this.$route.query.performanceId){
                this.id = this.$route.query.performanceId;
                    this.axios.get('/work/performanceApply/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            performanceId:this.$route.query.performanceId
                            // performanceId:'c5186d129f1f11ea88fa4ccc6ac12eca',
                        }
                    }).then((res)=>{ 
                     let data = res.data.b;
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.date = data.performanceApplyInfoApp.performanceCycle;
                        that.num = data.performanceApplyInfoApp.assessNum;
                        that.sequenceId = data.performanceApplyInfoApp.sequenceId;
                        that.reason = data.performanceApplyInfoApp.performanceReason?data.performanceApplyInfoApp.performanceReason:'';
                        // this.peopleData = data.performanceApplyHr.result.data;
                        this.chosed_list = data.performanceApplyInfoApp.receivers?data.performanceApplyInfoApp.receivers:[];
                        this.change_man(this.chosed_list);

                        let arrs = data.performanceApplyHr.result.data;
                        arrs.forEach((item,index)=>{
                            this.peopleData.push({
                                photo:item.photo,
                                name:item.employee,
                                position:item.position,
                                index,
                            })
                        })

                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
                    return
            }
        },
        beforeDestroy() {
            eventBus.$off('leaveType');
            eventBus.$off('approver');
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
                 color:#666;
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

    

    .performance{

        &_title{
            line-height: 0.44rem;
            font-size: 0.15rem;
            color: #333;
            font-weight: bold;

            span{
                float:right;
                font-size:0.14rem;
                color:#808080;
            }
        }

    }


    .performanceList{
        display:flex;
        max-height:2rem;
        overflow:hidden;
        flex-wrap:wrap;
       
       &_item{
           text-align:center;
           width:20%;
           margin-bottom:0.1rem;

           img{
               width:0.32rem;
               height:0.32rem;
               border-radius:50%;
               display:block;
               margin 0 auto;
               margin-bottom:0.05rem;
           }

           span{
               display:block;
               color:#808080;
               font-size 0.14rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
           }
       }
    }


</style>
