<template>
  <div class="spec-invoice">
    <div  v-if="!showSelection">
      <div class="tit">增票资质</div>
      <section><div class="sp1">单位名称</div><div class="sp2"><input type="text" v-model="CompanyName"></div></section>
      <section><div class="sp1">纳税人识别号</div><div class="sp2"><input type="text" v-model="IdentNnm"></div></section>
      <section><div class="sp1">注册地址</div><div class="sp2"><input type="text" v-model="RegisterAddress"></div></section>
      <section><div class="sp1">注册电话</div><div class="sp2"><input type="text" v-model="RegisterPhone"></div></section>
      <section><div class="sp1">开户银行</div><div class="sp2"><input type="text" v-model="OpenBank"></div></section>
      <section><div class="sp1">银行账号</div><div class="sp2"><input type="text" v-model="BankAccount"></div></section>
      <section><div class="sp1">发票内容</div><div class="sp2"><input type="text" v-model="InvoiceCon"></div></section>
      <section><div class="sp1">收票人姓名</div><div class="sp2"><input type="text" v-model="ReceiveName"></div></section>
      <section><div class="sp1">收票人手机</div><div class="sp2"><input type="text" v-model="ReceivePhone"></div></section>
      <section>
        <div class="sp1">所在地区</div>
        <div class="sp2" @click="handleSelect">
          <input type="text"  readonly  v-model="area">
          <i class="iconfont icon-jinru"></i>
        </div>
      </section>
      <section><div class="sp1">详细地址</div><div class="sp2"><input type="text" v-model="DetailAddress"></div></section>
      <section class="confimBtn" @click="SaveInvoice">保存</section>
    </div>
    <div class="select-address" v-else>
      <area-selector @selectArea="handleSelection"></area-selector>
    </div>
  </div>
</template>
<script>
  const AreaSelector = () => import("../../../components/mall/AreaSelector.vue");
  export default {
    data:function () {
      return{
        areaObj: {},
        showSelection: false,
        CompanyName:'',
        IdentNnm:'',
        RegisterAddress:'',
        RegisterPhone:'',
        OpenBank:'',
        BankAccount:'',
        InvoiceCon:'',
        ReceiveName:'',
        ReceivePhone:'',
        area:'',
        BelongAddress:'',
        DetailAddress:'',
        InvoiceArr:[]
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
      SaveInvoice(){
        this.InvoiceArr.push(this.CompanyName);
        this.InvoiceArr.push(this.IdentNnm);
        this.InvoiceArr.push(this.RegisterAddress);
        this.InvoiceArr.push(this.RegisterPhone);
        this.InvoiceArr.push(this.OpenBank);
        this.InvoiceArr.push(this.BankAccount);
        this.InvoiceArr.push(this.InvoiceCon);
        this.InvoiceArr.push(this.ReceiveName);
        this.InvoiceArr.push(this.ReceivePhone);
        this.InvoiceArr.push(this.area);
        this.InvoiceArr.push(this.DetailAddress);
        console.log(this.InvoiceArr);
        localStorage.setItem("InvoiceInfo",this.InvoiceArr.join(','));
        //console.log(localStorage.getItem("InvoiceInfo"));
        if(localStorage.getItem('InvoiceInfo')!==null && localStorage.getItem('InvoiceInfo')!=='null'){
          this.$router.push({path:'/Invoice'});
        }
      }
    },
    created(){
      document.title="增票资质";
      localStorage.setItem("SpecialInvoice",true);
      console.log(localStorage.getItem("SpecialInvoice"));
    }
  }
</script>
<style lang="stylus" scoped>
  .spec-invoice{
    overflow hidden;
    .tit{
      height .45rem;
      line-height .45rem;
      text-align center;
      background #fff;
      font-size .16rem;
      color #333;
      position relative;
    }
    .tit:after{
      content: "";
      position absolute;
      left 0;
      bottom 0;
      width 100%;
      height 1px;
      background #e5e5e5;
      transform scaleY(0.5);
    }
    section{
      height .45rem;
      line-height .45rem;
      overflow hidden;
      padding 0 .1rem;
      background #fff;
      div{
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
        height .3rem;
        line-height .3rem;
        margin-top .075rem;
        width 2.65rem;
        position relative;
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
</style>
