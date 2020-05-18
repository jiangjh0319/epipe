<template>
    <section>
        
        <TopHead
        mark = 'mark'
        bgcolor='#609EF7'
        title="上传档案" 
        v-on:history_back="history_back_click"
         ></TopHead>


        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <van-field v-model="archNum" clearable input-align="right" label="档案编号" placeholder="请输入档案编号" />
                </div>   
                <div class="bor_bottom">
                    <van-field v-model="archName" clearable input-align="right" label="档案名称" placeholder="请输入档案名称" />
                </div>
            </div>

            <div class="styles input_group">
        
                <div class="bor_bottom choose">
                    <van-field
                        v-model="valDate"
                        label="档案日期"
                        placeholder="请选择档案日期"
                         right-icon="arrow-down"
                        input-align="right"
                        @click="handlerShowPicker(1)"
                    />
                </div>      
                
                <div class="choose">
                    <van-field
                        v-model="valGrade"
                        label="保密等级"
                        placeholder="请选择保密等级"
                         right-icon="arrow-down"
                        input-align="right"
                        @click="handlerShowPicker(2)"
                    />
                </div>    
         
            </div>

            <div class="styles input_group">
        
                <div class="bor_bottom choose">
                    <van-field
                        v-model="ageLimit"
                        label="保管年限"
                        placeholder="请输入保管年限"
                        clearable
                        input-align="right"

                    />
                </div>      
                
                <div class="choose">
                    <van-field
                        v-model="endTime"
                        label="保管截止日期"
                        placeholder="选择保管截止日期"
                         right-icon="arrow-down"
                        input-align="right"
                        @click="handlerShowPicker(3)"
                    />
                </div>    
         
            </div>
            <div class="styles input_group">
        
                <div class="bor_bottom choose">
                    <van-field
                        v-model="wellmadestarm"
                        label="所属公司"
                        placeholder="选择所属公司"
                         right-icon="arrow-down"
                        input-align="right"
                        @click="handlerShowPicker(4)"
                    />
                </div>   
                <div class=" choose">
                    <van-field
                        v-model="archAdmin"
                        clearable
                        label="档案保管员"
                        placeholder="请输入档案保管员"
                        input-align="right"

                    />
                </div>      
         
            </div>
            <div class="styles input_group">
        
                <div class="choose">
                    <van-field
                        v-model="placeArch"
                        label="存放位置"
                        placeholder="选择存放位置"
                         right-icon="arrow-down"
                        input-align="right"
                        @click="handlerShowPicker(5)"
                    />
                </div>            
            </div>
            <van-popup v-model="showPicker"  position="bottom">
                <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
                />
            </van-popup>  
            <van-popup v-model="showPickerTime"  position="bottom">
                   <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    title="选择年月日"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="onConfirmTime"
                    />
            </van-popup> 
            <div class="styles" style="padding:0 0.15rem;">
                 <p class="title">档案描述</p>
                    <textarea v-model.trim="userBuyApplyRemarks" name="" maxlength="1000" id="" cols="30" rows="10" placeholder="请输入备注,限定1000字">

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
                color="#0fc37c"
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

            <!-- <CopeMan 
                :has_journal="!has_journal"
                color="#0fc37c"
                :data_list=chosed_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :types = '2'
                :isGroup = true
                :showAdd="showCopy"
            ></CopeMan> -->
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
    if(that.userBuyApplyTheme==''){
        that.$toast('申请事由不能为空')
    }else if(that.userBuyApplyTheme.length<2||that.userBuyApplyTheme.length>100){
        that.$toast('申请事由不能低于2个或超过100个字符')
    }else if(that.userBuyApplyRemarks.length<6||that.userBuyApplyRemarks.length>1000){
        that.$toast('备注不能低于6个或超过1000个字符')
    }else if(that.hopeDeliveryDate=='请选择'){
        that.$toast('请选择期望交付日期')
    }else if(that.Util.checkApprovers(that.allApprovers)){
        that.$toast('请选择审批人')
    }else{

        for(let i=0;i<that.buy.length;i++){
            
            if(that.buy[i].name==''){
                that.$toast('请输入名称')
            }else if(that.buy[i].name&&(that.buy[i].name.length<2||that.buy[i].name.length>30)){
                that.$toast('物品名称必须为2-30个字符')
            }else if(!that.buy[i].price){
                that.$toast('价格不能为空')
            } else if(isNaN(that.buy[i].price) || that.buy[i].price.length>8){
                that.$toast('价格为1-8位数字')
            }else if(that.buy[i].unit==''){
                that.$toast('请输入单位')
            }else if(that.buy[i].specifications==''){
                that.$toast('请输入规格')
            }else if(that.buy[i].number==''){
                that.$toast('请输入数量')
            }else if(isNaN(that.buy[i].number)){
                that.$toast('数量需为数字')
            }
        }

        let receiverIds = '',receiverCompanyIds="",fileObj = {}, params={}, approver = {}

        receiverIds = that.Util.getIds(that.chosed_list,'userId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

        approver = that.Util.approverFormat(that.allApprovers,that.linkAuditNum)

        fileObj = that.Util.fileFo(that.accessory)

        params = {
            Id : that.id, // id
            urls : fileObj.urlStr, //附件
            userBuyApplyTheme:that.userBuyApplyTheme, //
            payType:that.payTypeCode,
            buyType:that.buyTypeCode,
            hopeDeliveryDate:that.hopeDeliveryDate,
            userBuyApplyRemarks:that.userBuyApplyRemarks,
            fileNames : fileObj.fileNameStr, //文件名称s
            fileSizes : fileObj.fileSizeStr, //文件大小
            receiverIds, //抄送人
            receiverCompanyIds,
            auditUserIds:approver.userIdsStr, //审批人
            auditCompanyIds:approver.companyIdsStr,
            applyLinkIds:that.applyLinkIds,
            linkAuditNum:approver.numStr,
            draftFlag : index, //草稿还是发送
        }

        that.buy.forEach((item,index)=>{
            params['list['+index+'].name'] = item.name
            params['list['+index+'].specifications'] = item.specifications
            params['list['+index+'].number'] = item.number
            params['list['+index+'].price'] = item.price
            params['list['+index+'].unit'] = item.unit
        })

        that.axios({
                method:"post",
                url:"/work/buy/save",
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

                         if(that.$route.query.buyId){
                             window.location.href = "epipe://?&mark=goWork"
                        }else{
                            window.location.href = "epipe://?&mark=history_back" 
                        }
                    },500)
                }else{
                    that.$toast('提交成功!')
                    window.location.href = "epipe://?&mark=workUpdate";
                    setTimeout(()=>{
                        window.location.href = "epipe://?&mark=submitBuy&_id="+res.data.b.userBuyApplyId;
                    },500)
                }
            }
            that.change_man([])
            that.approver_man([])
            localStorage.removeItem('buy')
      })
    }
}
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import ReiTemplate  from '../../../components/worknews/reiTemplate.vue'    //报销组件
// import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
import ApproMan  from '../../../components/oa/approver_template.vue'    
import TopHead  from '../../../components/topheader.vue'  //header导航栏
import Dialog  from '../../../components/oa/dialog.vue'    //弹窗

