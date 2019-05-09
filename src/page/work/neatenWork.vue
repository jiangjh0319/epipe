<template>
    <div>
        <TopHead
            :bgcolor = color
            title ='全部应用'
            :is_relative_approva="is_relative_approva"
            v-on:show_edit='compile'
            native="native"
        ></TopHead>

        <div style="margin-top:0.59rem">

            <div class="menu-item">
                    <p class="item-title"> <i></i> <span>常用应用</span> <a class="manage" @click="addWork">添加</a> </p>
                    <ul>
                        <li >
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-daibanshiyi"></use>
                        </svg>
                        <span>待办事宜</span>
                    </li>
                    <li>
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-yiban"></use>
                        </svg>
                        <span>已办事宜</span>
                    </li>
                    <li >
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-chaosong"></use>
                        </svg>
                        <span>我的抄送</span>
                    </li>
                     <li>
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-wodeshenqing-mian"></use>
                        </svg>
                        <span>我的申请</span>
                    </li>
                    <li>
                         <svg style="font-size: 0.33rem;"  class="icon img" aria-hidden="false">
                            <use xlink:href="#icon-gongzuohuibao"></use>
                        </svg>
                        <span>工作汇报</span>
                    </li>
                        <li v-for="(c,i) in workData[0].apps" :key="i"  v-if="c.delFlag!='1'">
                            <img :src="c.icon"/>
                            <span>{{c.name}}</span>
                        </li>
                    </ul>
            </div>

            <div class="menu-item" v-for="(item,index) in workData" :key="index" v-if="index!=0&&item.apps.length&&item.show=='show'">
                    <p class="item-title"> <i></i> <span>{{item.name}}</span> <a class="manage" @click="hide(item)" v-if="isRedact">{{item.hideFlag=='0'?'隐藏':'显示'}}</a></p>
                    <ul :class="item.hideFlag==='1'?'opacity':''">
                        <li v-for="(c,i) in item.apps" :key="i" @click="go_jump(c)"  v-if="c.delFlag!='1'">
                            <img :src="c.icon"/>
                            <span>{{c.name}}</span>

                            <svg style="font-size: 0.12rem;color:#609ef7" class="icon delete" aria-hidden="false"  v-if="isRedact" @click="delApps(item.apps,c,i)">
                                <use xlink:href="#icon-shanchu1"></use>
                            </svg>
                        </li>
                    </ul>
            </div>
            <div class="menu-item" v-if="delData.length">
                    <p class="item-title"> <i></i> <span>已删除</span>  </p>
                    <ul style="opacity:0.6">
                        <li v-for="(c,i) in delData" :key="i" @click="go_jump(c)">
                            <img :src="c.icon"/>
                            <span>{{c.name}}</span>
                            <svg style="font-size: 0.12rem;color:#609ef7" class="icon delete" aria-hidden="false" v-if="isRedact" @click="addApps(c,i)">
                                <use xlink:href="#icon-tianjia"></use>
                            </svg>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import TopHead  from '../../components/topheader.vue'  //header导航栏
    export default {
        data() {
            return {
                workData : [],
                oldData : [],
                is_relative_approva : {title:'编辑',isShow:true},
                delData : [],
                isRedact : false, //是否编辑状态
            }
        },
        created() {
        },
        mounted() {
             let _this = this;
            this.axios.get('/work/app/list').then(res=>{
                _this.workData = res.data.b.appCategorys;
                _this.oldData = JSON.parse(JSON.stringify(this.workData))
                _this.delData = res.data.b.delApps;
                _this.isHide();
            })
        },

        methods:{
            compile(){
                this.isRedact=!this.isRedact;

                if(this.is_relative_approva.title=='编辑'){
                    this.is_relative_approva.title = '完成'
                }else{
                    this.is_relative_approva.title = '编辑'
                    this.finish();
                }
            },
            hide(item){
                item.hideFlag = item.hideFlag==='0'?'1':'0';
            },
            go_jump(){
            },
            delApps(arr,item,index){
                item.delFlag = '1';
                this.delData.push(item)
                this.isHide();

            },
            addApps(data,index){
                this.workData.forEach(element => {
                        element.apps.forEach(item =>{
                            if(item.id==data.id){
                                item.delFlag = '0';
                            }
                        })
                });
                this.delData.splice(index,1)
                this.isHide();
            },
            isHide(){
                this.workData.forEach(el=>{
                    el.show = 'hide'
                    el.apps.forEach(item=>{
                        if(item.delFlag=='0'){
                            el.show = 'show'
                        }
                    })
                })
            },
            finish(){
                // let arr = [];
                let that = this;
                let arr = [],idStr='',listId='';
                this.oldData.forEach((item,index)=>{
                    if(item.hideFlag!=this.workData[index].hideFlag){
                        listId+=item.id+'|';
                    }
                    item.apps.forEach((el,i)=>{
                        if(el.delFlag!=this.workData[index].apps[i].delFlag){
                            idStr+=el.id+'|';
                        }
                    })
                })

                if(idStr!='') arr.push({ids:idStr.slice(0,-1),type:'3'})
                if(listId!='') arr.push({ids:listId.slice(0,-1),type:'2'})

                let str = JSON.stringify(arr)
                 that.axios({
                        method:"post",
                        url:"/work/app/set",
                        headers:{
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data:{apps:str},
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res)=>{ 
                    console.log(res)
                })
            },
            addWork(){
                this.$router.push({path:'/addWork',query:{type:'add'}})
            }

        },
        components:{
            TopHead,
        }
        
    }
</script>

<style scoped lang="stylus">

    .manage{
        color #609ef7;
        font-size 0.14rem;
        float right;
        margin-top 0.02rem;
    }

    .opacity{
        opacity 0.6
    }

    .menu-item{
        box-sizing border-box;
        background-color #fff;
        margin 0 0.15rem;
        padding 0.15rem;
        border-raius 0.04rem;
        margin-bottom 0.15rem;

        .item-title{
            overflow hidden

            i{
                float left
                width 0.03rem;
                height 0.16rem;
                background-color #f80;
                border-radius 0.03rem;
                margin-top 0.03rem;
                margin-right 0.06rem;
            }

            span{
                float left
                font-size 0.16rem;
                color #333
            }
        }

        img,.img{
            display block;
            width 0.27rem;
            height 0.27rem;
            margin 0 auto;
            margin-bottom 0.03rem;
        }

        ul{
            overflow hidden

            li{
                float left;
                width 25%;
                text-align center;
                margin-top 0.15rem;
                position relative

                .delete{
                    position absolute;
                    top:-0.05rem;
                    right:0.15rem;
                }
            }

            span{
                fon-size 0.14rem;
                color #333
            }
        }
    }

</style>