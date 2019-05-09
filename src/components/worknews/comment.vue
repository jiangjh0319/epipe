<template>
    <div>
        <div class="comment">
            <p class="comment-title">批示 ({{data.comments.length + comentData.length}})</p>

            <div class="comment-main" v-for="item in comentData" :key="item.id">
                <div class="img_head">
                    <img :src="item.userPhoto"/>
                </div>
                <div style="flex:1">
                    <div class="comment-info">
                        <span>{{item.userName}}</span>
                        <span>{{item.commentDate | timeFormat}}</span>
                    </div>
                    <div class="comment-text">
                        {{item.comment}}
                    </div>
                </div>
            </div>  

            <div class="comment-main" v-for="item in data.comments" :key="item.id">
                <div class="img_head">
                    <img :src="item.userPhoto"/>
                </div>
                <div style="flex:1">
                    <div class="comment-info">
                        <span>{{item.userName}}</span>
                        <span>{{item.commentDate | timeFormat}}</span>
                    </div>
                    <div class="comment-text">
                        {{item.comment}}
                    </div>
                </div>
            </div> 

            <div class="hint" v-if="!comentData.length&&!data.comments.length">
                暂无批示内容!
            </div>  
        </div>

        <div class="comment-input">
        <div style="width:0.625rem">
            <svg style="width: 0.27rem;height: 0.27rem" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-pishi"></use>
                </svg>
        </div>
        <div class="input" @click="dialog=true" >请输入你的批示意见 !</div>

        <div class="dialog"  @touchmove.prevent v-if="dialog">
                <div class="dialog_box">
                    <div class="dialog_content" >
                    <p>请输入审批意见</p>

                    <textarea v-model="commentText" >

                    </textarea>
                    </div>
                    <div class="dialog_btn">
                        <a class="confirm_btn" @click="comment">确认</a>
                        <a class="cancel_btn" @click="dialog=false">取消</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog:false,
                commentText:'',
                comentData:[],
                infor:{},
            }
        },
        methods:{
            comment(){
                this.dialog = false;
                let that = this;
                this.axios.post('/work/report/comment'+this.Service.queryString({
                    reportId:this.data.id,
                    comment:this.commentText,
                })).then(res=>{
                    if(res.data.h.code==200){
                        that.$toast('批示成功')
                        that.setData();
                    }else{
                        that.$toast(res.data.h.msg)
                    }
                })
            },

            setData(){

                    let date = new Date();
                    let time = date.toLocaleDateString()+' ';
                    time+= this.zero(date.getHours()) +':'+this.zero(date.getMinutes())+':'+this.zero(date.getSeconds())
                    time = time.replace(/\//g,'-')

                this.comentData.unshift({
                    userPhoto:this.infor.profileImg,
                    comment:this.commentText,
                    userName:this.infor.name,
                    commentDate:time,

                })

                this.commentText = '';
            },

            zero(value){
                
                return value.length<2?'0'+value:value
            }
        },
        watch:{
            commentText : function(){
                if(this.commentText.length>100){
                    this.$toast("评论最多输入100字~")
                    this.commentText = this.commentText.slice(0,100)
                    return
                }
            }
        },
        created() {
            let that = this;
            this.axios('/user/info').then(res=>{
                if(res.data.h.code==200){
                    that.infor = res.data.b;
                }
            })
        },
        filters:{
            timeFormat : function(value) {
                let arr = ['一','二','三','四','五','六','日']
                let odate = value.split(" ")[0];
                let otime = new Date(odate);
                let time = new Date() - new Date(odate);
                time = parseInt( time/(24*60*60*1000))

                if(!time){
                    return '今天 ' +value.slice(-8,-3)
                }else if(time == 1){
                    return '昨天 '+ value.slice(-8,-3)
                }else if(1<time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return  value.slice(0,10)
                }
            },
        },
        props:['data']
    }
</script>

<style scoped lang="stylus">

    .hint{
        height 0.45rem;
        line-height 0.3rem;
        color #999;
        font-size 0.15rem;
    }

.comment{
    margin 0.15rem;
    background-color #fff
    padding 0 0.15rem;

    img{
      width 0.32rem;
      height 0.32rem;
      border-radius 50%;
    }

    &-title{
          line-height: 0.44rem;
          font-size: 0.15rem;
          color: #333;
          font-weight: bold;
    }

    &-main{
      display flex;
    }

    &-info{
      margin-bottom 0.1rem;
      overflow hidden
      text-align right 

      & span:first-child{
        color #333
        font-size 0.15rem;
        float left
      }

      span{
        color #999
        font-size 0.12rem;
      }
    }

    &-text{
      font-size 0.14rem;
      color #666
      padding-bottom 0.15rem;
      border-bottom 0.01rem solid #ebebeb

      &:last-child{
        border none
      }
    }

    .img_head{
      margin-right 0.15rem;
    }
  }

  .comment-input{
    height 0.48rem;
    line-height 0.48rem;
    background-color #fff;
    display flex
    margin 0.15rem;
    padding-right 0.15rem;

    >div{

      svg{
        display block;
        margin 0 auto;
        margin-top 0.1rem;
      }
    }

    .input{
      height 0.3rem;
      line-height 0.3rem;
      width 100%;
      background-color #f2f2f5
      margin-top 0.09rem;
      outline none 
      text-indent 0.1rem;
      border-radius 0.02rem;
    }
  }

  .dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left:0;
    z-index: 5;
    font-size: 0.16rem;
    background-color: rgba(0, 0, 0, 0.5);

    .dialog_box {
        width: 2.7rem;
        height: 1.8rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 1.2rem;
        // bottom: 0;
        margin: auto;
        background: #fff;
        text-align: center;
        border-radius 0.06rem;

        textarea{
              background-color: #f5f5f5;
              padding: 0.09rem;
              border: none;
              height: 0.75rem;
              width: 100%;
              outline: none;
              resize none;
              box-sizing border-box
              font-size 0.15rem;
        }
    }

    .dialog_content {
        height: 1.35rem;
        color: #333;
        box-sizing border-box
        padding 0 0.15rem;
        border-bottom: 0.01rem solid #e6e6e6;

        p{
          line-height 0.4rem;
        }
    }

    .dialog_btn {
        height: 0.45rem;
        line-height: 0.45rem;
        display: flex;

        a {
            flex: 1;
            touch-action: none;
            cursor: pointer;
        }
    }

    .confirm_btn {
        color: #f80;
        border-right 0.01rem solid #e6e6e6;
    }

    .cancel_btn {
        ciolor: #666;
    }
}
</style>