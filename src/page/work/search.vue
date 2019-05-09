<template>
  <section class="search-wrapper">
    <LOADING v-show="loading"></LOADING>
    <div class="search-header">
      <svg class="icon icon-back" aria-hidden="false" @click="goBack()">
        <use xlink:href="#icon-zuoyoujiantou"></use>
      </svg>
      <div class="search-bar">
        <svg class="icon icon-search" aria-hidden="false">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
        <form class="search-form" action="" @submit.prevent="search()">
          <input type="search" ref="input" class="search-input" :autofocus="autofocus" v-focus/>
        </form>
        <div @click="clearInput()">
          <svg class="icon icon-close" aria-hidden="false">
            <use xlink:href="#icon-x"></use>
          </svg>
        </div>
      </div>
      <div class="btn-search" @click="search()">搜索</div>
    </div>
    <div class="search-list" v-if="result">
      <div class="list-item" v-for="item in list">
        <div class="item-info">
          <div class="info-picture">
            <img src="../../assets/default.png">
          </div>
          <div class="info-content">
            <div class="info-org">{{item.companyName}}</div>
            <div class="info-num">{{item.personCount}}人</div>
          </div>
        </div>
        <div class="btn-content" v-if="item.auditStatus == 3" @click="application(item.companyName,item.companyId)">
          <div class="item-btn">申请加入</div>
        </div>
        <div class="btn-content" v-else-if="item.auditStatus == 0">
          <div class="item-btn status-done">待审核</div>
        </div>
        <div class="btn-content" v-if="item.auditStatus == 1">
          <div class="item-btn status-done">已申请</div>
        </div>
        <div class="btn-content" v-if="item.auditStatus == 2" @click="application(item.companyName,item.companyId)">
          <div class="item-btn">再次申请</div>
          <p class="btn-failed">审核不通过</p>
        </div>
      </div>
    </div>
    <div class="no-result" v-else>未搜索到相关结果!</div>
  </section>
</template>

<style scoped lang="stylus">
  .search-wrapper{
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F5F5F5;
  }
  .search-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 49px;
    margin-bottom: 15px;
    background: white;
    .btn-search{
      margin-right: 0.15rem;
      color: #0FC37C;
    }
    .icon-back{
      margin-left: 0.15rem;
    }
  }
  .search-bar{
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 2.7rem;
    height: 0.34rem;
    padding: 0 0.15rem;
    border-radius: 0.17rem;
    background: #F0F0F0;
    input{
      z-index: 9;
      width: 100%;
      height: 100%;
      outline: none;
      background: transparent;
    }
  }
  .search-list{
    overflow-y: auto;
    height: calc(100% - 64px);
    padding-left: 0.15rem;
    background: white;
  }
  .list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 54px;
    padding: 10px 0;
  }
  .list-item:not(:last-child){
    border-bottom: 1px solid #eaeaea;
  }
  .item-info{
    display: flex;
    align-items: center;
    .info-picture{
      width: 0.54rem;
      height: 0.54rem;
      margin-right: 0.15rem;
      img{
        width: 100%;
        height: 100%;
        border-radius: 0.05rem;
      }
    }
    .info-org{
      max-width: 1.68rem;
      line-height: 1.2;
      white-space: normal;
    }
    .info-num{
      margin-top: 2px;
      font-size: 13px;
      color: #666;
    }
  }
  .btn-content{
    margin-right: 0.15rem;
  }
  .item-btn{
    width: 71px;
    height: 29px;
    text-align: center;
    line-height: 29px;
    border-radius: 14px;
    background: #0fc37c;
    color: white;
    font-size: 13px;
  }
  .status-done{
    background: #f5ae14;
  }
  .btn-failed{
    margin-top: 5px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
  .no-result{
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: 16px;
    color: #666;
    background: white;
  }
  .search-input::-webkit-search-cancel-button{
    display: none;
  }
  .search-form{
    width: 80%;
  }
</style>

<script>
  import LOADING from "../../components/loading.vue";
  export default{
    name: 'search',
    data(){
      return{
        result: true,
        list: [],
        autofocus: true,
        loading: false,
      }
    },
    components: {
      LOADING,
    },
    methods: {
      //隐藏搜索功能
      goBack(){
        window.location.href = "epipe://?&mark=history_back";
      },
      //清除搜索框文字
      clearInput(){
        this.$refs.input.value = "";
        this.$refs.input.focus();
      },
      //搜索
      search(){
        let vm = this;
        vm.loading = true;
        this.axios.get(this.Service.search, {
          params: {
            organName: this.$refs.input.value
          },
        }).then(function (res) {
          console.log("搜索结果",res);
          vm.loading = false;
          if(res.data.b.data){
            vm.list = res.data.b.data;
            vm.result = true;
          }else{
            vm.result = false;
          }
        });
      },
      /*申请加入*/
      application(companyName,companyId){
        this.$router.push({path:'/application',query:{name: companyName,id:companyId}});
      },
    },
    mounted(){
      this.$nextTick(() =>{
        this.$refs.input.focus();
      });
    },
    directives:{
      focus(el){
        el.focus();
      }
    },
  }
</script>
