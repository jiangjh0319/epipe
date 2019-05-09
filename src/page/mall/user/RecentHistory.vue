<template>
  <div class="recent-wrapper">
    <div class="status" @click="handleEdit"  v-if="list.length>0">
      <span v-if="!edit">商品管理</span>
      <span v-else>完成</span>
    </div>
    <div class="history-list padding-top" :class="{'padding-bottom':list.length>4}" v-if="list.length>0">
      <router-link :to="{path:'/goodsdetail',query:{goodsId: item.goodsId}}" class="list-item" v-for="(item,index) in list" :key="index" v-if="item">
        <div class="left">
          <i class="iconfont" :class="checkedList[index] ? 'icon-xuanzhong1' : 'icon-weixuan'" v-if="edit" @click.stop.prevent="singleCheck(index)"></i>
          <img :src="imgPrefix + item.goodsImageMore[0]" alt="">
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
      <div class="no-more" v-if="list.length>0">暂无更多数据</div>
    </div>
    <div class="operate" v-show="edit">
      <div class="select-all" @click="handleSelectAll">
        <i class="iconfont" :class="selectAll ? 'icon-xuanzhong1' : 'icon-weixuan'"></i>
        <p>全选</p>
      </div>
      <button class="btn-delete" @click="deleteCollection">删除</button>
    </div>
    <div class="no-data" v-if="list.length<1">暂无浏览记录</div>
    <footer-tab :category="3"></footer-tab>
  </div>
</template>
<script>
  const FooterTab = () => import("../../../components/mall/FooterTab.vue");
  export default {
    name: "RecentHistory",
    components:{
      FooterTab
    },
    data(){
      return{
        list: localStorage.getItem("browser_history") ? JSON.parse(localStorage.getItem("browser_history")) : [],
        imgPrefix: localStorage.getItem("imgPrefix"),
	      edit: false,
	      selectAll: false,
	      checkedList: [],
	      len: '',
	      goodsIdList:[],
      }
    },
	  watch:{
		  'checkedList':{
			  handler: function(arr){
				  this.goodsIdList = [];
				  for(var i=0; i<this.len; i++){
					  if(!arr[i]){
						  this.selectAll = false;
					  }else{
						  this.goodsIdList.push(this.list[i].goodsId);
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
	    /*删除*/
	    deleteCollection(){
	    	if(this.goodsIdList.length == 0){
	    		this.$toast('请先选中一个商品');
	    		return;
        }
		    this.$confirm("确认要删除吗？").then(() =>{
	    		for (let i=0;i<this.goodsIdList.length;i++){
	    			for(let j=0;j<this.list.length;j++){
	    				if(this.list[j].goodsId == this.goodsIdList[i]){
	    					this.list.splice(j,1);
						    console.log(this.list);
						    localStorage.setItem("browser_history",JSON.stringify(this.list));
						    this.$toast('删除成功');
                this.edit = !this.edit;
                this.checkedList = [];
                this.selectAll = false;
						    this.list = localStorage.getItem("browser_history") ? JSON.parse(localStorage.getItem("browser_history")) : [];
              }
            }
          }
		    });
	    },
      //加入购物车，带入待询价
	    addToCart(index,type){
		    console.log(index);
		    this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
			    token:this.mallToken.getToken(),
			    goodsId:this.list[index].goodsId,
			    count:1,
			    specId:this.list[index].specId
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
      //立即购买，立即询价
	    buyNow(index,type){
		    console.log(index);
		    this.axios.post(this.baseURL.mall + "/m/cart/"+type+this.Service.queryString({
			    token:this.mallToken.getToken(),
			    goodsId:this.list[index].goodsId,
			    count:1,
			    specId:this.list[index].specId
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
    },
    created(){
      document.title = "最近浏览";
      this.len = this.list.length;
      console.log('len:' + this.len);
      console.log(JSON.parse(localStorage.getItem("browser_history")));
    },
  }
</script>
<style lang="stylus" scoped>
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
  .history-list{
    background white;
  }
  .padding-bottom{
    padding-bottom 45px;
  }
  .padding-top{
    padding-top .45rem;
  }
  .list-item{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
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
      width: 1.1rem;
      /*height: 1.1rem;*/
      margin-right: 0.1rem;
      background: #dedede;
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
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: #e9e9e9;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      -webkit-transform-origin: center;
      transform-origin: center;
    }
    .desc{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 0.14rem;
      line-height: 0.18rem;
      color: #333;
    }
    .sub{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    .price{
      font-size: 0.18rem;
      color: #d74a45;
    }
    .buy{
      font-size: 0;
      i{
        font-size .18rem;
        color #999;
        margin-right .18rem;
      }
    }
    .buy-now{
      width: 0.75rem;
      height: 0.3rem;
      text-align: center;
      line-height: 0.3rem;
      font-size: 0.14rem;
      background: #d74a45;
      color: #fff;
      border-radius: 2px;
      border: none;
    }
  }
  .edit-right{
    max-width 2rem;
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
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    color: #999;
  }
  .no-more{
    text-align: center;
    color: #999;
    padding 20px 0;
  }
</style>
