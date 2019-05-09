<template>
  <div class="wrapper">
    <div class="order-menu">
      <div class="menu-item" :class="{'menu-active': index === selected}" v-for="(item,index) in menuList" :key="index" @click="tab(index)">{{item.title}}</div>
    </div>
    <div class="order-list">
       <div v-for="(item,index) in orderList" :key="index"  @click="linkDetails(item)">
           <order-item :obj="item" :imgPrefix="imgPrefix"  @childCall="handleChildCall"></order-item>
       </div>
      <infinite-loading spinner="bubbles" @distance="0" @infinite="infiniteHandler" ref="infiniteLoading">
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
    name: "MyOrder",
    components:{
      FooterTab,
      OrderItem,
      InfiniteLoading
    },
    data(){
      return{
        menuList: [{title: "我的订单",code: ""},{title: "待付款",code: 10},{title: "已付款",code: 20},
          {title: "已发货",code: 40},{title: "已完成",code: 50},{title: "已取消",code: 0}],
        selected: 0,
        orderList: [],
        pageSize: 10,
        pageNo: 1,
        orderState: "",
        imgPrefix: "",
      }
    },
    created(){
      document.title = "我的订单";
      if(this.$route.query.state){
        this.selected = this.$route.query.state;
        this.orderState = this.menuList[this.$route.query.state].code;
      }
    },
    methods:{
      /*监听子组件*/
      handleChildCall(value){
        this.tab(value);
      },
      /*菜单切换*/
      tab(i){
        this.selected = i;
        this.orderState = this.menuList[i].code;
        this.changeFilter();
      },
      /*滚动加载*/
      infiniteHandler($state){
        setTimeout(() =>{
          this.axios.post(this.baseURL.mall + '/m/my/orderList' + this.Service.queryString({
            token: this.mallToken.getToken() || this.$route.query.token,
            pageSize: this.pageSize || "",
            pageNo: this.pageNo || "",
            orderState: this.orderState,
          })).then(res =>{
            console.log(this.menuList[this.selected].title,res);
            if(res.data.h.code === 200){
              if(res.data.b.result.length < 1){
                $state.complete();
              }else{
                this.imgPrefix = res.data.b.toUrl;
                this.orderList = this.orderList.concat(res.data.b.result);
                this.pageNo ++;
                setTimeout(()=>{
                  $state.loaded();
                },1000);
              }
            }else{
              $state.complete();
            }
          }).catch(err =>{
            console.log(err);
            $state.complete();
          });
        },500);
      },
      changeFilter() {
				this.pageNo = 1;
        this.orderList = [];
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
<style lang="stylus" scoped>
  borderBottom(borderColor= #e9e9e9,borderWidth= 1px){
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: borderWidth;
    background: borderColor;
    transform: scaleY(0.5);
    transform-origin: center;
  }
  .order-menu{
    z-index 9;
    box-sizing border-box;
    position fixed;
    top 0;
    left 0;
    display flex;
    align-items center;
    width 100%;
    height 49px;
    padding-left 0.1rem;
    line-height 49px;
    background white;
  }
  .order-menu::after{
    borderBottom();
  }
  .menu-item{
    flex: 1;
    height inherit;
    text-align center;
    font-size 13px;
    color #666;
  }
  .menu-active{
    position relative;
    color: #ff8800;
    &::after{
      borderBottom(#ff8800,3px);
    }
  }

  .order-list{
    margin-top 60px;
    margin-bottom 50px;
  }
  .item-container{
    z-index 99;
    position relative;
  }
  @media screen and (max-width: 320px) {
    .menu-item {
      font-size 12px;
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .order-list{
      margin-bottom 84px;
    }
  }
</style>
