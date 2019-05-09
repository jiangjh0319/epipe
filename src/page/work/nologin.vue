<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .banner-wrapper{
    width: 100%;
    height: 1.6rem;
    background: lightblue;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .input-bar{
    position: relative;
    z-index: 1;
    width: 3.45rem;
    height: 0.4rem;
    margin: 0 auto;
    margin-top: -0.2rem;
    background: white;
    border-radius: 0.2rem;
    text-align: center;
    line-height: 0.4rem;
    color: #999;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  .icon-search{
    width: 0.15rem;
    height: 0.17rem;
  }
  .tips{
    margin-top: 1rem;
    font-size: 0.14rem;
    text-align: center;
    color: #999;
  }
  .create-org{
    width: 1.64rem;
    height: 0.5rem;
    margin: 0 auto;
    margin-top: 0.15rem;
    line-height: 0.5rem;
    font-size: 0.18rem;
    border-radius: 0.25rem;
    background-color: #499844;
    color: white;
    text-align: center;
    box-shadow: 0 0 0.2rem rgba(49,98,44,0.6);
  }
  .create-org:active{
    transform: scale(0.95);
  }
   .slideup-enter-active{
     animation: slide-up 250ms ease-out;
   }

  @keyframes slide-up{
    0%{
      transform: translateY(100%);
    }
    100%{
      transform: translateY(0);
    }
  }
</style>
<template>
  <div class="wrapper">
    <section class="no-login">
      <div class="banner-wrapper">
        <img :src="imgUrl" alt="" class="banner">
      </div>
      <div class="input-bar" @click="linkSearch()">
        <svg class="icon icon-search" aria-hidden="false">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
        输入组织名称搜索加入
      </div>
      <div class="tips">您还没有加入组织哟~</div>
      <div class="create-org" @click="linkCreate()">创建组织</div>
    </section>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        imgUrl: "",
        search: false,
      }
    },
    methods: {
      //获取banner图
      getBanner(){
        let vm = this;
        vm.axios.get(vm.Service.category_banner, {
          params: {
            type: 3,
            locationId: 30
          }
        }).then(function (res) {
          console.log("获取banner",res);
          if( res.data.b.length>0){
            vm.imgUrl = res.data.b[0].imgUrl;
          }
        });
      },
      //显示搜索页
      showSearch(){
        this.search = true;
      },
      //关闭搜索页
      closeSearch(){
        this.search = false;
      },
      /*跳转搜索页面*/
      linkSearch(){
        window.location.href = "epipe://?&mark=search";
      },
      /*跳转创建组织*/
      linkCreate(){
        window.location.href = "epipe://?&mark=create";
      }
    },
    created(){
      this.getBanner();
    },
    mounted(){
    }
  }
</script>


