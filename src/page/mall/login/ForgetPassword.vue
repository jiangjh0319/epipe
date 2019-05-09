<template>
  <div class="account-login">
    <div class="phone-div">
      <input type="text" @input="handleInput" class="inputpart"  placeholder="请输入手机号" v-model="phone">
      <button class="verifi-code" :class="btnclass" :disabled="btndisabled" @click="sendcode">{{btntxt}}</button>
    </div>
    <input type="text" class="inputpart"  placeholder="请输入收到的验证码" v-model="verCode">
    <input type="password" class="inputpart"  placeholder="请输入新的登录密码"  minlength="6" maxlength="20"  @focus="pwFocus" @blur="pwBlur" @input="pwInput" v-model="password">
    <input type="password" class="inputpart"  placeholder="请再次输入新的登录密码"  minlength="6" maxlength="20" v-model="repassword">
    <div class="warn-tip">{{tips}}</div>
    <input type="button" value="确认修改并登录" id="sub" @click="confimSub">
  </div>
</template>
<script>
  export default{
    data: function () {
      return {
        btndisabled:false,
        btntxt:"获取验证码",
        tips:'',
        btnclass:"verifi-code-false",
        formMess:{
          phone:this.phone,
          verCode:this.verCode,
          password:this.password,
          repassword:this.repassword
        },
        sending: false,
      }
    },
    created(){
      document.title="忘记密码";
    },
    methods:{
      sendcode(){
        this.sending = true;
        var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        //var url="/nptOfficialWebsite/apply/sendSms?mobile="+this.ruleForm.phone;
        if(this.phone==''||this.phone==undefined){
          this.tips="请输入手机号码";
        }else if(!reg.test(this.phone)){
          this.tips="手机格式不正确";
        }else{
          this.axios.post(this.baseURL.mall+"/m/user/checkUser"+this.Service.queryString({
            mobile:this.phone
          })).then(res=>{
            console.log(res);
            if(res.data.h.code!=200){
              this.time=60;
              this.btndisabled=true;
              this.btnclass="verifi-code-true";
              this.timer();
              this.axios.post(this.baseURL.mall+"/m/user/sendMessage"+this.Service.queryString({
                mobile:this.phone,
                type:4
              })).then(res=>{
                console.log(res);
                if(res.data.h.code === 200){
                  this.sending = false;
                }
              })
            }else{
              this.tips="该用户尚未注册";
            }
          })
        }
      },
      handleInput(e){
        e.target.value=e.target.value.replace(/[^\d]/g,'');
      },
      pwFocus(){
        this.tips="密码规则：6-20个字符，包含字母、数字及标点符号至少两种";
      },
      pwBlur(){
        this.tips="";
      },
      pwInput(){
        this.tips="";
        console.log(this.password);
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
      confimSub(){
        if(this.sending){
          this.$toast("正在获取验证码");
        }else{
          let mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
          if(this.phone==undefined||this.phone.trim()==''){
            this.tips="手机号不能为空";
            return false;
          }else if(this.verCode==undefined||this.verCode.trim()==''){
            this.tips="验证码不能为空";
            return false;
          }else if(this.password==undefined||this.password.trim()==''){
            this.tips="密码不能为空";
            return false;
          }else if(this.password.length<6){
            this.tips="密码长度不能小于6个字符";
            return false;
          }else if(this.password != this.repassword) {
            this.tips="两次输入的密码不一致";
            return false;
          }else if(!mediumRegex.test(this.password)){
            this.tips="密码应为字母、数字、标点符号至少包含2种组合";
            return false;
          }else{
            this.axios.post(this.baseURL.mall+"/m/user/setNewPassword"+this.Service.queryString({
              mobile: this.phone,
              code: this.verCode,
              password:this.password
            })).then(res =>{
              console.log(res);
              if(res.data.h.code==200){
                this.$toast('修改密码成功');
                this.$router.push({path:'/accountlogin'});
              }else{
                this.tips=res.data.h.msg;
              }
            });
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  input{
    -webkit-appearance: none;
    outline none;
    background transparent;
  }
  .phone-div{
    width 100%;
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
  .account-login {
    width 100%;
    height: 100%;
    background: #fff;
    padding: .35rem .275rem 0 .275rem;
    box-sizing: border-box;
    position: absolute
  }
  .inputpart {
    height: .49rem;
    border: none;
    border-bottom: .01rem solid #ccc;
    font-size: .16rem;
    width: 100%;
    color: #333;
  }
  .inputpart:focus{
    outline none;
    border-bottom .01rem solid #ff8800;
  }
  .warn-tip {
    font-size .13rem;
    color #d74a45;
    margin-top .1rem;
  }
  #sub{
    width 100%;
    height .48rem;
    background #ff8800;
    font-size .17rem;
    color #fff;
    border-radius .04rem;
    margin-top .5rem;
  }
</style>
