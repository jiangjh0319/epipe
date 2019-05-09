<template>
  <div class="invoice">
    <div v-if="!showSelection">
      <div class="height-45"><span class="sp1">发票类型</span><span class="sp2">{{InvoiceType}}</span></div>
      <div class="height-45" @click="NoInvoiceFun"><span class="sp1"><i class="iconfont" :class="NoInvoiceSel ? 'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>不开发票</span></div>
      <div class="height-45" @click="NorInvoiceFun"><span class="sp1"><i class="iconfont" :class="NorInvoiceSel ? 'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>普通发票</span></div>
      <div class="height-45" @click="SpeInvoiceFun"><span class="sp1"><i class="iconfont" :class="SpeInvoiceSel ? 'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>增值税专用发票</span></div>
      <article v-if="NorInvoiceSel">
        <div  class="invoice-header height-45"><span class="sp1">发票抬头</span><span class="sp2">{{InvHeacon}}</span></div>
        <div class="height-45">
          <span class="sp1" @click="PerInvoiceHeaFun"><i class="iconfont" :class="PerInvoiceHea ? 'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>个人</span>
          <span class="sp2" v-if="PerInvoiceHea"><input type="text" placeholder="请输入个人名字" v-model="InvHeacon"></span>
        </div>
        <div class="height-45">
          <span class="sp1" @click="ComInvoiceHeaFun"><i class="iconfont" :class="ComInvoiceHea ? 'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>公司</span>
          <span class="sp2" v-if="ComInvoiceHea"><input type="text" placeholder="请输入公司全称"  v-model="InvHeacon"></span>
        </div>
        <div class="height-45" v-if="ComInvoiceHea">
          <span class="sp1"><i  class="iconfont"></i>纳税人识别号</span>
          <span class="sp2"><input type="tel" onkeyup="this.value = this.value.replace(/[^\d]/g, '')" placeholder="请输入纳税人识别号" v-model="IdentNnm"></span>
        </div>
        <div class="invoice-header height-45"><span class="sp1">普通商品发票内容</span><span class="sp2">{{InvoiceCon}}</span></div>
        <div class="height-45" v-for="(obj,index) in InvoiceConArr" @click="InvoiceConFun(index,obj)">
          <span class="sp1"><i class="iconfont" :class="InvoiceConIndex==index ?  'icon-xuanzhong1 red' : 'icon-weixuan gray'"></i>{{obj}}</span>
        </div>
      </article>
      <article v-if="SpeInvoiceSel">
        <div  class="invoice-header height-45">
            <span class="sp1">增票资质</span><span class="sp2"></span>
        </div>
        <section><span class="sp1">单位名称</span><span class="sp2"><input type="text" v-model="CompanyName"></span></section>
        <section><span class="sp1">纳税人识别号</span><span class="sp2"><input type="tel" onkeyup="this.value = this.value.replace(/[^\d]/g, '')"  v-model="IdentNnm"></span></section>
        <section><span class="sp1">注册地址</span><span class="sp2"><input type="text" v-model="RegisterAddress"></span></section>
        <section><span class="sp1">注册电话</span><span class="sp2"><input type="tel" v-model="RegisterPhone"></span></section>
        <section><span class="sp1">开户银行</span><span class="sp2"><input type="text" v-model="OpenBank"></span></section>
        <section><span class="sp1">银行账号</span><span class="sp2"><input type="tel" onkeyup="this.value = this.value.replace(/[^\d]/g, '')" v-model="BankAccount"></span></section>
        <section><span class="sp1">发票内容</span><span class="sp2"><input type="text" v-model="InvoiceCon"></span></section>
        <section><span class="sp1">收票人姓名</span><span class="sp2"><input type="text" v-model="ReceiveName"></span></section>
        <section><span class="sp1">收票人手机</span><span class="sp2"><input type="tel" v-model="ReceivePhone" @blur="handleBlur(ReceivePhone)"></span></section>
        <section><span class="sp1">所在地区</span><span class="sp2"  @click="handleSelect"><input type="text" readonly v-model="area"><i class="iconfont icon-jinru"></i></span></section>
        <section><span class="sp1">详细地址</span><span class="sp2"><input type="text" v-model="DetailAddress"></span></section>
      </article>
      <section class="confimBtn" @click="InvoiceSubmit">确认</section>
    </div>
    <div class="select-address"  v-else>
      <area-selector @selectArea="handleSelection"></area-selector>
    </div>
  </div>
