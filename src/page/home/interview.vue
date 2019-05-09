<template>
    <section>
        <div class="item" v-for="item in intervewArr" @click="go_newsdetail(item)">
            <div class="img-show">
                <img :src="item.coverImgUrl" />
            </div>
            <div class="item-content">
                <h2 v-html="item.title"></h2>
                <div class="item-text" v-html="item.summary"></div>
                <div class="item_infor">
                    <span>{{item.createDate|time}}</span>
                    <span class="spanRight">
                        <svg style="width: 0.2rem;height: 0.14rem" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-yuedu"></use>
                        </svg>{{item.clicks + item.addClicks}}
                    </span>
                </div>
            </div>
        </div>
        <div class="no-more">
            暂无更多加载
        </div>
    </section>
</template>

<script >
import Util from '../../js/Util.js'
export default {
        data(){
            return{
                intervewArr : [],
        }},
        methods:{
            go_newsdetail(item){
            let obj = {};
            obj.title = Util.Title_format(item.title);
            obj.imageUrl = item.coverImgUrl;
            obj.text = Util.Title_format(item.summary.slice(0,40));
            obj.collectState = item.collectState;
            let data = JSON.stringify(obj)
            window.location.href = "epipe://?&mark=newsdetail&title=" + obj.title + "&_id=" + item.id+'TTTTTT&data='+data;
            }
        },
        mounted(){
            let that = this;
            this.axios.get(this.Service.resource + '专家访谈',)
            .then(function(res){
                  if(res.data.h.code == 200){               
                    that.intervewArr = res.data.b;
                    console.log(that.intervewArr)
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
        display flex;
        margin 0.15rem;
        margin-bottom 0;
        padding 0.15rem 0.1rem;
        background-color #fff;
        border-radius 4px;
        -webkit-box-shadow: 0 0 0.2rem rgba(255,136,0,.1);    
        box-shadow 0 0 0.2rem rgba(255,136,0,.1);
    }

    .img-show{
        width 0.9rem;
        height 0.9rem;
        margin-right 0.1rem;

        img{
            width 100%;
            height 100%;
            border-radius 4px;
        }
    } 

    .item-content{
        width:2.25rem;

        h2{
            font-size 0.15rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .item-text{
             height 0.36rem;
            font-size 0.14rem;
            line-height 0.18rem;
            color #666;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin 0.09rem 0;
            text-align justify;
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

    .no-more{
        text-align center;
        color #666;
        heigh 0.2rem;
        line-height 0.2rem;
        padding 0.1rem 0;
    }
    
</style>


