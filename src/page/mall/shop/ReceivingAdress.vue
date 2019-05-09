<template>
  <div>
    <div class="receiving-adress" v-if="showState">
      <div class="adress" v-for="(obj,i) in addressList" :key="i">
        <div><i class="iconfont icon-xuanzhong1" :class="obj.isDefault==1 ? 'red' : 'gray'" @click="defalutAddress(i)"></i></div>
        <div class="address-content">
          <p><span>{{obj.trueName}}</span><span>{{obj.telPhone}}</span></p>
          <p>{{obj.areaInfo}}{{obj.address}}</p>
        </div>
        <div @click="editAdress(i)"><i class="iconfont icon-bianji"></i></div>
      </div>
      <div class="adress-add">
        <div class="add-address">新增收货地址</div>
        <div @click="addNewAddress"><i class="iconfont icon-jia"></i></div>
      </div>
    </div>
    <div class="wrapper" v-if="!showState">
      <div class="setting-wrapper" v-if="!showSelection">
        <div class="setting-item">
          <div class="setting-title">收货人</div>
          <input class="setting-content" type="text" placeholder="姓名" v-model="name">
        </div>
        <div class="setting-item">
          <div class="setting-title">联系方式</div>
          <input class="setting-content" type="tel" placeholder="手机号码" v-model="phone">
        </div>
        <div class="setting-item">
          <div class="setting-title">所在区域</div>
          <div class="setting-content area" @click="handleSelect">{{area}}</div>
          <i class="iconfont icon-jinru"></i>
        </div>
        <div class="setting-item setting-address">
          <div class="setting-title">详细地址</div>
          <textarea name="address" id="textarea" placeholder="详细地址需填写镇乡路及楼栋楼层房间号信息" maxlength="50" v-model="address"></textarea>
        </div>
        <div class="btn-wrapper">
          <div class="btn-confirm" :class="submitActive ? 'btn-confirm-active' : ''" @click="handleConfirm(addressId)">确定</div>
        </div>
      </div>
      <div class="select-address" v-else>
        <area-selector @selectArea="handleSelection"></area-selector>
      </div>
    </div>
  </div>
</template>
<script>
  const AreaSelector = () => import("../../../components/mall/AreaSelector.vue");
  export default {
    data:function () {
      return{
        addressList:[],
        showState:true,
        area: "",
        areaObj: {},
        name: "",
        phone: "",
        address: "",
        showSelection: false,
        addressId:'',
        isDefault: 0,
      }
    },
    components:{
      AreaSelector
    },
    methods:{
      //获取所有收件地址
      getAddressList(){
        this.axios.post(this.baseURL.mall + "/m/my/queryUserAddress"+this.Service.queryString({
          token:this.mallToken.getToken(),
        })).then(res=>{
          console.log(res);
          if(res.data.h.code==200){
            this.addressList=res.data.b;
          }else{
            this.$toast(res.data.h.msg);
          }
        })
      },
      //设置默认收件地址
      defalutAddress(index){
        console.log(index);
        if(this.addressList[index].isDefault==0){
          this.axios.post(this.baseURL.mall + "/m/my/setIsDefault" + this.Service.queryString({
            token: this.mallToken.getToken(),
            isDefault:true,
            addressId:this.addressList[index].addressId
          })).then(res =>{
            console.log("提交结果",res);
            if(res.data.h.code==200){
              this.getAddressList();
            }
          })
        }
      },
      //编辑收件地址
      editAdress(index){
        console.log(index);
        this.showState=false;
        this.name=this.addressList[index].trueName;
        this.phone=this.addressList[index].telPhone;
        this.area=this.addressList[index].areaInfo;
        this.address=this.addressList[index].address;
        this.addressId=this.addressList[index].addressId;
        this.isDefault = this.addressList[index].isDefault;
      },
      //新增地址
      addNewAddress(){
        this.showState=false;
        this.name='';
        this.phone='';
        this.area='';
        this.address='';
        this.addressId='';
      },
      /*显示区域选择*/
      handleSelect(){
        this.showSelection = true;
      },
      /*监听回调函数*/
      handleSelection(obj){
        console.log(obj);
        this.area = obj.provice+obj.city+obj.area;
        this.areaObj = obj;
        this.showSelection = false;
      },
      /*确定*/
      handleConfirm(addressId){
        if(this.submitActive){
          this.axios.post(this.baseURL.mall + "/m/my/saveOrUpdateUserAddress" + this.Service.queryString({
            token: this.mallToken.getToken(),
            trueName: this.name,
            telPhone: this.phone,
            mobPhone:this.phone,
            isDefault: this.isDefault,
            provinceId: this.areaObj.proviceId,
            cityId: this.areaObj.cityId ? this.areaObj.cityId : "",
            areaId: this.areaObj.areaId ? this.areaObj.areaId : "",
            areaInfo: this.area,
            address: this.address,
            addressId:addressId ? addressId : ''
          })).then(res =>{
            console.log("提交结果",res);
            if(res.data.h.code==200){
              this.$toast("保存成功");
              this.showState=true;
              this.getAddressList();
            }else{
              this.$toast(res.data.h.msg);
            }
          })
        }
      },
    },
    computed:{
      submitActive(){
        if(this.name && this.phone && this.address && this.area){
          return true;
        }else{
          return false;
        }
      }
    },
    created(){
      document.title="收货地址";
      this.getAddressList();
    }
  }
