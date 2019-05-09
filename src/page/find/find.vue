<template>
  <section class="padding_bottom_content">
    <img style="min-height:1.36rem" :src=banner.imgUrl  class="banner_img" />
    <div  class="find_con_div">
      <ul>
        <li class="find_color_div chose_blue_color">
        </li>
        <li class="find_color_div22">展会</li>
      </ul>
      <ul>
        <li class="find_color_div33" @click="go_exhibition()">更多</li>
        <li>
          <svg style="width: 0.15rem;height: 0.15rem" class="icon" aria-hidden="false">
            <use xlink:href="#icon-into"></use>
          </svg>
        </li>
      </ul>
    </div>

    <div class="cont" v-for="(item,index) in newsData" v-if="index<3" @click="go_newsdetail(item)">
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

    <div class="rests">
      
      <div class="expert" @click="go_expert()">
        <h3>专家资源</h3>
        <img src="../../assets/ex.png">
      </div>
      <div class="organization"  @click="go_specialistAgencies()">
        <h3>专业机构</h3>
        <img src="../../assets/ag.png">
      </div>
    </div>
  </section>
</template>

<script>
  import Util from '../../js/Util.js'
  export default {
    data () {
      return {
        banner: '',
        newsData : [],
      }
    },
   
    mounted(){
      let that = this;
      that.axios.get(that.Service.content_show + that.Service.queryString({type: 4, locationId: 40})).then(function(res){
            that.banner = res.data.b[0]
      })

      that.axios.get('content/getResExhibition', {
        params: {
         lastId:'',
        }
      }).then(function (data) {
        if (data.data.b) {
          that.newsData = data.data.b
          window.localStorage.exhibition = JSON.stringify(data.data.b)
        }
      })
      
    },

    methods: {

      go_exhibition(){ //跳展会
        window.location.href = "epipe://?&mark=exhibition"
      },
      go_expert(){ //跳专家库
        window.location.href = "epipe://?&mark=expert"
      },
      go_specialistAgencies(){ //跳专业机构
        window.location.href = "epipe://?&mark=specialistAgencies"
      },
      go_newsdetail(item){

        let title = Util.Title_format(item.title)
        let obj = {};
        obj.title = title;
        obj.imageUrl = item.coverImg;
        obj.text = Util.Title_format(item.summary);
        obj.collectState = item.collectState;
        let data = JSON.stringify(obj)
     
        window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&_id=" + item.id+'&data='+data; 
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../style/variable.styl";
  .exhit_div {
    margin: 0.15rem 0.15rem 0 0.15rem;
    height: 1.83rem;
    position: relative;
    overflow: hidden;
    margin-top -0.005rem
  }
  .item-title{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .exhit_div div {
    height: 0.45rem;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    bottom: 0;
    line-height: 0.45rem;
  }

  .exhit_div div span {
    color: #fff;
    font-size: 0.15rem;
    padding: 0 0.14rem 0 0.14rem;
  }

  .find_con_div {
    margin-top: 0.08rem;
    height: 0.44rem;
    display :-webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 0.15rem;
    margin-right: 0.15rem;
    align-items: center;
  }

  .find_con_div:active {
    opacity $opacity_common
  }


  .find_con_div > ul {
    display :-webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .find_color_div {
    background-color: $green_color;
    width: 0.04rem;
    height: 0.24rem;
  }

  .find_color_div22 {
    margin-left: 0.1rem;
    font-size: 0.15rem;
  }

  .find_color_div33 {
    margin-right: 0.05rem;
    font-size: 0.15rem;
    color: #666;
  }


  .rests{
      display :-webkit-flex;
      display flex
      background-color #fff;
      margin 0 0.15rem;
      margin-top 0.15rem;

      h3{
        margin-left 0.15rem;
        font-size 0.13rem;
        margin-bottom 0.1rem;
        font-weight 600 
      }

    .expert{
      width 1.13rem;
      border-right 1px solid #e5e5e5;
      padding 0.15rem 0;

      h3{
        color #f80;
      }
      
        img{
          display block;
          width 0.5rem;
          height 0.65rem;
          margin 0 auto;
        }
    }

    .organization{
        flex 1
        padding 0.15rem 0;
      
      h3{
        color #27b1eb

      }

      img{
        display block;
        width 1.7rem;
        height 0.65rem;
        margin 0 auto;
      }
    }

  }

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
