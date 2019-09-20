<style scoped lang="stylus">
    .application-wrapper{
      padding-bottom: 0.5rem;
    }
    .form-wrapper{
      margin-top: 0.59rem;
      padding-left: 0.15rem;
      background: white;
    }
    .form-item{
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      padding-right: 0.15rem;
      .form-title{
        font-size: 0.16rem;
        color: #333;
        white-space: nowrap;
      }
      .form-content{
        height: 100%;
        width: 2.5rem;
        line-height: 48px;
        text-align: right;
        font-size: 0.14rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .form-item:not(:last-child){
      border-bottom: 1px solid #EAEAEA;
    }
    .btn-submit{
      width: 3.45rem;
      height: 0.5rem;
      margin: 0 auto;
      margin-top: 0.5rem;
      border-radius: 0.25rem;
      background: #ddd;
      color: white;
      text-align: center;
      line-height: 0.5rem;
      font-size: 0.18rem;
    }
  .btn-active{
    background: #499844;
  }
  .tips-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 0.15rem;
    margin-bottom: 0.3rem;
    font-size: 0.12rem;
    .link{
      color: #46BCE8;
    }
  }
  .organize span{
    color: #FF8800;
  }
  .icon-select{
    width: 0.16rem;
    height: 0.16rem;
    margin-right: 2px;
  }
  .show-img{
    padding-right: 0.15rem;
    text-align: right;
    .img{
      display: inline-block;
      width: 0.8rem;
      height: 0.6rem;
      margin: 0.1rem 0;
      border-radius: 0.1rem;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.44rem;
    background: #42a653;
    text-align: center;
    line-height: 0.44rem;
    color: #fff;
    font-size: 0.185rem;
    letter-spacing: 0.012rem;
    .back{
      position: absolute;
      left: 0;
      width: 0.5rem;
      text-align: left;
      .icon-back{
        font-size: 0.17rem;
        margin-left: 0.1rem;
      }
    }
  }

  input{
      height 0.48rem;
      width 100%;
      outline none
      color #666;
      font-size 0.14rem;
      text-align right;
  }

  .dialog{
      position fixed;
      width 100%;
      height 100%;
      top 0;
      z-index 5;
      font-size 0.18rem;
      background-color rgba(0,0,0,0.5)

      .dialog_box{
          width 2.7rem;
          height 0.8rem;
          position absolute;
          left 0;
          right 0;
          top 0;
          bottom 0;
          margin auto;
          background #fff;
          text-align center;
      }
      
      .dialog_option{
        height 0.4rem;
        line-height 0.4rem;
        position relative;
        font-size:0.16rem;
      }

       .dialog_border{
        border 1px solid #f5f5f5
      }
  }
</style>

<template>
  <div class="application-wrapper">
      <LOADING v-show="loading"></LOADING>
      <div class="header">
        <div class="back" @click="goback()">
          <svg class="icon icon-back" aria-hidden="false">
            <use xlink:href="#icon-zuoyoujiantou"></use>
          </svg>
        </div>
        {{title}}
      </div>
      <div class="form-wrapper">
        <div class="form-item">
          <div class="form-title">组织名称</div>
          <div class="form-content">
            <div>
              <input v-model="organization" placeholder="请输入组织全称，限制20字以内"/>
             
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">组织类型</div>
          <div class="form-content organize" @click="isShow=true">
            <!--<router-link :to="{ path:'/edit', query: { title:  '组织类型',bg: '#0fc37c',value:this.category} }">-->
              <!--<span v-if="category.length > 0">{{category}}</span>-->
              <!--<span v-else>企业</span>-->
              <!--<svg class="icon icon-into" aria-hidden="false">-->
                <!--<use xlink:href="#icon-into"></use>-->
              <!--</svg>-->
            <!--</router-link>-->
              <span v-html="category==1?'企业':'集团'"></span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">地区</div>
          <div class="form-content" @click="set_address()">
              <span v-if="address">{{address}}</span>
              <span v-else>请选择地址</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">联系人</div>
          <div class="form-content">
            <div>
              <input v-model="name" placeholder="请输入联系人姓名"/>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">手机号码</div>
          <div class="form-content">
            <div>
              <input v-model="phone" placeholder="请输入手机号码"/>
            
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">企业资质(营业执照)</div>
          <div class="form-content" @click="upload_file()">
              <span v-if="img_src.length > 0">上传成功</span>
              <span v-else>请上传企业营业执照</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
          </div>
        </div>
        <div class="show-img" v-if="img_src" @click="imgdetail()">
          <div class="img" :style="{backgroundImage:'url('+img_src+')'}"></div>
        </div>
      </div>
      <div class="btn-submit btn-active"  @click="submit(1)">保存</div>
    

    <div class="dialog" v-show="isShow" @touchmove.prevent>
            <div class="dialog_box">
                <div class="dialog_option dialog_border" @click="organizationFn(1)">企业</div>
                <div class="dialog_option" @click="organizationFn(0)">集团</div>
            </div>
        </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import TopHead from "../../components/topheader.vue"    //引入导航栏
  import LOADING from "../../components/loading.vue";
  export default{
    components:{
      TopHead,
      LOADING,
    },
    data(){
      return{
        phone:"",
        email : "",
        organization:"",
        category:"",
        address:'',
        name:'',
        provinceId:'',
        cityId:'',
        areaId:'',
        img_src:"", //营业执照图片地址

        submit_active: false,
        selected: true,
        loading: false,
        isShow:false,
        isInfo:false,
        title:'创建组织',
        centerGroupId:''
      }
    },
    methods: {
      ...mapMutations([
        'edit_status',
        'edit_address',
        'edit_province',
        'edit_city',
        'edit_area',
        'edit_img',
        'edit_tel',
        'edit_mail',
      ]),
      select(){
        this.selected = !this.selected;
        this.isActive();
      },
      //上传营业执照
      upload_file(){
        let vm = this;
        window.location.href = "epipe://?&mark=upload";
        window["epipe_upload_callback"] = URL => {
          vm.img_src = URL;
          vm.isActive();
//          alert("组织:"+this.organization+"简称:"+ this.abbreviation+"姓名:"+ this.name +"手机:"+ this.phone +"邮箱:"+ this.email +"协议:"+ this.selected +"执照:"+ this.img_src);
        }
      },
      //选择地区
      set_address(){
        let vm = this;
        window.location.href = "epipe://?&mark=area";
        window["epipe_address_callback"] = json => {
          let data = JSON.parse(json);
          data.provinceId = data.provinceId?data.provinceId:"";
          data.cityId = data.cityId?data.cityId:"";
          data.areaId = data.areaId?data.areaId:"";
          data.provinceName = data.provinceName?data.provinceName:"";
          data.cityName = data.cityName?data.cityName:"";
          data.areaName = data.areaName?data.areaName:"";
          vm.address = data.provinceName+" "+data.cityName+" "+data.areaName,
          vm.provinceId = data.provinceId;
          vm.cityId = data.cityId;
          vm.areaId = data.areaId;
          vm.edit_address(vm.address);
          vm.edit_province(vm.provinceId);
          vm.edit_city(vm.cityId);
          vm.edit_area(vm.areaId);
        }
      },
      //提交创建组织申请
      submit(type){
        if(true){

          if(this.organization==''){
            this.$toast('组织名称不能为空')
          }else if(this.phone==''){
            this.$toast('手机号码不能为空')
          }else if(this.name==""){
            this.$toast('联系人不能为空')
          }

          this.submit_active = false;
          this.loading = true;
          let vm = this,params={};
//          alert("地址:"+vm.address+"省份ID:"+vm.provinceId+",城市ID:"+vm.cityId+
//            ",区域ID:"+vm.areaId+",企业:"+vm.organization+"简称:"+vm.abbreviation+"类型:"+vm.category+"手机:"+vm.phone+"邮箱:"+vm.email);
            params={
              centerGroupId:vm.centerGroupId,
                universalName: vm.organization,
                abbreviationName: vm.organization,
                organizationType: vm.category,
                provinceId: vm.provinceId,
                cityId: vm.cityId,
                areaId: vm.areaId,
                datailAddress: vm.address,
                contactName: vm.name,
                contactMobile: vm.phone,
                contactMail: vm.email,
                bussinessLicUrl: vm.img_src
            }
            if(type==1){
              params.id = this.$route.query.id;
            }
          this.axios.post(vm.Service.createOrg + vm.Service.queryString(params)).then(function (res) {
            console.log("提交申请",res);
            vm.submit_active = true;
            vm.loading = false;
            if(res.data.h.code === 200){
              vm.$toast("提交成功");
              window.location.href = "epipe://?&mark=pending";
            }else{
              vm.$toast(res.data.h.msg);
            }
          });
        }else{
          console.log("资料未填写完成");
        }
      },
      //判断是否激活提交按钮
      isActive(){
        if((this.organization && this.abbreviation && this.name && this.selected && this.img_src) && (this.phone || this.email)){
          this.submit_active = true;
        }else{
          this.submit_active = false;
        }
      },
      //组织类型选择
      organizationFn(type){
          this.category = type
          this.isShow = false;
      },
      /*返回*/
      goback(){
        window.location.href = "epipe://?&mark=history_back";
      },
      /*查看图片*/
      imgdetail(){
        let obj = {index_num: 0, data: [this.img_src], type: "0"}
        window.location.href = "epipe://?&mark=imgdetail&url=" + JSON.stringify(obj);
      },
      /*服务使用协议*/
      registertext(){
        window.location.href = "epipe://?&mark=registertext";
      },
      /*跳转隐私协议*/
      agreement(){
        window.location.href = "epipe://?&mark=agreement";
      },
      /*用户信息*/
      userInfo(){
        let vm = this;
        this.axios.get(this.Service.userInfo).then(res =>{
          console.log("用户信息",res);
          if(res.data.b.mobile && !vm.$store.state.create.tel){
            vm.phone = res.data.b.mobile;
          }
          if(res.data.b.email && !vm.$store.state.create.email){
            vm.email = res.data.b.email;
          }
          vm.isActive();
        });
      },
      getOrganInfo(){
        let vm = this;
          this.axios.get('organ/user/createorgan/info?officeJoinId='+this.$route.query.id).then(res=>{
              let data = res.data.b;
              vm.phone = data.contactMobile;
              vm.email = data.contactMail;
              vm.organization = data.universalName
              vm.category=data.organizationType
              vm.address =data.detailAddress
              vm.name = data.contactName
              vm.provinceId = data.provinceId
              vm.cityId = data.cityId
              vm.areaId = data.areaId
              vm.centerGroupId = data.centerGroupId;
              vm.img_src = data.qualificationsUrls
          })
      }
    },
    created(){
     
    },
    beforeDestroy() {
     
    },
    mounted(){
      
        this.getOrganInfo()
        this.isInfo = this.$route.query.info
        this.title = this.$route.query.title;
     
      
    },
  }
</script>
