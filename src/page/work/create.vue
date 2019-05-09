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
    background: #499844;
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
        创建组织
      </div>
      <div class="form-wrapper">
        <div class="form-item">
          <div class="form-title">组织名称</div>
          <div class="form-content">
            <router-link :to="{ path:'/edit', query: { title:  '组织名称',bg: '#499844',value: this.organization} }">
              <span v-if="organization.length > 0">{{organization}}</span>
              <span v-else>请输入组织全称，限制20字以内</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">组织简称</div>
          <div class="form-content">
            <router-link :to="{ path:'/edit', query: { title:  '组织简称',bg: '#499844',value:this.abbreviation} }">
              <span v-if="abbreviation.length > 0">{{abbreviation}}</span>
              <span v-else>请输入组织简称，限制10字以内</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
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
            <router-link :to="{ path:'/edit', query: { title:  '联系人',bg: '#499844',value:this.name} }">
              <span v-if="name.length > 0">{{name}}</span>
              <span v-else>请输入联系人姓名</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">手机号码</div>
          <div class="form-content">
            <router-link :to="{ path:'/edit', query: { title:  '手机号码', bg: '#499844',value:this.phone}}">
              <span  v-if="phone.length > 0">{{phone}}</span>
              <span v-else>请输入联系人手机号码</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">邮箱</div>
          <div class="form-content">
            <router-link :to="{ path:'/edit', query: { title:  '设置邮箱',bg: '#499844',value:this.email} }">
              <span v-if="email.length > 0">{{email}}</span>
              <span v-else>请输入联系人邮箱</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
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
      <div class="btn-submit" :class="{'btn-active':submit_active}" @click="submit()">提交</div>
      <div class="tips-wrapper">
        <div  @click="select()">
          <svg class="icon icon-select" aria-hidden="false">
            <use xlink:href="#icon-chenggong" v-if="selected"></use>
            <use xlink:href="#icon-meiyouxuanzhong" v-else></use>
          </svg>
        </div>
        <p>
          提交表示您已同意
          <span class="link" @click="registertext()">《隐私保护政策》</span>
          和
          <span class="link" @click="agreement()">《服务使用协议》</span>
        </p>
      </div>

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
        organization: this.$store.state.create.organization?this.$store.state.create.organization:"",
        abbreviation: this.$store.state.create.abbreviation?this.$store.state.create.abbreviation:"",
        category: this.$store.state.create.category?this.$store.state.create.category:"1",
        area: this.$store.state.create.area?this.$store.state.create.area:"",
        name: this.$store.state.create.chargeman?this.$store.state.create.chargeman:"",
        phone: this.$store.state.create.tel?this.$store.state.create.tel:"",
        email: this.$store.state.create.email?this.$store.state.create.email:"",
        submit_active: false,
        selected: true,
        img_src: this.$store.state.create.img?this.$store.state.create.img:"", //营业执照图片地址
        provinceId: this.$store.state.create.provinceId?this.$store.state.create.provinceId:"",  //省份id
        cityId: this.$store.state.create.cityId?this.$store.state.create.cityId:"",  //城市id
        areaId: this.$store.state.create.areaId?this.$store.state.create.areaId:"",  //城区id
        address: this.$store.state.create.address?this.$store.state.create.address:"",  //详细地址
        loading: false,
        isShow:false,
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
          vm.edit_img(vm.img_src);
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
      submit(){
        if(this.submit_active){
          this.submit_active = false;
          this.loading = true;
          let vm = this;
//          alert("地址:"+vm.address+"省份ID:"+vm.provinceId+",城市ID:"+vm.cityId+
//            ",区域ID:"+vm.areaId+",企业:"+vm.organization+"简称:"+vm.abbreviation+"类型:"+vm.category+"手机:"+vm.phone+"邮箱:"+vm.email);
          this.axios.post(vm.Service.createOrg + vm.Service.queryString({
            universalName: vm.organization,
            abbreviationName: vm.abbreviation,
            organizationType: vm.category,
            provinceId: vm.provinceId,
            cityId: vm.cityId,
            areaId: vm.areaId,
            datailAddress: vm.address,
            contactName: vm.name,
            contactMobile: vm.phone,
            contactMail: vm.email,
            bussinessLicUrl: vm.img_src
          })).then(function (res) {
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
    },
    created(){
      eventBus.$on('getTarget', target => {
        console.log(target);
        let vm = this;
        let title = target.title;
        switch (title){
          case "组织名称":
            vm.organization = target.txt;
            vm.edit_organization(target.txt);
            console.log("组织名称",vm.organization);
            break;
          case "组织简称":
            vm.abbreviation = target.txt;
            vm.edit_abbreviation(target.txt);
            console.log("邮箱",vm.abbreviation);
            break;
          case "组织类型":
            vm.category = target.txt;
            break;
          case "联系人":
            vm.name = target.txt;
            vm.edit_chargeman(target.txt);
            break;
          case "手机号码":
            vm.phone = target.txt;
            vm.edit_tel(target.txt);
            break;
          case "邮箱":
            vm.email = target.txt;
            vm.edit_mail(target.txt);
            break;
        }
      });
    },
    beforeDestroy() {
      eventBus.$off('getTarget');
    },
    mounted(){
      this.userInfo();
      //如果vuex中的has_changed字段为true，则说明数据已经更新，显示弹框，然后重置该值为false
      if(this.$store.state.create.has_changed){
        setTimeout(() =>{
          this.$toast('修改成功');
        },150);
        this.edit_status(false);
        console.log("发生数据更新了");
      }
    },
  }
</script>
