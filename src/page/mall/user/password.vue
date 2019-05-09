<template>
  <div class="password-wrapper">
    <!--<div class="setting-item">-->
      <!--<div class="setting-title">旧密码</div>-->
      <!--<input type="text" v-model="oldPassword">-->
    <!--</div>-->
    <div class="setting-item">
      <input type="text" v-model="mobile" readonly>
      <button class="verifi-code" :class="btnclass" :disabled="btndisabled" @click="sendcode">{{btntxt}}</button>
    </div>
    <div class="setting-item">
      <input type="text" class="inputpart" placeholder="请输入收到的验证码" v-model="verCode">
    </div>
    <div class="setting-item">
      <!--<div class="setting-title">新密码</div>-->
      <input type="password" v-model="newPassword" placeholder="请输入新密码">
    </div>
    <div class="setting-item">
      <!--<div class="setting-title">确认新密码</div>-->
      <input type="password" v-model="confirmPassword" placeholder="请再次输入新密码">
    </div>
    <div class="btn" :class="{'btn-confirm': confirmFlag}" @click="handleConfirm">确认</div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  export default {
    name: "MallPassword",
    components:{
      FooterTab
    },
    data(){
      return{
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        mobile: "",
	      verCode:"",
	      btndisabled:false,
	      btntxt:"获取验证码",
	      tips:'',
	      btnclass:"verifi-code-false",
      }
    },
    created(){
      document.title = "账号设置";
      this.getData();
    },
    computed:{
      confirmFlag(){
        if( this.newPassword && this.confirmPassword && this.verCode){
          return true;
        }else{
          return false;
        }
      }
    },
    methods:{
	    sendcode() {
        this.time=60;
        this.btndisabled=true;
        this.btnclass="verifi-code-true";
        this.timer();
        this.axios.post(this.baseURL.mall+"/m/user/sendMessage"+this.Service.queryString({
          mobile:this.mobile,
          type:4
        })).then(res=>{
          console.log(res);
        })
	    },
	    timer() {
		    if (this.time > 0) {
			    this.time--;
			    this.btntxt=this.time+"s后重新获取";
			    setTimeout(this.timer, 1000);
			    this.tips="";
		    } else{
			    this.time=0;
			    this.btntxt="获取验证码";
			    this.btndisabled=false;
			    this.btnclass="verifi-code-false";
		    }
	    },
      /*获取用户信息*/
      getData(){
        this.axios.post(this.baseURL.mall + '/m/my/queryPersonalMsg' + this.Service.queryString({
          token: this.mallToken.getToken(),
        })).then(res =>{
          console.log("个人信息",res);
          if(res.data.h.code === 200){
            this.mobile = res.data.b.phone;
          }else if(res.data.h.code === 50 || res.data.h.code === 30){
	          if(this.isApp.state){
		          window.location.href = "epipe://?&mark=login";
	          }else{
		          this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
	          }
          }
        })
      },
      /*修改密码*/
      handleConfirm(){
        if(this.confirmFlag){
          if(this.checkPasswords()){
            this.axios.post(this.baseURL.mall + '/m/user/setNewPassword' + this.Service.queryString({
              token: this.mallToken.getToken(),
              mobile: this.mobile,
              code:this.verCode,
              password: this.newPassword,
            })).then(res =>{
              console.log("修改密码",res);
              if(res.data.h.code === 200){
	              this.$toast('修改密码成功');
	              setTimeout(this.logout(),500)
              }else{
                this.$toast(res.data.h.msg);
              }
            })
          }
        }else{
          return;
        }
      },
      /*退出登录*/
      logout(){
        this.axios.post(this.baseURL.mall + '/m/my/loginOut' + this.Service.queryString({
          token: this.mallToken.getToken(),
        })).then(res =>{
          console.log("退出登录",res);
          if(res.data.h.code === 200){
            this.$router.push("/accountlogin");
          }
        })
      },
      /*检验密码格式*/
      checkPasswords(){
        function check(str){
          var ls = 0;
          if(str.match(/([a-zA-Z])+/)){
            ls ++;
          }
          if(str.match(/([0-9])+/)){
            ls ++;
          }
          if(str.match(/[^a-zA-Z0-9]+/)){
            ls++;
          }
          if(ls >= 2){
            return true;
          }else{
            return false;
          }
        }
        if(this.newPassword.length<6){
          this.$toast("密码长度应为6-20位");
          return false;
        }else if(this.newPassword != this.confirmPassword){
          this.$toast("密码前后不一致");
          return false;
        }else if(!check(this.newPassword)){
          this.$toast("密码格式错误");
          return false;
        }else{
          return true;
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .password-wrapper{
    padding 0.2rem 0.1rem 0.3rem 0.1rem;
    background white;
  }
  .setting-item{
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.4rem;
    margin-bottom 0.15rem;
    position relative;
  }
  .verifi-code{
    position absolute;
    right 0;
    bottom .05rem;
    height .29rem;
    line-height .29rem;
    text-align center;
    font-size .13rem;
    padding 0 .06rem;
    border-radius .04rem;
    background none;
  }
  .verifi-code-true{
    border .01rem solid #ccc;
    color #999;
  }
  .verifi-code-false{
    border .01rem solid #999;
    color #333;
  }
  input:focus{
    outline none;
    border-bottom .01rem solid #ff8800;
  }
  .setting-title{
    font-size 0.14rem;
    color #666;
  }
  input{
    width: 100%;
    height: inherit;
    padding 0 0.1rem;
    border-radius: 2px;
    background-color:transparent;
    border-bottom: 1px solid #e5e5e5;
    -webkit-appearance: none;
  }
  .btn{
    width: 3.55rem;
    height: 0.45rem;
    margin 0 auto;
    margin-top 0.4rem;
    background #dedede;
    border-radius 4px;
    line-height 0.45rem;
    text-align center;
    color white;
    font-size 0.15rem;
  }
  .btn-confirm{
    background #d95757;
  }
</style>
