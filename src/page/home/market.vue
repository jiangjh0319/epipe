<template>
  <section class="main">
      <div class="item" v-for="value in arrs" @click="go_newsdetail(value)">
          <h2>{{value.title}}</h2>
          <div class="item_infor">
              <span>{{value.createDate|time}}</span>
              <span class="spanRight">
                  <svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                    <use xlink:href="#icon-yuedu"></use>
                 </svg>{{value.clicks + value.addClicks}}
              </span>
          </div>
      </div>
     <div class="no-more">
         暂无更多加载
     </div>
  </section>
</template>


<script>
import Util from '../../js/Util.js'
export default {
    data(){
        return{
            arrs:[],
        }
    },
    methods:{
            go_newsdetail(item){
                let obj = {};
                obj.title = Util.Title_format(item.title);
                obj.imageUrl = item.coverImgUrl;
                obj.text = Util.Title_format(item.summary);
                obj.collectState = item.collectState;
                let data = JSON.stringify(obj)
                window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&_id=" + item.id+'TTTTTT&data='+data;
            }
        },
    mounted(){
        let that = this;
        this.axios.get(this.Service.resource + '价格行情',)
        .then(function(res){
                if(res.data.h.code == 200){          
                console.log(res.data.b)     
                that.arrs = res.data.b;
            }  
        })
    },
     filters : {
            time : function(value){
                let date = new Date(value)
                let year = date.getFullYear();
                let mon = (date.getMonth()+1)+'';
                let days = date.getDate()+'';
                mon =  mon.length<2? '0'+mon : mon 
                days =  days.length<2? '0'+days : days             
                return year+'-'+mon+'-'+days;
            }
        }
}
</script>

<style lang="stylus" scoped>

    .item{
        margin  0.15rem;
        margin-bottom 0;
        padding 0.15rem 0.1rem;
        background-color: #fff;
        border-radius 4px;
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
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
        float right ;
    }

    h2{
        height 0.48rem;
        font-size 0.15rem;
        color #333;
        line-height 0.24rem;
    }
    .no-more{
        text-align center;
        color #666;
        heigh 0.2rem;
        line-height 0.2rem;
        padding 0.1rem 0;
    }

</style>
