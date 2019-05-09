<template>
  <div class="address-list-wrapper">
    <div v-if="!editing">
      <div class="address-list">
        <div class="list-item" v-for="(item,i) in addressList" :key="i">
          <div class="consignee list-line">
            <span class="name">{{item.trueName}}</span>
            <span class="tel" v-if="item.telPhone">{{item.telPhone}}</span>
            <span class="tel" v-else>{{item.mobPhone}}</span>
          </div>
          <div class="address">{{item.areaInfo | filterStr}}{{item.address}}</div>
          <div class="operation">
            <div class="left" @click="select(i)">
              <i class="iconfont" :class="selected === i ? 'icon-xuanzhong1' : 'icon-weixuan'"></i>
              <span>设为默认地址</span>
            </div>
            <div class="right">
              <!--<router-link :to="{path:'/malladdress',query:{info:item}}" tag="span" class="edit">编辑</router-link>-->
              <span class="edit" @click="showEdit(item)">编辑</span>
              <span class="delete" @click="deleteAddress(item)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="add-address" @click="showEdit">
        <div class="item-title">新增收货地址</div>
        <i class="iconfont icon-jia"></i>
      </div>
    </div>
    <div class="wrapper" v-else>
      <div class="setting-wrapper" v-if="!showSelection">
        <div class="setting-item">
          <div class="setting-title">收货人</div>
          <input class="setting-content" type="text" placeholder="姓名" v-model="name">
        </div>
        <div class="setting-item">
          <div class="setting-title">联系方式</div>
          <input class="setting-content" type="tel" placeholder="手机号码" v-model="phone" @blur="handleBlur(phone)">
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
          <div class="btn-confirm" :class="submitActive ? 'btn-confirm-active' : ''" @click="handleConfirm">确定</div>
        </div>
      </div>
      <div class="select-address" v-else>
        <area-selector @selectArea="handleSelection"></area-selector>
      </div>
    </div>
    <footer-tab :category="3" v-show="!showSelection"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const AreaSelector = () => import("../../../components/mall/AreaSelector.vue");
  function filterStr(str) {
    try{
      return str.replace(/,/g,'');
    }catch(err){
      console.log(err);
    }
  }
  export default {
    name: "AddressList",
    data(){
      return{
        selected: null,
        addressList: [],
        editing: false,
        areaObj: {},
        infoObj: {},
        area: "",
        areaObj: {},
        name: "",
        phone: "",
        address: "",
        showSelection: false,
      }
    },
    computed:{
      submitActive(){
        if(this.name && this.checkPhone(this.phone) && this.address && this.area){
          return true;
        }else{
          return false;
        }
      }
    },
    components:{
      FooterTab,
      AreaSelector
    },
    created(){
      document.title = "账号设置";
      this.getAddressList();
    },
    filters:{
      filterStr(str){
        return str.replace(/,/g,"");
      }
    },
    methods:{
      select(i){
        let obj = this.addressList[i];
        let _isDefault = obj.isDefault === '1' ? false : true;
        this.axios.post(this.baseURL.mall + '/m/my/setIsDefault' + this.Service.queryString({
          token: this.mallToken.getToken(),
          isDefault: _isDefault,
          addressId: obj.addressId
        })).then(res =>{
          console.log("设置默认地址",res);
          if(res.data.h.code === 200){
            this.selected = _isDefault ? i : null;
            obj.isDefault = _isDefault ? '1' : '0';
            this.addressList.map(function(item,index){
              if(index != i){
                item.isDefault = '0';
              }
            });
          }
        })
      },
      /*获取收货地址*/
      getAddressList(){
        this.axios.post(this.baseURL.mall + '/m/my/queryUserAddress' + this.Service.queryString({
          token: this.mallToken.getToken(),
        })).then(res =>{
          console.log("收货地址",res);
          if(res.data.h.code === 200){
            this.addressList = res.data.b;
            let vm = this;
            this.addressList.map(function(item,index){
              if(item.isDefault == 1){
                vm.selected = index;
              }
            })
          }
        })
      },
      /*删除地址*/
      deleteAddress(item){
        this.$confirm("是否确定删除该地址?").then(() =>{
          this.axios.post(this.baseURL.mall + '/m/my/deleteUserAddress' + this.Service.queryString({
            token: this.mallToken.getToken(),
            addressId: item.addressId,
            isDefault: item.isDefault
          })).then(res =>{
            if(res.data.h.code === 200){
              this.selected = null;
              this.getAddressList();
              setTimeout(()=>{
                this.$toast('删除成功');
              },100);
            }else{
              this.$toast(res.data.h.msg);
            }
          });
        }).catch(err =>{
          console.log("删除失败");
        });
      },
      /*编辑*/
      showEdit(item){
        this.editing = true;
        if(item){
          this.infoObj = this.areaObj = item;
          this.address = item.address;
          this.name = item.trueName;
          this.area = item.areaInfo;
          this.phone = item.telPhone || item.mobPhone;
        }
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
      handleConfirm(){
        if(this.submitActive){
          this.axios.post(this.baseURL.mall + "/m/my/saveOrUpdateUserAddress" + this.Service.queryString({
            token: this.mallToken.getToken(),
            trueName: this.name,
            telPhone: this.phone,
            mobPhone: this.phone,
            isDefault: this.areaObj.isDefault ? this.areaObj.isDefault : "0",
            provinceId: this.areaObj.proviceId,
            cityId: this.areaObj.cityId ? this.areaObj.cityId : "",
            areaId: this.areaObj.areaId ? this.areaObj.areaId : "",
            areaInfo: this.area,
            address: this.address,
            addressId: this.areaObj.addressId ? this.areaObj.addressId : "",
          })).then(res =>{
            console.log("提交结果",res);
            if(res.data.h.code === 200){
              console.log("修改成功");
              this.$toast("保存成功");
              this.editing = false;
              this.getAddressList();
            }
          })
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .address-list-wrapper{
    background white;
  }
  .item-title{
    color: #999;
  }
  .add-address{
    position relative;
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.45rem;
    padding 0 0.1rem;
    &::after{
      content: "";
      position absolute;
      left 0;
      bottom -49px;
      width 100%;
      height 49px;
      background #F4F4F4;
    }
  }
  .list-item{
    position relative;
    box-sizing border-box;
    min-height: 0.8rem;
    padding: 0.15rem 0.1rem 0.1rem 0.1rem;
  }
  .list-item::after{
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
  .list-line{
    font-size 0.14rem;
    line-height 0.18rem;
    color #333;
    white-space nowrap;
    overflow hidden;
    text-overflow ellipsis;
  }
  .operation{
    display flex;
    justify-content space-between;
    align-items center;
    margin-top 0.06rem;
    line-height 1;
  }
  .left{
    font-size 0;
    .iconfont{
      margin-right 0.05rem;
      vertical-align sub;
    }
    span{
      font-size 0.12rem;
      color #999;
    }
  }
  .right{
    font-size 0;
    span{
      font-size 0.12rem;
    }
    .edit{
      color: #ff8800;
      margin-right 0.2rem;
    }
    .delete{
      color: #333;
    }
  }
  .icon-xuanzhong1{
    color: #d74a45;
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
