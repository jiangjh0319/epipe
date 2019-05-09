<template>
    <section>
        
        <TopHead
        mark = 'mark'
        bgcolor='#f80'
        title="补卡" 
        v-on:history_back="history_back_click"
         ></TopHead>


        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title">文件标题</span>
                    <input placeholder="请输入文件标题"  v-model="absenceTitle" />
                </div>
                
                <div class="bor_bottom">
                    <span class="title">提交人</span>
                    <input placeholder="请输入提交人" disabled  v-model="userName" />
                </div>      
                
                <div class="">
                    <span class="title">所属部门</span>
                    <input placeholder="请输入所属部门" disabled  v-model="departmentName" />
                </div>      
            </div>

            <RepairTemplate v-for="(item,index) in datas"
            :key="index"
            :index = index
            :datas = item
            :length = datas.length
             @remove="removeData"
            v-on:setTime='setTime'
             >
            </RepairTemplate>
              <div class="addDiv styles" @click="addEvection" v-if="datas.length<3">
                + 增加补卡明细
              </div>
            <Accessory
                :accessory ='accessory'
            >
            </Accessory>
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#f80"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type= 8
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#f80"
                :data_list=chosed_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :types = '2'
                :isGroup = true
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
        
        <div class="modal" v-if="modalShow"  @touchmove.prevent>
            <div class="modal_box">
                <div class="modal_content" >
                    你已经提交{{num}}次补卡申请！每月只有{{absenceAmount}}次补卡机会。</div>
                <div class="modal_btn">
                    <a class="confirm_btn" @click="modalback">返回</a>
                   
                </div>
            </div>
        </div>

    </section>
</template>

