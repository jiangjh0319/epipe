<style scoped lang="stylus">
  .choose-content{
    margin-top: 0.59rem;
  }
  .choose-item{
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 0.15rem;
    border-bottom: 1px solid #EAEAEA;
    background: white;
    input{
      width: 3rem;
      height: 100%;
      outline: none;
    }
  }
  .choose-item:first-child{
    border-top: 1px solid #EAEAEA;
  }
  .icon-close{
    width: 0.2rem;
    height: 0.2rem;
  }
  .btn-save{
    position: fixed;
    top: 0;
    right: 0;
    width: 0.58rem;
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    text-align: center;
    color: white;
    z-index: 9;
  }

  .header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.44rem;
    background: rgb(15, 195, 124);
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
  .no-result{
    height: 1.2rem;
    line-height: 1.2rem;
    background: white;
    font-size: 0.15rem;
    color: #666;
    text-align: center;
  }
</style>

<template>
  <div class="edit-wrapper">
    <div class="header">
      <div class="back" @click="goback()">
        <svg class="icon icon-back" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </div>
      部门
      <div class="btn-save" @click.stop.prevent="save()" v-if="list.length>0">保存</div>
    </div>
    <div class="choose-content" v-if="list.length>0">
      <div class="choose-item" v-for="(item,index) in list" @click="select(index)">
        {{item.name}}
        <svg class="icon icon-select" aria-hidden="false">
          <use xlink:href="#icon-chenggong" v-if="temp === index"></use>
          <use xlink:href="#icon-meiyouxuanzhong" v-else></use>
        </svg>
      </div>
    </div>
    <div class="choose-content" v-if="noresult">
      <div class="no-result">暂无部门</div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import TopHead from "../../components/topheader.vue"    //引入导航栏
  export default{
    name: 'department',
    components:{
      TopHead,
    },
    data(){
      return{
        list:[],
        selected: -1,
        temp: -1,
        companyId: 0,
        noresult: false,
      }
    },
    mounted(){
      this.temp = this.$route.query.selected;
      this.companyId = this.$route.query.company_id;
      this.department();
    },
    beforeDestroy() {
      this.updata();
    },
    methods: {
      /*组织部门查询*/
      department(){
        let vm = this;
        this.axios.get(this.Service.department, {
          params: {
            companyId: vm.companyId
          },
        }).then(function (res) {
          console.log("部门列表",res);
          vm.list = res.data.b.offices;
          if(!res.data.b.offices.length){
            vm.noresult = true;
          }else{
            vm.noresult = false;
          }
        });
      },
      /*选择部门*/
      select(index){
        this.temp = index;
      },
      /*
      * 使用evenBus向application页面传参
      * 如果有数据更新则触发eventBus
      * */
      updata(){
        let vm = this;
        eventBus.$emit('getTarget', {
          title: "部门",
          txt: vm.list[vm.selected].name,
          id: vm.list[vm.selected].id
        });
      },
      //保存
      save(){
        this.selected = this.temp;
        window.history.back(-1);
      },
      //返回
      goback(){
        window.history.back(-1);
      },
    }
  }
</script>
