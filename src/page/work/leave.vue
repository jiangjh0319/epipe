<template>
    <section>
        <TopHead
        mark = 'mark'
        bgcolor = '#fd545c'
        title="请假" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div class="content">          
            <router-link :to="{ path:'/option', query: {indexs:leaveIndex,type:'leave',color:'#fd545c'}}" class="styles" tag="div">
                <div class="items">
                    请假类型
                    <p>
                        <span class="nullValue">{{leaveName}}</span>
                    <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                    </svg>
                    </p>
                </div>
           </router-link>
            <div class="styles inp_ul">
                <div class="items" @click="getTime(0)">
                    开始时间
                    <p >
                        <span class="nullValue">{{beginTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>

                <div class="items" @click="getTime(1)">
                    结束时间
                    <p >
                        <span class="nullValue">{{endTime}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
                <div class="items leaveTime">
                    时长 <span style="font-size:0.12rem;color:#999">（以0.5为单位）</span>
                    <p>
                        <input type="number" v-model="leaveDay">
                        <span class="nullValue">
                            天
                            </span>
                        <svg class="icon icon-back" aria-hidden="false">
                            <use href=""></use>
                        </svg>
                    </p>
                </div>
            </div>
            
            <div class="styles pad reason" style="padding-bottom:0.01rem">
                <p>请假事由</p>
                    <textarea v-model="reasonText"  placeholder="请输入请假事由"></textarea>
                <div class="record_box">
                    <span>{{textNum}}/150</span>
                </div>
            </div>
            <Accessory
                :accessory ='accessory'
            >
            </Accessory>

            <ApproverMan 
                :has_journal="!has_journal"
                color="#fd545c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                type = 0
            ></ApproverMan>

            <CopeMan 
                :has_journal = "!has_journal"
                color = "#fd545c"
                :data_list = chosed_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :types = '2'
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
    if(that.leaveIndex== '-1'){
        that.$toast('请选择请假类型')
    }else if(that.beginTime=='请选择开始时间'){
        that.$toast('请选择开始时间')
    }else if(that.endTime=='请选择结束时间'){
        that.$toast('请选择结束时间')
    }else if(that.textNum == 0){
        that.$toast("请输入请假事由")
    }else if(that.approver_list.length == 0){
        that.$toast('请选择审批人')
    }else if(that.leaveDay=='0'){
        that.$toast('请假天数不能为0')
    }else if(that.leaveDay==''||that.leaveDay*10%5!=0){
        that.$toast('请输入正确的请假天数')
    }else{

        let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds=""

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        let fileObj = {},params={}
        fileObj = that.Util.fileFo(that.accessory)

        that.axios.post(that.Service.saveLeave + that.Service.queryString({
          Id :that.leaveId, // id
          leaveType: that.leaveIndex, //请假类型
          beginTime: that.beginTime, //开始时间
          endTime : that.endTime, //结束时间
          leaveDuration : that.leaveDay, //请假天数
          auditUserIds, //审批人
          receiverIds, //抄送人
          auditCompanyIds,
          receiverCompanyIds,
          reason : encodeURI(that.reasonText.replace(/\n/g, '<br/>')), //请假事由
          url : fileObj.urlStr, //附件
          fileName :fileObj.fileNameStr, //文件名称 
          fileSize :fileObj.fileSizeStr, //文件大小
          draftFlag : index, //草稿还是发送
        })).then(function (res){
            if(res.data.h.code!=200){
                that.$toast(res.data.h.msg)
            }else if(res.data.h.code == 200){
                if(index){
                    that.$toast('已保存至草稿箱!')
                    setTimeout(()=>{
                        if(that.$route.query.leaveId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },700)
                }else{
                    that.$toast('提交成功！')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                            window.location.href = "epipe://?&mark=submitLeave&_id="+res.data.b.leaveId+'&title=我的请假审批';
                    },300)
                }
                localStorage.removeItem('leave')
            }
      })
    }
}
  import Accessory  from '../../components/worknews/accessory_select.vue'    //附件
  import {mapState, mapMutations} from 'vuex';
  import TopHead  from '../../components/topheader.vue'  //header导航栏
  import WorkButton  from '../../components/worknews/work_button.vue'   //提交按钮
  import CopeMan  from '../../components/worknews/copy_man.vue'    //抄送人
  import ApproverMan  from '../../components/worknews/approver_man.vue'    //审批人
  import Dialog  from '../../components/oa/dialog.vue'    //弹窗

export default {
    data(){
        return {
            textNum : 0,  //请假输入字数
            beginTime : '请选择开始时间', //开始时间
            endTime : '请选择结束时间',  //结束时间
            chosed_list: [], //抄送人
            approver_list : [], //审批人
            leaveIndex : '-1', //假期类型
            leaveName : '请选择请假类型', //请假类型名称
            reasonText : '', //请假事由
            leaveDay : '0',  //请假天数
            leaveId :'',
            isShow:false,
            accessory :[], // 附件
            isDraft : 0, //0请假 1草稿
            workOnTime: '',//上班开始时间
            oldData:null,//老数据
        }
    },
    components: {
      WorkButton,
      CopeMan,
      TopHead,
      ApproverMan,
      Accessory,
      Dialog
    },
    methods : {
        ...mapMutations(['change_man','approver_man']),
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
                            console.log(data[key],this.oldData[key],key)
                            return true;
                    }
                }
            }

            return false
        },
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
            if(this.$route.query.leaveId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('leave',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('leave')
            window.location.href = "epipe://?&mark=history_back"
        },
        getLeaveDay(){
            let bTime = this.Util.timeFo(this.beginTime)
            let eTime = this.Util.timeFo(this.endTime)
            let time =eTime.getTime() - bTime.getTime()
            let dayTime =  parseInt( time/(24*60*60*1000));
            if(time/(1000*60*60)<=4){
                this.leaveDay = 0.5;
            }else if(!dayTime&&time/(1000*60*60)>4){
                this.leaveDay = 1;
            }else{
                let days = time/(1000*60*60) - dayTime * 24
                this.leaveDay = days<=4?dayTime +0.5:dayTime+1
            }
        },
        getTime(num){ //获取原生时间
            let that = this;
            window.location.href = "epipe://?&mark=getLeaveTime";
            window["epipe_leavetime_callback"] = str => {
                    let flag = false; 
                    let date = null;
                if(str.indexOf('/')>0){
                    flag = true;
                    date = that.Util.timeFo(str)
                    str = str.split(/[- : \/]/);
                }else{
                    date = new Date(str)
                }
                if(!num){
                    if(that.endTime!='请选择结束时间'){
                        let endDate = that.Util.timeFo(that.endTime)
                        if(date.getTime()>endDate.getTime()){
                            that.$toast('开始时间不能大于结束时间')
                        }else if(date.getTime()==endDate.getTime()){
                            that.$toast('开始时间不能等于结束时间')
                        }else{
                           that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
                           that.getLeaveDay();
                        }
                    }else{
                        that.beginTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }
                }else{            
                    if(that.beginTime!='请选择开始时间'){
                        let beginDate = that.Util.timeFo(that.beginTime);
                        if(date.getTime()<beginDate.getTime()){
                            that.$toast('结束时间不能小于开始时间')
                        }else if(date.getTime()==beginDate.getTime()){
                             that.$toast('结束时间不能等于开始时间')
                        }else{
                            that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                            that.getLeaveDay();
                        }
                    }else{
                        that.endTime = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str;
                    }  
                }
            }
        },
        remove_item: function (itme, index,typess) {   //删除抄送人
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
        addAccessory:function(){
            window.location.href = "epipe://?&mark=addAccessory"
        },
    },
    watch:{
            reasonText : function(){
                if(this.reasonText.length>150){
                    this.$toast("最多输入150字~")
                    this.reasonText = this.reasonText.slice(0,150)
                    return
                }
                this.textNum = this.reasonText.length
            }
        },
    created(){
        console.log(this.$store.state)
        if(localStorage.getItem('leave')){
            let leavedata = JSON.parse(localStorage.getItem('leave'))
            for(let key in leavedata){
                this.$data[key] = leavedata[key]
            }
            this.approver_man(this.$data.approver_list)
            this.change_man(this.$data.chosed_list)
        }
        this.oldData = JSON.parse(JSON.stringify(this.$data))
        eventBus.$on('leaveType', res =>{
            if(res.name=='') return;
            this.leaveIndex = res.index;
            this.leaveName = res.name;
        })
    },
    activated(){
        this.approver_list = this.approver_man_state
        this.chosed_list = this.chosed_man_state
    },
    mounted : function(){
        window["epipe_camera_callback"] = (url,fileSize,fileName) => {
                    var obj = {
                            url,
                            fileSize,
                            fileName
                    }
                    // that.isImg(url)?obj.isImg=true:obj.isImg=false;
                    obj.isImg = that.isImg(url)
                    that.accessory.push(obj)
                }
        let that = this;

     
        if(this.$route.query.leaveId){

            this.axios.get('/work/leave/apply/info',{
                params:{
                    type:that.$route.query.resubmit,
                    leaveId:this.$route.query.leaveId
                }
            }).then(function(res){
                 let datas = res.data.b.data[0];
                 if(res.data.h.code == 200){
                     that.isDraft = 1;
                     that.accessoryFor(datas)
                     if(!that.$route.query.resubmit){
                        that.leaveId = datas.leaveId;
                     }
                     that.beginTime = datas.beginTime.slice(0,-3);
                     that.endTime = datas.endTime.slice(0,-3);
                     that.leaveDay = datas.leaveDuration.slice(0,-1)
                     that.leaveName = datas.leaveType;
                     that.leaveIndex = datas.leaveTypecode;
                     that.reasonText = datas.reason.replace(/<br\/>/g,'\n');
                     that.chosed_list = datas.receivers;
                     that.textNum = that.reasonText.length;
                     that.change_man(that.chosed_list);
                     that.approver_list = datas.auditers;
                     that.approver_man(that.approver_list);
                     that.oldData = JSON.parse(JSON.stringify(that.$data))
                 }else{
                     this.$toast(res.data.h.msg)
                 }
             })
        }

    },
     beforeDestroy() {
      eventBus.$off('leaveType');
    },
    computed: mapState(["chosed_man_state","approver_man_state"])
}
</script>

