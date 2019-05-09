<style scoped lang="stylus">
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
        width: 2rem;
        line-height: 48px;
        text-align: right;
        font-size: 0.14rem;
        color: #666;
        white-space: nowrap;
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
    background: #0fc37c;
  }
  .btn-active:active{
    transform: scale(0.9);
  }
</style>

<template>
  <div class="application-wrapper">
      <TopHead bgcolor="#0fc37c" title="申请加入"></TopHead>
      <div class="form-wrapper">
        <div class="form-item">
            <div class="form-title">公司名称</div>
            <div class="form-content">{{company}}</div>
        </div>
        <div class="form-item">
          <div class="form-title">部门</div>
          <div class="form-content">
            <router-link :to="{ path:'/department',query:{selected: this.department_id,company_id:this.id}}">
              <span v-if="department">{{department}}</span>
              <span v-else>请选择部门</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">姓名</div>
          <div class="form-content">
            <router-link :to="{ path:'/edit', query: { title:  '姓名',bg: '#0fc37c',value: this.name} }">
              <span  v-if="name.length > 0">{{name}}</span>
              <span v-else>请输入姓名</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">手机</div>
          <div class="form-content" v-if="phone.length>0">
            <span>{{phone}}</span>
          </div>
          <div class="form-content" v-else @click="bindMobile()">
              <span>绑定手机号</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
          </div>
        </div>
        <div class="form-item">
          <div class="form-title">邮箱</div>
          <!-- <div class="form-content" v-if="email.length>0">
              <span>{{email}}</span>
          </div> -->
          <div class="form-content" >
            <router-link :to="{ path:'/edit', query: { title: '邮箱',bg: '#0fc37c',value: this.email} }">
              <span>{{email}}</span>
              <svg class="icon icon-into" aria-hidden="false">
                <use xlink:href="#icon-into"></use>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      <div class="btn-submit" :class="{'btn-active': submit_active}" @click="apply()">提交</div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import TopHead from "../../components/topheader.vue"    //引入导航栏
  export default{
    components:{
      TopHead,
    },
    data(){
      return{
        company: this.$route.query.name,
        id: this.$route.query.id,
        name: this.$store.state.application.name?this.$store.state.application.name:"",
        email: this.$store.state.application.email?this.$store.state.application.email:"设置",
        phone: this.$store.state.application.phone?this.$store.state.application.phone:"",
        department: this.$store.state.application.department?this.$store.state.application.department:"",
        department_id: -1,
        submit_active: false,
      }
    },
    methods: {
      ...mapMutations([
        'edit_name',
        'edit_email',
        'edit_phone',
        'edit_department',
        'edit_departmentID',
        'changeStatus',
      ]),
      /*绑定手机号码*/
      bindMobile(){
        var vm = this;
        window.location.href = "epipe://?&mark=mobile";
        window["epipe_mobile_callback"] = MOBILE => {
          vm.phone = MOBILE;
        }
      },
      /*查询用户信息*/
      userInfo(){
        let vm = this;
        this.axios.get(this.Service.userInfo).then(function (res) {
          console.log("用户信息",res);
          if(res.data.b.name){
            vm.name = res.data.b.name;
            vm.edit_name(res.data.b.name);
          }
          if(res.data.b.mobile){
            vm.phone = res.data.b.mobile;
          }
          if(res.data.b.email){
            vm.email = res.data.b.email;
          }
          if(res.data.b.officeName){
            vm.department = res.data.b.officeName
          }
          if((vm.name && vm.phone) || (vm.name && vm.email)){
            vm.submit_active = true;
          }
        });
      },
      /*提交申请*/
      apply(){
        let vm = this;
        if(vm.submit_active){
          vm.submit_active = false;
          this.axios.post(this.Service.application+this.Service.queryString({
            companyId: vm.id,
            officeId: vm.department_id
          })).then(res =>{
            console.log("提交申请",res);
            vm.submit_active = true;
            if(res.data.h.code == 200){
              vm.$toast("申请成功");
              setTimeout(function(){
                window.location.href = "epipe://?&mark=pending";
              },1000);
            }else{
              this.$toast(res.data.h.msg);
            }
          });
        }
      },
    },
    created(){
      eventBus.$on('getTarget', target => {
        console.log(target);
        let vm = this;
        let title = target.title;
        switch (title){
          case "姓名":
            vm.name = target.txt;
            vm.edit_name(target.txt);
            console.log("姓名",vm.name);
            break;
          case "邮箱":
            vm.email = target.txt;
            vm.edit_email(target.txt);
            console.log("邮箱",vm.email);
            break;
          case "手机":
            vm.phone = target.txt;
            vm.edit_phone(target.txt);
            break;
          case "部门":
            vm.department = target.txt;
            vm.department_id = target.id;
            vm.edit_department(target.txt);
            vm.edit_departmentID(target.id);
            break;
        }
      });
    },
    beforeDestroy() {
      eventBus.$off('getTarget');
    },
    mounted(){
      //如果vuex中的has_changed字段为true，则说明数据已经更新，显示弹框，然后重置该值为false
      if(this.$store.state.application.has_changed){
        setTimeout(() =>{
          this.$toast('修改成功');
        },150);
        this.changeStatus(false);
        console.log("发生数据更新了");
      }
      this.userInfo();
    },
  }
</script>