<script>
let reg = /[\u4e00-\u9fa5]/g;
let save_leave = (index,text,that) =>{
    if(that.absenceTitle==''){
        that.$toast('文件标题不能为空')
    }
    else if(that.absenceTitle.length<2||that.absenceTitle.length>100){
        that.$toast('文件标题不能低于2个或超过100个字符')
    }
    else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else{

        for(let i=0;i<that.datas.length;i++){
            
            if(that.datas[i].absenceDate == '请选择日期'){
                that.$toast('请选择日期')
                return
            }else if(that.datas[i].absenceReason==''){
                that.$toast('请输入异常原因')
                return
            }else if(that.datas[i].absenceReason.length<6||that.datas[i].absenceReason.length>1000){
                that.$toast('你输入异常原因不能低于6个或超过1000个字符')
                return
            }
        }

        let approver_id = '',chosed_id = ''
        chosed_id = that.Util.people(that.isDraft,that.chosed_list,1).slice(1)

        approver_id = that.Util.people(that.isDraft,that.approver_list,2).slice(1)

        let fileObj = {}
        fileObj = that.Util.fileFo(that.accessory)


        let params = {
             Id : that.id, // id
            urls : fileObj.urlStr, //附件
            absenceTitle:that.absenceTitle, //标题
            fileNames : fileObj.fileNameStr, //文件名称s
            fileSizes : fileObj.fileSizeStr, //文件大小
            auditUserIds : approver_id, //审批人
            receiverIds : chosed_id, //抄送人
            draftFlag : index, //草稿还是发送
        }

        that.datas.forEach((item,index)=>{
            params['absenceList['+index+'].absenceDate'] = item.absenceDate
            params['absenceList['+index+'].absenceReason'] = item.absenceReason
        })

        that.axios({
                method:"post",
                url:"/work/absence/save",
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

        // that.axios.post('/work/absence/save' + encodeURI(that.Service.queryString(params))).then(function (res){

            if(res.data.h.code!=200){
                that.$toast(res.data.h.msg)
            }else if(res.data.h.code == 200){
                if(index){
                    that.$toast('已保存至草稿箱!')
                    setTimeout(()=>{

                         if(that.$route.query.absenceId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },500)
                }else{
                    that.$toast('提交成功!')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitAbsence&_id="+res.data.b.absenceApplyId;
                    },500)
                }
            }
            localStorage.removeItem('absence')
      })
    }
}
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import RepairTemplate  from '../../../components/oa/repairTemplate.vue'    //报销组件
import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id : '',
                absenceTitle : '', //标题
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[], //附件
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                departmentName:'',
                userName:'',
                surplus:3, //剩余补卡次数
                num:0,
                absenceAmount:3,
                isShow:false,
                modalShow:false,

                datas:[{
                    absenceDate : '请选择日期',  //报销日期
                    absenceReason : '',//报销明细描述
                }],
                oldData:null,
            }
        },
        components: {
            WorkButton,
            CopeMan,
            ApproverMan,
            TopHead,
            Accessory,
            RepairTemplate,
            Dialog
        },
        methods:{
        ...mapMutations(['change_man','approver_man',"remburseData"]),
        save_btn(){ //保存草
         save_leave(1, "存入草稿成功", this)
        },
        submit_btn(){ //提
            let num = this.absenceAmount - this.surplus 
                if((num + this.datas.length)>this.absenceAmount){
                 this.$toast('你已经提交'+num+'次补卡申请，每月只有'+this.absenceAmount+'次补卡机会')
                return false
            }

            save_leave(0, "提交成功", this)
        },
        lf_click(){

             this.isShow=false;
            if(this.$route.query.absenceId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('absence',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('absence')
            window.location.href = "epipe://?&mark=history_back"
        },
        isUpdate(){
            let data = this.$data;
            for(let key in data){
               if(key=='approver_list'||key=='chosed_list'||key=='accessory'||key=='datas'){
                    if(data[key].length!=this.oldData[key].length){
                        return true
                    }
                    for(let i=0;i<data[key].length;i++){
                        if((key=='approver_list'||key=='chosed_list')&&data[key][i].auditUserId!=this.oldData[key][i].auditUserId){
                            return true
                        }else if(key=='accessory'&&data[key][i].url!=this.oldData[key][i].url){
                            return true
                        }else if(key=='datas'&&data[key][i].absenceDate!=this.oldData[key][i].absenceDate){
                            return true
                        }
                    }
                }else if(key!='oldData'){
                    if(data[key]!=this.oldData[key]){
                            return true;
                    }
                }
            }
            return false
        },
        surplusNum(){
            let that = this;
            this.axios.get('/work/absence/limit').then(res=>{ //key总次数 value剩余次数
               if(res.data.h.code==200){
                  if(res.data.b==null){
                     that.absenceAmount = 999999;
                     that.surplus = 99999;
                  }else{
                        that.absenceAmount = parseInt(res.data.b.key)
                        that.surplus = parseInt(res.data.b.value)
                        that.num = that.absenceAmount - that.surplus;
                        if(res.data.b.value=='0'){
                            that.modalShow=true
                        }
                  }
               }
           })
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
        setTime(date,index){
            this.datas[index].absenceDate = date;
            this.$forceUpdate
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
        removeData(index){
            this.datas.splice(index,1)
            this.absence.splice(index,1)
            let arr = this.absence = this.absence
            this.remburseData(arr)
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
                if(!this.isUpdate()){
                     window.location.href = "epipe://?&mark=history_back"
                }else{
                    this.isShow = true;
                }
        },
        modalback(){
            this.modalShow = false;
            window.location.href = "epipe://?&mark=history_back"
        },
        addEvection(){ //添加行程明细
            if(!this.checkNum()) return false

           this.datas.push({
                    absenceDate : '请选择日期',  //报销日期
                    absenceReason : '',//报销明细描述
                });
        },
        checkNum(){
             let num = this.absenceAmount - this.surplus 
             if((num + this.datas.length)>this.absenceAmount-1){
                this.$toast('你已经提交'+num+'次补卡申请，每月只有'+this.absenceAmount+'次补卡机会')
                return false
            }
            return true
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
        created() {
            
            this.surplusNum()

            if(this.$route.query.absenceTime){
                this.datas[0].absenceDate = this.$route.query.absenceTime;
            }

            if(localStorage.getItem('absence')){
                let absencedata = JSON.parse(localStorage.getItem('absence'))
                for(let key in absencedata){
                    this.$data[key] = absencedata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

            this.oldData = JSON.parse(JSON.stringify(this.$data))

            let that = this;
            this.axios.get('/user/info').then(function(res){
                that.departmentName = res.data.b.officeName
                that.userName = res.data.b.name
                that.oldData = JSON.parse(JSON.stringify(that.$data))
            })
        },
        activated(){
            this.approver_list = this.approver_man_state
            this.chosed_list = this.chosed_man_state
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
            if(this.$route.query.absenceId){
                    this.axios.get('/work/absence/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            absenceApplyId:this.$route.query.absenceId
                        }
                    }).then(function(res){
                      let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.absenceApplyId;
                        }
                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.absenceTitle = data.absenceTitle;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list);
                        that.approver_list = data.auditers;
                        that.approver_man(that.approver_list);
                        let arr = [];
                        data.absenceList.forEach((item,i) =>{
                             arr.push({
                                absenceDate : item.absenceDate.slice(0,-3),  //报销日期
                                absenceReason : item.absenceReason,//报销明细描述
                            })
                        })

                        that.datas = arr;
                        that.oldData = JSON.parse(JSON.stringify(that.$data))
                    })
            }
        },
        computed:{
            ...mapState(["chosed_man_state","approver_man_state","absence"]),
            amount:function(){

                let count = 0 ;

                this.datas.forEach(item =>{
                    count+= (item.absenceAmount - 0)
                })

                return count
            },
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

    .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 5;
    font-size: 0.16rem;
    background-color: rgba(0, 0, 0, 0.5);

    .modal_box {
        width: 2.7rem;
        height: 1.5rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: #fff;
        text-align: center;
        border-radius 0.06rem;
    }

    .modal_content {
        height: 1rem;
        color: #333;
        padding:0.15rem;
        line-height:0.3rem;
        box-sizing:border-box;
        border-bottom: 0.01rem solid #e6e6e6;
    }

    .modal_btn {
        height: 0.5rem;
        line-height: 0.5rem;
        display: flex;

        a {
            flex: 1;
            touch-action: none;
            cursor: pointer;
        }
    }

    .confirm_btn {
        color: #0fc37c;
        border-right 0.01rem solid #e6e6e6;
    }

    .cancel_btn {
        ciolor: #666;
    }
}



</style>
