<template>
    <section>
        <TopHead
        mark= 'mark'
        bgcolor = '#ff8800'
        title="请示函" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">
            <div class="styles">
                <span class="title">主题</span>
                <input style="text-align:right;"  v-model="theme" placeholder="请输入主题"/>
            </div>
             <router-link :to="{ path:'/option', query: {indexs:letterIndex,type:'letter',color:'#ff8800',getType:1,title:'请示类别'}}" class="styles" tag="div">
                <div class="items">
                    请示类别
                    <p>
                        <span class="nullValue">{{letterType}}</span>
                    <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                    </svg>
                    </p>
                </div>
           </router-link>

            <div class="styles">
                <p class="title">请示函内容</p>
                <textarea v-model="content" name="" id="" maxlength="1000" cols="30" rows="10" placeholder="请输入请示函内容,限定1000字">

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
                color="#ff8800"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type = 3
            ></ApproverMan> -->

            <ApproMan 
              :approver_list="allApprovers"
              v-on:address="go_address"
              v-on:del_poeple="del_poeple"
              hintType=3
            ></ApproMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#ff8800"
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
    if(that.theme== ''){
        that.$toast('主题不能为空')
    }else if(that.theme.length<2||that.theme.length>100){
        that.$toast('主题内容需2~100字之间')
    }
    else if(that.letterIndex<0){
        that.$toast('请选择请示类别')
    }
    else if(that.content==''){
        that.$toast('请示函内容不能为空')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{
      

        let receiverIds = '',receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        params = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)
        fileObj = that.Util.fileFo(that.accessory)

        that.axios({
                method:"post",
                url:"/work/letter/save",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{Id :that.id, // id
                    theme:that.theme,//主题
                    letterType:that.letterIndex,
                    content:that.content.replace(/\n/g, '<br/>'), //请示函内容0
                    Url : fileObj.urlStr, //附件
                    fileName:fileObj.fileNameStr, 
                    fileSize:fileObj.fileSizeStr,
                    receiverIds, //抄送人
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
                       if(that.$route.query.letterId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitLetter&_id="+res.data.b;
                    },300)

                    localStorage.removeItem('letter')
                
                }
            }
      })
    }
}

import {mapState, mapMutations} from 'vuex';
import Accessory  from '../../components/worknews/accessory_select.vue'    //附件
import WorkButton  from '../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../components/worknews/copy_man.vue'    //抄送人
// import ApproverMan  from '../../components/worknews/approver_man.vue'    //审批人
import ApproMan  from '../../components/oa/approver_template.vue'    

import TopHead  from '../../components/topheader.vue'  //header导航栏
import Dialog  from '../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id:'',
                theme: '', //主题
                content:'',//内容
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[],
                isDraftFlag:0, //判断是不是草稿
                isShow:false,
                textNum : 0,  //请假输入字数
                oldData:null,
                letterType:'请选择',
                letterIndex:-1,
                addressListIndex:-1,
                showCopy:0,
                showGroup:false,
                applyLinkIds:'',
                allApprovers:[],
                linkAuditNum:'',
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
            if(!this.isUpdate()){
                 window.location.href = "epipe://?&mark=history_back"
            }else{
                this.isShow = true;
            }
        },
        lf_click(){
            this.isShow=false;
            if(this.$route.query.letterId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('letter',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('letter')
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
        check:function(){
            if(this.theme.length<6||this.theme.length>30){
                this.$toast('主题内容需6~30字之间')
                return false
            }
            if(this.content.length>1000){
                this.$toast('请示函内容不能超过1000字')
                return false
            }
            return true
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
                    if(strFilter.indexOf(strPostfix)>-1)
                    {
                        return true;
                    }
                }        
                return false;   

            },
        accessoryFor:function(data){
              if(!data.accessory) return false;
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
        },
        watch:{
            content : function(){
                if(this.content.length>1000){
                    this.$toast("最多输入1000字~")
                    return
                }
                this.textNum = this.content.length
            }
        },
        filters:{
          fileSize:function(value){
              value = value - 0
            var num =  parseInt(value)/1024/1024

            return num.toFixed(2)
          }  
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
         },
        created(){
             if(localStorage.getItem('letter')){
                let letterdata = JSON.parse(localStorage.getItem('letter'))
                for(let key in letterdata){
                    this.$data[key] = letterdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

             this.axios.get('/process/apply/enter?req=1').then((res)=>{
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

            eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                this.letterIndex = res.index;
                this.letterType = res.name;
            })
            this.oldData = JSON.parse(JSON.stringify(this.$data))
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
            if(this.$route.query.letterId){
                  
            this.axios.get('/work/letter/info',{
                params:{
                    type:that.$route.query.resubmit,
                    letterId:this.$route.query.letterId
                }
            }).then((res)=>{
                       let data = res.data.b.data[0];
                       if(!that.$route.query.resubmit){
                            that.id = data.letterId;
                        }
                        that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.theme = data.theme;
                        that.content = data.content.replace(/<br\/>/g,'\n');
                        that.theme = data.theme;
                        that.letterIndex = data.letterType;
                        that.letterType = data.letterTypeName; 
                        that.textNum = that.content.length;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
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
            padding 0 0.15rem;
            margin-bottom 0.15rem;
             -webkit-box-shadow: 0 0 0.2rem rgba(238,65,54,.1);    
             box-shadow 0 0 0.2rem rgba(238,65,54,.1);
             background-color #fff;
             overflow hidden

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

             input{
                 float right;
                 width 2.5rem;
                 height 0.44rem;
                 border none;
                 outline none;
                 font-size:0.14rem;
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

    .add-btn{
        display flex;

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
