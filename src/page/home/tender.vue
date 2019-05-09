<template>
  <section>
    <div class="tender" v-for="item in newsData" :key="item.id" @click="go_newsdetail(item)">
          <h2 style="-webkit-box-orient: vertical;" v-html="item.title"></h2>
          <div style="-webkit-box-orient: vertical;" class="tender-content" v-html="item.summary">
            
          </div>
          <div class="tender-foot">
            <div v-if="item.area">
              <svg style="font-size: 0.15rem;" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-location1"></use>
                </svg>
                {{item.area}}
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
        this.axios.get('content/getResIdWaterfallPagedList', {
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
      if (window.localStorage.tender) {
        this.newsData = JSON.parse(window.localStorage.tender)
      }
    },
    mounted() {
      var that = this;
      //首页头条
      this.axios.get('content/getResIdWaterfallPagedList', {
        params: {
          lastId:''
        }
      }).then(function (data) {
        if (data.data.b) {
          for (let i = 0; i < data.data.b.length; i++) {
            data.data.b[i].content = Util.HTMLDecode(data.data.b[i].content).replace(/<[^>]+>/g, "").replace(/\s/g, "")
          }
        
          that.newsData = data.data.b
          window.localStorage.tender = JSON.stringify(data.data.b)
        }
      }).catch(function (error) {
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

  .tender{
    //  height 1.4rem;
     margin-top 0.1rem;
     background-color #fff;
     box-sizing border-box
     padding 0.15rem;

     h2{
       font-size 0.15rem;
       color #333;
       font-weight 600
       margin-bottom 0.12rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      margin-bottom 0.1rem;
      -webkit-box-orient: vertical;
     }
  }

  .tender-content{
      font-size 0.13rem
      color #666
    
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      margin-bottom 0.1rem;
  }

  .tender-foot{
    overflow hidden;
    color #999

    >div{
      float left 
    }

    span{
      float right
    }
  }

</style>
