<template>
  <div class="collection-wrapper">
    <div class="status" @click="handleEdit">
      <span v-if="!edit">商品管理</span>
      <span v-else>完成</span>
    </div>
    <div class="collection-list" :class="{'padding-bottom':edit&&len>4}">
      <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="list-item" v-for="(item,index) in itemList" :key="index">
        <div class="left">
          <i class="iconfont" :class="checkedList[index] ? 'icon-xuanzhong1' : 'icon-weixuan'" v-if="edit" @click.stop.prevent="singleCheck(index)"></i>
          <img :src="imgPrefix+item.goodsImage" alt="">
        </div>
        <div class="right" :class="{'edit-right': edit}">
          <div class="desc">{{item.goodsName}}</div>
          <div class="sub">
            <div class="price" v-if="item.priceNegotiable === 0">￥{{item.goodsStorePrice}}</div>
            <div class="price" v-if="item.priceNegotiable === 1">待询价</div>
            <div class="buy" v-if="item.priceNegotiable === 0">
              <i class="iconfont icon-gouwucheicon"  @click.prevent="addToCart(index,'addCartItems')"></i>
              <button class="buy-now" @click.prevent="buyNow(index,'buy_now')">立即购买</button>
            </div>
            <div class="buy" v-if="item.priceNegotiable === 1">
              <i class="iconfont icon-xunjiadan-weixuanzhong" @click.prevent="addToCart(index,'addInquiry')"></i>
              <button class="buy-now" @click.prevent="buyNow(index,'inquiryNow')">立即询价</button>
            </div>
          </div>
        </div>
      </router-link>
      <infinite-loading spinner="bubbles" distance="50" @infinite="infiniteHandler">
        <span slot="no-more">
          暂无更多数据
        </span>
        <span slot="no-results">
          暂无结果
        </span>
      </infinite-loading>
      <div class="no-data" v-if="noData">暂无数据</div>
    </div>
    <div class="operate" v-show="edit">
      <div class="select-all" @click="handleSelectAll">
        <i class="iconfont" :class="selectAll ? 'icon-xuanzhong1' : 'icon-weixuan'"></i>
        <p>全选</p>
      </div>
      <button class="btn-delete" @click="deleteCollection">删除</button>
    </div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  const InfiniteLoading = () => import("vue-infinite-loading");
  export default {
    name: "MallCollection",
    data(){
      return{
        edit: false,
        selectAll: false,
        len: 0,
        checkedList: [],
        pageSize: 10,
        pageNo: 1,
        itemList: [],
        imgPrefix: "",
        goodsIdList: [],
        noData: false,
      }
    },
    components:{
      InfiniteLoading,
      FooterTab
    },
    created(){
      document.title = "商品收藏";
    },
    watch:{
      'checkedList':{
        handler: function(arr){
          this.goodsIdList = [];
          for(var i=0; i<this.len; i++){
            if(!arr[i]){
              this.selectAll = false;
            }else{
              this.goodsIdList.push(this.itemList[i].goodsId);
            }
          }
          console.log(this.goodsIdList);
          if(this.goodsIdList.length === this.len){
            this.selectAll = true;
          }
        },
        deep: true
      }
    },
    methods:{
	    addToCart(index,type){
		    console.log(index);
		    this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
			    token:this.mallToken.getToken(),
			    goodsId:this.itemList[index].goodsId,
			    count:1,
			    specId:this.itemList[index].specId
		    })).then(res=>{
			    console.log(res);
			    if(res.data.h.code==200){
				    this.$toast(res.data.b.msg);
				    //this.$refs.footertab.getGoodsNumber();
			    }else  if(res.data.h.code === 50 || res.data.h.code === 30){
				    if(this.isApp.state){
					    window.location.href = "epipe://?&mark=login";
				    }else{
					    this.$router.replace("/accountlogin?loginUrl="+encodeURIComponent(window.location.href));
				    }
			    }else{
				    this.$toast(res.data.h.msg);
			    }
		    })
	    },
	    buyNow(index,type){
		    console.log(index);
		    this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
			    token:this.mallToken.getToken(),
			    goodsId:this.itemList[index].goodsId,
			    count:1,
			    specId:this.itemList[index].specId
		    })).then(res=>{
			    console.log(res);
			    if(res.data.h.code==200){
				    localStorage.setItem("settleOrder",JSON.stringify(res.data.b));
				    if(localStorage.getItem("settleOrder")){
					    this.$router.push({path:'/ConfirmOrder'});
				    }
			    }else  if(res.data.h.code === 50 || res.data.h.code === 30){
				    if(this.isApp.state){
					    window.location.href = "epipe://?&mark=login";
				    }else{
					    this.$router.replace("/accountlogin?loginUrl="+encodeURIComponent(window.location.href));
				    }
			    }else{
				    this.$toast(res.data.h.msg);
			    }
		    })
	    },
      handleEdit(){
        this.edit = !this.edit;
      },
      /*全选*/
      handleSelectAll(){
        this.selectAll = !this.selectAll;
        for(var i=0; i<this.len; i++){
          this.$set(this.checkedList,i,this.selectAll);
        }
      },
      /*单选*/
      singleCheck(index){
        this.$set(this.checkedList,index,!this.checkedList[index]);
      },
      /*滚动加载*/
      infiniteHandler($state){
        let vm = this;
        setTimeout(() =>{
          vm.axios.post(vm.baseURL.mall + "/m/my/myFavGoods" + vm.Service.queryString({
            isApp: this.isApp.state,
            token: vm.mallToken.getToken(),
            pageSize: vm.pageSize || 10,
            pageNo: vm.pageNo || 1
          })).then(res => {
            console.log("收藏商品",res);
            if(res.data.h.code === 200){
              vm.imgPrefix = res.data.b.imgPrefix;
              if(res.data.b.goods.length < 1){
                $state.complete();
              }else{
                res.data.b.goods.map(function(item){
                  vm.itemList.push(item);
                  vm.len ++;
                });
                vm.pageNo ++;
                $state.loaded();
              }
            }else{
              $state.complete();
            }
          })
        },500);
      },
      /*取消收藏*/
      deleteCollection(){
        this.$confirm("确认取消收藏？").then(() =>{
          this.axios.post(this.baseURL.mall + "/m/favorite/deleteFavGoods" + this.Service.queryString({
            token: this.mallToken.getToken(),
            goodsIds: this.goodsIdList.join(','),
          })).then(res =>{
            console.log("取消收藏",res);
            if(res.data.h.code === 200){
              this.$toast(res.data.b.msg);
              let deleteList = [];
              let vm = this;
              this.checkedList.map(function(item,index){
                if(item){
                  deleteList.push(vm.itemList[index]);
                }
              });
              deleteList.map(function(item){
                vm.itemList.splice(vm.itemList.indexOf(item),1);
              });
              this.len = vm.itemList.length;
              this.checkedList.splice(0,this.checkedList.length);
              this.selectAll = false;
              this.noData = vm.itemList.length === 0 ? true : false;
            }
          });
        });
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .collection-wrapper{
    background white;
  }
  .icon-xuanzhong1{
    color: #d74a45;
  }
  .status{
    display flex;
    justify-content flex-end;
    align-items center;
    position fixed;
    left 0;
    top 0;
    box-sizing border-box;
    z-index 9;
    width 100%;
    height: 0.45rem;
    padding 0.1rem;
    color: #ff8800;
    font-size 0.14rem;
    border-bottom 1px solid #E9E9E9;
    background white;
  }
  .collection-list{
    padding 45px 0;
  }
  .padding-bottom{
    padding-bottom 90px;
  }
  .list-item{
    display flex;
    justify-content space-between;
    align-items center;
    height: 1.2rem;
    padding-left: 0.1rem;
  }
  .left{
    display flex;
    justify-content space-between;
    align-items center;
    width 1.2rem;
    .iconfont{
      margin-right 0.1rem;
      font-size 0.2rem;
    }
    img{
      display block;
      width 1.1rem;
      /*height 1.1rem;*/
      margin-right 0.1rem;
    }
  }
  .right{
    position relative;
    display flex;
    flex-direction column;
    justify-content space-between;
    height: 1rem;
    min-width 1rem;
    max-width 2.45rem;
    padding: 0.1rem 0;
    padding-right 0.1rem;
    width calc(100% - 1.3rem);
    &::after{
      content: "";
      position absolute;
      left 0;
      bottom 0;
      width 100%;
      height 1px;
      background #e9e9e9;
      transform scaleY(0.5);
      transform-origin center;
    }
    .desc{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size 0.14rem;
      line-height 0.18rem;
      color: #333;
    }
    .sub{
      display flex;
      justify-content space-between;
      align-items center;
    }
    .price{
      font-size 0.18rem;
      color: #d74a45;
    }
    .buy{
      font-size 0;
      i{
        font-size .18rem;
        color #999;
        margin-right .18rem;
      }
    }
    .buy-now{
      width: 0.75rem;
      height: 0.3rem;
      text-align center;
      line-height 0.3rem;
      font-size 0.14rem;
      background #d74a45;
      color: white;
      border-radius 2px;
      border: none;
    }
  }
  .edit-right{
   max-width 2.15rem;
  }
  .operate{
    display flex;
    justify-content space-between;
    align-items center;
    position fixed;
    box-sizing border-box;
    left 0;
    bottom 49px;
    width 100%;
    height 49px;
    padding 0 0.1rem;
    border-top: 1px solid #e5e5e5;
    background white;
    .select-all{
      text-align center;
      .iconfont{
        font-size 0.2rem;
      }
      p{
        font-size: 0.12rem;
        line-height: 1;
        color: #999;
      }
    }
    .btn-delete{
      padding 0;
      width 0.75rem;
      height 0.3rem;
      border: none;
      background #ff8800;
      color: white;
      border-radius 2px;
    }
  }
  .no-data{
    z-index 9;
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    height: 100%;
    color: #666;
    font-size: 14px;
    padding-top: 0.3rem;
    text-align: center;
    background: white;
  }
</style>
