<template>
  <div class="listContainer">
    <div class="tab" v-if="tabShow">
      <div @click="tabClick"><span class="active">供应</span></div>
      <div @click="tabClick"><span>需求</span></div>
    </div>
    <div class="tab" v-else>
      <div @click="tabClick"><span>供应</span></div>
      <div @click="tabClick"><span class="active">需求</span></div>
    </div>
    <div class="list-part" v-if="tabShow">
      <router-link tag="div"  class="list-content" v-for="item in supplyList" :key="item.supplyId" :to="{path:'/SupplyDemandDetail',query:{id: item.supplyId, type: 'S'}}">
        <div class="list-content-l"><i class="iconfont icon-gong"></i></div>
        <div class="list-content-m">{{item.supplyName}}</div>
        <div class="list-content-r">{{item.createTime}}</div>
      </router-link>
      <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMoreSupply" ref="infiniteLoading">
        <span slot="no-more">暂无更多数据</span>
        <span slot="no-results">暂无结果</span>
      </infinite-loading>
    </div>
    <div class="list-part" v-else>
      <router-link tag="div" class="list-content" v-for="item in demandList" :key="item.demandId" :to="{path:'/SupplyDemandDetail',query:{id: item.demandId, type: 'D'}}">
        <div class="list-content-l"><i class="iconfont icon-xu"></i></div>
        <div class="list-content-m">{{item.demandName}}</div>
        <div class="list-content-r">{{item.createTime}}</div>
      </router-link>
      <infinite-loading spinner="bubbles" @distance="1" @infinite="loadMoreDemand" ref="infiniteLoading">
        <span slot="no-more">暂无更多数据</span>
        <span slot="no-results">暂无结果</span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
	const InfiniteLoading = () => import("vue-infinite-loading");
	export default {
		name: 'SupplyDemandList',
		components:{
			InfiniteLoading
		},
    data () {
			return {
				classId: this.$route.query.classId,
        tabShow: true,
				pageNo: 1,
				supplyList: [],
        demandList: []
      }
    },
    methods: {
	    tabClick(){
	    	this.tabShow = !this.tabShow;
	    	this.pageNo = 1;
	    	if(!this.tabShow && this.demandList.length === 0 ){
	    		this.loadMoreDemand();
        }
      },
	    loadMoreSupply($state){
		    setTimeout(() => {
			    this.axios.post(this.baseURL.mall + "/m/demandAndSupply/querySupplyInfo" + this.Service.queryString({
				    pageNo: this.pageNo,
				    pageSize: 15,
				    classId: this.classId
			    })).then(res => {
				    if (res.data.h.code === 200) {
					    if (res.data.b.supplyList.length < 1) {
						    $state.complete();
					    } else {
						    this.pageNo++;
						    this.supplyList = this.supplyList.concat(res.data.b.supplyList);
						    $state.loaded();
					    }
				    } else {
					    $state.complete();
				    }
			    })
		    },200)
      },
	    loadMoreDemand($state){
		    setTimeout(() => {
			    this.axios.post(this.baseURL.mall + "/m/demandAndSupply/queryDemandInfo" + this.Service.queryString({
				    pageNo: this.pageNo,
				    pageSize: 15,
				    classId: this.classId
			    })).then(res => {
				    if (res.data.h.code === 200) {
					    if (res.data.b.demandList.length < 1) {
						    $state.complete();
					    } else {
						    this.pageNo++;
						    this.demandList = this.demandList.concat(res.data.b.demandList);
						    $state.loaded();
					    }
				    } else {
					    $state.complete();
				    }
			    })
		    },200)
	    }
    },
    created () {
			document.title = this.classId === 1 ? '管道市场' : '塑料市场';
    }
	}
</script>

<style lang="stylus" scoped>
  .listContainer{
    background #fff;
    overflow hidden;
    .tab{
      height .45rem;
      line-height .45rem;
      display flex;
      justify-content center;
      align-items center;
      position relative;
      &::after{
        content: "";
        position absolute;
        left 0;
        bottom: 0;
        width 100%;
        height: 1px;
        background #E9E9E9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      div{
        flex 1;
        font-size .16rem;
        color #33;
        text-align center;
        span{
          display inline-block;
          height .45rem;
          padding 0 .1rem;
        }
        .active{
          border-bottom 2px solid #ff5959;
        }
      }
    }
    .list-part{
      width 100%;
      padding .25rem .15rem;
      box-sizing border-box;
      .list-content{
        display flex;
        align-items center;
        margin-bottom .35rem;
        &:last-child{
          margin-bottom 0;
        }
        .list-content-l{
          margin-right .05rem;
          .icon-gong{
            color #fd545c;
          }
          .icon-xu{
            color #0fc27c;
          }
        }
        .list-content-m{
          flex 1;
          font-size .15rem;
          color #333
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .list-content-r{
          font-size .12rem;
          color #999;
          margin-left .2rem;
        }
      }
    }
  }
</style>
