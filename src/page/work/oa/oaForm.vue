<template>
    <div class="main">

        <TopHead
        mark = 'mark'
        bgcolor = '#0fc37c'
        :title="formData.approvalName" 
        v-on:history_back="history_back_click"
         ></TopHead>
        <div style="height:0.49rem;" >
        </div>

        <div class="content">

            <div v-for="(el,index) in formData.components" :key="index">
                <Inputs v-if="el.ename=='singleInputBox'" :info="el"
                
                ></Inputs>

                <TextAreaInput :info="el" v-else-if="el.ename=='multiInputBox'"
                
                ></TextAreaInput>

                <SelectInput :info="el" v-on:select="go_select(el,index)" v-else-if="el.ename=='singleBox'"
                
                ></SelectInput>

                <SelectPeople v-on:selectPeople="selectPeoples(el,index)"  :info="el" v-else-if="el.ename=='contactPerson'"
                    
                ></SelectPeople>

                <DateInput :info="el" v-else-if="el.ename=='date'" v-on:openPopup="showPopup(el,index)"
                
                ></DateInput>

                <DateSection :info="el" :indexs="index" v-else-if="el.ename=='dateRange'" v-on:openPopup="dateRange(el,index)"
                
                ></DateSection>

                <DepartmentSelect :info="el"  v-else-if="el.ename=='department'" v-on:select="departSelect(el,index)"
                
                ></DepartmentSelect>

                <ExplainText :info="el" v-else-if="el.ename=='instructions'"

                ></ExplainText>

                <MoreSelect :info="el" v-else-if="el.ename=='checkbox'" v-on:more_select="more_select(el,index)"
                
                ></MoreSelect>

                <NumInput :info="el" v-else-if="el.ename=='numberInputBox'" v-on:input='inputEvent(el)'

                ></NumInput>

                <PhoneInput :info="el" v-else-if="el.ename=='phone'"

                ></PhoneInput>

                <AmountInput :info="el" v-else-if="el.ename=='amount'"

                ></AmountInput>

                <SiteInput :info="el" v-else-if="el.ename=='location'" v-on:go_map="go_map(el,index)"
                
                ></SiteInput>

                

            </div>


            
            <div style="padding-top:0.15rem">
                <Accessory
                    :accessory ='accessory'
                >
                </Accessory>
            
                <ApproMan 
                    :approver_list="allApprovers"
                    v-on:address="go_address"
                    v-on:del_poeple="del_poeple"
                    hintType=1
                    
                ></ApproMan>
                <div v-if="formData.isCondFlag==1&&!meetConditionFlag&&!allApprovers.length" class="noapprover">该条件下无审批人</div>

                <CopeMan 
                    :has_journal="!showCopy"
                    color="#0fc37c"
                    :data_list=chosed_list
                    v-on:remove_item="remove_item"
                    :special_class='1'
                    :types = '2'
                    :isGroup = true
                    :showAdd="showCopy"
                ></CopeMan>

            </div>
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


<van-popup v-model="showss" position="bottom" :style="{ height: '35%' }" :azy-render = false >

    <van-picker
    v-show="pickerSelect"
    :title="pickerTitle"
    :default-index="defaultIndex"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
    />

    <van-datetime-picker
        v-show="data_popup"
        v-model="currentDate"
        :type="dateType"
        :title="pickerTitle"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="onCancel"
    />

    <div v-show="more_select_show">
        <div class="more_box_top">
            <span class="cancel_btn" @click="onCancel">取消</span>
            <p>{{pickerTitle}}</p>
            <span class="confirm_btn" @click="onConfirm(result)">确定</span>
        </div>
        <div class="more_content">
            <van-checkbox-group v-model="result">
                <van-checkbox v-for="(item,index) in more_select_option" :key="index" :name="item">{{item}}</van-checkbox>
            </van-checkbox-group>
        </div>

    </div>



</van-popup>

    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import ApproMan  from '../../../components/oa/approver_template.vue'    

