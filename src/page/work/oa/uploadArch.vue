<template>
    <section>
        
        <TopHead
        mark = 'mark'
        bgcolor='#0fc37c'
        title="上传档案" 
        v-on:history_back="history_back_click"
         ></TopHead>


        <div class="content">
            <div class="styles input_group">
                <div class="bor_bottom">
                    <span class="title"><a>*</a>申请事由</span>
                    <input placeholder="请输入申请事由"  v-model="userBuyApplyTheme" />
                </div>
                
                <div class="bor_bottom choose" @click="buyTypeSelect">
                    <span class="title">采购类型</span>
                     <p>
                        <span class="nullValue">{{buyType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>      
                
                <div class="choose" @click="getTime()">
                    <span class="title"><a>*</a>期望交付日期</span>
                    <p>
                        <span class="nullValue">{{hopeDeliveryDate |times}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>      
            </div>

            <div class="styles input_group" v-for="(item,index) in buy" :key="item.id">
                <div class="control" v-show="buy.length>1">
                    <span>采购明细({{index+1}})</span>
                    <span style="color:#fd545c" @click.stop="remove(index)">删除</span>
                </div>
                <div class="bor_bottom">
                    <span class="title"><a>*</a>名称</span>
                    <input placeholder="请输入名称"  v-model="item.name" />
                </div>
                
                <div class="bor_bottom">
                    <span class="title"><a>*</a>规格</span>
                    <input placeholder="请输入规格"   v-model="item.specifications" />
                </div>      
                
                <div class="">
                    <span class="title"><a>*</a>数量</span>
                    <input type="number" @input="totalPriceF" placeholder="请输入数量"   v-model="item.number" />
                </div>
                 <div class="bor_bottom">
                    <span class="title"><a>*</a>单位</span>
                    <input placeholder="请输入单位"   v-model="item.unit" />
                </div>      
                
                <div class="">
                    <span class="title"><a>*</a>价格</span>
                    <input type="number" @input="totalPriceF" placeholder="请输入价格"   v-model="item.price" />
                </div>       
            </div>


              <div class="addDiv styles" v-if="buy.length<3" @click="addEvection" >
                + 增加采购明细
              </div>
             
             <div style="margin-bottom:10px;">
                 总价格  
                 <span style="float:right">{{totalPrice}} 元</span>
             </div>
             <div class="styles input_group choose" @click="payTypeSelect">
                <div>
                    <span class="title">支付方式</span>
                     <p>
                        <span class="nullValue">{{payType}}</span>
                        <svg class="icon icon-back" aria-hidden="false">
                                <use xlink:href="#icon-right"></use>
                        </svg>
                    </p>
                </div>
             </div>
             <div class="styles" style="padding:0 0.15rem;">
                 <p class="title">备注</p>
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
            
            <ApproverMan 
                :has_journal="!has_journal"
                color="#0fc37c"
                :data_list=approver_list
                v-on:remove_item="remove_item"
                :special_class='1'
                :isGroup = true
                type= 1
            ></ApproverMan>

            <CopeMan 
                :has_journal="!has_journal"
                color="#0fc37c"
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

    </section>
</template>

<script>
let reg = /[\u4e00-\u9fa5]/g;
let save_leave = (index,text,that) =>{
    if(that.userBuyApplyTheme==''){
        that.$toast('申请事由不能为空')
    }else if(that.userBuyApplyTheme.length<2||that.userBuyApplyTheme.length>100){
        that.$toast('申请事由不能低于2个或超过100个字符')
    }else if(that.userBuyApplyRemarks!=''&&(that.userBuyApplyRemarks<6||that.userBuyApplyRemarks>1000)){
        that.$toast('备注不能低于6个或超过1000个字符')
    }else if(that.hopeDeliveryDate=='请选择'){
        that.$toast('请选择期望交付日期')
    }else if(that.approver_list.length == 0){
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

         let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj = {},params={}

        receiverIds = that.Util.getIds(that.chosed_list,'receiverId')
        auditUserIds = that.Util.getIds(that.approver_list,'auditUserId')
        auditCompanyIds = that.Util.getIds(that.approver_list,'companyId')
        receiverCompanyIds = that.Util.getIds(that.chosed_list,'companyId')

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
            auditUserIds, //审批人
            receiverIds, //抄送人
            auditCompanyIds,
            receiverCompanyIds,
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
            localStorage.removeItem('buy')
      })
    }
}
import {mapState, mapMutations} from 'vuex';
import WorkButton  from '../../../components/worknews/work_button.vue'   //提交按钮
import CopeMan  from '../../../components/worknews/copy_man.vue'    //抄送人
import Accessory  from '../../../components/worknews/accessory_select.vue'    //附件
import ReiTemplate  from '../../../components/worknews/reiTemplate.vue'    //报销组件
import ApproverMan  from '../../../components/worknews/approver_man.vue'    //审批人
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
            }
        },
        components: {
            WorkButton,
            CopeMan,
            ApproverMan,
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
                // if(!this.Util.isUpdate(this.$data,this.oldData)){
                //      window.location.href = "epipe://?&mark=history_back"
                // }else{
                //     this.isShow = true;
                // }
                history.back();
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
                        that.approver_list = data.auditers;
                        that.approver_man(that.approver_list);
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
