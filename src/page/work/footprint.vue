<template>
  <section>
    <TopHead
      v-if="hasHead"
      :bgcolor = color
      title = '签到记录'
      v-on:history_back="history_back_click"
    ></TopHead>
    <div :class="{ hashead: hasHead }">
      <div v-if="has_foot" class="no_foot">
          <p>还没有足迹哦~</p>
          <p>世界那么大，浪荡孩儿需努力...</p>
        </div>
      <div v-if="!has_foot">
          <ul class="has_foot" v-for="item in items">
          <li class="has_foot_li">
            <p><span>{{item.signDate.substring(8)}}</span> &nbsp{{item.signDate.substring(5,7)}}月</p>
            <ul class="has_footdiv-1" @click="go_checkmap(p)" v-for="p in item.dataList">
              <li class="has_footdiv-2">{{p.time.substring(0,5)}}</li>
              <li class="has_footdiv-3">
                <div class="has_footdiv-4 line-1">{{p.address}}</div>
                <div class="line-2">{{p.detailAddress}}</div>
              </li>
              <div class="has_foot_img">
                <svg style="width: 0.18rem;height: 0.18rem" class="icon" aria-hidden="false">
                  <use xlink:href="#icon-into"></use>
                </svg>
              </div>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <infinite-loading  v-if="!has_foot"  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
    <span slot="no-more">
      暂无更多加载
    </span>
      <span slot="no-results">
      暂无更多加载
    </span>
    </infinite-loading>
  </section>
</template>

<script>
  let obj = []
  import InfiniteLoading from 'vue-infinite-loading';
  import TopHead  from '../../components/topheader.vue'  //header导航栏
  export default {
    data () {
      return {
        has_foot: false,
        items: [],
        hasHead: false,
        taskId: '',
        color:'#fd545c',
        num:1,
      }
    },
    components: {
      InfiniteLoading, TopHead
    },
    created(){
      if(this.$route.query.hasHead){
        this.hasHead = this.$route.query.hasHead;
      }
      if(this.$route.query.taskId){
        this.taskId = this.$route.query.taskId;
      }
      if(window.localStorage.footprint){
        this.items = JSON.parse(window.localStorage.footprint)
      }
    },
    mounted() {
      let that = this;
      this.color = this.$route.query.color
      // this.axios.get('https://apps.epipe.cn/member/v3/outsign/record/list', {params: {pageNo: this.num, pageSize: 10, taskId: this.taskId}}).then(function (data) {
      this.axios.get('/outsign/record/list', {params: {pageNo: this.num, pageSize: 10, taskId: this.taskId}}).then(function (data) {
          if (data.data.h.code == 200) {
            let mydata = data.data.b;
            that.items = mydata.data;
            if (mydata.dataTotal == 0) {
              that.has_foot = true;
            } else {
              window.localStorage.footprint=JSON.stringify(mydata.data);
              obj = mydata.data;
            }
          }
        }
      );
    },
    methods: {
      onInfinite(){
        let that = this;
        this.num++
        // this.axios.get('https://apps.epipe.cn/member/v3/outsign/record/list', {params: {pageNo: this.num, pageSize: 10, taskId: this.taskId}}).then(function (data) {
        this.axios.get('/outsign/record/list', {params: {pageNo: this.num, pageSize: 10, taskId: this.taskId}}).then(function (data) {
            console.log(data)
            if(data.data.h.code==200){
              let mydata = data.data.b.data
              if(mydata.length==0){
                that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              }else{
                if (obj[obj.length - 1].signDate == mydata[0].signDate) {
                  obj[obj.length - 1].dataList = obj[obj.length - 1].dataList.concat(mydata[0].dataList)
                  mydata.shift()
                  obj = obj.concat(mydata)
                } else {
                  obj = obj.concat(mydata)
                }
                that.items=obj
                setTimeout(function () {
                  that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                }, 200)
              }
            }
        })
      },
      go_checkmap(item) {
        window.location.href = "epipe://?&mark=checkmap&_id=" + item.id;
      }
    }
  }
</script>


<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .hashead {
    margin-top: 0.6rem
  }
  .no_foot
    text-align center
    font-size 0.16rem
    color: $font_color_6
    margin-top 1.3rem
    line-height 0.28rem

  .has_footdiv-2 {
    width 0.55rem
    font-size 0.15rem
  }

  .has_footdiv-3 {
    flex 1
    font-size 0.14rem
    color $font_color_6
    width 78%
  }

  .has_footdiv-4 {
    font-weight bold
    font-size 0.15rem
    color $font_color_3
  }
  .has_foot_li .has_footdiv-1{
    border-bottom 1px solid #e6e6e6
    padding-bottom 0.1rem
  }
  .has_foot_li .has_footdiv-1:active{
    background-color $bg_color
  }
  .has_foot_li .has_footdiv-1:nth-last-child(1){
    border-bottom none
    padding-bottom 0
  }
  .has_foot
    .has_foot_li
      margin 0.15rem
      background-color #fff
      padding 0.15rem
      border-radius 0.03rem
      .has_footdiv-1
        line-height 0.27rem
        display flex
        padding-top 0.1rem
        .has_foot_img
          display flex
          justify-content center
          align-items center
          margin-left 0.05rem
      p
        font-size 0.13rem
        color: $font_color_6
        span
          color $green_color
          font-size 0.17rem
          font-weight bold
  .line-1
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
  .line-2
    overflow hidden
    text-overflow ellipsis
    display -webkit-box
    -webkit-box-orient vertical
    -webkit-line-clamp 2
</style>
