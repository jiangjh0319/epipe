<template>
  <div class="comment-wrapper">
    <div class="sup">
      <span class="title">评价</span>
      <span v-for="i in score" :key="i" @click="handleStar(i)">
        <i class="iconfont icon-star"></i>
      </span>
      <span v-for="i in (5-score)" :key="score+i" @click="handleStar(score+i)">
        <i class="iconfont icon-star-gray"></i>
      </span>
    </div>
    <div class="sub">
      <textarea name="comment" id="container" cols="30" rows="10" maxlength="100" placeholder="评价内容在100字内" v-model="content"></textarea>
    </div>
    <div class="btn" :class="{'btn-active': score && content}" @click="handleSubmit">提交</div>
  </div>
</template>
<script>
  export default {
    name: 'GoodsComment',
    data(){
      return{
        recId: null,
        score: 0,
        content: '',
      }
    },
    created(){
      document.title="评价";
      this.recId = this.$route.query.id;
    },
    methods:{
      /*评分*/
      handleStar(index){
        this.score = index;
      },
      /*提交评价*/
      handleSubmit(){
        if(this.score && this.content){
          this.axios.post(this.baseURL.mall + '/m/my/saveEvaluate' + this.Service.queryString({
            token: this.mallToken.getToken(),
            recId: this.recId,
            score: this.score,
            content: this.content
          })).then(res =>{
            console.log("评价",res);
            if(res.data.b.success){
              this.$toast(res.data.b.msg);
              this.$router.go(-1);
            }
          })
        }else{
          return;
        }
      }
    }
  }
</script>
<style lang="stylus" scoped="true">
  .comment-wrapper{
    padding 0 0.1rem;
    padding-bottom 0.3rem;
    background white;
  }
  .sup{
    height 45px;
    line-height 45px;
    font-size 0;
    color #333;
    .title{
      font-size 14px;
    }
    span{
      margin-right 6px;
    }
  }
  .sub{
    position relative;
    width 3.55rem;
    height 1.2rem;
    &::after{
      content: "";
      position absolute;
      left 0;
      top 0;
      width 200%;
      height 200%;
      border 1px solid #e5e5e5;
      border-radius 4px;
      transform scale(0.5);
      transform-origin left top;
    }
  }
  #container{
    position relative;
    z-index 99;
    box-sizing border-box;
    width inherit;
    height inherit;
    padding 0.1rem;
    font-size 13px;
    color #333;
    outline none;
    border none;
    background transparent;
  }
  #container::-webkit-input-placeholder{
    color #ccc;
    font-size 13px;
  }
  .icon-star{
    color: #ff8800;
  }
  .icon-star-gray{
    color: #ccc;
  }
  .btn{
    width: 1rem;
    height: 0.4rem;
    border: none;
    background: #dedede;
    color: white;
    margin: 0 auto;
    margin-top: 0.3rem;
    text-align: center;
    line-height: 0.4rem;
    border-radius: 2px;
  }
  .btn-active{
    background: #d74a45;
  }
</style>