</template>
<script>
  const AreaSelector = () => import("../../../components/mall/AreaSelector.vue");
  export default {
    data:function () {
      return{
        InvoiceType:'不开发票',
        NoInvoiceSel:true,        //不开发票选择
        NorInvoiceSel:false,      //普通发票选
        SpeInvoiceSel:false,      //增值税发票选择
        PerInvoiceHea:true,       //普通发票个人
        ComInvoiceHea:false,      //普通发票公司
        InvHeacon:'',              //发票抬头
        InvoiceConArr:['商品明细','文具','电脑配件','耗材','日用品','电器数码','家具建材','日化用品'] ,
        InvoiceConIndex:'',
        InvoiceCon:'商品明细',
        areaObj: {},
        showSelection: false,
        area:'',
        invState:'',
        invId:'',
        CompanyName:'',
        IdentNnm:'',
        RegisterPhone:'',
        RegisterAddress:'',
        OpenBank:'',
        BankAccount:'',
        ReceiveName:'',
        ReceivePhone:'',
        area:'',
        DetailAddress:'',
      }
    },
    components:{
      AreaSelector
    },
    methods:{
      //显示区域选择
      handleSelect(){
        this.showSelection = true;
      },
      //监听回调函数
      handleSelection(obj){
        console.log(obj);
        this.area = obj.provice+obj.city+obj.area;
        this.areaObj = obj;
        this.showSelection = false;
      },
      //不开发票
      NoInvoiceFun(){
        this.NoInvoiceSel=true;
        this.NorInvoiceSel=false;
        this.SpeInvoiceSel=false;
        this.InvoiceType='不开发票';
        this.invState=0;
        this.InvoiceCon='';
        this.InvHeacon='';
      },
      //普通发票
      NorInvoiceFun(){
        this.NoInvoiceSel=false;
        this.NorInvoiceSel=true;
        this.SpeInvoiceSel=false;
        this.InvoiceType='普通发票';
        this.PerInvoiceHeaFun();
        this.invState=2;
//        this.InvoiceCon='';
        this.CompanyName='';
        this.IdentNnm='';
        this.RegisterPhone='';
        this.RegisterAddress='';
        this.OpenBank='';
        this.BankAccount='';
        this.ReceiveName='';
        this.ReceivePhone='';
        this.area='';
        this.DetailAddress='';
      },
      //增值税专用发票
      SpeInvoiceFun(){
        this.NoInvoiceSel=false;
        this.NorInvoiceSel=false;
        this.SpeInvoiceSel=true;
        this.InvoiceType='增值税专用发票';
        this.invState=1;
        this.InvoiceCon='';
        this.IdentNnm='';
        this.InvHeacon='';
      },
      //普通发票个人
      PerInvoiceHeaFun(){
        this.PerInvoiceHea=true;
        this.ComInvoiceHea=false;
        this.invState=2;
        this.InvHeacon='';
        this.IdentNnm='';
        this.InvoiceConIndex='';
        this.InvoiceCon='商品明细';
      },
      //普通发票公司
      ComInvoiceHeaFun(){
        this.PerInvoiceHea=false;
        this.ComInvoiceHea=true;
        this.invState=1;
        this.InvHeacon='';
        this.IdentNnm='';
        this.InvoiceConIndex='';
        this.InvoiceCon='商品明细';
      },
      //普通发票商品内容
      InvoiceConFun(index,obj){
        this.InvoiceConIndex=index;
        this.InvoiceCon=obj;
      },
      InvoiceSubmit(){
        if( this.InvoiceType == "增值税专用发票" && !this.checkPhone(this.ReceivePhone)){
          this.$toast("请输出正确的手机号码");
          return false;
        }
        if(this.NoInvoiceSel==true){                          //不开发票
          localStorage.removeItem('invoiceListArr');
          this.invState = 0;
        }
        if(this.NorInvoiceSel==true && this.PerInvoiceHea==true){         //普通发票个人
          if(this.InvHeacon==''){
            this.$toast("请输入个人名字");
            return false;
          }
        }
        if(this.NorInvoiceSel==true && this.ComInvoiceHea==true){         //普通发票公司
          if(this.InvHeacon==''){
            this.$toast("请输入公司全称");
            return false;
          }
          if(this.IdentNnm==''){
            this.$toast("请输入纳税人识别号");
            return false;
          }
        }
        if(this.SpeInvoiceSel==true){       //增值税专用发票
          if(this.CompanyName=='' || this.IdentNnm=='' || this.RegisterAddress=='' || this.RegisterPhone=='' ||
          this.OpenBank=='' || this.BankAccount=='' || this.InvoiceCon=='' || this.ReceiveName=='' || this.ReceivePhone=='' ||
          this.area=='' || this.DetailAddress==''){
            this.$toast("请填写完整的增票资质")
            return false;
          }
        }
        this.axios.post(this.baseURL.mall + "/m/my/saveOrUpdateInvoice"+this.Service.queryString({
          token:this.mallToken.getToken(),
          invId:this.invId,
          invState:this.invState,
          invTitle:this.InvHeacon,
          invContent:this.InvoiceCon,
          invCompany:this.CompanyName,
          invCode:this.IdentNnm,
          invRegPhone:this.RegisterPhone,
          invRegAddr:this.RegisterAddress,
          invRegBname:this.OpenBank,
          invRegBaccount:this.BankAccount,
          invRecName:this.ReceiveName,
          invRecMobphone:this.ReceivePhone,
          invRecProvince:this.areaObj.proviceId+","+this.areaObj.cityId+","+this.areaObj.areaId,
          invGotoAddr:this.DetailAddress,
        })).then(res=>{
          console.log(res);
          if(res.data.h.code==200){
            this.$toast("保存成功");
            setTimeout(() =>{
              this.$router.push({path:'/ConfirmOrder'});
            },1000);
          }else{
            this.$toast(res.data.h.msg);
          }
        })
      },
      /*验证手机号码*/
      checkPhone(phone){
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
          return false;
        }else{
          return true;
        }
      },
      handleBlur(phone){
        console.log(phone);
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
          this.$toast("手机号码有误");
        }
      },
    },
    created(){
      document.title="发票";
      this.invId=localStorage.getItem('setInvoiceId');
      this.axios.post(this.baseURL.mall + "/m/my/queryInvoiceByInvId"+this.Service.queryString({
        token:this.mallToken.getToken(),
        invId:this.invId
      })).then(res=>{
        console.log('已保存发票信息',res);
        let dataB=res.data.b.invoice;
        if(res.data.h.code===200){
          if(dataB.invState==1 && dataB.invRegBname==''){
            this.NorInvoiceFun();
            this.ComInvoiceHeaFun();
            this.InvHeacon=dataB.invTitle;
            this.IdentNnm=dataB.invCode;
            this.InvoiceCon=dataB.invContent;
            this.InvoiceConIndex=this.InvoiceConArr.indexOf(this.InvoiceCon);
          }else if(dataB.invState==2){
            this.NorInvoiceFun();
            this.PerInvoiceHeaFun();
            this.InvHeacon=dataB.invTitle;
            this.InvoiceCon=dataB.invContent;
            this.InvoiceConIndex=this.InvoiceConArr.indexOf(this.InvoiceCon);
          }else if(dataB.invState==1 && dataB.invRegBname!=''){
            this.SpeInvoiceFun();
            this.InvoiceCon=dataB.invContent;
            this.CompanyName=dataB.invCompany;
            this.IdentNnm=dataB.invCode;
            this.RegisterPhone=dataB.invRegPhone;
            this.RegisterAddress=dataB.invRegAddr;
            this.OpenBank=dataB.invRegBname;
            this.BankAccount=dataB.invRegBaccount;
            this.ReceiveName=dataB.invRecName;
            this.ReceivePhone=dataB.invRecMobphone;
            this.area=res.data.b.province;
            this.DetailAddress=dataB.invGotoAddr;
            this.areaObj.provice = res.data.b.province.split(" ")[0];
            this.areaObj.city = res.data.b.province.split(" ")[1];
            this.areaObj.area = res.data.b.province.split(" ")[2];
            this.areaObj.proviceId = res.data.b.provinceIds.split(",")[0];
            this.areaObj.cityId = res.data.b.provinceIds.split(",")[1];
            this.areaObj.areaId = res.data.b.provinceIds.split(",")[2];
          }
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .invoice{
    overflow hidden;
    div{
      article{
        overflow hidden;
      }
      div.height-45{
        position relative;
        height .45rem;
        line-height .45rem;
        padding 0 .1rem;
        background #fff;
        overflow hidden;
        .sp1{
          float left;
          font-size .14rem;
          color #333;
          i{
            font-size .18rem;
            margin-right .1rem;
            vertical-align middle;
          }
          .red{
            color  #d74a45;
          }
          .gray{
            color #ccc;
          }
        }
        .sp2{
          float right;
          font-size .12rem;
          color #666;
          i{
            color #ccc;
            font-size .14rem;
          }
        }
        input{
          width 2.45rem;
          height .25rem;
          background #f3f3f5;
          border-radius 2px;
          font-size .12rem;
          color #333;
          padding-left .1rem;
          box-sizing border-box;
        }
        input:focus{
          outline none;
        }
      }
      .invoice-header{
        margin-top .1rem;
        a{
          display block;
          width 100%;
          height 100%;
        }
      }
      section{
        height .45rem;
        line-height .45rem;
        overflow hidden;
        padding 0 .1rem;
        background #fff;
        span{
          display inline-block;
          font-size .12rem;
          height 100%;
          float left;
        }
        .sp1{
          width .72rem;
          text-align left;
          color #999;
        }
        .sp2 {
          color #333;
          margin-left .15rem;
          position relative;
          height .3rem;
          line-height .3rem;
          margin-top .075rem;
          input{
            width 2.65rem;
            height .3rem;
            background #f7f7fa;
            border-radius 2px;
            padding-left .1rem;
            box-sizing border-box;
          }
          input:focus{
            outline none;
          }
          i{
            color #ccc;
            position absolute;
            right 5px;
            top 0;
          }
        }
        .sp2:after{
          content: "";
          position absolute;
          left 0;
          top 0;
          width 200%;
          height 200%;
          border  1px solid #ccc;
          box-sizing border-box;
          transform scale(0.5);
          transform-origin 0 0;
          pointer-events: none;
        }
      }
      .confimBtn{
        height .5rem;
        line-height .5rem;
        text-align center;
        font-size .16rem;
        color #fff;
        margin-top .75rem;
        background #d74a45;
      }
    }
  }
  .invoice div.height-45:after{
    content: "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height 1px;
    background #e5e5e5;
    transform scaleY(0.5);
  }
</style>