import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import TopHead  from '../../../components/topheader.vue'  //header导航栏
// import 'vant/lib/DatetimePicker/style'
import Inputs  from '../../../components/form_oa/input.vue' 
import TextAreaInput  from '../../../components/form_oa/textarea.vue' 
import SelectInput  from '../../../components/form_oa/select.vue' 
import SelectPeople  from '../../../components/form_oa/selectPeople.vue' 
import DateInput  from '../../../components/form_oa/date_input.vue' 
import DateSection  from '../../../components/form_oa/date_section.vue' 
import DepartmentSelect  from '../../../components/form_oa/department_select.vue' 
import ExplainText  from '../../../components/form_oa/explain_text.vue' 
import MoreSelect  from '../../../components/form_oa/more_select.vue' 
import NumInput  from '../../../components/form_oa/num_input.vue' 
import PhoneInput  from '../../../components/form_oa/phone_input.vue' 
import AmountInput  from '../../../components/form_oa/amount_input.vue' 
import SiteInput  from '../../../components/form_oa/site_input.vue' 

// import DatetimePicker  from 'vant/lib/datetime_picker'
// import { DatetimePicker } from 'vant';

    export default {
        data() {
            return {
                applyId:'',
                formData:{},
                allApprovers:[],
                linkAuditNum:'',
                applyLinkIds:'',
                showCopy:false,
                addressListIndex:-1,
                choseIndex:0, //选择的控件下标

                pickerSelect:false,//单选
                pickerTitle:'',//标题
                more_select_show:false,//复选
                data_popup:false,

                has_journal:false,
                accessory:[],
                approver_list:[],
                chosed_list:[],
                showss:false,
                columns: [],
                styles:{ height: '30%'},

                minDate: new Date(2000, 0, 1),
                maxDate: new Date(2025, 10, 1),
                currentDate: new Date(),
                dateType:'datetime',
                result: [],
                more_select_option:[],
                isOpenPeople:false,
                departData:[], //部门数据
                defaultIndex:1,//单选默认选中
                peopleType:0,//联系人类型
                approvalFormId:'',
                meetConditionFlag:false
            }
        },
        components: {
            Accessory,
            ApproMan,
            CopeMan,
            WorkButton,
            TopHead,
            Inputs,
            TextAreaInput,
            SelectInput,
            SelectPeople,
            DateInput,
            DateSection,
            DepartmentSelect,
            ExplainText,
            MoreSelect,
            NumInput,
            PhoneInput,
            AmountInput,
            SiteInput
        },
        created(){
            


            let companyId = localStorage.getItem('companyId')
            this.axios.get('organ/office/select?companyId='+companyId).then(res=>{
                this.departData = res.data.b.offices;
            })


            if(this.$route.query.approvalFormId){
                this.approvalFormId = this.$route.query.approvalFormId
                this.getData(this.$route.query.approvalFormId)
            }

            if(this.$route.query.applyId){
                this.applyId = this.$route.query.applyId
                this.axios.get('/process/apply/info?applyId='+this.applyId).then(res=>{
                    let data = res.data.b;
                    let newData = []
                this.approvalFormId = data.applyType

                    this.getData(data.applyType,1)

                    data.list.forEach(item=>{
                         let child = item.componentInfo

                         child.value = item.stringValue?item.stringValue:'';
                         if(child.ename=='dateRange'){
                             child.endVal = item.secondStringValue?item.secondStringValue:'';
                         }else if(child.ename=='singleBox'||child.ename=='checkbox'||child.ename=='contactPerson'||child.ename=='department'){
                             child.valueCode = item.secondStringValue?item.secondStringValue:'';
                        
                         }else if(child.ename=='location'){
                             child.lon = item.lon?item.lon:''
                             child.lat = item.lat?item.lon:''
                         }
                        child.id = item.componentId
                        newData.push(child)
                    })


                    // this.formData.components = newData

                    this.$set( this.formData,'components',newData)
                })
            }
        },
        methods:{
            ...mapMutations(['change_man','approver_man','peerData_man']),
            getData(id,type){
                this.axios.get('/process/apply/enter?req='+id).then(res=>{
                    let param = res.data.b

                    if(!type){
                        param.components.forEach(item=>{
                            if(item.ename=='dateRange'){
                                item.endVal = ''
                            }else if(item.ename=='location'){
                                item.lon = ''
                                item.lat = ''
                            }
                            item.value = ''
                            item.valueCode = ''
                        })
                        this.formData = param;
                        //  this.$forceUpdate()
                    }else{
                        // this.formData.linkAuditNum = param.linkAuditNum;
                        this.formData.applyLinkIds = param.applyLinkIds;
                        this.formData.approvalReceiverFlag = param.approvalReceiverFlag;
                        this.formData.receivers = param.receivers;
                        this.formData.approvalFormId = id;
                        this.formData.links = param.links;
                        this.formData.isCondFlag = param.isCondFlag
                        this.formData.approvalName =param.approvalName
                    }
                    this.allApprovers = this.Util.approverDataInit(param.links);
                    // this.linkAuditNum = this.formData.linkAuditNum;
                    this.linkAuditNum = param.linkAuditNum;
                    this.applyLinkIds = this.formData.applyLinkIds;
                    this.showCopy = this.formData.approvalReceiverFlag=='1'?false:true;
                    if(this.formData.receivers&&this.formData.receivers.length>0){
                            this.chosed_list = this.formData.receivers
                            this.change_man(this.chosed_list);
                    }

                    if(type&&param.isCondFlag==1){
                        this.getConForm()
                    }
                })
            },
            onConfirm(value, index) {
                let item =  this.formData.components[this.choseIndex]

                if(item.ename=="date"||(item.ename=='dateRange'&&item.selectType==1)){
                    item.value = this.timeF(value,item.dataType)
                }else if(item.ename=='checkbox'){
                    let str = ''
                    this.more_select_option.forEach((el,num)=>{
                        value.forEach(val=>{
                            if(el==val){
                                str+= num+','
                            }
                        })
                    })

                    item.valueCode = str.slice(0,-1)
                    item.value = value.join()
                } else if(item.ename=='dateRange'&&item.selectType==2){
                    item.endVal = this.timeF(value,item.dataType)
                }else if(item.ename=='singleBox'){
                    item.value = value;
                    this.$set(item,'value',value)
                    item.valueIndex = index;
                    item.valueCode = index;
                    this.inputEvent(item)
                }else if(item.ename=='department'){
                    item.value = value
                    item.valueIndex = index
                    item.valueCode = this.departData[index].id
                }else{
                    item.value = value
                }

                this.showss = this.data_popup = this.more_select_show = this.pickerSelect = false;

            },
            onCancel() {
                this.showss = this.data_popup = this.more_select_show = this.pickerSelect = false;
            },
            history_back_click(){
                window.location.href = "epipe://?&mark=history_back"
            },
            go_map(item,index){//打开地图
                 let that = this;
                    window["epipe_site_callback"] = (name,site,lon,lat) => {
                            name = !name?site:name;
                            item.value = name;
                            that.detailAddress = site;
                            item.lon =  lon;
                            item.lat = lat;
                    }
                    window.location.href = "epipe://?&mark=outsideAddress"
            },
            save_btn(){
                this.checked(1)
            },
            submit_btn(){
                this.checked(0)
            },
            checked(type){

                    if(this.formData.isCondFlag==1&&!this.allApprovers.length){
                       this.$toast('该内容下无符合条件的审批人')
                        return;

                    }
                if(this.Util.checkApprovers(this.allApprovers)){
                        this.$toast('请选择审批人')
                        return;
                }

                for (let i = 0; i < this.formData.components.length; i++) {
                    let item = this.formData.components[i]
                    if(item.req==1){
                        if(item.value==''&&item.ename!='location'){
                            this.$toast(item.title+'为必填项')
                            return false
                        }
                    }
                    if(item.ename=='numberInputBox'&&(item.req==1||item.value!='')){
                        if( isNaN(item.value)){
                            this.$toast(item.title+'必须为数字')
                            return false
                        }
                    }else if(item.ename=='phone'&&(item.req==1||item.value!='')){
                        var reg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
                        if(!reg.test(item.value)){
                            this.$toast(item.title+'必须为手机号码')
                            return false
                        }
                    }else if(item.ename=='dateRange'&&(item.req==1||item.value!='')){

                        if(new Date(item.endVal).getTime()<new Date(item.value).getTime()){
                            this.$toast(item.secondTitle+'不能小于'+item.title)
                            return false
                        }
                    }else if(item.ename=='amount'&&(item.req==1||item.value!='')){
                        var temp = /^\d+\.?\d{0,2}$/;
                        if(!temp.test(item.value)){
                            this.$toast(item.title+'请输入正确的金额值')
                            return false
                        }

                    }
                    
                }

                this.ajax(type)

            },
            ajax(type){

                let receiverIds = '',receiverCompanyIds="",fileObj = {},params={},approver = {}

                receiverIds = this.Util.getIds(this.chosed_list,'userId')
                receiverCompanyIds = this.Util.getIds(this.chosed_list,'companyId')

                approver = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)
                fileObj = this.Util.fileFo(this.accessory)

                 params = {
                    id:this.applyId,
                    applyType:this.formData.approvalFormId,
                    applyName:this.formData.approvalName,
                    auditUserIds:approver.userIdsStr, //审批人
                    auditCompanyIds:approver.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approver.numStr,
                    fileNames : fileObj.fileNameStr, //文件名称s
                    fileSizes : fileObj.fileSizeStr, //文件大小
                    urls : fileObj.urlStr, //附件
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    draftFlag:type,
                }


                this.formData.components.forEach((item,index)=>{

                    params['list['+index+'].componentId'] = item.id

                    if(item.ename=='singleBox'||item.ename=='checkbox'||item.ename=='contactPerson'||item.ename=='department'){
                        params['list['+index+'].stringValue'] = item.valueCode
                    } else if(item.ename=='location'){
                        params['list['+index+'].stringValue'] = item.value
                        params['list['+index+'].lat'] = item.lat
                        params['list['+index+'].lon'] = item.lon
                    } else if(item.ename=='dateRange'){
                        params['list['+index+'].stringValue'] = item.value
                        params['list['+index+'].secondStringValue'] = item.endVal
                    } else if(item.ename=='instructions'){
                        params['list['+index+'].stringValue'] = item.textnote
                    }
                     else{
                        params['list['+index+'].stringValue'] = item.value
                    }
                })

                console.log(params)
                this.axios({
                method:"post",
                url:"/process/apply/save",
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
                    if(res.data.h.code==200){
                        if(type){
                            this.$toast('已保存至草稿箱!')
                            setTimeout(()=>{
                                    if(this.$route.query.applyId){
                                        window.location.href = "epipe://?&mark=goWork"
                                    }else{
                                        window.location.href = "epipe://?&mark=history_back" 
                                    }
                            },500)
                        }else{
                            this.$toast('提交成功！')
                            window.location.href = "epipe://?&mark=workUpdate";
                            setTimeout(()=>{
                                window.location.href = "epipe://?&mark=oaDetails&_id="+res.data.b.applyId;
                            },500)
                        }

                    }else{
                        this.$toast(res.data.h.msg)

                    }

                })
            },
        
            go_select(item,index){//单选项
                this.common(item,index)
                let arr = item.items.split(',')
                this.columns = arr;
                // this.$set(this.columns,arr)
                this.defaultIndex = item.valueIndex
                this.pickerSelect = true;
            },
            more_select(item,index){//多选项
                this.common(item,index)
                let arr = item.items.split(',')
                this.more_select_option = arr;

                if(item.value!=''){
                    this.result = item.value.split(',')
                }else{
                    this.result= []
                }

                this.more_select_show = true;
            },

            dateRange(item,index){//日期区间
                this.dateType = item.dataType==1?'datetime':'date'
                this.common(item,index)
                if(item.selectType==2){
                    this.pickerTitle = item.secondTitle;
                }
                this.data_popup = true;
            },
            departSelect(item,index){//部门选择
                this.common(item,index)
                let arr =[] 
                this.departData.forEach(el=>{
                    arr.push(el.name)
                })
                this.defaultIndex = item.valueIndex
                this.columns = arr;
                this.pickerSelect = true;
            },
            selectPeoples(el,index){//选择联系人 多个或一个
                this.choseIndex = index;
                this.peopleType = el.radios;
                this.isOpenPeople = true;
                if(el.radios=='1'){
                    this.peerData_man({
                        index:0,
                        array:el.peopleData
                    })
                }else{
                    this.peerData_man({
                        index:0,
                        array:el.peopleData
                    })
                }

                this.$router.push({path:'/addressList', query: {peArrIndex:0,showGroup:el.ranges==0?true:false,type:el.radios==0?1:'0'}})

            },
            showPopup(item,index){
                this.dateType = item.dataType==1?'datetime':'date'
                // this.dateType
                this.common(item,index)
                this.data_popup = true;
            },

            common(item,index){
                this.pickerTitle = item.title;
                this.choseIndex = index;
                this.showss = true;
            },

            timeF(val,type){ //时间格式化
                    let date = new Date(val)
                    let timeStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

                    let hours = (date.getHours()+'').length<2?'0'+date.getHours():date.getHours();
                    let minu = (date.getMinutes()+'').length<2?'0'+date.getMinutes():date.getMinutes();

                    timeStr = type==1?timeStr+" "+hours+':'+minu:timeStr;

                    return timeStr;
            },

            go_address(index){ //选择审批人
                this.addressListIndex = index
                this.approver_list =  this.allApprovers[index].auditers;
                this.approver_man(this.approver_list)
                let showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
                let flag = this.allApprovers[index].remarks=='0'?'1':null;
                this.$router.push({path: 'imchoices', query: {bgcolor:'#0fc37c',amount:flag,num:1,showGroup,}})

            },
            del_poeple(index,num){//删除审批人
                this.allApprovers[index].auditers.splice(num,1 )
            },
            remove_item: function (itme, index,typess) {   //删除审批人
                this.chosed_list.splice(index, 1);
                this.change_man(this.chosed_list)
            },

            numberInput(val){//监听数字输入
                if(this.formData.isCondFlag==0) return ''

                this.getConForm()
            },
            inputEvent(item){
                if(this.formData.isCondFlag==0&&item.req!=1) return ''
                this.getConForm()
            },
            getConForm(){

                let arrs = [], param = {}, flag = false;
                console.log(flag)
                this.formData.components.map(item=>{
                    if(item.req==1&&item.columnType==3){
                        if(item.value==''){
                            console.log(1)
                            flag = true
                        }
                        arrs.push(item)
                    }else if(item.req==1&&item.columnType==4){
                        if(item.valueCode===''){
                            flag = true
                        }
                        arrs.push(item)

                    }
                })
                if(flag) return ''

                arrs.map((item,index)=>{
                    param['list['+index+'].componentId'] = item.id
                    param['list['+index+'].stringValue'] = item.columnType=='3'?item.value:item.valueCode
                })


                param.applyType =this.approvalFormId

                 this.axios({
                method:"post",
                url:"/process/apply/load",
                headers:{
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:param,
                transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res)=>{ 
                    let data = res.data.b.processInfo;
                    this.meetConditionFlag = res.data.b.meetConditionFlag
                    this.allApprovers = this.Util.approverDataInit(data.links);
                    this.linkAuditNum = data.linkAuditNum;
                    this.applyLinkIds = data.applyLinkIds;
                    this.showCopy = data.approvalReceiverFlag=='1'?false:true;

                    if(data.receivers&&data.receivers.length>0){
                            this.chosed_list = data.receivers
                            this.change_man(this.chosed_list);
                    }
                })
                
            }
        },
        activated(){
            if(this.addressListIndex>0){
                this.allApprovers[this.addressListIndex].auditers = this.approver_man_state
            }
            this.chosed_list = this.chosed_man_state

            if(this.isOpenPeople){
                if(this.peopleType==1){
                    let arr = this.peer_man_state[0]
                    let strValue = '',valueCode = ''

                    arr.forEach(item=>{
                         strValue+=item.name+','
                         valueCode+=item.userId+','
                    })

                        this.formData.components[this.choseIndex].value = strValue.slice(0,-1)
                        this.formData.components[this.choseIndex].valueCode = valueCode.slice(0,-1)

                    this.formData.components[this.choseIndex].peopleData = this.peer_man_state[0];

                }else{
                    this.formData.components[this.choseIndex].peopleData = this.peer_man_state[0];
                    this.formData.components[this.choseIndex].value = this.peer_man_state[0][0].name
                    this.formData.components[this.choseIndex].valueCode = this.peer_man_state[0][0].userId
                }
                this.isOpenPeople = false;
            }

         },
        computed: mapState(["chosed_man_state","approver_man_state","peer_man_state"])

    }
</script>

<style lang="stylus" scoped>

    .main{
        min-height 100%;
        background-color #f5f5f5;
    }

    .content{
        padding 0.15rem;
    }

    .more_box_top{
        display: flex;
        line-height:0.44rem;
        flex-direction row 

        span{
            padding:0 0.16rem;
            color: #969799;
            font-size 0.14rem;
        }
        
        .confirm_btn{
            color:#576b95;
        }

        p{
            flex:1;
            font-width 500;
            font-size 0.16rem;
            text-align:center;
        }

    }

    .more_content{
        paddin-top:0.2rem;
        padding-left:0.15rem;
    }

    .van-checkbox-group>div{
        margin:0.15rem 0
    }

    .noapprover{
        background-color: #fff;
        padding: 0.15rem;
        position: relative;
        top: -0.35rem;
        color: #666;
    }
</style>