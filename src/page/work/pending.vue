<template>
  <div class="tips-wrapper">
    <LOADING v-show="loading"></LOADING>
    <div class="application-tips" v-if="!cancle_flag">
      <p>您申请<span v-if="type == 1">加入</span><span v-else>创建</span> <span id="organization">{{organization}}</span></p>
      <p>的申请正在审核，请耐心等待~</p>
      <div class="btn-cancle" @click="showTips()">撤销申请</div>
    </div>
    <div class="cancle-tips" v-else>
      <div class="tips-content">
        <p>撤销后您需要重新提交资料，确认撤销申请吗？</p>
        <div class="btn-wrapper">
          <div class="btn-confirm" @click="revoke">确认</div>
          <div class="btn-cancle" @click="cancle">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .application-tips{
    padding-top: 2.36rem;
    p{
      font-size: 0.16rem;
      text-align: center;
      line-height: 1.5;
    }
    #organization{
      margin-left: 0.05rem;
      color: #609EF7;
    }
    .btn-cancle{
      width: 1.2rem;
      height: 0.4rem;
      margin: 0 auto;
      margin-top: 0.25rem;
      line-height: 0.4rem;
      text-align: center;
      color: #ff8800;
      border-radius: 0.2rem;
      border: 1px solid #ff8800;
    }
  }
  .tips-content{
    position: relative;
    width: 2.7rem;
    height: 1.2rem;
    margin: 0 auto;
    margin-top: 1.95rem;
    padding-top: 0.3rem;
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 0.1rem rgba(0,0,0,0.2);
    p{
      width: 13em;
      margin: 0 auto;
      font-size: 0.16rem;
      line-height: 0.24rem;
      text-align: center;
      color: #666;
    }
  }
  .btn-wrapper{
    position: absolute;
    display: flex;
    width: 100%;
    left: 0;
    bottom: 0.07rem;
    div{
      flex: 1;
      height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
    }
  }
  .btn-wrapper>div:first-child{
    border-right: 1px solid #e6e6e6;
  }
  .btn-confirm{
    color: #999;
  }
  .btn-cancle{
    color: #ff8800;
  }
</style>

<script>
  import LOADING from "../../components/loading.vue";
  export default {
    data(){
      return{
        cancle_flag: false,
        organization: "",
        type: 0,
        loading: false,
      }
    },
    components: {
      LOADING,
    },
    mounted(){
      this.userInfo();
    },
    methods:{
      showTips(){
        this.cancle_flag = true;
      },
      cancle(){
        this.cancle_flag = false;
      },
      /*撤销申请*/
      revoke(){
        let vm = this;
        if(!vm.loading){
          vm.loading = true;
          vm.cancle_flag = false;
          this.axios.post(this.Service.revoke+this.Service.queryString({
            type: vm.type
          })).then(function (res) {
//            vm.$alert("撤销:"+JSON.stringify(res));
            vm.loading = false;
            vm.cancle_flag = false;
            console.log("撤销申请",res);
            if(res.data.h.code != 200){
              vm.$toast("撤销失败:"+res.data.h.code);
            }else{
              vm.$toast("撤销成功");
              window.location.href = "epipe://?&mark=revokeOrganization";
            }
            setTimeout(() =>{
              vm.$router.push({path:'/work'});
            },1000);
          });
        }
      },
      //判断用户是否有组织
      userInfo(){
        let vm = this;
        this.axios.get(this.Service.organization).then(res =>{
          console.log("用户组织",res);
          if(res.data.h.code ==200){
            vm.organization = res.data.b.companyname;
            vm.type = res.data.b.type;
          }
        });
      },
    },
  }
</script>
