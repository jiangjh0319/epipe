<template>
    <section>
        <div >
            <OaTemplate v-on:goDetails="goDetails" v-for="(item,index) in leaveData" :item=item :key="item.applyId"></OaTemplate>
        </div>
         <infinite-loading  spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more" class="no-more">
            暂无更多加载
            </span>
            <span slot="no-results" class="no-results">
            暂无更多加载
            </span>
        </infinite-loading>
    </section>
  
</template>


<script>

 import OaTemplate  from '../../../components/oa/oa_template.vue' 
 import InfiniteLoading from 'vue-infinite-loading';

export default {
        data(){
            return{
                leaveData:[],
                pageNo:1,
            } 
        },
         components: {
            InfiniteLoading,
            OaTemplate
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
                this.axios.get('/work/complete/list',{
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
                    
                }
            },

        mounted:function(){
            let that = this;
            this.axios.get('/work/complete/list').then(function(res){
                that.leaveData = that.dataFor(res.data.b.data);
            })
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
                }else if(1<time&&time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return value.slice(0,10)
                }
            },
        }
}
</script>


<style lang="stylus" scoped>





    .no-results,.no-more{
        display:block;
        margin:0.15rem 0;
    }
</style>

