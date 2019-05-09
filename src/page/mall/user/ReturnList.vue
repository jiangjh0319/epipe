<template>
  <div class="return-wrapper">
    <div class="status">
      <div class="status-item" :class="{'status-active': tabStatus === i}" v-for="(item,i) in statusList" :key="i" @click="changeFilter(i)">{{item}}</div>
    </div>
    <div class="order-list">
      <order-item v-for="(item,index) in returnList" :key="index" :obj="item" :imgPrefix="imgPrefix" @click.native.prevent="linkDetails(item)" @childCall="handleChildCall"></order-item>
      <infinite-loading spinner="bubbles" @distance="0" @infinite="getData" ref="infiniteLoading">
        <span slot="no-more">
          暂无更多数据
        </span>
        <span slot="no-results">
          暂无结果
        </span>
      </infinite-loading>
    </div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const OrderItem = () => import("../../../components/mall/OrderItem.vue");
  const InfiniteLoading = () => import("vue-infinite-loading");
  export default {
    name: "ReturnList",
    components:{
      FooterTab,
      OrderItem,
      InfiniteLoading
    },
    data(){
      return{
        statusList:["所有退货单","退货申请中","审核通过","审核未通过"],
        tabStatus: 0,
        returnStatus: "",
        pageNo: 1,
        pageSize: 10,
        returnList: [],
        imgPrefix: "",
      }
    },
    created(){
      document.title="我的退货单";
    },
    methods:{
      /*监听子组件*/
      handleChildCall(value){
        this.changeFilter(value,value);
      },
      getData($state){
        setTimeout(() =>{
          this.axios.post(this.baseURL.mall + "/m/my/myReturnGoodsOrderList" + this.Service.queryString({
            token: this.mallToken.getToken(),
            pageSize: this.pageSize,
            pageNo: this.pageNo,
            returnGoodsState: this.returnStatus
          })).then(res =>{
            console.log("退货列表",res);
            if(res.data.h.code === 200){
              if(res.data.b.result.length<1){
                $state.complete();
              }else{
                this.returnList = this.returnList.concat(res.data.b.result);
                this.pageNo ++;
                this.imgPrefix = res.data.b.imgPrefix;
                $state.loaded();
              }
            }else{
              $state.complete();
            }
          }).catch(err =>{
            console.log(err);
            $state.complete();
          })
        },500);
      },
      /*菜单栏切换*/
      changeFilter(i) {
        this.tabStatus = i;
        if(i === 0){
          this.returnStatus = "";
        }else{
          this.returnStatus = i;
        }
        this.pageNo = 1;
        this.returnList = [];
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        });
      },
      /*跳转订单详情*/
      linkDetails(item){
        this.$router.push({path: '/orderdetails', query:{orderSn:item.orderSn,imgPrefix:this.imgPrefix}});
      }
    }
  }
</script>
<style lang="stylus" scoped="true">
  .status{
    z-index 99;
    position fixed;
    left 0;
    top 0;
    width 100%;
    height 45px;
    line-height 45px;
    display flex;
    justify-content space-between;
    background white;
  }
  .status-item{
    flex: 1;
    height inherit;
    font-size 13px;
    color #666;
    text-align center;
  }
  .status-active{
    color: #ff8800;
    border-bottom: 1px solid #ff8800;
  }
  .order-list{
    padding-top 55px;
  }
</style>
