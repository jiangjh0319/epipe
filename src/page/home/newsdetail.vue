<template>
  <section style="background-color: #fff; padding :0.15rem 0.15rem 0.3rem 0.15rem;">
    <div style="height: 6.2rem;overflow: hidden" v-if="!is_show">
      <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>
    </div>
    <div v-show="is_show">
      <div  v-show="home" class="head_title" v-html="detail.title">
      </div>
      <ul v-show="home" class="head_title_ul">
        <li v-if="detail.authorName">作者：<span>{{detail.authorName}}</span></li>
        <li v-if="detail.sourceOfName">来源：<span>{{detail.sourceOfName}}</span></li>
        <li v-if="detail.keywords">TAG：<span style="color: #0fc37c">{{detail.keywords}}</span></li>
        <li v-if="detail.create_date">
          发布时间：<span>{{detail.createDate | home_time_format}}</span>
        </li>
      </ul>
      <div class="detail_content" v-html="content"></div>
    </div>

  </section>
</template>

<script>
  import Util from '../../js/Util.js'
  export default {
    data () {
      return {
        content: '',
        home: false,
        is_show: false,
        detail: ''
      }
    },
    components: {},
    created(){

    },
    mounted() {
      let _id = this.$route.query.id
       let that = this;
      if (_id.indexOf("TTTTTT")>0) {
        
        _id=_id.replace("TTTTTT",'');
        
        this.home = true;
        //改版头条
        this.axios.get('/content/getDetails?resId='+_id).then(function (data) {
    
          if (data.data.b) {
            that.is_show = true;
            that.detail = data.data.b
            that.content = data.data.b.contents
            document.title = that.detail.title;

            let obj = {};
            obj.collectId = that.detail.collectId;
            obj.collectState = that.detail.collectState;
            let dataStr = JSON.stringify(obj)
            window.location.href = "epipe://?&mark=isCollect"+'&data='+dataStr;
          }
        })
      } else {
        //首页头条
        this.axios.get(this.Service.content_Detail, {
          params: {
            headlineId: _id
          }
        }).then(function (data) {
          if (data.data.b) {      
            that.is_show = true;
            document.title = data.data.b.title;
            that.content = Util.HTMLDecode(data.data.b.content)
          }
        })
      }
    }
  }
</script>
<style>
  .head_title {
    font-size: 0.22rem;
    font-weight: bold;
    padding-bottom: 0.1rem;
    word-wrap:break-word;
  }

  .head_title_ul {
    display: flex;
    flex-wrap: wrap;
  }

  .head_title_ul li {
    width: 50%;
    padding: 0.035rem 0 0.035rem 0;
  }

  .head_title_ul li span {
    color: #777;
    font-size: 0.13rem;
  }

  .detail_content {
    overflow-x: hidden;
    padding-top: 0.1rem;
    line-height: 0.28rem;
  }

  img {
    width: 100%;

  }

  p > span {
    /*margin-left: -2em;*/
  }

  .menu-title-span {
    padding-bottom: 0.2rem;
    line-height: 0.31rem;
    font-weight: bold;
  }

  h2 span {
    font-weight: bold;
  }

  .sk-circle {
    margin: 2.8rem auto;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .sk-circle .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-circle .sk-child:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #333;
    border-radius: 100%;
    -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
    animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
  }

  .sk-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
  }

  .sk-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    transform: rotate(60deg);
  }

  .sk-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .sk-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
    -ms-transform: rotate(120deg);
    transform: rotate(120deg);
  }

  .sk-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
    -ms-transform: rotate(150deg);
    transform: rotate(150deg);
  }

  .sk-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .sk-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
    -ms-transform: rotate(210deg);
    transform: rotate(210deg);
  }

  .sk-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
    -ms-transform: rotate(240deg);
    transform: rotate(240deg);
  }

  .sk-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
  }

  .sk-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
    -ms-transform: rotate(300deg);
    transform: rotate(300deg);
  }

  .sk-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
    -ms-transform: rotate(330deg);
    transform: rotate(330deg);
  }

  .sk-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .sk-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .sk-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .sk-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  .sk-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }

  .sk-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }

  .sk-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .sk-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }

  .sk-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }

  .sk-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }

  .sk-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes sk-circleBounceDelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes sk-circleBounceDelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
