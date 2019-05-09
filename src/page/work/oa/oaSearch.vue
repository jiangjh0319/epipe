<template>
    <div>
        <TopHead
            mark = 'mark'
            :bgcolor = color
            title="审批搜索" 
            v-on:history_back="history_back_click"
         >
         </TopHead>
         <div v-if="!show" style="margin-top:0.44rem;background-color:#fff">
            <div class="search">
                 <svg class="icon icon-back" aria-hidden="false" >
                    <use xlink:href="#icon-sousuo2"></use>
                </svg>
                <input ref="input" v-model.trim="searchText"  type="search" autofocus placeholder="搜索 标题、编号、正文内容">
            </div>
            
            <!-- <div class="option-list" v-if="!tag">
                 <p>审批分类</p>
                 <div class="list">
                     <a :class="item.status==1?'active':item.status==2?'disable':''"  v-for="item in approvalClassify" :key="item.value" @click="select(item,0)">{{item.key}}</a>
                 </div>
            </div> -->
            <div  class="option-list">
                 <p>审批状态</p>
                 <div class="list">
                     <a :class="item.status==1?'active':item.status==2?'disable':''" v-for="item in approvalStatus" :key="item.value" @click="select(item,1)">{{item.key}}</a>
                 </div>
             </div>
            <div id="oaType"  class="option-list" ref="list">
                 <p>审批类型</p>
                 <div class="list">
                     <a v-for="item in type" @click="oaType=item.value" :class="item.value===oaType?'active':''" :key="item.value">{{item.key}}</a>
                   
                 </div>
             </div>
         </div>

        <div v-if="!show" class="ok_btn" @click="submit">确 认</div>

        <div v-if="show" style="margin-top:0.55rem;">
            <OaTemplate  v-on:goDetails="goDetails" v-for="(item,index) in data" :key="item.index" :item=item>

            </OaTemplate>
            <infinite-loading   spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                        <span slot="no-more" class="no-more" style="display:none">
                        </span>
                        <span slot="no-results" class="no-results" style="display:none">
                        </span>
            </infinite-loading>

             <div class="footLine" v-if="data.length">
                <span >暂无内容</span>
            </div>
            <div v-else class="footLine" style="margin-top:2rem;font-size:0.16rem;">
                <span style="width:auto">未找到相关结果</span>
            </div>
        </div>
    </div>
</template>

