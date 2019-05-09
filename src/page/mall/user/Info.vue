<template>
  <div class="user-info">
    <div class="info-item info-avatar">
      <div class="setting-title">头像</div>
      <div class="avatar-wrapper">
        <img :src="userInfo.imgurl" alt="">
        <!--<i class="iconfont icon-jinru"></i>-->
      </div>
    </div>
    <div class="info-item info-name">
      <div class="setting-title">用户名</div>
      <div class="user-id">{{userInfo.phone}}</div>
    </div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  export default {
    name: 'UserInfo',
    components:{
      FooterTab
    },
    data(){
      return{
        userInfo: {},
      }
    },
    created(){
      document.title = "个人资料";
      this.getUserInfo();
    },
    methods:{
      getUserInfo(){
        this.axios.post(this.baseURL.mall + '/m/my/queryPersonalMsg' + this.Service.queryString({
          token: this.mallToken.getToken()
        })).then(res =>{
          console.log("个人信息",res);
          if(res.data.h.code === 200){
            this.userInfo = res.data.b;
          }
          if(res.data.h.code === 50 || res.data.h.code === 30){
            this.$router.push("/accountlogin");
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .user-info{
    background white;
  }
  .info-item{
    display flex;
    justify-content space-between;
    align-items center;
    padding 0 0.1rem;
  }
  .info-avatar{
    height: 0.65rem;
    border-bottom 1px solid #E9E9E9;
  }
  .info-name{
    height: 0.45rem;
  }
  .avatar-wrapper{
    img{
      width: 0.4rem;
      height: 0.4rem;
      margin-right 0.1rem;
      border-radius: 50%;
    }
  }
  .setting-title{
    font-size 0.14rem;
    color #666;
  }
  .user-id{
    font-size 0.14rem;
    color: #999;
  }
</style>
