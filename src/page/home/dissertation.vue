<template>
  <section>
    <div class="dissertation" :key="item.id" @click="go_newsdetail(item)" v-for="item in newsData">
          <p class="title" v-html="item.title"></p>
          <div style="-webkit-box-orient: vertical;" class="dissertation-content" v-html="item.summary">
              
          </div>
          <div class="dissertation-foot">
            <div class="foots">
              <a>{{item.name}}</a>
              <span>{{item.keywords}}</span>
              <!-- <span>管道</span> -->
            </div>
            <span>{{item.createDate.slice(0,10)}}</span>
          </div>
    </div>
    <infinite-loading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
    <span slot="no-more">
      暂无更多加载
    </span>
      <span slot="no-results">
      暂无结果
    </span>
    </infinite-loading>
  </section>
</template>

<script>
  import Util from '../../js/Util.js'
  import InfiniteLoading from 'vue-infinite-loading';
  let pageNo = 2
  export default {
    data () {
      return {
        newsData: ''
      }
    },
    components: {
      InfiniteLoading
    },
    methods: {
      go_newsdetail(item){

        let obj = {};
        obj.title = Util.Title_format(item.title);
        obj.imageUrl = item.coverImg;
        obj.text =  Util.Title_format(item.content.slice(0,40));
        let data = JSON.stringify(obj)
        window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&_id=" + item.id+'TTTTTT&data='+data;
      }, onInfinite(){
        let that = this;
        //招投标
        this.axios.get('content/getYouGuanZuanTi', {
          params: {
            lastId:that.newsData[(that.newsData.length) - 1].id
          }
        }).then(function (data) {
          setTimeout(() => {
            if (data.data.b.pageTotal == pageNo || data.data.b.pageSize >= data.data.b.dataTotal) {
              that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            }
            if (data.data.b) {
              pageNo++
              for (let i = 0; i < data.data.b.length; i++) {
                data.data.b[i].content = Util.HTMLDecode(data.data.b[i].content).replace(/<[^>]+>/g, "").replace(/\s/g, "")
              }
              that.newsData = that.newsData.concat(data.data.b)
              that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          }, 200);
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    created(){
      if (window.localStorage.dissertation) {
        this.newsData = JSON.parse(window.localStorage.dissertation)
      }
    },
    mounted() {
      var that = this;
      //首页头条
      this.axios.get('content/getYouGuanZuanTi', {
        params: {
          lastId:''
        }
      }).then(function (data) {
        if (data.data.b) {
          for (let i = 0; i < data.data.b.length; i++) {
            data.data.b[i].content = Util.HTMLDecode(data.data.b[i].content).replace(/<[^>]+>/g, "").replace(/\s/g, "")
          }
        
          that.newsData = data.data.b
          window.localStorage.dissertation = JSON.stringify(data.data.b)
        }
      }).catch(function (error) {
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

  .dissertation{
     height 1.2rem;
     margin-top 0.1rem;
     background-color #fff;
     box-sizing border-box
     padding 0.15rem;

     .title{
       font-size 0.15rem;
       color #333;
       font-weight 600
       margin-bottom 0.05rem;
       text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
     }
  }

  .dissertation-content{
      font-size 0.13rem
      color #666
  
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      margin-bottom 0.1rem;
  }

  .dissertation-foot{
    color #999
    font-size 0.13rem;

    >div{
      float left 
    }

    >span{
      float right
    }
  }

  .foots span{
      color #f80
      margin-right 0.15rem;
  }

  .foots a{
      display inline-block
      height 0.14rem;
      line-height 0.14rem;
      border 1px solid #27b1eb
      margin-right 0.25rem;
      border-radius 0.5rem;
      padding 0 0.1rem;
      font-size 0.1rem;
  }

</style>