<style scoped lang="stylus">
    
    .leaveTime{

        input{
            width:1.2rem;
            outline:none;
            text-align:right;
            color:#999;
            font-size:0.14rem;
            padding-right:0.1rem;
        }
    }

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
        }

        .pad{
              padding 0.15rem;
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

        .inp_ul{

            .items{
                border-bottom 0.01rem solid #e6e6e6
            }

            .items:last-child{
                border none;
            }
        }
    }

    .imgShow{
        overflow hidden;
        height:0.36rem;
        
        li{
            float left;
            width 0.32rem;
            height 0.3rem;
            border-radius 5px;
            margin-right 0.1rem;
            overflow hidden;
            margin-top:2px;

            img{
                width:100%;
                height:100%;
            }
        }
    }

    .record_box{
        overflow hidden;
        margin-bottom 0.06rem;
        font-size 0.12rem;

        span{
            float right;
            color: rgb(96, 158, 247);
        }
    }

    .reason{

        p{
            font-size 0.15rem;
            color #333;
            font-weight bold;
            margin-bottom 0.1rem;
        }
        
        textarea{
            width 100%;
            height 100px;
            padding 0;
            font-size 0.14rem;
            color #333;
            line-height 0.2rem;
            border none;
            outline none;
            resize none;
            word-wrap: break-word;
            word-break:break-all
        }
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

    .styles{

         .title{
                 line-height 0.44rem;
                 font-size 0.15rem;
                 color #333;
                 font-weight:bold;
             }
    }


</style>
