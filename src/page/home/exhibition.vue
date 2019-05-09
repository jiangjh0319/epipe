<template>
  <section>
    <!-- <div @click="go_newsdetail(item)" v-for="item in newsData" class="exhit_div">
      <img v-if="item.coverImg!=''" style="border-radius: 0.03rem;overflow: hidden;width: 100%;height: 1.83rem" :src=item.coverImg|img_format />
      <img v-else="item.coverImg!=''"  style="border-radius: 0.03rem;overflow: hidden;width: 100%;height: 1.83rem"  src="../../assets/pic3.png" />
      <div>
        <span class="over_width" v-html="item.title"></span>
      </div>
    </div> -->

    <div class="cont" v-for="(item,index) in newsData" @click="go_newsdetail(item)">
        <h2 v-html="item.title"></h2>
        <article v-html="item.summary" style="-webkit-box-orient: vertical"></article>
        <div class="cont_foot">
          <div class="cont_address" v-if="item.exhibitionLocation">
             <svg style="font-size: 0.15rem;" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-location1"></use>
                </svg>
                {{item.exhibitionLocation}}
          </div>
          <span class="cont_time">{{item.createDate.slice(0,10)}}</span>
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
  import InfiniteLoading from 'vue-infinite-loading';
  import Util from '../../js/Util.js'
  let pageNo = 2
  export default {
    data () {
      return {
        newsData: ''
      }
    },
    components: {
      InfiniteLoading
    }, methods: {
      go_newsdetail(item){
        let title = Util.Title_format(item.title)
        let obj = {};
        obj.title = title;
        obj.imageUrl = item.coverImg;
        obj.text = Util.Title_format(item.summary);
        let data = JSON.stringify(obj)
        window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&_id=" + item.id+'TTTTTT&data='+data;
      },
      onInfinite(){ //上拉加载更多
        let that = this;
        //首页头条
        this.axios.get('content/getResExhibition', {
          params: {
              lastId:that.newsData[(that.newsData.length) - 1].id
          }
        }).then(function (data) {
          setTimeout(() => {
            if (data.data.b.length == 0) { 
                that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else if (data.data.b) {
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
      if (window.localStorage.exhibition) {
        this.newsData = JSON.parse(window.localStorage.exhibition)
      }
    },
    mounted(){
      let that = this;
      //展会
      this.axios.get('content/getResExhibition', {
        params: {
          lastId:''
        }
      }).then(function (data) {
        console.log(data)
        if (data.data.b) {
          that.newsData = data.data.b
          window.localStorage.exhibition = JSON.stringify(data.data.b)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>


  .cont{
    height 1rem;
    margin 0 0.15rem;
    background-color #fff;
    margin-bottom 0.1rem;
    padding 0.15rem;

    h2{
      font-size 0.15rem;
      color #333;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-weight 600
    }

    article{
      display block;
      color #666;
      font-size 0.13rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin 0.18rem 0;
    }

    .cont_foot{
      color #999;
    }

    .cont_address{
      float left
    }

    .cont_time{
      float right 
    }
  }
  .find_color_div{
    background-color #2bb1e9
  }
</style>
