<template>
  <!--<vue-pull-refresh :on-refresh="onRefresh">-->
  <div>
    <section class="home">
  
      <!-- <div class="header"> -->
            <!-- <div class="search-main">
                <div class="search"  @click="go_search()">
                    <div class="search_icon">
                        
                    </div>
                    
                    <input ref="input"  type="text"  placeholder="请输入关键字">
                </div>
            </div>
           -->
        <!-- </div> -->
      <div class="banner-wrapper">
        <!-- <carousel-3d :autoplay="true" dir="ltr" :autoplayTimeout="5000" :autoplayHoverPause="true" :width="config.width" :height="config.height" :border="0" :perspective="0">
          <slide v-for="(banner,index) in banners" :key="index" :index="index">
            <img @click="go_newsdetail(banner)" :src=banner.imgUrl>
          </slide>
        </carousel-3d> -->
        
    <wc-swiper :duration="900" :interval="3000" @transitionend="fn">
        <wc-slide v-for="(banner,index) in banners" :key="index" :index="index" >
            <img @click="go_newsdetail(banner)" :src=banner.imgUrl>
        </wc-slide>
    </wc-swiper>
      </div>
      <ul class="home_nav_top">
        <li @click="go_mall">
          <div style="background: -webkit-linear-gradient(top, #fd535b 0%,#fc757e 100%);">
            <svg style="width: 0.22rem;height: 0.22rem" class="icon" aria-hidden="false">
              <use :xlink:href='name'></use>
            </svg>
          </div>
          <div>优管优选</div>
        </li>

         <li @click="go_dissertation">
          <div  style="background: -webkit-linear-gradient(top, #51cdfc 0%,#27b1eb 100%);">
            <svg style="width: 0.22rem;height: 0.22rem" class="icon" aria-hidden="false">
              <use xlink:href="#icon-zhuanjiaku"></use>
            </svg>
          </div>
          <div>优管专题</div>
        </li>
       
        <li @click="go_tender">
          <div style="background: -webkit-linear-gradient(top, #45e3b5 0%,#22be8e 100%);">
            <svg style="width: 0.22rem;height: 0.22rem" class="icon" aria-hidden="false">
              <use xlink:href="#icon-zhaotoubiao"></use>
            </svg>
          </div>
          <div>优招标</div>
        </li>
        </ul>
       
      <div class="home_title_con1">
        <div></div>
        <div>头条</div>
      </div>
  <!-- <div class="home_content_news-1" v-for="newsData_item in newsData"> 
          <ul v-if="newsData_item.coverImgUrl==''" @click="go_news(newsData_item)" class="home_title_con2">
          <li class="over_width" v-html="newsData_item.resTitle"></li>
          <li class="home_title_con3 simple-ellipsis" v-html="newsData_item.summary">
          </li>
          <li>
            <span>{{newsData_item.resTopNewsCategoryName}}</span>
            <span>&nbsp&nbsp&nbsp&nbsp{{newsData_item.resCreateDate | home_time_format}}</span>
            <span>&nbsp&nbsp&nbsp&nbsp <svg style="font-size: 0.15rem" class="icon" aria-hidden="false">
              <use xlink:href="#icon-yuedu"></use>
            </svg>：{{newsData_item.clicks}}</span>
          </li>
        </ul>
        <ul v-else="newsData_item.coverImg!=''" @click="go_news(newsData_item)" class="home_title_con4">
          <div><img v-bind:src=newsData_item.coverImgUrl|news_format width="100%"></div>
          <div>
            <div class="home_title_con5 over_width" v-html="newsData_item.resTitle"></div>
            <div class="home_title_con6 simple-ellipsis" v-html="newsData_item.summary"></div>
            <div class="home_title_con7 over_width sub-desc">
              <div>
                <span>{{newsData_item.resTopNewsCategoryName}}</span>
                <span>&nbsp; {{newsData_item.resCreateDate | home_time_format}}</span>
              </div>
              <div>
                <span>&nbsp; 
                  <svg style="font-size: 0.15rem;" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-yuedu"></use>
                  </svg> {{newsData_item.clicks}}
                </span>
              </div>
            </div>
          </div>
    </ul> -->
        <div class="item" v-for="item in newsData" @click="go_news(item)" :key="item.id" >
            <div class="img-show">
                <img :src="item.coverImgUrl" />
            </div>
            <div class="item-content">
                <h2 v-html="item.resTitle"></h2>
                <div class="item-text" style="-webkit-box-orient: vertical" v-html="item.summary"></div>
                <div class="item_infor">
                    <span style="margin-right:0.05rem;">{{item.resTopNewsCategoryName}}</span>
                    <span>{{item.resCreateDate.slice(0,10)}}</span>
                    <span class="spanRight">
                        <svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                          + <use xlink:href="#icon-yuedu"></use>
                        </svg>{{item.clicks}}
                    </span>
                </div>
            </div>
        </div>

        <!-- </div> -->
      <infinite-loading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
        <span slot="no-more">
          暂无更多加载
        </span>
        <span slot="no-results">
          暂无结果
        </span>
      </infinite-loading>
    </section>
  </div>
