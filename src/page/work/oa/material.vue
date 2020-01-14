<template>
    <section>
        
        <TopHead
        mark = 'mark'
        bgcolor='#f80'
        title="物品领用" 
        v-on:history_back="history_back_click"
         ></TopHead>

        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title"><a>*</a>物品用途</span>
                    <input placeholder="请输入物品用途"  v-model="materialReceiveTheme" />
                </div>
                
            </div>

            <div class="styles input_group" v-for="(item,index) in material" :key="item.id">
                <div class="control" v-show="material.length>1">
                    <span>物品明细({{index+1}})</span>
                    <span style="color:#fd545c" @click.stop="remove(index)">删除</span>
                </div>
                <div class="bor_bottom">
                    <span class="title"><a>*</a>物品名称</span>
                    <input placeholder="请输入物品名称"  v-model="item.materialName" />
                </div>
                
                <div class="">
                    <span class="title">数量</span>
                    <input placeholder="请输入数量" type="number"   v-model="item.num" />
                </div>
            </div>


              <div class="addDiv styles" v-if="material.length<5" @click="addEvection" >
                + 增加物品明细
              </div>

             <div class="styles" style="padding:0 0.15rem;">
                 <p class="title">领用详情</p>
                    <textarea v-model.trim="materialReceiveRemarks" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入领用详情,限定1000字">

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
                color="#f80"
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
let reg = /[\u4e00-\u9fa5]/g;
let save_leave = (index,text,that) =>{
    if(that.materialReceiveTheme==''){
        that.$toast('物品用途不能为空')
    }else if(that.materialReceiveTheme.length<2||that.materialReceiveTheme.length>100){
        that.$toast('物品用途不能低于2个或超过100个字符')
    }else if(that.materialReceiveRemarks!=''&&(that.materialReceiveRemarks.length<6||that.materialReceiveRemarks.length>1000)){
        that.$toast('领用详情不能低于6个或超过1000个字符')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{

        for(let i=0;i<that.material.length;i++){
            
            if(that.material[i].materialName==''){
                that.$toast('请输入名称')
                return
            }else if(that.material[i].materialName.length<2||that.material[i].materialName.length>30){
                that.$toast('物品名称不能少于2个或超过30字')
            }
        }

         let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        // auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        // auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')
        fileObj = that.Util.fileFo(that.accessory)

     let   appObj = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)


         params = {
            Id : that.id, // id
            urls : fileObj.urlStr, //附件
            materialReceiveTheme:that.materialReceiveTheme, //
            materialReceiveRemarks:that.materialReceiveRemarks,
            fileNames : fileObj.fileNameStr, //文件名称s
            fileSizes : fileObj.fileSizeStr, //文件大小
            auditUserIds:appObj.userIdsStr, //审批人
            applyLinkIds:that.applyLinkIds,

            receiverIds, //抄送人
            auditCompanyIds:appObj.companyIdsStr,
            linkAuditNum:appObj.numStr,
            receiverCompanyIds,
            draftFlag : index, //草稿还是发送
        }

        that.material.forEach((item,index)=>{
            params['list['+index+'].materialName'] = item.materialName
            params['list['+index+'].num'] = item.num?item.num:''
        })

        that.axios({
                method:"post",
                url:"/work/material/save",
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

        // that.axios.post('/work/reimburse/save' + encodeURI(that.Service.queryString(params))).then(function (res){

            if(res.data.h.code!=200){
                that.$toast(res.data.h.msg)
            }else if(res.data.h.code == 200){
                if(index){
                    that.$toast('已保存至草稿箱!')
                    setTimeout(()=>{

                         if(that.$route.query.materialId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },500)
                }else{
                    that.$toast('提交成功!')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitMaterial&_id="+res.data.b.materialReceiveApplyId;
                    },500)
                }
            }
            localStorage.removeItem('material')
      })
    }
}
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import ReiTemplate  from '../../../components/worknews/reiTemplate.vue'    //报销组件
import ApproMan  from '../../../components/oa/approver_template.vue'    //审批人
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id : '',
                materialReceiveTheme : '', //标题
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[], //附件
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                materialReceiveRemarks:'',

                material: [{materialName:'',num:''}], //
                departmentName:'',
                userName:'',
                isShow:false,
                oldData:null,
                allApprovers:[],
                addressListIndex:-1,
                showCopy:0,
                applyLinkIds:'',
                linkAuditNum:'',

            }
        },
        components: {
            WorkButton,
            CopeMan,
            ApproMan,
            TopHead,
            Accessory,
            ReiTemplate,
            Dialog
        },
        methods:{
        ...mapMutations(['change_man','approver_man',]),
        save_btn(){ //保存草
         save_leave(1, "存入草稿成功", this)
        },
        submit_btn(){ //提
            save_leave(0, "提交成功", this)
        },
        lf_click(){

             this.isShow=false;
            if(this.$route.query.materialId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('material',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('material')
            window.location.href = "epipe://?&mark=history_back"
        },
        go_address(index){
            this.addressListIndex = index
            this.approver_list =  this.allApprovers[index].auditers;
            this.approver_man(this.approver_list)
            let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
            this.$router.push({path: 'imchoices', query: {bgcolor:'#f80',num:1,amount:1,showGroup,}})

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
        remove(index){
          this.material.splice(index,1)
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
        history_back_click:function(){
                // window.location.href = "epipe://?&mark=history_back&url=myApply"
                if(!this.Util.isUpdate(this.$data,this.oldData)){
                     window.location.href = "epipe://?&mark=history_back"
                }else{
                    this.isShow = true;
                }
        },
        tiemF(timeStr){
            timeStr+=':00';
            timeStr = timeStr.split(/[- : \/]/);
            return new Date(timeStr[0],timeStr[1]-1,timeStr[2],timeStr[3],timeStr[4])
        },
        addEvection(){ //添加行程明细
           this.material.push({
                    num : '',
                    materialName : '',
                });
        },
        },
        filters:{
          fileSize:function(value){
                 value = value - 0
                var num =  parseInt(value)/1024/1024
                return num.toFixed(2)
          },
          times:function(value){
              if(value=='请选择') return value
              return value.slice(0,10)
          }
        },
        watch: {
             materialReceiveRemarks : function(){
                if(this.materialReceiveRemarks.length>1000){
                    this.$toast("最多输入1000字~")
                    this.materialReceiveRemarks = this.materialReceiveRemarks.slice(0,1000)
                    return
                }
                this.textNum = this.materialReceiveRemarks.length
            },
        },
        created() {
            if(localStorage.getItem('material')){
                let materialdata = JSON.parse(localStorage.getItem('material'))
                for(let key in materialdata){
                    this.$data[key] = materialdata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }
            this.oldData = JSON.parse(JSON.stringify(this.$data))
            let that = this;

            if(that.$route.query.resubmit!='1'){

                this.axios.get('/process/apply/enter?req=21').then((res)=>{
                    let data = res.data.b;

                    this.allApprovers = data.links;
                    this.linkAuditNum = data.linkAuditNum;
                    this.applyLinkIds = data.applyLinkIds;
                    this.showCopy = data.approvalReceiverFlag=='1'?false:true;

                    if(data.receivers.length>0){
                            this.chosed_list = data.receivers
                            this.change_man(this.chosed_list);
                    }
                })
            }
            
        },
        activated(){
            // this.approver_list = this.approver_man_state
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state
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
            if(this.$route.query.materialId){
                   this.axios.get('/work/material/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            materialReceiveApplyId:this.$route.query.materialId
                        }
                    }).then(function(res){ 
                   let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.materialReceiveId;
                        }

                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.materialReceiveTheme = data.materialReceiveTheme;
                        that.materialReceiveRemarks = data.materialReceiveRemarks;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list)
                        that.material = data.list
                        that.allApprovers = data.links;

                        that.textNum = data.materialReceiveRemarks.length;

                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
            }
        },
        computed:{
            ...mapState(["chosed_man_state","approver_man_state",]),
         
        } 

        
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
                 color:#666;
             }

             a{
                 color:#fd545c;
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

.content .control{
        background-color: #f5f5f5;
        padding 0;
        font-size:0.15rem;
        padding-bottom:0.08rem;

        span:first-child{
            float:left;
            color:#609df6;
        }

        span:last-child{
            float:right;
        }
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

    .amount{
        float:right;
        line-height 0.44rem;
    }



</style>
