
<template>
    <section style="height:100%">
        <div class="header">
            <div class="header_back" @click="go_back()">
                <svg style="color:#fff;height:0.2rem;width:0.2rem;margin-top:0.05rem;"  class="icon" aria-hidden="false">
                    <use xlink:href="#icon-zuoyoujiantou"></use>
                </svg>
            </div>
            <div class="search-main">
                <div class="search">
                    <div class="search_icon">
                       
                    </div>
                    
                    <form action="#" @submit.prevent="searchClick()">
                        <input ref="input" v-model.trim="inputVal" @focus="isShowPrompt=true" type="search" autofocus placeholder="请输入关键字">
                    </form>
                    <div class="microphone" @click.stop="voice">
                        <svg style="height:0.16rem;width:0.16rem;margin-top:0.05rem;"  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-yuyin"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="search_btn" @click="searchClick()">
                <span>搜索</span>
            </div>
        </div>

        <div class="main" v-if="isShowPrompt">
            <div class="search_prompt search_hot">
                <h3>热门搜索</h3>
                <ul>
                    <li v-if="index<3" v-for="(item,index) in words" :key="index" @click="searchClick(item.keyWord)">{{item.keyWord}}</li>
                </ul>
            </div>
            <div class="search_prompt search_history" v-if="historyData.length">
                <h3>历史搜索</h3>
                <div class="items" v-for="(item,index) in historyData" :key="index">
                    <span @click="searchClick(item)">{{item}}</span>
                    <div class="items_close" @click="delHistory(index)">
                        <svg style="heigth:0.1rem;"  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-x"></use>
                        </svg>
                    </div>
                </div>
               
            </div>
        </div>

        <div class="search_res" v-if="!isShowPrompt">
                <div class="search_main">
                    
                    <div class="search_item" v-if="searchData.news.length">
                        <div class="search_item_head">
                            <span>
                                优管专题
                            </span>

                            <span @click="go_more(1)">
                                更多
                                <svg style="heigth:0.1rem;color:#999s"  class="icon" aria-hidden="false">
                                        <use xlink:href="#icon-right"></use>
                                </svg>
                            </span>
                        </div>
                        <div class="search_item_cont">
                            <div v-for="item in searchData.news" :key="item.resId" @click="go_newsdetail(item)" v-html="item.resTitle"></div>
                        </div>
                    </div>

                    <div class="search_item" v-if="searchData.bids.length">
                        <div class="search_item_head">
                            <span>
                                招标
                            </span>

                            <span  @click="go_more(2)">
                                更多
                                <svg style="heigth:0.1rem;"  class="icon" aria-hidden="false">
                                        <use xlink:href="#icon-right"></use>
                                </svg>
                            </span>
                        </div>
                        <div class="search_item_cont">
                            <div v-for="item in searchData.bids" :key="item.resId" v-html="item.resTitle" @click="go_newsdetail(item)"></div>
                        </div>
                    </div>

                    <div class="search_item" v-if="searchData.exhibitions.length">
                        <div class="search_item_head">
                            <span>
                                展会
                            </span>

                            <span  @click="go_more(3)">
                                更多
                                <svg style="heigth:0.1rem;"  class="icon" aria-hidden="false">
                                        <use xlink:href="#icon-right"></use>
                                </svg>
                            </span>
                        </div>
                        <div class="search_item_cont">
                            <div v-for="item in searchData.exhibitions" :key="item.resId" @click="go_newsdetail(item)" v-html="item.resTitle"></div>
                        </div>
                    </div>
                </div>
                <div class="no-more" v-if="!searchData.news.length||!searchData.bids.length||!searchData.exhibitions.length">暂无查询内容</div>
  
        </div>
    </section>
</template>


<script>

