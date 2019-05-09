<template>
  <div class="account-login">
    <div class="input-container">
      <input type="text"  @input="handleInput" class="inputpart"  placeholder="请输入手机号" v-model="phone">
    </div>
    <div class="input-container">
      <input type="password" class="inputpart"  placeholder="请输入密码" v-model="password">
    </div>
    <div class="warn-tip">{{tips}}</div>
    <input type="button" value="确认登录" id="sub" @click="confimSubmit">
    <div class="operate">
      <div>
        <span><a href="#/ForgetPassword">忘记密码</a></span>
        <span>|</span>
        <span>
          <a href="#/VerificationLogin" v-if="!backUrl">验证登录</a>
           <router-link :to="{path:'/VerificationLogin', query:{loginUrl:backUrl}}" v-if="backUrl">验证登录</router-link>
        </span>
      </div>
      <div>
        <span><a href="#/Register">注册</a></span>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data:function () {
      return{
        tips:'',
        formMess:{
          phone:this.phone,
          password:this.password
        },
	      backUrl:''      //登录成功，返回原页面地址参数
      }
    },
    methods:{
      handleInput(e){
        e.target.value=e.target.value.replace(/[^\d]/g,'');
      },
      confimSubmit(){
        var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        if(this.phone==''||this.phone==undefined){
          this.tips="请输入手机号码";
          return false;
        }else if(this.password==undefined||this.password.trim()==''){
          this.tips="请输入密码";
          return false;
        }else if(!reg.test(this.phone)){
          this.tips="手机格式不正确";
          return false;
        }else{
          this.tips="";
          this.axios.post(this.baseURL.mall+"/m/user/login"+this.Service.queryString({
            account: this.phone,
            password: this.password
          })).then(res =>{
            console.log(res);
            let dataMes=res.data.h;
            if(dataMes.code==200){
              this.mallToken.setToken(res.data.b.token);
              localStorage.setItem('preLoginPhone',this.phone);
              console.log("new_token",res.data.b.token);
              if(this.$route.query.loginUrl){
	              window.location.href=this.$route.query.loginUrl;
              }else{
	              this.$router.push({path:'/mallhome'});
              }
            }else{
              this.tips=dataMes.msg;
            }
          });
        }
      }
    },
    created(){
    	document.title="登录";
	    this.phone=localStorage.getItem("preLoginPhone") || '';
	    this.backUrl= this.$route.query.loginUrl || '';
    }
  }
</script>
<style lang="stylus" scoped>
  input{
    -webkit-appearance: none;
    outline none;
    background transparent;
  }
  .account-login {
    width 100%;
    height: 100%;
    background: #fff;
    padding: .35rem .275rem 0 .275rem;
    box-sizing: border-box;
    position: absolute
  }
  .input-container{
    border-bottom: .01rem solid #ccc;
  }
  .inputpart {
    height: .49rem;
    border: none;
    font-size: .16rem;
    width: 100%;
    color: #333;
  }
  .inputpart:focus{
    outline none;
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
  .operate{
    margin-top .15rem;
    div{
      span{
        margin-right .05rem;
        font-size .14rem;
        a{
          color #6699ff;
        }
      }
      span:last-child{
        margin-right 0;
      }
      span:nth-child(2){
        color #999;
      }
    }
    div:first-child{
      float left;
    }
    div:last-child{
      float right;
    }
  }
</style>