</template>

<script>
  import Util from '../../js/Util.js'
  import InfiniteLoading from 'vue-infinite-loading';
  import Pagination from '../../components/Pagination.vue';
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  export default {
    data () {
      return {
        banners: [1, 2],
        newsData: [], //新闻列表
        currentSlide: 0,
        config:{
          width: 350,
          height: 180
        },
        name:'#icon-youguanyouxuan'
      }
    },
    components: {
      InfiniteLoading,
      Pagination,
      Carousel3d,
      Slide
    },
    methods: {
      onInfinite(){
        let that = this;
        //首页头条
        setTimeout(() => {
          that.axios.get('/content/getWaterfallPagedList', {
            params: {
              pageSize: 10,
              lastId: that.newsData[(that.newsData.length) - 1].id
            }
          }).then(function (data) {
            if (data.data.b.length == 0) {
           
              that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else if (data.data.b) {
              that.newsData = that.newsData.concat(data.data.b)
              that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          })
        }, 200);
      },
      go_tender(){  //首页跳招投标
        window.location.href = "epipe://?&mark=tender"
         TDGA.onEvent('tender','招投标')    
      },
      go_dissertation(){  //首页跳优管专题
        window.location.href = "epipe://?&mark=dissertation"
       TDGA.onEvent('dissertation','优管专题')    
      },
      go_mall(){  //首页跳商城
        window.location.href = "epipe://?&mark=mallhome"
        TDGA.onEvent('mall','商城')    
      },
      go_newsdetail(item){
        if(item.title=='优商城'){
            window.location.href = "epipe://?&mark=mallhome"
          return
        }else if(item.url.indexOf("isActivity=1")>-1){
            window.location.href = "epipe://?&mark=mallhome&title=" + item.title + "&url=" + item.url;
            return
        }
        if (item.h5Uri != "" && item.h5Uri) {
          let title = Util.Title_format(item.title) 
          window.location.href = "epipe://?&mark=newsdetail&title=" + title+'&data='+ data + "&url=" + item.h5Uri;
        } else if (item.url) {
            if (item.coverImgUrl != "#") {
              console.log(item.coverImgUrl!='#')
              let obj = {};
              obj.title = Util.Title_format(item.title);
              obj.imageUrl = item.imgUrl;
              obj.text = '';
              obj.collectState = item.collectState;
              obj.collectId = item.collectId;
              let data = JSON.stringify(obj)
              window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&url=" + item.url;
            }
          } else {
            let title = Util.Title_format(item.title)
            window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&_id=" + item.id;
          }
      },
      go_news(item){
        let title = Util.Title_format(item.resTitle);
        let obj = {};
        obj.title = title;
        obj.imageUrl = item.coverImgUrl;
        obj.text = Util.Title_format(item.summary);
        let data = JSON.stringify(obj)
    
        window.location.href = `epipe://?&mark=newsdetail&title=${title}&_id=${item.resId}`+'&data='+data;
      },
      transitionend (current) {
        this.currentSlide = current;
      },
      go_search(){
        window.location.href ="epipe://?&mark=homeSearch"
      }
    },
    created(){
      if (window.localStorage.banners) {
        this.banners = JSON.parse(window.localStorage.banners)
      }
      if (window.localStorage.newsData) {
        this.newsData = JSON.parse(window.localStorage.newsData)
      }
      /*根据屏幕分辨率设置轮播图大小*/
      const deviceWidth = document.body.clientWidth;
      this.config.width = (deviceWidth/375)*350;
      this.config.height = (deviceWidth/375)*180;
    },
    mounted() {
      let that = this;

      //轮播图
      this.axios.get(this.Service.content_show, {params: {type: 1, locationId: 10}}).then(function (data) {
      
        if (data.data.b) {
          for (var i = 0; i < data.data.b.length; i++) {
            data.data.b[i].imgUrl = data.data.b[i].imgUrl + '?imageslim&imageView2/1/w/750/h/320'
          }
          that.banners = data.data.b
          window.localStorage.banners = JSON.stringify(data.data.b)
        }
      })
      //首页头条
      // this.axios.get(this.Service.host + this.Service.newHomeNews, {
       
        this.axios.get('/content/getWaterfallPagedList', {
        params: {
          pageSize: 10,
          lastId: ""
        }
      }).then(function (data) {
      
        if (data.data.b) {
          that.newsData = data.data.b
          window.localStorage.newsData = JSON.stringify(that.newsData)
        }
      })
    },
    computed: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../style/variable.styl";
  .wc-swiper-container {
    height auto
  }

  .wc-slide{
    height:auto;
    min-height:1.74rem;
    }

  .wc-slide img{
    width:100%;
    height:100%
  }

  .wc-pagination .wc-dot-active {
    background $green_color
  }

  .swiper-slide
    .banner_img
      border none
      display block

  .banner-wrapper{
    overflow hidden;
    background: white;
  }
  .carousel-3d-container{
    margin 0;
  }
  .carousel-3d-slide img{
    display block;
    height: 100%;
  }
  .home_title_con7 {
    color: #999;
    font-size: 0.12rem;
    margin-top: 0.09rem;
  }

  .home_title_con6 {
    color: #666;
    font-size: 0.14rem;
    margin-top: 0.063rem;
    line-height 0.178rem
    min-height 0.345rem
  }

  .home_title_con5 {
    width: 100%;
    font-size: 0.15rem;
    font-weight: bold;
    margin-top: -0.01rem;
  }

  .home_title_con4 {
    background-color: #fff;
    padding: 4% 0 4% 0;
    margin-top: 4%;
    clear: both;
    height: 0.85rem;
  }

  .home_title_con4 > div:first-child {
    margin-left: 4%;
    width: 37.5%;
    border-radius: 0.025rem;
    height: 0.85rem;
    float: left;
    overflow: hidden;
    background-color: #fff;
  }

  .home_title_con4 > div:last-child {
    margin-right: 4%;
    width: 52.5%;
    float: left;
    margin-left: 2%;
  }

  .home_title_con2 {
    display: flex;
    display:-webkit-flex;
    flex-direction: column;
    background-color: #fff;
    padding: 0.15rem;
    margin-top 0.15rem
  }

  .home_title_con2:active {
    background-color $opacity_bgcolor
  }

  .home_title_con4:active {
    background-color $opacity_bgcolor
  }

  .home_title_con2 li:first-child {
    font-size: 0.15rem;
    font-weight: bold;
  }

  .home_title_con3 {
    height 0.39rem
    font-size: 0.14rem;
    color: #666;
    margin-top: 0.08rem;
    line-height 0.2rem
  }

  .home_title_con2 li:last-child {
    margin-top: 0.15rem;
    font-size 0.12rem
    color $font_color_9
  }

  .home_title_con1 {
    display: flex;
    display:-webkit-flex;
    flex-direction: row;
    align-items: center;
    height: 0.475rem;
    margin-bottom -0.15rem
  }

  .home_title_con1 div:first-child {
    width: 0.04rem;
    height: 0.25rem;
    background-color: $orange_color;
    margin-left: 0.15rem;
  }

  .home_title_con1 div:last-child {
    margin-left: 0.08rem;
    font-size: 0.15rem;
  }

  .home_nav_top {
    display: flex;
    display:-webkit-flex;
    flex-direction: row;
    height: 0.96rem;
    align-items: center;
    background-color: #fff;
    padding 0 0.1rem 0 0.1rem
  }

  .home_nav_top li {
    width:33.33%;
    font-size: 0.14rem;
    align-items: center;
   
    display: flex;
    display:-webkit-flex;
    justify-content: center;
    flex-direction: column;
    /*padding-bottom 0.05rem*/
    padding 0.08rem 0 0.08rem 0
  }

  .home_nav_top
    li
      &:active
        background-color $opacity_bgcolor

  .home_nav_top li > div:first-child {
    width: 0.398rem;
    height: 0.398rem;
    border-radius: 10rem;
    
    display: flex;
    display:-webkit-flex;
    align-items: center;
    justify-content: center;
  }

  .home_nav_top li div {

    display: flex;
    display:-webkit-flex;
    font-size: 0.13rem;
    margin-top: 0.05rem;
  }

  .swiper-pagination .swiper-pagination-bullet-active {
    background-color $green_color
  }

  .swiper-pagination .swiper-pagination-bullet {
    height 0.025rem
    width 0.14rem
    border-radius 0.6rem
  }
  
  .sub-desc{
   
    display: flex;
    display:-webkit-flex;
    justify-content space-between;
  }

  .header{
        display flex;
        display:-webkit-flex;
        padding 0.07rem 0.15rem;
        height 0.44rem;
        box-sizing: border-box;
        line-height 0.3rem;
        background-color #fff;


        .search-main{
            flex 1
        }

        .search{
            position relative
            width:3rem;
            height 0.3rem;
            border-radius 0.3rem;
            overflow hidden;
            margin 0 auto;
            background-color:#efeff0;

            .search_icon{
                position absolute;
                width:0.15rem;
                height 0.15rem;
                background-image url(../../assets/fdj.png)
                background-size 0.15rem 0.15rem;
                top:0.08rem;
                left:0.2rem;
            }

            svg{
              margin-left 0.2rem;
            }

            input{
                position absolute;
                width 1.5rem;
                height 100%;
                color #fff;
                font-size 0.14rem;
                border none;
                outline none;
                left:0.6rem;
                background-color:#efeff0;
            }
            input::-webkit-input-placeholder{
            color:#666;
            }
            input::-moz-placeholder{  
                color:#fff;
            }
            input:-moz-placeholder{  
                color:#fff;
            }
            input:-ms-input-placeholder{ 
                color:#fff;
            }
        }

        .search_btn{
            font-size 0.16rem;
            color:#fff;
        }
    }


    .item{
        
        display flex;
        display:-webkit-flex;
        margin-top 0.15rem;
        width:100%;
        padding 0.15rem 0.15rem;
        background-color #fff;
        border-radius 4px;
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
        box-sizing border-box
    }

    .img-show{
        width 1.4rem;
        margin-right 0.1rem;

        img{
            width 1.4rem;
            height 0.9rem;
            border-radius 4px;
        }
    } 

    .item-content{
     
        width : calc(100% - 1.5rem)

        h2{
            width 100%;
            font-size 0.15rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            color:#333;
            font-weight bold;

        }

        .item-text{
        
            font-size 0.14rem;
            line-height 0.18rem;
            color #666;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin 0.09rem 0;           
        }
    }

    .item_infor{
        font-size 0.13rem;
        color #999;
    }

    .item_tag{
        color #ffa51e;
        margin-right 0.2rem;
    }
    .spanRight{
        float right;
    }

    .simple-ellipsis{
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
             /* autoprefixer: off*/
                -webkit-box-orient: vertical;
            /* autoprefixer: on*/
            margin 0.09rem 0; 
    }

</style>