export default {
    data(){
        return {
            inputVal :'',  //输入框值
            isShowPrompt:true, //是否显示历史记录等提示
            historyData :[], //历史记录数组值
            words:[], //关键字
            searchData :{news:[],bids:[],exhibitions:[]},
        }
    },

    mounted(){
        this.getHistory()
        let that = this;
        this.axios.get('/content/select/keyWord').then(function(res){
            if(res.data.h.code==200){
                that.words = res.data.b.words;
            }
        })
    },
    methods:{
        go_back(){
            window.location.href = "epipe://?&mark=history_back";
        },
        getHistory(){ //获取历史记录
            let str = localStorage.getItem('homeSearch')
            if(!str) return
            this.historyData = str.split('|')
        },
        setHistory(str){ //存入历史记录

            for(let i = 0;i<this.historyData.length;i++){

                if(str==this.historyData[i]){
                    this.historyData.splice(i,1)
                    this.historyData.unshift(str)
                    localStorage.setItem('homeSearch',this.historyData.join('|'))
                    return;
                }
            }

            this.historyData.unshift(str)

            if(this.historyData.length>12){
                this.historyData = this.historyData.splice(0,12)
            }
            localStorage.setItem('homeSearch',this.historyData.join('|'))

        },
        go_more(type){ //更多
            this.$router.push({path:'/searchMore',query:{type:type,keyWord:this.inputVal,h5:true}})
        },
        delHistory(index){//删除历史记录
            this.historyData.splice(index,1)
            localStorage.setItem('homeSearch',this.historyData.join('|'))
        },
        searchClick(val){ //点击搜索
            if(val){
                this.inputVal = val; 
            }else{
                if(this.inputVal==''){
                    this.$toast('你搜索的内容不能为空')
                     return
                }
            }
            this.$refs.input.blur();
            this.setHistory(this.inputVal)
            let that = this;
            this.axios.get('/content/search?keyWord='+this.inputVal).then(function(res){
                that.searchData = res.data.b;
            })

            this.isShowPrompt = false;
        },
        go_newsdetail(item){
              let title = this.Util.Title_format(item.resTitle)
                let obj = {};
                obj.title = title;
                obj.imageUrl = item.converImgUrl;
                obj.text = this.Util.Title_format(item.summary);
                let data = JSON.stringify(obj)
                window.location.href = "epipe://?&mark=newsdetail&title=" + title + "&_id=" + item.resId+'&data='+data;
        },
        voice(){
            window.location.href = "epipe://?&mark=microphone"
        }
    },

  
}
</script>


<style lang="stylus" scoped>

    .header{
        display flex;
        padding 0.07rem 0.15rem;
        height 0.44rem;
        background-color #0fc37c;
        box-sizing: border-box;
        line-height 0.3rem;


        .search-main{
            flex 1
        }

        .search{
            position relative
            width:2.5rem;
            height 0.3rem;
            border-radius 0.3rem;
            background-color #0c9c63; 
            overflow hidden;
            margin 0 auto;

            .search_icon,.microphone{
                position absolute;
                width:0.15rem;
                height 0.15rem;
            }

            .search_icon{
                width:0.15rem;
                height 0.15rem;
                background url(../../assets/search_icon.png) no-repeat;
                background-size 0.15rem 0.15rem;
                top:0.08rem;
                left:0.1rem;
            }

            .microphone{
                width:0.2rem;
                height:100%;
                right:0.1rem;
            }

            input{
                position absolute;
                width 2.1rem;
                height 100%;
                background-color #0c9c63;
                color #fff;
                font-size 0.14rem;
                border none;
                outline none;
                left:0.3rem;
                -webkit-appearance:none;
            }
            input::-webkit-input-placeholder{color:#fff;}
            input::-webkit-search-cancel-button {display: none;}
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

    .main{
        padding-top 1px;
        height 100%;
       
    }

    .search_prompt{
        font-size 0.14rem;
        color:#666;

        h3{
            text-indent 0.15rem;
            margin-top:0.1rem;
            margin-bottom:0.05rem;
            font-size:0.15rem;
        }
    }

    .search_hot{

        ul{
            display flex;
            height 0.4rem;
            line-height 0.4rem;
        }

        li{
            width 33.333%
            text-align center;
            background-color #fff;
            border-right 1px solid #eee;
        }

        li:last-child{
            border none;
        }
    }

    .search_history{
        overflow hidden

        .items{
            width:50%;
            float left;
            height 0.4rem;
            line-height 0.4rem;
            background-color #fff;
            text-indent 0.15rem;
            overflow hidden;
            border-right 1px solid #eee;
            border-bottom 1px solid #eee;
            box-sizing: border-box;
        }

        .items:nth-child(odd){
            margin 0;
        }

        span{
            float left;
            width 82%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .items_close{
            width 17%;
            height 100%;
            float right;
        }
        
        svg{
            display block;
            margin 0.13rem auto;

        }
    }

    .no-more{
        text-align center;
        color #666;
        heigh 0.2rem;
        line-height 0.2rem;
        padding 0.1rem 0;
    }


    .search_item{
        padding:0 0.15rem;
        background-color #fff;
        margin-bottom 0.1rem;
    }

    .search_item_head{
        height 0.4rem;
        line-height 0.4rem;
        font-size  0.14rem;
        color:#666;
        border-bottom:0.01rem solid #ddd;

        span:nth-child(2){
            float right;
            color:#999;
        }
    }

    .search_item_cont{

        div{
            height 0.4rem;
            line-height 0.4rem;
            color: #333;
            font-size:0.16rem;
            overflow hidden;
            text-overflow:ellipsis;
            white-space:nowrap;   
            border-bottom:0.01rem solid #ddd;

        }
    }

    .search_item_cont div:nth-last-child(1){
        border none
    }

    .search_res{
        margin-top 0.15rem;
    }

</style>

