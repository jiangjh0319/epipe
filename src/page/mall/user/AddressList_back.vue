<template>
  <div class="address-list-wrapper">
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
            <router-link :to="{path:'/malladdress',query:{info:item}}" tag="span" class="edit">编辑</router-link>
            <span class="delete" @click="deleteAddress(item.addressId)">删除</span>
          </div>
        </div>
      </div>
    </div>
    <router-link to="malladdress" tag="div" class="add-address">
      <div class="item-title">新增收货地址</div>
      <i class="iconfont icon-jia"></i>
    </router-link>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  export default {
    name: "AddressList",
    data(){
      return{
        selected: null,
        addressList: [],
      }
    },
    components:{
      FooterTab
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
      deleteAddress(id){
        let vm = this;
          this.$confirm("是否确定删除该地址?").then(() =>{
            this.axios.post(this.baseURL.mall + '/m/my/deleteUserAddress' + this.Service.queryString({
              token: this.mallToken.getToken(),
              addressId: id
            })).then(res =>{
              if(res.data.h.code === 200){
                this.selected = null;
                this.getAddressList();
              }else{
                this.$toast(res.data.h.msg);
              }
            });
          }).catch(err =>{
            console.log("删除失败");
          });
      }
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
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.45rem;
    padding 0 0.1rem;
    margin-bottom 50px;
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
</style>
