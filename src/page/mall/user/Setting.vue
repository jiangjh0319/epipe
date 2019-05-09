<template>
  <div class="setting-wrapper">
    <div class="setting-item user-info">
      <div class="user-content">
        <img :src="userInfo.imgurl" alt="" v-if="userInfo.imgurl">
        <img :src="avatar" alt="" v-else>
        <span class="name">{{userInfo.realName}}（{{userInfo.phone}}）</span>
      </div>
    </div>
    <router-link to="malladdresslist" tag="div" class="setting-item">
      <div class="setting-title">收货地址管理</div>
      <i class="iconfont icon-jinru"></i>
    </router-link>
    <div class="setting-item" @click="go_mallpassword">
      <div class="setting-title">修改密码</div>
      <i class="iconfont icon-jinru"></i>
    </div>
    <!-- <router-link to="mallpassword" tag="div" class="setting-item">
      <div class="setting-title">修改密码</div>
      <i class="iconfont icon-jinru"></i>
    </router-link> -->
    <div class="logout">
      <div class="btn-logout" @click="logout">退出登录</div>
    </div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const imgURL = require("../../../assets/avatar.png");
  export default {
    name: "MallSetting",
    components:{
      FooterTab
    },
    data(){
      return{
        userInfo:{},
        avatar: imgURL
      }
    },
    created(){
      document.title = "账号设置";
      this.getData();
    },
    methods:{
      getData(){
        this.axios.post(this.baseURL.mall + '/m/my/queryPersonalMsg' + this.Service.queryString({
          isApp: this.isApp.state,
          token: this.mallToken.getToken()
        })).then(res =>{
          console.log("个人信息",res);
          if(res.data.h.code === 200){
            this.userInfo = res.data.b;
          }
          if(res.data.h.code === 50 || res.data.h.code === 30){
            if(this.isApp.state){
              window.location.href = "epipe://?&mark=login";
            }else{
	            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }
        })
      },
      /*退出登录*/
      logout(){
        this.axios.post(this.baseURL.mall + '/m/my/loginOut' + this.Service.queryString({
          isApp: this.isApp.state,
          token: this.mallToken.getToken(),
        })).then(res =>{
          console.log("退出登录",res);
          if(res.data.h.code === 200){
            if(this.isApp.state){
              window.location.href = "epipe://?&mark=logoutUser";
              // this.$router.replace('/mallhome')
            }else{
	            this.$router.replace("/verificationlogin?loginUrl="+encodeURIComponent(window.location.href));
            }
          }
        })
      },
    // 判断是跳往app修改密码 还是 商城修改密码
      go_mallpassword(){
        if(this.isApp.state){
          window.location.href = "epipe://?&mark=modificationPasswords";
        }else{
          this.$router.push({path:'mallpassword'})
        }

      }
    }
  }
</script>
<style lang="stylus" scoped="true">
  .setting-wrapper{
    background: white;
  }
  .setting-item{
    position relative;
    display flex;
    justify-content space-between;
    align-items center;
    height: 0.45rem;
    padding: 0 0.1rem;
    font-size 0.14rem;
    color: #666;
  }
  .user-content img{
    width 0.4rem;
    height 0.4rem;
    vertical-align middle;
    margin-right 0.06rem;
    border-radius 50%;
    border none;
  }
  .setting-item::after{
    content: "";
    position absolute;
    left 0;
    bottom 0;
    width 100%;
    height: 1px;
    border-bottom 1px solid #E9E9E9;
    transform scaleY(0.5);
    transform-origin center;
  }
  .user-info{
    height: 0.65rem;
  }
  .icon-jinru{
    font-size 0.12rem;
    color: #ccc;
  }
  .logout{
    padding: 0.45rem 0;
  }
  .btn-logout{
    width: 3.55rem;
    height: 0.45rem;
    margin: 0 auto;
    line-height 0.45rem;
    text-align center;
    border-radius 4px;
    font-size 0.16rem;
    color: white;
    background #d74a45;
  }
</style>
