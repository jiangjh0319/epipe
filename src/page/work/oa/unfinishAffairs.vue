<template>
    <section>
        <!-- <div class="nav">
            <a :class="active==1?'active':''" @click="active=1">待办 <span v-if="count">{{count}}</span></a>
            <a :class="active==2?'active':''" @click="active=2">已办</a>
            <a :class="active==3?'active':''" @click="active=3">抄送 <span v-if="copyCount">{{copyCount}}</span></a>
        </div> -->

        <div>
            <div>
                <OaTemplate v-on:goDetails="goDetails" v-for="(item,index) in leaveData" :item=item :key="item.applyId"></OaTemplate>
                <infinite-loading  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                    <span slot="no-more" class="no-more">
                        暂无更多加载
                    </span>
                    <span slot="no-results" class="no-results">
                        暂无更多加载
                    </span>
                </infinite-loading>
            </div>
            <!-- <div v-show="active==2">
                <OaTemplate v-on:goDetails="goDetails" v-for="(item,index) in finishData" :item=item :key="item.applyId"></OaTemplate>
                <infinite-loading  spinner="bubbles" :on-infinite="onInfiniter" ref="infiniteLoadingr">
                    <span slot="no-more" class="no-more">
                        暂无更多加载
                    </span>
                    <span slot="no-results" class="no-results">
                        暂无更多加载
                    </span>
                </infinite-loading>
                <div v-if="!finishData.length" class="footLine" style="margin-top:2rem;font-size:0.16rem;">
                    <span style="width:auto">未找到相关结果</span>
                </div>
            </div>
            <div v-show="active==3">
                <OaTemplate v-on:goDetails="goCopyDetails" v-for="(item,index) in copyData" :isCopy='true' :item=item :key="item.applyId"></OaTemplate>
                <infinite-loading  spinner="bubbles" :on-infinite="onInfinites" ref="infiniteLoadings">
                    <span slot="no-more" class="no-more">
                        暂无更多加载
                    </span>
                    <span slot="no-results" class="no-results">
                            暂无更多加载
                    </span>
                </infinite-loading>
                <div v-if="!copyData.length" class="footLine" style="margin-top:2rem;font-size:0.16rem;">
                    <span style="width:auto">未找到相关结果</span>
                </div>
            </div> -->
        </div>

    </section>
</template>


<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import OaTemplate  from '../../../components/oa/oa_template.vue' 
export default {
        data(){
            return{
                leaveData : [],
                count:0,
                copyCount:0,
                pageNo:1,

            }
        },
         components: {
            InfiniteLoading,
            OaTemplate
        },
        mounted:function(){
            let that = this;
            this.axios.get('/work/wait/list').then(function(res){
                        that.leaveData = that.dataFor(res.data.b.data);
                       that.count = res.data.b.data[0].count
                 })
        },
        methods:{
     
            dataFor(arr){
                let data = [],res=[];
                for(let i= 0;i<arr.length;i++){
                    let obj = {};
                    for(let j = 0;j<arr[i].extend.length;j++){
                        obj[arr[i].extend[j].key] = arr[i].extend[j].value
                    }
                    data.push(obj)
                }


                return data;
            },
            goDetails(item,type){
                window.location.href = "epipe://?&mark="+type+"Details&_id="+item.applyId+'&data='+JSON.stringify({text:0});
            },
            
            onInfinite(){
                let that = this;
                    //供需
                this.axios.get('/work/wait/list',{
                    params:{
                        pageNo:this.pageNo+1,
                    }
                }).then(function(res){
                    setTimeout(() => {
                            if (res.data.b.data.length == 0) {
                                that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            } else if (res.data.b.data) {
                                    let arr = that.dataFor(res.data.b.data)
                                that.leaveData = that.leaveData.concat(arr)
                                that.pageNo++;
                                that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            }
                    }, 200);
                }).catch(function (error) {
                    console.log(error);
                });
            },
       
        
        },
        filters : {
            timeFormat : function(value) {
                let arr = ['一','二','三','四','五','六','日']
                let odate = value.split(" ")[0];
                let otime = new Date(odate);
                let time = new Date() - new Date(odate);
                time = parseInt( time/(24*60*60*1000))

                if(!time){
                    return value.slice(-8,-3)
                }else if(time == 1){
                    return '昨天 '+ value.slice(-8,-3)
                }else if(1<time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return value.slice(0,10)
                }
            },
        }
}
</script>


<style lang="stylus" scoped>


     .footLine{
       height 0.13rem;
       font-size:0.13rem;
       position relative;
       text-align center;
       color #999;
       padding 0 0.15rem;
       margin-bottom:0.3rem;
       margin-top:0.25rem;

       span{
           position absolute;
           width:0.91rem;
           z-index 2;
           line-height 1em;
           left 0;
           right 0;
           margin auto;
           background-color #f5f5f5;
       }
    }
    
</style>