<script>

    import TopHead  from '../../../components/topheader.vue'  //header导航栏
    import OaTemplate  from '../../../components/oa/oa_template.vue' 
    import InfiniteLoading from 'vue-infinite-loading';


    export default {
        data() {
            return {
                approvalStatus:[
                    {key:'全部',status:1,value:'',arr:[]},
                    {key:'审批中',status:0,value:0,arr:[2,3]},
                    {key:'已同意',status:0,value:1,arr:[1]},
                    {key:'已拒绝',status:0,value:2,arr:[1] },
                    {key:'已撤销',status:0,value:3,arr:[3] },
                    {key:'已退回',status:0,value:4,arr:[1,3] }],
                approvalClassify:[

                    {key:'全部',status:1,value:'',arr:[]},
                    {key:'待办',status:0,value:1,arr:[2,3,4]},
                    {key:'已办',status:0,value:2,arr:[1]},
                    {key:'抄送',status:0,value:3,arr:[1,3,4]}],

                type:[{key:'全部',value:''},{key:'请假',value:0},
                {key:'补卡',value:11},{key:'出差',value:4},{key:'公出',value:3},{key:'请示函',value:1},{key:'合同',value:2},{key:'报销',value:6},
                {key:'付款',value:7},{key:'用印',value:5},{key:'离职',value:8},{key:'借款',value:9},{key:'接待',value:10},{key:'用车',value:12},{key:'人员需求',value:13},
                {key:'项目立项',value:14},{key:'转正',value:15},{key:'就餐',value:16},{key:'行文呈批',value:17},{key:'加班',value:18},{key:'员工调岗',value:19},{key:'采购',value:20},{key:'物品领用',value:21}
                ],
                oaType:'',
                oaState:'',
                oaClass:'',
                data:[],
                show:false,
                pageNo:1,
                searchText:'',
                tag:0,
                color:'#fd545c',
            }
        },
        components:{
            TopHead,
            OaTemplate,
            InfiniteLoading
        },
        created() {
        },
        mounted() {
            this.tag = this.$route.query.tag;
            
            this.select(this.approvalClassify[(this.$route.query.type)],0)

            this.color = this.$route.query.color?this.$route.query.color:'#fd545c';
        },
        methods:{
            dataFor(arr){
                let data = [];

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
            select(item,type){
                console.log(item,type)

                if(item.status==2||item.status==1) return
                
                if(type){
                    this.oaClass = item.value;

                    this.approvalStatus.forEach(item => {
                      item.status = item.status == 2?2:0;
                    });

                    this.approvalClassify.forEach((el,index)=>{
                        if(el.status!=1){
                            el.status=0
                        }
                        item.arr.forEach(els=>{
                            if(els==index){
                                if(el.status==1){
                                    this.approvalClassify[0].status = 1;
                                }
                                el.status = 2
                            }
                        })
                    })

                }else{
                    
                    this.oaState = item.value;

                    this.approvalClassify.forEach(item =>{
                      item.status = item.status == 2?2:0;
                    })
                    this.approvalStatus.forEach((el,index)=>{
                        if(el.status!=1){
                            el.status=0
                        }
                        item.arr.forEach(els=>{
                            if(els==index){
                                if(el.status==1){
                                    this.approvalStatus[0].status = 1;
                                }
                                el.status = 2
                            }
                        })
                    })
                }

                item.status = 1
                if(item.key=='待办'){
                    this.approvalStatus[2].status=2
                }

            //   this.$forceUpdate()
            },
            onInfinite(){
                let that = this;
                //供需
                this.axios.get('/work/oa/search',{
                    params:{
                        pageNo:that.pageNo+1,
                        pageSize:10,
                        type:that.oaState,
                        finalStatus:that.oaClass,
                        oaType:that.oaType,
                        keyWords:that.searchText,
                    }
                }).then(function(res){
                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                    let arr = that.dataFor(res.data.b.data)
                                    that.data = that.data.concat(arr)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);
                    }).catch(function (error) {
                        console.log(error);
                    });
                    
                },
            submit(){
                this.show = true;
                let that = this;
                this.pageNo=1;
                this.axios.get('/work/oa/search',{params:{
                    pageNo:1,
                    pageSize:10,
                    type:this.oaState,
                    finalStatus:this.oaClass,
                    oaType:this.oaType,
                    keyWords:this.searchText,
                }}).then(res=>{
                    if(res.data.h.code==200){
                        that.data = that.dataFor(res.data.b.data)
                    }
                })
            },
            history_back_click(){
                if(this.show){
                    this.show = false
                }else{
                     window.location.href = "epipe://?&mark=history_back"
                }

            }
        }
        
    }
</script>

<style scoped lang="stylus">

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
           z-index 1;
           line-height 1em;
           left 0;
           right 0;
           margin auto;
           background-color #f5f5f5;
       }
    }


    .option-list{
        padding 0 0.15rem;

        p{
            font-size 0.15rem;
            color #333;
            line-height 1.1em
            border-left 0.03rem solid #609ef7
            text-indent 0.08rem
            margin-bottom 0.1rem;
        }
    }

    .search{
        width 100%
        padding 0.08rem 0.15rem;
        box-sizing border-box
        border-bottom 0.01rem solid #ebebeb
        margin-bottom 0.15rem;
        position relative;

        svg{
            position absolute
            top 0.22rem;
            left 0.25rem;
            color:#bfbfbf;
        }

        input{
            width 3.45rem;
            height 0.4rem;
            background-color #f2f2f2
            text-indent 0.4rem;
            outline none;
            border-radius 0.02rem;
            font-size 0.15rem;
        }

        input::-webkit-search-cancel-button {display: none;}
        input::-webkit-input-placeholder{
            color:#ccc;
            font-size 0.15rem;
            }
    }


    .list{
        overflow hidden

        a{
            float left;
            width 0.7rem;
            height 0.27rem;
            line-height 0.27rem;
            border-radius 0.02rem; 
            border 0.01rem solid #ebebeb
            text-align center
            color #666;
            font-size 0.14rem;
            margin-right 0.2rem;
            margin-bottom 0.15rem;
            box-sizing border-box;

            &:nth-child(4n+0){
                margin-right 0
            }
        }

        .active{
            color #fff
            background-color #609ef7
            border-color #609ef7
        }

        .disable{
            background-color #ebebeb
        }
    }

    .ok_btn{
        width 3.45rem;
        margin 0 auto;
        color #fff
        background-color #609ef7
        line-height 0.5rem
        text-align center
        border-radius 0.03rem;
        font-size 0.17rem;
        margin-top 0.45rem;
    }

</style>