</script>
<style lang="stylus" scoped>
  .adress{
    display flex;
    justify-content space-between;
    align-items center;
    align-content center;
    min-height .65rem;
    padding 0 .1rem;
    background #fff;
    border-bottom 1px solid #e5e5e5;
    .address-content{
      flex 2;
    }
    div{
      /*float left;*/
      /*position relative;*/
      /*top 50%;*/
      /*transform translateY(-50%);*/
      i{
        font-size .2rem;
      }
      p{
        font-size .12rem;
        line-height .18rem;
        color #333;
        span{
          margin-right .1rem;
        }
      }
    }
    div:first-child{
      margin-right .15rem;
      .red{
        color #d74a45;
      }
      .gray{
        color #ccc;
      }
    }
    div:last-child{
      float right;
      i{
        color #ccc;
      }
    }
  }
  .adress-add{
    display flex;
    justify-content space-between;
    align-items center;
    height .45rem;
    padding 0 0.1rem;
    background white;
    .add-address{
      font-size .12rem;
      color #ccc;
    }
  }
  .setting-wrapper{
    background: white;
  }
  .setting-item{
    position relative;
    display flex;
    justify-content flex-start;
    align-items center;
    padding 0 0.1rem;
    height: 0.45rem;
    .setting-title{
      width: 4.5em;
      font-size 0.14rem;
      color #999;
    }
    .setting-content{
      height: inherit;
      width: 2.8rem;
      line-height 0.45rem;
      margin-left 0.1rem;
      outline none;
      color: #333;
    }
  }
  .setting-item::after{
    content: "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height: 1px;
    background #e9e9e9;
    transform scaleY(0.5);
    transform-origin center;
  }
  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
    font-size 0.14rem;
    color: #ccc;
  }
  input,textarea{
    font-size 0.14rem;
    color: #333;
  }
  .icon-jinru{
    position absolute;
    right: 0.1rem;
    color: #999;
  }
  .setting-address{
    align-items flex-start;
    height: 0.4rem;
    padding: 0.12rem 0.1rem;
    textarea{
      height: 0.4rem;
      width: 3rem;
      margin-left 0.1rem;
      border none;
      outline none;
    }
  }
  .btn-wrapper{
    padding-top 0.15rem;
    padding-bottom 0.25rem;
  }
  .btn-confirm{
    width: 3.55rem;
    height: 0.45rem;
    margin 0 auto;
    border-radius 4px;
    line-height 0.45rem;
    text-align center;
    background #ddd;
    color: white;
    font-size 0.15rem;
  }
  .btn-confirm-active{
    background #d95757;
  }
  .icon-jinru{
    font-size 0.12rem;
    color #ccc;
  }
</style>
