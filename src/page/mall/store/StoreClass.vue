<template>
  <div class="goods-class">
    <div class="search-container" ref="search">
      <div class="search-bar"  @click="linkSearch">
        <i class="iconfont icon-sousuoicon"></i>
        <input type="text" class="search-input">
      </div>
    </div>
    <div class="class-area">
      <div class="class-area-l">
        <ul ref="classpart">
          <li v-for="(item,index) in goodClassList" :key="index" :class="{calssActive:selected==index}" @click="changeClass(index)">{{item.stcName}}</li>
        </ul>
      </div>
      <div class="class-area-r"  ref="conClass">
        <div class="con-class"  v-for="(items,index) in goodClassList" :key="index" v-if="showIndex===index">
          <div  v-for="(item,index) in items.classList" :key="index">
            <div class="class-tit"  @click="classSearch(item.stcId)">{{item.stcName}}</div>
            <!--<ul>-->
              <!--<li  v-for="(obj,index) in item.classList" :key="index" @click="classSearch(obj.stcId)">{{obj.stcName}}</li>-->
            <!--</ul>-->
          </div>
        </div>
      </div>
    </div>
    <store-tab :category="1"></store-tab>
  </div>
</template>
<script>
	const StoreTab = () => import("../../../components/mall/StoreTab.vue");
  export default {
  	name: 'StoreClass',
	  data:function () {
		  return{
			  goodClassList:'',
			  selected:0,
			  showIndex:0
		  }
	  },
	  components:{
		  StoreTab,
	  },
	  methods:{
  		getData(){
			  this.axios.post(this.baseURL.mall+"/m/store/queryStoreGoodsClassList"+this.Service.queryString({
				  storeId: this.$route.query.storeId,
			  })).then(res =>{
				  console.log('店铺分类',res);
				  if(res.data.h.code==200){
					  this.goodClassList=res.data.b;
				  }
			  });
      },
		  changeClass(index){
			  this.selected = index;
			  this.showIndex = index;
		  },
		  classSearch(stcId) {
			  this.$router.push("/StoreSearch?gcId=" + stcId);
		  },
		  linkSearch(){
			  this.$router.push({path:'/mallsearch'});
		  },
	  },
    mounted(){
	    let searchH=window.getComputedStyle(this.$refs.search).height.replace("px","");
	    console.log(searchH);
	    let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	    console.log(winH);
	    let classH=winH-searchH-50;
	    this.$refs.classpart.style.height = classH +'px';
	    this.$refs.conClass.style.height = classH +'px';
    },
    created(){
    	document.title='店铺分类';
    	this.getData();
    }
  }
</script>
<style lang="stylus" scoped>
  ::-webkit-scrollbar {/*隐藏滚轮*/
    display: none;
    width: 0px;
  }
  .goods-class{
    width 100%;
    min-height 100%;
    background #fff;
    position absolute;
  }
  .search-container{
    box-sizing border-box;
    display flex;
    justify-content center;
    align-items center;
    width: 100%;
    height: 0.45rem;
    background #fff;
    position fixed;
    z-index 2;
    .search-bar{
      width: 3.25rem;
      height: 0.29rem;
      line-height 0.29rem;
      padding 0 0.1rem;
      background #f2f2f5;
      border-radius 0.145rem;
    }
    .icon-search{
      width: 0.14rem;
      height: 0.15rem;
    }
    .search-input{
      width: 3rem;
      height inherit;
      font-size 0.14rem;
      color: #ccc;
      outline none;
      background transparent;
    }
  }
  .class-area{
    overflow hidden;
    margin-top .45rem;
    position relative;
    .class-area-l{
      width .8rem;
      float left;
      ul{
        overflow-y scroll;
        -webkit-overflow-scrolling touch;
        background #f0f0f5;
        li{
          width 100%;
          height .45rem;
          line-height .45rem;
          position relative;
          font-size .12rem;
          color #666;
          text-align center;
          padding 0 .1rem;
          box-sizing border-box;
          overflow hidden;
        }
        li:after{
          content: "";
          position absolute;
          left 0;
          bottom 0;
          width 100%;
          height 1px;
          background #e5e5e5;
          transform scaleY(0.5);
        }
      }
      ul::-webkit-scrollbar {/*隐藏滚轮*/
           display: none;
           width: 0px;
         }
      ul li.calssActive{
        background #fff;
        color #ff8800;
      }
      ul li:last-child:after{
        height 0;
      }
    }
    .class-area-r{
      margin-left .95rem;
      overflow-y scroll;
      -webkit-overflow-scrolling touch;
      .con-class{
      
      }
      .con-class::-webkit-scrollbar {/*隐藏滚轮*/
        display: none;
        width: 0px;
      }
      .class-tit{
        height .4rem;
        line-height .4rem;
        font-size .12rem;
        color #333;
        position relative;
      }
      .class-tit:after{
        content: "";
        position absolute;
        left 0;
        bottom 0;
        width 100%;
        height 1px;
        background #e5e5e5;
        transform scaleY(0.5);
      }
      ul{
        overflow hidden;
        margin-top .15rem;
        li{
          font-size .12rem;
          color #666;
          margin 0 .25rem .15rem 0;
          float left;
        }
      }
    }
  }
  
  .class-area:after{
    content: "";
    position absolute;
    left 0;
    top 0;
    width 100%;
    height 1px;
    background #e5e5e5;
    transform scaleY(0.5);
  }
</style>