export default {
        data(){
            return{
                id : '',
                userBuyApplyTheme : '', //标题
                chosed_list: [], //抄送人
                approver_list : [], //审批人
                accessory :[], //附件
                isDraftFlag : 0, //判断是不是草稿
                textNum : 0,
                userBuyApplyRemarks:'',
                buyType:'请选择',
                buyTypeCode:'',
                payType:'请选择',
                payTypeCode:'',
                hopeDeliveryDate:'请选择',
                totalPrice:0,
                buy: [{name:'',number:'',price:'',specifications:'',unit:''}], //
                departmentName:'',
                userName:'',
                isShow:false,
                oldData:null,
                addressListIndex:-1,
                showCopy:0,
                showGroup:false,
                applyLinkIds:'',
                allApprovers:[],
                linkAuditNum:'',

                     valDate:'',
                valGrade:'',
                showPicker:false,
                showPickerTime:false,
                minDate: new Date(1690, 0, 1),
                currentDate: new Date(),
                columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
                endTime:'',
                index_:'',
                picker_index:'',
                ageLimit:'',
                wellmadestarm:'',
                archAdmin:'',
                placeArch:''

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
        ...mapMutations(['change_man','approver_man',"remburseData"]),
        save_btn(){ //保存草
         save_leave(1, "存入草稿成功", this)
        },
        submit_btn(){ //提
            save_leave(0, "提交成功", this)
        },
         handlerShowPicker(i){
            if(i===1){
                this.index_ = i;
                this.showPickerTime = true;
             }else if(i===2){
                 this.picker_index = i;
                this.showPicker = true;
             }else if(i===3){
                this.index_ = i;
                this.showPickerTime = true;
             }else if(i===4){
                 this.picker_index = i;
                this.showPicker = true;
             }else if(i===5){
                this.picker_index = i;
                this.showPicker = true;
             }
        },
        onConfirm(value) {
            if(this.picker_index===2){
                this.valGrade = value;
            }else if(this.picker_index===4){
                this.wellmadestarm = value;
            }else if(this.picker_index===5){
                this.placeArch = value;
            }
            this.showPicker = false;
        },
        format(date, index){
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        onConfirmTime(value){
            if(this.index_==1){
                this.valDate =this.format(value);
            }else if(this.index_==3){
                this.endTime =this.format(value);
            }
            this.showPickerTime = false;
        },
        lf_click(){

             this.isShow=false;
            if(this.$route.query.buyId&&!this.$route.query.resubmit){
                 save_leave(1, "存入草稿成功", this)
            }else{
                localStorage.setItem('buy',JSON.stringify(this.$data))
            }
            window.location.href = "epipe://?&mark=history_back"
        },
        rg_click(){
            this.isShow=false;
            localStorage.removeItem('buy')
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
          this.buy.splice(index,1)
          this.totalPriceF()
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
        totalPriceF(){
            let total = 0
            console.log(11)
            this.buy.forEach(item=>{
                let num = item.number==''?0:item.number
                let price = item.price==''?0:item.price

                if(isNaN(num)||isNaN(price)){
                    return
                }
                total+=parseFloat(num) * parseFloat(price)
            })

            this.totalPrice = total.toFixed(1);
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
                    that.hopeDeliveryDate = flag?str[0]+'-'+str[1]+'-'+str[2]+' '+str[3]+':'+str[4]:str; 
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
           this.buy.push({
                    // price: '', //报销金额
                    // unit: '',  //报销日期
                    // number : '',
                    // name : '',
                    // specifications:''
                });
        },
        buyTypeSelect(){
            this.$router.push({path:'/option',query:{indexs:this.buyTypeCode,type:'buy',color:'#0fc37c',title:'采购类型',getType:1}})
        },
        payTypeSelect(){
            this.$router.push({path:'/option',query:{indexs:this.payTypeCode,type:'pay2',color:'#0fc37c',title:'采购类型',getType:1}})
        }
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
             userBuyApplyRemarks : function(){
                if(this.userBuyApplyRemarks.length>1000){
                    this.$toast("最多输入1000字~")
                    this.userBuyApplyRemarks = this.userBuyApplyRemarks.slice(0,1000)
                    return
                }
                this.textNum = this.userBuyApplyRemarks.length
            },

        },
        created() {

            if(localStorage.getItem('buy')){
                let buydata = JSON.parse(localStorage.getItem('buy'))
                for(let key in buydata){
                    this.$data[key] = buydata[key]
                }
                this.approver_man(this.$data.approver_list)
                this.change_man(this.$data.chosed_list)
            }

            this.oldData = JSON.parse(JSON.stringify(this.$data))
            let that = this;

             eventBus.$on('leaveType', res =>{
                if(res.name=='') return;
                if(res.type=='buy'){
                    this.buyTypeCode = res.index;
                    this.buyType = res.name;
                }else{
                    this.payTypeCode = res.index;
                    this.payType = res.name;
                }
            })

             this.axios.get('/process/apply/enter?req=20').then((res)=>{
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

        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
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
            if(this.$route.query.buyId){
                   this.axios.get('/work/buy/info',{
                        params:{
                            type:that.$route.query.resubmit,
                            userBuyApplyId:this.$route.query.buyId
                        }
                    }).then(function(res){ 
                   let data = res.data.b;
                       if(!that.$route.query.resubmit){
                                that.id = data.userBuyId;
                        }

                       that.isDraftFlag = 1;
                        that.accessoryFor(data)
                        that.buyType = data.buyType
                        that.buyTypeCode = data.buyTypeCode
                        that.payType = data.payType
                        that.payTypeCode = data.payTypeCode
                        that.userBuyApplyTheme = data.userBuyApplyTheme;
                        that.userBuyApplyRemarks = data.userBuyApplyRemarks;
                        that.hopeDeliveryDate = data.hopeDeliveryDate;
                        that.chosed_list = data.receivers;
                        that.change_man(that.chosed_list)
                        that.buy = data.list
                        that.totalPriceF()
                        that.textNum = data.userBuyApplyRemarks.length;
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
