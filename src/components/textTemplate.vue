<template>
<div>
         <div v-if="item.resType==8" class="home_content_news-1">
            <ul  @click="go_newsdetail(item)" class="home_title_con4">
                <div><img :src="item.converImgUrl" width="100%"></div>
                <div>
                    <div class="home_title_con5 over_width" v-html="item.resTitle" ></div>
                    <div class="home_title_con6 simple-ellipsis" v-html="item.summary"></div>
                    <div class="home_title_con7 over_width sub-desc">
                        <div>
                            <span>{{item.resTopNewsCategoryName}}</span>
                            <span>&nbsp; {{item.resDate}}</span>
                        </div>
                        <div>
                            <span>&nbsp; 
                            <svg style="font-size: 0.15rem;" class="icon" aria-hidden="false">
                                <use xlink:href="#icon-yuedu"></use>
                            </svg> {{item.clicks}}
                            </span>
                        </div>
                    </div>
                </div>
            </ul>
        </div>

     
        <div class="cont" v-if="item.resType==1" @click="go_newsdetail(item)">
            <h2 v-html="item.resTitle"></h2>
            <article v-html="item.summary" style="-webkit-box-orient: vertical"></article>
            <div class="cont_foot">
            <div class="cont_address" v-if="item.exhibitionLocation">
                <svg style="font-size: 0.15rem;" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-location1"></use>
                    </svg>
                    {{item.exhibitionLocation}}
            </div>
            <span class="cont_time" v-if="item.resDate">{{item.resDate.slice(0,10)}}</span>
            </div>
        </div>

        <ul v-if="item.resType==2||item.resType==3||item.resType==9||item.resType==10"  @click="go_newsdetail(item)" class="tender_div1">
            <li class="over_width" v-html="item.resTitle"></li>
                <li class="simple-ellipsis" v-html="item.summary"></li>
        </ul>

        <div v-if="item.resType==4" class="item market"  @click="go_newsdetail(item)">
            <h2 v-html="item.resTitle"></h2>
            <div class="item_infor">
                <span v-html="item.resDate"></span>
                <span class="spanRight">
                    <svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yuedu"></use>
                    </svg>{{item.clicks}}
                </span>
            </div>
        </div>

        <div v-if="item.resType==5||item.resType==11" class="item interview"  @click="go_newsdetail(item)">
            <div class="img-show">
                <img :src="item.converImgUrl" />
            </div>
            <div class="item-content">
                <h2 v-html="item.resTitle"></h2>
                <div class="item-text" v-html="item.summary"></div>
                <div class="item_infor">
                    <span>{{item.resDate}}</span>
                    <span class="spanRight">
                        <svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-yuedu"></use>
                        </svg>{{item.clicks}}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="cont agencies" @click.stop="go_newsdetail(item)"  v-if="item.resType==7||item.resType==6">
            <div class="img-show">       
                <img :src="item.converImgUrl"/>
            </div>
            <div class="item-text">
                <h2 v-html="item.resTitle"></h2>
                <article v-html="item.summary"></article>
            </div>
        </div> 
    </div>
  
</template>


<script>
import Util from '../js/Util.js'
export default {
    data(){
        return{
        }
    },
    props:['item','type'],
    methods:{
        go_newsdetail(item){
         
            let obj = {};
            obj.title = Util.Title_format(item.resTitle)
            obj.imageUrl = item.coverImgUrl;
            obj.text = Util.Title_format(item.summary)
            let data = JSON.stringify(obj)

            window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&_id=" + item.resId+'&data='+data;
  
        }
    }
}
</script>


<style lang="stylus" scoped>
@import "../style/style.styl";

    // 头条
 
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
  .home_title_con4:active {
    background-color $opacity_bgcolor
  }
  .home_title_con5 {
    width: 100%;
    font-size: 0.15rem;
    font-weight: bold;
    margin-top: -0.01rem;
  }
  .home_title_con6 {
    color: #666;
    font-size: 0.14rem;
    margin-top: 0.063rem;
    line-height 0.178rem
    min-height 0.345rem
  }
  .home_title_con7 {
    color: #999;
    font-size: 0.12rem;
    margin-top: 0.09rem;
  }
  .sub-desc{
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

  }

//展会
.cont{
    height 1rem;
    margin 0.15rem 0.15rem;
    background-color #fff;
    margin-bottom 0;
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
      /* autoprefixer: off*/
        -webkit-box-orient: vertical;
    /* autoprefixer: on*/
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
 

// 供需

.tender_div1 {
    margin: 0.15rem 0.15rem 0 0.15rem;
    padding: 0.15rem;
    background-color: #fff;
    border-radius: 0.027rem;
  }

  .tender_div1 li {
    color: #666;
    font-size: 0.14rem;
    margin-top: 0.058rem;
    line-height 0.2rem
  }

  .tender_div1 li:first-child {
    color: #333;
    font-size: 0.15rem;
    font-weight: bold;
    margin: 0;
  }
  .tender_div1:active {
    background-color $opacity_bgcolor
  }

  //行情

  .market{
        margin  0.15rem;
        margin-bottom 0;
        padding 0.15rem 0.1rem;
        background-color: #fff;
        border-radius 4px;
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
    }

    .market .item_infor{
        font-size 0.13rem;
        color #999;
    }

    .market .item_tag{
        color #ffa51e;
        margin-right 0.2rem;
    }
    .market .spanRight{
        float right ;
    }

   .market h2{
        height 0.48rem;
        font-size 0.15rem;
        color #333;
        line-height 0.24rem;
    }

    //访谈

     .interview{
        display flex;
        margin 0.15rem;
        margin-bottom 0;
        padding 0.15rem 0.1rem;
        background-color #fff;
        border-radius 4px;
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
    }

    .interview .img-show{
        width 0.9rem;
        height 0.9rem;
        margin-right 0.1rem;

        img{
            width 100%;
            height 100%;
            border-radius 4px;
        }
    } 

   .interview .item-content{
       width : calc(100% - 1rem);

        h2{
            font-size 0.15rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .item-text{
            font-size 0.14rem;
            line-height 0.18rem;
            color #666;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
             /* autoprefixer: off*/
                -webkit-box-orient: vertical;
            /* autoprefixer: on*/

            margin 0.09rem 0;
            text-align justify;
        }
    }

    .interview .item_infor{
        font-size 0.13rem;
        color #999;
    }

    .interview .item_tag{
        color #ffa51e;
        margin-right 0.2rem;
    }
    .interview .spanRight{
        float right;
    }

    // 政府机构

    .agencies{
        display flex;
        padding 0.15rem;
        margin-bottom 0.15rem;
        background-color #fff;
        -webkit-box-shadow: 0 0 0.2rem rgba(252,83,91,0.1);    
        box-shadow 0 0 0.2rem rgba(252,83,91,0.1);   
        margin: 0.15rem 0.15rem 0px;
        padding: 0.15rem 0.1rem;
        border-radius: 4px;
    }


    .agencies .item-text{
        width : calc(100% - 1rem);

         h2{
            font-size 0.15rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        article {
            font-size 0.14rem;
            line-height 0.18rem;
            color #666;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            margin 0.09rem 0;
            text-align justify;
        }
    }

    .agencies .img-show{
        width 0.9rem;
        height 0.9rem;
        margin-right 0.1rem;

        img{
            width 100%;
            height 100%;
            border-radius 4px;
        }
    }
</style>
